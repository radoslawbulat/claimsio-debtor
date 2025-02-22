
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { phone_number } = await req.json()

    if (!phone_number) {
      return new Response(
        JSON.stringify({ error: 'Phone number is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Fetching debtor information for phone number:', phone_number)

    // First, find the debtor by phone number
    const { data: debtorData, error: debtorError } = await supabase
      .from('debtors')
      .select('id')
      .eq('phone_number', phone_number)
      .maybeSingle()

    if (debtorError) {
      console.error('Error fetching debtor:', debtorError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch debtor information' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    if (!debtorData) {
      return new Response(
        JSON.stringify({ error: 'Debtor not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }

    console.log('Found debtor with ID:', debtorData.id)

    // Fetch the case information for this debtor
    const { data: caseData, error: caseError } = await supabase
      .from('cases')
      .select(`
        id,
        debt_amount,
        debt_remaining,
        due_date,
        case_description,
        case_number
      `)
      .eq('debtor_id', debtorData.id)
      .maybeSingle()

    if (caseError) {
      console.error('Error fetching case:', caseError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch case information' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    if (!caseData) {
      return new Response(
        JSON.stringify({ error: 'No case found for this debtor' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }

    console.log('Found case with ID:', caseData.id)

    // Fetch associated files
    const { data: filesData, error: filesError } = await supabase
      .from('case_attachments')
      .select('*')
      .eq('case_id', caseData.id)

    if (filesError) {
      console.error('Error fetching files:', filesError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch case attachments' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    const result = {
      ...caseData,
      files: filesData || [],
    }

    console.log('Successfully fetched all data')

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
