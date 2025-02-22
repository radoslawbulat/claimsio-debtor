
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { phone_number } = await req.json();

    if (!phone_number) {
      return new Response(
        JSON.stringify({ error: 'Phone number is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log('Looking up debtor with phone number:', phone_number);

    // First, find the debtor by phone number
    const { data: debtorData, error: debtorError } = await supabase
      .from('debtors')
      .select(`
        id,
        first_name,
        last_name,
        email,
        phone_number
      `)
      .eq('phone_number', phone_number)
      .maybeSingle();

    if (debtorError) {
      console.error('Error fetching debtor:', debtorError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch debtor information' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    if (!debtorData) {
      console.log('No debtor found with phone number:', phone_number);
      return new Response(
        JSON.stringify({ error: 'Debtor not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    console.log('Found debtor with ID:', debtorData.id);

    // Then, fetch the case information
    const { data: caseData, error: caseError } = await supabase
      .from('cases')
      .select(`
        id,
        debt_amount,
        debt_remaining,
        due_date,
        case_description,
        case_number,
        payment_link_url,
        status
      `)
      .eq('debtor_id', debtorData.id)
      .maybeSingle();

    if (caseError) {
      console.error('Error fetching case:', caseError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch case information' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    if (!caseData) {
      console.log('No case found for debtor:', debtorData.id);
      return new Response(
        JSON.stringify({ error: 'Case not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    console.log('Found case with ID:', caseData.id);

    // Fetch payment history
    const { data: paymentsData, error: paymentsError } = await supabase
      .from('payments')
      .select('*')
      .eq('case_id', caseData.id)
      .order('created_at', { ascending: false });

    if (paymentsError) {
      console.error('Error fetching payments:', paymentsError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch payment history' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Return all information
    const result = {
      ...caseData,
      debtor: debtorData,
      payments: paymentsData || []
    };

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
