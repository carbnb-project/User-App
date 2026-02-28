import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { useEffect } from 'react';

export function SignupSuccessScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-redirect after 2 seconds
    const timer = setTimeout(() => {
      navigate('/home');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 pt-safe-top text-center">
      <div className="w-full max-w-md flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>

        <h1 className="text-2xl font-bold text-black mb-3">
          Account Created!
        </h1>

        <p className="text-gray-600 mb-8">
          Your account has been successfully created. Start exploring amazing cars now.
        </p>

        <Button
          onClick={() => navigate('/home')}
          className="w-full bg-brand hover:brightness-90 text-white h-12 rounded-lg"
        >
          Start Exploring
        </Button>
      </div>
    </div>
  );
}