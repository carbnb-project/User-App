import { useState } from 'react';
import { useNavigate } from 'react-router';
import { MessageCircle, Phone, Calendar, User, Search } from 'lucide-react';
import { mockBookings, mockCars, Booking } from '../../data/mockData';
import { BottomNav } from '../components/BottomNav';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { format } from 'date-fns';
import { RideChatSheet } from '../components/RideChatSheet';
import { InAppCallOverlay } from '../components/InAppCallOverlay';

export function BookingsScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showChat, setShowChat] = useState(false);
  const [showCall, setShowCall] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<{ name: string; avatar: string } | null>(null);
  const [allBookings, setAllBookings] = useState<Booking[]>(() => {
    // TEMPORARY: Inject a test Instant Ride to verify Details Screen
    const testInstantRide: any = {
      id: 'test_ir_1',
      bookingCode: 'CB-TEST-1',
      carId: 'classic', // "Classic Ride"
      userId: 'user_1',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 60000).toISOString(),
      withDriver: true,
      deliveryOption: 'pickup',
      status: 'ongoing', // Show in Upcoming as On-going
      totalPrice: 4500,
      deliveryAddress: 'Lagos, NG',
      pickupAddress: 'Lekki Phase 1',
    };

    try {
      const stored = localStorage.getItem('ride_history');
      if (stored) {
        const parsed: Booking[] = JSON.parse(stored);
        return [testInstantRide, ...parsed, ...mockBookings];
      }
    } catch (e) {
      console.error("Failed to parse ride history", e);
    }
    return [testInstantRide, ...mockBookings];
  });

  // Filter bookings based on tab
  // "Upcoming" tab includes: confirmed, awaiting_confirm, ongoing, upcoming
  // "Past" tab includes: completed, cancelled
  const upcomingBookings = allBookings.filter(b =>
    ['confirmed', 'awaiting_confirm', 'ongoing', 'upcoming'].includes(b.status)
  );

  const pastBookings = allBookings.filter(b =>
    ['completed', 'cancelled'].includes(b.status)
  );

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="bg-brand text-white text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider">
            Confirmed
          </span>
        );
      case 'awaiting_confirm':
        return (
          <span className="bg-brand text-white text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider">
            Awaiting Confirm
          </span>
        );
      case 'ongoing':
        return (
          <span className="bg-brand text-white text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider">
            On-Going
          </span>
        );
      case 'completed':
        return (
          <span className="bg-[#9CA3AF] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider">
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="bg-red-50 text-red-600 text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider">
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  const renderBookingCard = (booking: Booking) => {
    let car = mockCars.find(c => c.id === booking.carId);

    // Virtual Car Logic for Instant Rides (to avoid adding to global mockCars)
    const isInstantRide = booking.carId === 'classic' || booking.carId === 'executive';

    if (!car && isInstantRide) {
      car = {
        id: booking.carId,
        name: booking.carId === 'executive' ? 'Executive Ride' : 'Classic Ride',
        brand: 'N/A',
        model: booking.carId === 'executive' ? 'Luxury Sedan' : 'Standard Sedan',
        year: 2024,
        image: booking.carId === 'executive' ? '/assets/images/cars/Executive.jpg' : '/assets/images/cars/Classic.jpg',
        pricePerDay: booking.totalPrice, // Uses total price as base
        location: 'Lagos, NG',
        host: {
          id: 'h_ir',
          name: booking.carId === 'executive' ? 'Executive Driver' : 'RideNaira Driver',
          avatar: booking.carId === 'executive' ? 'https://i.pravatar.cc/150?img=33' : 'https://i.pravatar.cc/150?img=12',
        }
      } as any;
    }

    if (!car) return null;

    // Check if it's a past booking to apply specific styling
    const isPast = ['completed', 'cancelled'].includes(booking.status);

    return (
      <div
        key={booking.id}
        onClick={() => {
          if (isInstantRide) {
            navigate(`/instant-ride-details/${booking.id}`);
          } else {
            navigate(`/booking-details/${booking.id}`);
          }
        }}
        className={`bg-white p-5 rounded-[24px] shadow-sm border border-gray-100/50 mb-4 cursor-pointer hover:border-gray-200 transition-colors ${isPast ? 'opacity-80' : ''}`}
      >
        {/* Top Section: Image & Basic Info */}
        <div className="flex gap-4 mb-6">
          <div className="w-[110px] h-[85px] bg-gray-50 rounded-[16px] overflow-hidden shrink-0">
            <img
              src={car.image}
              alt={car.name}
              className={`w-full h-full object-cover ${isPast ? 'grayscale-[0.1]' : ''}`}
            />
          </div>

          <div className="flex-1 min-w-0 flex justify-between items-start gap-3">
            <div className="min-w-0 flex-1">
              <h3 className={`font-bold text-brand text-[16px] mb-1 truncate ${isPast ? 'text-gray-600' : ''}`}>{car.name}</h3>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-gray-500 text-[13px]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                  <span className="truncate block">{booking.deliveryAddress || car.location}</span>
                </div>
                {/* INT-RIDE Badge for Instant Rides */}
                {isInstantRide && (
                  <span className="bg-[#0F172A] text-white text-[9px] font-bold px-2 py-0.5 rounded-[4px] self-start uppercase tracking-wider">
                    INT-RIDE
                  </span>
                )}
              </div>
            </div>
            <div className="text-right flex flex-col items-end gap-2 shrink-0">
              <div className="flex items-baseline justify-end gap-0.5">
                <span className={`font-bold text-brand text-[15px] ${isPast ? 'text-gray-500' : ''}`}>₦{booking.totalPrice.toLocaleString()}</span>
                {!isInstantRide && <span className="text-gray-400 text-[11px] font-medium">/Day</span>}
              </div>
              {getStatusBadge(booking.status)}
            </div>
          </div>
        </div>

        {/* Date Grid */}
        <div className="grid grid-cols-2 gap-8 mb-6">
          <div>
            <p className="text-[10px] text-gray-400 font-bold tracking-wider uppercase mb-1.5">PICK UP</p>
            <p className={`text-[15px] font-bold text-brand mb-1 ${isPast ? 'text-gray-600' : ''}`}>
              {format(new Date(booking.startDate), 'MMM. dd, yyyy')}
            </p>
            <p className="text-[13px] text-gray-400 font-medium">
              {format(new Date(booking.startDate), 'hh:mm a')}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold tracking-wider uppercase mb-1.5">DROP OFF</p>
            <p className={`text-[15px] font-bold text-brand mb-1 ${isPast ? 'text-gray-600' : ''}`}>
              {format(new Date(booking.endDate), 'MMM. dd, yyyy')}
            </p>
            <p className="text-[13px] text-gray-400 font-medium">
              {format(new Date(booking.endDate), 'hh:mm a')}
            </p>
          </div>
        </div>

        {/* Driver Info & Actions */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full overflow-hidden border border-gray-100 ${isPast ? 'grayscale-[0.5]' : ''}`}>
              <img
                src={booking.withDriver
                  ? (booking.id === 'b1' || booking.id === 'b5' ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100' : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100')
                  : car.host.avatar
                }
                alt={booking.withDriver ? "Driver" : "Host"}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className={`font-bold text-brand text-[14px] ${isPast ? 'text-gray-500' : ''}`}>
                {booking.withDriver
                  ? (booking.id === 'b1' || booking.id === 'b5' ? 'Sarah Johnson' : 'Adeleke Brandon')
                  : car.host.name
                }
              </p>
              <p className="text-[12px] text-gray-400 font-medium">
                {booking.withDriver ? 'Driver' : 'Host'}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedDriver({
                  name: booking.withDriver
                    ? (booking.id === 'b1' || booking.id === 'b5' ? 'Sarah Johnson' : 'Adeleke Brandon')
                    : car.host.name,
                  avatar: booking.withDriver
                    ? (booking.id === 'b1' || booking.id === 'b5' ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100' : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100')
                    : car.host.avatar
                });
                setShowChat(true);
              }}
              className={`w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 transition-all active:scale-95 shadow-sm ${isPast ? 'text-gray-300 border-gray-100' : 'text-brand hover:bg-gray-50'}`}
              disabled={isPast}
            >
              <MessageCircle className="w-[18px] h-[18px] stroke-[1.5]" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedDriver({
                  name: booking.withDriver
                    ? (booking.id === 'b1' || booking.id === 'b5' ? 'Sarah Johnson' : 'Adeleke Brandon')
                    : car.host.name,
                  avatar: booking.withDriver
                    ? (booking.id === 'b1' || booking.id === 'b5' ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100' : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100')
                    : car.host.avatar
                });
                setShowCall(true);
              }}
              className={`w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 transition-all active:scale-95 shadow-sm ${isPast ? 'text-gray-300 border-gray-100' : 'text-brand hover:bg-gray-50'}`}
              disabled={isPast}
            >
              <Phone className="w-[18px] h-[18px] stroke-[1.5]" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background pb-28 font-sans">
      {/* Header */}
      <div className="bg-background sticky top-0 z-10 px-6 pt-safe-top pb-4">
        <h1 className="text-[22px] font-bold text-brand py-4">My Bookings</h1>
      </div>

      {/* Tabs */}
      <div className="px-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full mb-6 bg-white p-1 rounded-[16px] h-[52px] border border-gray-100/50 shadow-sm">
            <TabsTrigger
              value="upcoming"
              className="flex-1 rounded-xl h-[44px] data-[state=active]:bg-brand data-[state=active]:text-white font-semibold text-sm transition-all"
            >
              Upcoming
            </TabsTrigger>
            <TabsTrigger
              value="past"
              className="flex-1 rounded-xl h-[44px] data-[state=active]:bg-brand data-[state=active]:text-white font-semibold text-sm transition-all"
            >
              Past
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4 mt-0 min-h-[50vh]">
            {upcomingBookings.length > 0 ? (
              upcomingBookings.map(renderBookingCard)
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                  <Calendar className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-brand font-bold text-lg mb-2">No Upcoming Trips</h3>
                <p className="text-gray-400 text-sm max-w-[200px]">
                  You don't have any booked trips coming up.
                </p>
                <Button
                  onClick={() => navigate('/home')}
                  className="mt-6 bg-brand text-white rounded-xl px-6 h-12"
                >
                  Start Exploring
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4 mt-0 min-h-[50vh]">
            {pastBookings.length > 0 ? (
              pastBookings.map(renderBookingCard)
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                  <Calendar className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-brand font-bold text-lg mb-2">No Past Trips</h3>
                <p className="text-gray-400 text-sm max-w-[200px]">
                  You haven't completed any trips yet.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />

      {/* Communication Overlays */}
      {selectedDriver && (
        <>
          <RideChatSheet
            isOpen={showChat}
            onClose={() => setShowChat(false)}
            driverName={selectedDriver.name}
            driverImage={selectedDriver.avatar}
          />

          <InAppCallOverlay
            isOpen={showCall}
            onEndCall={() => setShowCall(false)}
            driverName={selectedDriver.name}
            driverImage={selectedDriver.avatar}
          />
        </>
      )}
    </div>
  );
}