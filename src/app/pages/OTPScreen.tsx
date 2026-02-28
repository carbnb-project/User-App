import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Button } from '../components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../components/ui/input-otp';

export function OTPScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const contact = location.state?.contact || '+234 813 259 4968'; // Default for demo if not passed

  const [otp, setOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(59);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState(false);

  const isEmail = contact.includes('@');
  const contactType = isEmail ? 'Email Address' : 'WhatsApp';

  // Timer logic
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleResend = () => {
    if (canResend) {
      setResendTimer(59);
      setCanResend(false);
      setError(false);
      setOtp('');
      alert(`New code sent to ${contact}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 4) {
      // Simulate verification
      if (otp === '1234') { // Mock correct OTP
        navigate('/complete-profile', { state: { contact } });
      } else {
        setError(true);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Header */}
      <div className="bg-background px-6 pt-safe-top pb-4 flex items-center shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm border border-gray-100"
        >
          <ArrowLeft className="w-5 h-5 text-brand" />
        </button>
        <span className="text-lg font-bold text-brand ml-4">Verification</span>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pt-4 flex flex-col items-center w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <p className="text-gray-500 mb-2">
            A 4 digit code was sent to your <span className="font-semibold text-brand">{contactType}</span>
          </p>
          <p className="text-brand font-bold text-lg mb-2">
            {contact}
          </p>
          <button onClick={() => navigate(-1)} className="text-xs font-semibold text-brand hover:underline">
            Wrong {isEmail ? 'email' : 'number'}? Edit
          </button>
        </div>

        {/* OTP Input */}
        <div className="mb-8">
          <InputOTP
            maxLength={4}
            value={otp}
            onChange={(value) => {
              setOtp(value);
              if (error) setError(false);
            }}
          >
            <InputOTPGroup className="gap-3">
              {[0, 1, 2, 3].map((index) => (
                <InputOTPSlot
                  key={index}
                  index={index}
                  className={`w-14 h-14 text-2xl font-bold rounded-xl border-gray-200 bg-white shadow-sm transition-all focus:border-brand ${error ? 'border-red-500 text-red-500' : 'text-brand'}`}
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-sm text-red-500 font-medium mb-6 bg-red-50 px-4 py-2 rounded-lg">
            Incorrect code. Please check and try again.
          </p>
        )}

        {/* Timer & Resend */}
        <div className="flex flex-col items-center gap-2">
          {resendTimer > 0 ? (
            <p className="text-sm text-gray-500">
              Resend code in <span className="font-bold text-brand">{resendTimer}s</span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="text-sm font-bold text-brand underline decoration-2 underline-offset-4 hover:text-black transition-colors"
            >
              Resend Code
            </button>
          )}
        </div>
      </div>

      {/* Footer Button */}
      <div className="p-6 bg-background mt-auto shrink-0 safe-pb">
        <Button
          onClick={handleSubmit}
          className="w-full bg-brand hover:bg-brand-light text-white h-14 rounded-xl font-semibold text-base shadow-lg shadow-gray-200/50"
        >
          Verify
        </Button>
      </div>
    </div>
  );
}