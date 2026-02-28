import { useNavigate, useLocation } from 'react-router';
import { Button } from '../components/ui/button';
import { CheckCircle2 } from 'lucide-react';

export function BookingConfirmedScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 pt-safe-top">
      <div className="w-full max-w-md flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-16 h-16 text-green-600" />
        </div>

        <h1 className="text-2xl font-bold text-black mb-3">
          Booking Confirmed!
        </h1>

        <p className="text-gray-600 mb-8">
          Your booking has been successfully confirmed. The host will contact you shortly with pickup/delivery details.
        </p>

        <div className="w-full space-y-3">
          <Button
            onClick={() => navigate('/bookings')}
            className="w-full bg-brand hover:brightness-90 text-white h-12 rounded-lg"
          >
            View My Bookings
          </Button>

          <Button
            onClick={() => navigate('/home')}
            variant="outline"
            className="w-full h-12 rounded-lg"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}