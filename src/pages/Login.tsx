
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Phone, Lock } from "lucide-react";

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    // Here you would integrate with your OTP service
    setOtpSent(true);
    toast.success("OTP sent successfully!");
  };

  const handleLogin = async () => {
    if (!otp || otp.length < 4) {
      toast.error("Please enter a valid OTP");
      return;
    }
    // Here you would verify the OTP
    navigate("/dashboard", { state: { phoneNumber } });
    toast.success("Login successful!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <Card className="w-full max-w-md p-8 space-y-6 animate-fadeIn">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold text-gray-900">Welcome</h1>
          <p className="text-gray-500">Please login to access your account</p>
        </div>

        <div className="space-y-4">
          {!otpSent ? (
            <div className="space-y-4">
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                className="w-full bg-black hover:bg-black/90 text-white"
                onClick={handleSendOtp}
              >
                Send OTP
              </Button>
            </div>
          ) : (
            <div className="space-y-4 animate-slideUp">
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="pl-10"
                  maxLength={6}
                />
              </div>
              <Button
                className="w-full bg-black hover:bg-black/90 text-white"
                onClick={handleLogin}
              >
                Verify & Login
              </Button>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-gray-500">
          Having trouble? Please contact support
        </p>
      </Card>
    </div>
  );
};

export default Login;
