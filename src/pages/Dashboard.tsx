
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Calendar, ArrowRight, FileText, User, Mail, Phone, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface DebtFile {
  file_name: string;
  description: string | null;
  storage_path: string;
}

interface Debtor {
  first_name: string;
  last_name: string;
  email: string | null;
  phone_number: string | null;
}

interface DebtCase {
  id: string;
  debt_amount: number;
  debt_remaining: number;
  due_date: string;
  case_description: string | null;
  case_number: string;
  payment_link_url: string | null;
  status: "ACTIVE" | "CLOSED";
  debtor?: Debtor;
}

const Dashboard = () => {
  const [debtCase, setDebtCase] = useState<DebtCase | null>(null);
  const [documents, setDocuments] = useState<DebtFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [cases, setCases] = useState<DebtCase[]>([]);
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const phoneNumber = location.state?.phoneNumber;

  useEffect(() => {
    if (!phoneNumber) {
      toast({
        title: "Error",
        description: "No phone number provided. Please login again.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    const fetchDebtInformation = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-debt-case', {
          body: { phone_number: phoneNumber }
        });

        if (error) {
          throw error;
        }

        if (data) {
          setDebtCase(data);
          setCases([data]); // Initialize cases with the current case
          // After getting the case data, fetch the documents
          if (data.id) {
            const { data: attachments, error: attachmentsError } = await supabase.functions.invoke('get-case-attachments', {
              body: { case_id: data.id }
            });

            if (attachmentsError) {
              console.error('Error fetching documents:', attachmentsError);
              toast({
                title: "Warning",
                description: "Could not load documents. Please try again later.",
                variant: "destructive",
              });
            } else if (attachments) {
              setDocuments(attachments);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching debt information:", error);
        toast({
          title: "Error",
          description: "Failed to fetch debt information. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDebtInformation();
  }, [phoneNumber, toast, navigate]);

  const handleViewFile = async (file: DebtFile) => {
    try {
      const { data: fileUrl, error } = await supabase.storage
        .from('case-attachments')
        .createSignedUrl(file.storage_path, 3600); // URL valid for 1 hour

      if (error) {
        throw error;
      }

      if (fileUrl) {
        setSelectedFile(file.file_name);
        setPreviewUrl(fileUrl.signedUrl);
      }
    } catch (error) {
      console.error("Error getting file URL:", error);
      toast({
        title: "Error",
        description: "Could not open the file. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handlePayment = () => {
    if (!debtCase?.payment_link_url) {
      toast({
        title: "Error",
        description: "Payment link is not available. Please try again later.",
        variant: "destructive",
      });
      return;
    }
    window.location.href = debtCase.payment_link_url;
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

  const renderCasesList = () => {
    if (!cases.length) {
      return (
        <div className="text-center py-4 text-gray-500">
          No cases available
        </div>
      );
    }

    return cases.map((case_) => (
      <div
        key={case_.id}
        className="flex items-center justify-between p-4 border-b last:border-0"
      >
        <div className="space-y-1">
          <p className="font-medium">Case: {case_.case_number}</p>
          <p className="text-sm text-gray-500">
            Outstanding: ${case_.debt_remaining.toLocaleString()}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm ${
          case_.status === 'ACTIVE' 
            ? 'bg-blue-100 text-blue-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          {case_.status}
        </span>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold text-gray-900">Your Account</h1>
          <p className="text-gray-500">View and manage your payment details</p>
        </div>

        {debtCase.debtor && (
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <User className="h-5 w-5" />
                <span>{debtCase.debtor.first_name} {debtCase.debtor.last_name}</span>
              </div>
              {debtCase.debtor.email && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="h-5 w-5" />
                  <span>{debtCase.debtor.email}</span>
                </div>
              )}
              {debtCase.debtor.phone_number && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="h-5 w-5" />
                  <span>{debtCase.debtor.phone_number}</span>
                </div>
              )}
            </div>
          </Card>
        )}

        <Card className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Cases Overview</h3>
            {renderCasesList()}
          </div>
        </Card>

        {debtCase.status === "ACTIVE" && (
          <>
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
                  <span>Case: {debtCase.case_number}</span>
                </div>
              </div>
            </Card>

            {debtCase.case_description && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Case Description</h2>
                <p className="text-gray-700">{debtCase.case_description}</p>
              </Card>
            )}

            {documents.length > 0 && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Documents</h2>
                <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                  <div className="space-y-4">
                    {documents.map((file, index) => (
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
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="ml-2"
                          onClick={() => handleViewFile(file)}
                        >
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
                  disabled={!debtCase.payment_link_url}
                >
                  Make Payment
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </Card>
          </>
        )}
      </div>

      <Dialog open={!!previewUrl} onOpenChange={() => {
        setPreviewUrl(null);
        setSelectedFile(null);
      }}>
        <DialogContent className="max-w-4xl w-full">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">{selectedFile}</h2>
          </div>
          <div className="relative w-full" style={{ height: "80vh" }}>
            {previewUrl && (
              <iframe
                src={previewUrl}
                className="w-full h-full border-0 rounded-md"
                title="Document Preview"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;

