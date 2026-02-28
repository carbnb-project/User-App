import { useNavigate, useParams, useLocation } from 'react-router';
import { ArrowLeft, Calendar, MapPin, User, Shield } from 'lucide-react';
import { mockCars } from '../../data/mockData';
import { Button } from '../components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { format } from 'date-fns';

export function BookingSummaryScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const car = mockCars.find(c => c.id === id);

  const {
    startDate,
    endDate,
    withDriver,
    deliveryOption,
    addInsurance,
    totalPrice,
  } = location.state || {};

  if (!car || !startDate || !endDate) {
    return <div>Invalid booking</div>;
  }

  const handleConfirm = () => {
    navigate(`/payment/${car.id}`, {
      state: location.state,
    });
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 flex items-center gap-4 px-4 pb-4 pt-safe-top border-b">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold">Booking Summary</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Car Info */}
        <div className="border rounded-xl overflow-hidden">
          <img
            src={car.image}
            alt={car.name}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h2 className="text-xl font-bold mb-1">{car.name}</h2>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{car.location}</span>
            </div>
          </div>
        </div>

        {/* Host Info */}
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm text-gray-600 mb-3">Your Host</p>
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={car.host.avatar} />
              <AvatarFallback>{car.host.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{car.host.name}</p>
              <p className="text-sm text-gray-600">⭐ {car.host.rating} rating</p>
            </div>
          </div>
        </div>

        {/* Trip Details */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Trip Details</h3>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-600 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Rental Period</p>
                <p className="font-medium">
                  {format(new Date(startDate), 'MMM dd, yyyy')} - {format(new Date(endDate), 'MMM dd, yyyy')}
                </p>
              </div>
            </div>

            {withDriver && (
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Driver</p>
                  <p className="font-medium">Professional driver included</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-600 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Delivery</p>
                <p className="font-medium">
                  {deliveryOption === 'delivery' ? 'Delivered to your location' : 'Pickup from host location'}
                </p>
              </div>
            </div>

            {addInsurance && (
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Insurance</p>
                  <p className="font-medium">Full coverage included</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Total */}
        <div className="bg-brand text-white rounded-xl p-4">
          <div className="flex justify-between items-center">
            <span className="text-lg">Total Amount</span>
            <span className="text-2xl font-bold">₦{totalPrice.toLocaleString()}</span>
          </div>
        </div>

        {/* Terms */}
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm text-gray-600">
            By confirming this booking, you agree to our{' '}
            <button
              type="button"
              className="text-black font-semibold"
              onClick={() => alert('Terms & Conditions:\n\n1. Minimum rental period is 24 hours\n2. Valid driver\'s license required\n3. Security deposit may be required\n4. Fuel policy: Return with same fuel level\n5. Late returns subject to additional charges\n\n(This is a demo)')}
            >
              Terms & Conditions
            </button> and{' '}
            <button
              type="button"
              className="text-black font-semibold"
              onClick={() => alert('Cancellation Policy:\n\n- Free cancellation up to 24 hours before pickup\n- 50% refund for cancellations within 24 hours\n- No refund for cancellations after pickup time\n- Host cancellations: Full refund + credit\n\n(This is a demo)')}
            >
              Cancellation Policy
            </button>.
          </p>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <Button
          onClick={handleConfirm}
          className="w-full bg-brand hover:brightness-90 text-white h-12 rounded-lg"
        >
          Proceed to Payment
        </Button>
      </div>
    </div>
  );
}