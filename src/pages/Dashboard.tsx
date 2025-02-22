
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Calendar, ArrowRight, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DebtFile {
  file_name: string;
  description: string | null;
  storage_path: string;
}

interface DebtCase {
  debt_amount: number;
  debt_remaining: number;
  due_date: string;
  case_description: string | null;
  case_number: string;
  files?: DebtFile[];
}

const Dashboard = () => {
  const [debtCase, setDebtCase] = useState<DebtCase | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDebtInformation = async () => {
      try {
        // For now, we'll mock the phone number
        const mockPhoneNumber = "+48123456789";

        // First, find the debtor by phone number
        const { data: debtorData } = await supabase
          .from("debtors")
          .select("id")
          .eq("phone_number", mockPhoneNumber)
          .maybeSingle();

        if (debtorData) {
          // Fetch the case information for this debtor
          const { data: caseData } = await supabase
            .from("cases")
            .select(`
              debt_amount,
              debt_remaining,
              due_date,
              case_description,
              case_number
            `)
            .eq("debtor_id", debtorData.id)
            .maybeSingle();

          if (caseData) {
            // Fetch associated files
            const { data: filesData } = await supabase
              .from("case_attachments")
              .select("*")
              .eq("case_id", caseData.id);

            setDebtCase({
              ...caseData,
              files: filesData || [],
            });
          }
        }
      } catch (error) {
        console.error("Error fetching debt information:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDebtInformation();
  }, []);

  const handlePayment = () => {
    window.location.href = "/payment";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!debtCase) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">No Debt Information Found</h2>
          <p className="text-gray-500 mt-2">We couldn't find any debt information for this account.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold text-gray-900">Your Account</h1>
          <p className="text-gray-500">View and manage your payment details</p>
        </div>

        <Card className="p-6 space-y-6">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Total Outstanding</p>
            <p className="text-3xl font-semibold text-gray-900">
              ${debtCase.debt_remaining.toLocaleString()}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="h-5 w-5" />
              <span>Due Date: {new Date(debtCase.due_date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <CreditCard className="h-5 w-5" />
              <span>Account: {debtCase.case_number}</span>
            </div>
          </div>
        </Card>

        {debtCase.case_description && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Debt Description</h2>
            <p className="text-gray-700">{debtCase.case_description}</p>
          </Card>
        )}

        {debtCase.files && debtCase.files.length > 0 && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Documentation</h2>
            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
              <div className="space-y-4">
                {debtCase.files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium text-sm">{file.file_name}</p>
                        {file.description && (
                          <p className="text-sm text-gray-500">{file.description}</p>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="ml-2">
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        )}

        <Card className="p-6 bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-semibold text-gray-900">Ready to make a payment?</h2>
              <p className="text-gray-500">Pay securely through our payment gateway</p>
            </div>
            <Button
              onClick={handlePayment}
              className="bg-primary hover:bg-primary/90 text-primary-foreground group"
            >
              Make Payment
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
