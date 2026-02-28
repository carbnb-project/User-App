import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Download, Star, MapPin, MessageCircle, Phone, ChevronRight, ThumbsUp } from 'lucide-react';
import { mockCars } from '../../data/mockData';
import { Button } from '../components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { RideChatSheet } from '../components/RideChatSheet';
import { InAppCallOverlay } from '../components/InAppCallOverlay';

export function CarDetailsScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const car = mockCars.find(c => c.id === id);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [showChat, setShowChat] = useState(false);
  const [showCall, setShowCall] = useState(false);

  if (!car) {
    return <div>Car not found</div>;
  }

  // Spec items using local icon assets
  const specItems = [
    { icon: '/assets/images/Icons/icon-park-outline_peoples.jpg', value: `${car.specs.seats} Seats` },
    { icon: '/assets/images/Icons/line-md_speedometer.jpg', value: car.specs.maxSpeed || '150mph' },
    { icon: '/assets/images/Icons/SvgjsSvg1097.jpg', value: car.specs.transmission },
    { icon: '/assets/images/Icons/ph_engine.jpg', value: car.specs.fuelType === 'Petrol' ? 'Gasoline' : car.specs.fuelType },
    { icon: '/assets/images/Icons/hugeicons_luggage-01.jpg', value: `${car.specs.luggage || 2} Bags` },
  ];

  // Feature icons — exactly matching the design screenshot (L→R)
  const featureIcons = [
    { src: '/assets/images/Icons/SvgjsSvg1097.jpg', label: 'AC' },
    { src: '/assets/images/Icons/Frame-5.jpg', label: 'Keyless Entry' },
    { src: '/assets/images/Icons/Frame-3.jpg', label: 'Sensors' },
    { src: '/assets/images/Icons/Frame-1.jpg', label: 'USB Charging' },
    { src: '/assets/images/Icons/Frame-2.jpg', label: 'Display' },
    { src: '/assets/images/Icons/Frame-4.jpg', label: 'Smart Key' },
    { src: '/assets/images/Icons/Frame.jpg', label: 'Bluetooth' },
  ];

  return (
    <div className="min-h-screen bg-background pb-32 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-14 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100"
        >
          <ArrowLeft className="w-5 h-5 text-brand" />
        </button>
        <button
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 text-brand"
        >
          <Download className="w-5 h-5" />
        </button>
      </div>

      <div className="px-5">
        {/* Car Name */}
        <h1 className="text-2xl font-bold text-brand mb-1.5 leading-tight">{car.name}</h1>

        {/* Location */}
        <div className="flex items-center gap-1.5 mb-1.5">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-400 font-medium">{car.location}</span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-5">
          <Star className="w-4 h-4 fill-star stroke-star" />
          <span className="text-sm font-semibold text-gray-500">{car.rating}</span>
          <span className="text-sm text-gray-400">({car.reviewCount} Reviews)</span>
        </div>

        {/* Image Gallery */}
        <div className="relative mb-2 rounded-2xl overflow-hidden bg-gray-100 h-[220px] w-full">
          <img
            src={car.images[currentImageIndex]}
            alt={car.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Image Dots */}
        <div className="flex justify-center gap-2 mb-8">
          {(car.images.length > 1 ? car.images : [...Array(4)]).map((_, index) => (
            <button
              key={index}
              onClick={() => car.images.length > 1 && setCurrentImageIndex(index)}
              className={`h-2 w-2 rounded-full transition-all ${index === currentImageIndex ? 'bg-brand w-2.5 h-2.5' : 'bg-gray-300'
                }`}
            />
          ))}
        </div>

        {/* Overview */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-brand mb-3">Overview</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            {car.overview || "Experience the future of driving with this premium vehicle. Fully equipped with modern features, premium interior, and cutting edge technology. Perfect for your next trip."}
          </p>
        </div>

        {/* Specifications - Icon Grid */}
        <div className="flex justify-between items-start gap-2 mb-8">
          {specItems.map((spec, index) => (
            <div key={index} className="flex flex-col items-center gap-2 min-w-0 flex-1">
              <div className="w-10 h-10 flex items-center justify-center">
                <img
                  src={spec.icon}
                  alt={spec.value}
                  className="w-7 h-7 object-contain opacity-60"
                />
              </div>
              <span className="text-xs font-medium text-brand text-center leading-tight">{spec.value}</span>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-brand mb-4">Features</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {featureIcons.map((feature, index) => (
              <div
                key={index}
                className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-200/60 flex items-center justify-center shrink-0"
              >
                <img
                  src={feature.src}
                  alt={feature.label}
                  className="w-6 h-6 object-contain opacity-60"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Host Info */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-brand mb-4">Your Host</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={car.host.avatar} />
                <AvatarFallback>{car.host.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-bold text-base text-brand">{car.host.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Star className="w-3.5 h-3.5 fill-star stroke-star" />
                  <span className="text-xs text-gray-400 font-medium">
                    {car.host.rating} • Host since {car.host.joinedDate.split('-')[0]}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowChat(true)}
                className="w-11 h-11 rounded-full border border-gray-200 bg-white flex items-center justify-center text-brand hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
              >
                <MessageCircle className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowCall(true)}
                className="w-11 h-11 rounded-full border border-gray-200 bg-white flex items-center justify-center text-brand hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
              >
                <Phone className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Cancellation Policy */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-brand mb-4">Cancellation Policy</h2>
          <div className="bg-white p-5 rounded-2xl flex items-center justify-between shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <ThumbsUp className="w-6 h-6 text-gray-400 stroke-[1.5] shrink-0" />
              <p className="text-xs text-gray-400 leading-snug">
                Free cancellation, if you cancel your booking before 5 days of your trip
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 shrink-0 ml-2" />
          </div>
        </div>
      </div>

      {/* Bottom Booking Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-4 pb-8 flex items-center justify-between z-10">
        <div>
          <span className="text-2xl font-bold text-brand">₦{car.pricePerDay.toLocaleString()}</span>
          <span className="text-sm text-gray-400 font-medium">/Day</span>
        </div>
        <Button
          onClick={() => navigate(`/booking/${car.id}`)}
          className="bg-brand hover:bg-brand-light text-white h-14 rounded-xl px-10 font-semibold text-base active:scale-[0.98] transition-transform"
        >
          Book Now
        </Button>
      </div>

      {/* Communication Overlays */}
      <RideChatSheet
        isOpen={showChat}
        onClose={() => setShowChat(false)}
        driverName={car.host.name}
        driverImage={car.host.avatar}
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