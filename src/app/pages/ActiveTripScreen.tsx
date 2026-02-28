import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Phone, MessageCircle, Clock, MapPin, Shield } from 'lucide-react';
import { mockBookings, mockCars } from '../../data/mockData';
import { Button } from '../components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { format } from 'date-fns';
import { useState } from 'react';
import { toast } from 'sonner';
import { RideChatSheet } from '../components/RideChatSheet';
import { InAppCallOverlay } from '../components/InAppCallOverlay';

export function ActiveTripScreen() {
  const navigate = useNavigate();
  const { id } = useParams();

  const booking = mockBookings.find(b => b.id === id);
  const car = booking ? mockCars.find(c => c.id === booking.carId) : null;

  const [showChat, setShowChat] = useState(false);
  const [showCall, setShowCall] = useState(false);

  if (!booking || !car) {
    return <div>Trip not found</div>;
  }

  const handleReportIssue = () => {
    const issue = prompt(
      'Please describe the issue you\'re experiencing:\n\nCommon issues:\n- Vehicle damage\n- Mechanical problems\n- Accident\n- Other'
    );

    if (issue) {
      alert(`Issue reported successfully!\n\nYour report: "${issue}"\n\nOur support team will contact you shortly. (This is a demo)`);
    }
  };

  const handleSOS = () => {
    const confirmSOS = window.confirm(
      'EMERGENCY SOS\n\nAre you in immediate danger? This will connect you to emergency services and notify our safety team.'
    );

    if (confirmSOS) {
      alert('Connecting to Emergency Services...\n\nNotifications sent to:\n- Local Authorities\n- RideNaira Safety Team\n- Your Emergency Contacts\n\n(This is a demo)');
    }
  };

  const handleEndTrip = () => {
    const confirmEnd = window.confirm(
      'Are you ready to end this trip?\n\nPlease ensure:\n✓ Vehicle is returned to pickup location\n✓ Fuel level matches pickup level\n✓ Vehicle is clean and undamaged\n✓ All belongings are removed'
    );

    if (confirmEnd) {
      alert('Trip ended successfully!\n\nThank you for using RideNaira. A receipt has been sent to your email.\n\n(This is a demo)');
      navigate('/bookings');
    }
  };

  return (
    <div className="min-h-screen bg-white relative">
      {/* Header - Floating */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 pb-4 pt-safe-top">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg"
        >
          <ArrowLeft className="w-5 h-5 text-brand" />
        </button>
        <div className="bg-white px-4 py-2 rounded-full shadow-lg">
          <h1 className="text-sm font-semibold text-brand">Active Trip</h1>
        </div>
        <button
          onClick={() => toast.error("SOS Alert Sent! Emergency services notified.", {
            style: { backgroundColor: '#be123c', color: 'white' }
          })}
          className="bg-rose-600 text-white px-4 py-2 rounded-xl font-black text-[10px] tracking-widest uppercase shadow-lg shadow-rose-600/20 active:scale-95 transition-all"
        >
          SOS HELP
        </button>
      </div>

      {/* Map View */}
      <div className="h-[55vh] bg-gray-200 relative">
        {/* Using a dark map style image */}
        <img
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&h=800&fit=crop"
          alt="Map"
          className="w-full h-full object-cover opacity-90"
        />

        {/* Car location marker */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="w-14 h-14 bg-brand rounded-full flex items-center justify-center shadow-xl border-4 border-white">
              <MapPin className="w-7 h-7 text-white" fill="white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
          </div>
        </div>
      </div>

      {/* Bottom Sheet */}
      <div className="bg-white rounded-t-3xl -mt-8 relative z-10 shadow-2xl min-h-[50vh]">
        <div className="px-4 pt-6 pb-8 space-y-5">
          {/* Trip Status */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-semibold">Trip in Progress</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Rental active until {format(new Date(booking.endDate), 'MMM dd, hh:mm a')}
            </p>
          </div>

          {/* Car Info */}
          <div className="flex gap-3 bg-gray-50 rounded-2xl p-3.5">
            <img
              src={car.image}
              alt={car.name}
              className="w-20 h-20 object-cover rounded-xl"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-base text-brand mb-0.5">{car.name}</h3>
              <p className="text-xs text-gray-600 mb-1.5">{car.model}</p>
              <div className="flex items-center gap-1">
                <span className="text-amber-400 text-sm">★</span>
                <span className="text-xs font-medium text-brand">{car.rating}</span>
              </div>
            </div>
          </div>

          {/* Host/Driver Info */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-xs text-gray-600 mb-3">
              {booking.withDriver ? 'Your Driver' : 'Your Host'}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={car.host.avatar} />
                  <AvatarFallback>{car.host.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm text-brand">{car.host.name}</p>
                  <p className="text-xs text-gray-600 mt-0.5">⭐ {car.host.rating} rating</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
                  onClick={() => setShowCall(true)}
                >
                  <Phone className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  className="w-10 h-10 bg-white border border-gray-100 rounded-full flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
                  onClick={() => setShowChat(true)}
                >
                  <MessageCircle className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </div>
          </div>

          {/* Trip Details */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Rental Period</p>
                <p className="font-medium text-sm text-brand mt-0.5">
                  {format(new Date(booking.startDate), 'MMM dd')} - {format(new Date(booking.endDate), 'MMM dd')}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-2">
            <Button
              onClick={handleReportIssue}
              variant="outline"
              className="w-full h-12 rounded-xl border-gray-200 font-medium text-sm"
            >
              Report an Issue
            </Button>

            <Button
              onClick={handleEndTrip}
              className="w-full bg-brand hover:brightness-90 text-white h-14 rounded-xl font-semibold text-base"
            >
              End Trip & Return
            </Button>
          </div>
        </div>
      </div>

      {/* Communication Overlays */}
      <RideChatSheet
        isOpen={showChat}
        onClose={() => setShowChat(false)}
        driverName={car.host.name}
        driverImage={car.host.avatar}
        onCall={() => { setShowChat(false); setShowCall(true); }}
      />

      <InAppCallOverlay
        isOpen={showCall}
        onEndCall={() => setShowCall(false)}
        driverName={car.host.name}
        driverImage={car.host.avatar}
      />
    </div>
  );
}