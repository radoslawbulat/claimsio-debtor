
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Calendar, ArrowRight } from "lucide-react";

const Dashboard = () => {
  const debtDetails = {
    totalAmount: 5000,
    dueDate: "2024-03-15",
    accountNumber: "****1234",
    minimumPayment: 500,
  };

  const handlePayment = () => {
    // Redirect to payment gateway
    window.location.href = "/payment";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold text-gray-900">Your Account</h1>
          <p className="text-gray-500">View and manage your payment details</p>
        </div>

        <Card className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Total Outstanding</p>
              <p className="text-3xl font-semibold text-gray-900">
                ${debtDetails.totalAmount.toLocaleString()}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Minimum Payment Due</p>
              <p className="text-3xl font-semibold text-success">
                ${debtDetails.minimumPayment.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center pt-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="h-5 w-5" />
              <span>Due Date: {new Date(debtDetails.dueDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <CreditCard className="h-5 w-5" />
              <span>Account: {debtDetails.accountNumber}</span>
            </div>
          </div>
        </Card>

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
