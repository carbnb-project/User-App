import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, SlidersHorizontal, MapPin, Heart, Star, Bell, ChevronDown, ChevronRight } from 'lucide-react';
import { mockCars, carBrands, mockUser } from '../../data/mockData';
import { BottomNav } from '../components/BottomNav';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Button } from '../components/ui/button';

import { FilterModal } from '../components/FilterModal';

import { LocationSelectorModal } from '../components/LocationSelectorModal';
import { useLocationContext } from '../context/LocationContext';

export function HomeScreen() {
  const navigate = useNavigate();
  const { location, setLocation } = useLocationContext(); // Use global state
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // Filter cars based on location
  const filteredCars = mockCars.filter(car => car.location === location);

  const toggleFavorite = (carId: string) => {
    setFavorites(prev =>
      prev.includes(carId)
        ? prev.filter(id => id !== carId)
        : [...prev, carId]
    );
  };

  return (
    <div className="min-h-screen bg-background pb-24 font-sans text-brand">
      {/* Header Section */}
      <div className="px-6 pt-safe-top">
        {/* Top Row: Avatar, Location, Notification */}
        <div className="flex items-center justify-between mb-6 pt-2">
          {/* Avatar - Clickable */}
          <button
            onClick={() => navigate('/profile')}
            className="active:scale-95 transition-transform"
          >
            <Avatar className="w-12 h-12 shadow-sm border border-gray-100">
              <AvatarImage src={mockUser.avatar} className="object-cover" />
              <AvatarFallback>{mockUser.name[0]}</AvatarFallback>
            </Avatar>
          </button>

          {/* Location - Clickable */}
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="flex items-center gap-1.5 text-gray-500 hover:text-brand transition-colors active:scale-[0.98]"
          >
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium text-gray-600">{location}</span>
            <ChevronDown className="w-4 h-4" />
          </button>

          {/* Notification */}
          <button
            onClick={() => navigate('/notifications')}
            className="relative w-12 h-12 flex items-center justify-end active:scale-95 transition-transform"
          >
            <Bell className="w-6 h-6 text-brand" />
            <span className="absolute top-2 right-0.5 w-2.5 h-2.5 bg-danger rounded-full ring-2 ring-background"></span>
          </button>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-brand">
            Find your perfect<br />car rental
          </h1>
        </div>

        {/* Search & Filter Row */}
        <div className="flex gap-4 mb-8">
          {/* Search Input */}
          <div className="flex-1 bg-white rounded-2xl flex items-center px-4 h-[56px] shadow-sm">
            <Search className="w-5 h-5 text-brand mr-3" strokeWidth={2.5} />
            <input
              type="text"
              placeholder="Search cars, brands, locations..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-brand placeholder-gray-400 font-medium"
              onClick={() => navigate('/search')}
            />
          </div>
          {/* Filter Button */}
          <button
            onClick={() => setIsFilterOpen(true)}
            className="w-14 h-14 bg-brand rounded-2xl flex items-center justify-center shadow-lg active:scale-[0.98] transition-all"
          >
            <SlidersHorizontal className="w-6 h-6 text-white" strokeWidth={2} />
          </button>
        </div>
      </div>

      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={(filters) => console.log('Filters applied:', filters)}
      />

      <LocationSelectorModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onSelect={setLocation}
        currentLocation={location}
      />

      {/* Popular Brands */}
      <div className="mb-10">
        <div className="px-6 flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-brand tracking-tight">Popular Brands</h2>
          <button onClick={() => navigate('/brands')} className="text-sm text-gray-400 font-medium flex items-center hover:text-gray-600 transition-colors">
            view all <ChevronRight className="w-4 h-4 ml-0.5" />
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto px-6 pb-2 scrollbar-hide">
          {carBrands.map((brand) => (
            <div key={brand.id} className="flex flex-col items-center gap-3 flex-shrink-0 cursor-pointer" onClick={() => navigate(`/brand/${brand.name.toLowerCase()}`)}>
              <div className="w-[72px] h-[72px] bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100/50 transition-all active:scale-[0.98]">
                {brandLogo(brand.logo) || <span className="font-bold text-gray-300 text-xs">{brand.name.substring(0, 3)}</span>}
              </div>
              <span className="text-xs font-semibold text-gray-600 tracking-tight">{brand.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Latest Cars */}
      <div className="px-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-brand tracking-tight">Latest Cars</h2>
          <button
            onClick={() => navigate('/cars/latest')}
            className="text-sm text-gray-400 font-medium flex items-center hover:text-gray-600 transition-colors"
          >
            view all <ChevronRight className="w-4 h-4 ml-0.5" />
          </button>
        </div>

        <div className="space-y-4">
          {filteredCars.length > 0 ? (
            filteredCars.slice(0, 3).map((car) => (
              <div key={car.id} className="group bg-white p-4 rounded-2xl flex gap-4 shadow-sm border border-gray-100/50 items-stretch hover:shadow-md transition-all active:scale-[0.98]">
                {/* Car Image (Left) */}
                <div className="w-[150px] min-h-[140px] bg-gray-50 rounded-2xl overflow-hidden relative shrink-0">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    onClick={() => navigate(`/car/${car.id}`)}
                  />
                </div>

                {/* Details (Right) */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div className="flex flex-col gap-2">
                    {/* Title & Heart Row */}
                    <div className="flex justify-between items-start gap-2">
                      <h3
                        className="font-bold text-brand text-base leading-snug truncate pt-1"
                        onClick={() => navigate(`/car/${car.id}`)}
                      >
                        {car.name}
                      </h3>
                      <button
                        onClick={() => toggleFavorite(car.id)}
                        className="mt-1 shrink-0 transition-colors"
                      >
                        <Heart
                          className={`w-5 h-5 ${favorites.includes(car.id) ? 'fill-danger stroke-danger' : 'text-gray-300 stroke-[1.5px]'}`}
                        />
                      </button>
                    </div>

                    {/* Price Row */}
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-brand font-bold text-base">₦{car.pricePerDay.toLocaleString()}</span>
                      <span className="text-gray-400 text-xs font-medium">/Day</span>
                    </div>

                    {/* Rating & Avatars Row */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-star stroke-star" />
                        <span className="text-sm font-medium text-gray-600">{car.rating}</span>
                      </div>
                      {car.reviewerAvatars.length > 0 && (
                        <div className="flex -space-x-2 ml-1">
                          {car.reviewerAvatars.slice(0, 3).map((avatar, i) => (
                            <img
                              key={i}
                              src={avatar}
                              className="w-6 h-6 rounded-full border-2 border-white object-cover"
                              style={{ zIndex: 3 - i }}
                              alt=""
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* CTA Button - Compact, left-aligned */}
                  <Button
                    onClick={() => navigate(`/booking/${car.id}`)}
                    className="w-full h-10 bg-brand hover:bg-brand-light text-white rounded-2xl text-xs font-semibold tracking-wide shadow-none mt-3 active:scale-[0.98] transition-all"
                  >
                    Book Now
                  </Button>
                </div>
              </div>

            ))
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <MapPin className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <h3 className="text-brand font-bold mb-1">No cars found in {location}</h3>
              <p className="text-sm text-gray-400">Try changing your location or filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Featured Cars */}
      <div className="px-6 mb-8 mt-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-brand tracking-tight">Featured Cars</h2>
          <button
            onClick={() => navigate('/cars/featured')}
            className="text-sm text-gray-400 font-medium flex items-center hover:text-gray-600 transition-colors"
          >
            view all <ChevronRight className="w-4 h-4 ml-0.5" />
          </button>
        </div>

        <div className="space-y-4">
          {mockCars.slice(3, 6).map((car) => (
            <div key={car.id} className="group bg-white p-4 rounded-2xl flex gap-4 shadow-sm border border-gray-100/50 items-stretch hover:shadow-md transition-all active:scale-[0.98]">
              {/* Car Image (Left) */}
              <div className="w-[150px] min-h-[140px] bg-gray-50 rounded-2xl overflow-hidden relative shrink-0">
                <img
                  src={car.image}
                  alt={car.name}
                  className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  onClick={() => navigate(`/car/${car.id}`)}
                />
              </div>

              {/* Details (Right) */}
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div className="flex flex-col gap-2">
                  {/* Title & Heart Row */}
                  <div className="flex justify-between items-start gap-2">
                    <h3
                      className="font-bold text-brand text-base leading-snug truncate pt-1"
                      onClick={() => navigate(`/car/${car.id}`)}
                    >
                      {car.name}
                    </h3>
                    <button
                      onClick={() => toggleFavorite(car.id)}
                      className="mt-1 shrink-0 transition-colors"
                    >
                      <Heart
                        className={`w-5 h-5 ${favorites.includes(car.id) ? 'fill-danger stroke-danger' : 'text-gray-300 stroke-[1.5px]'}`}
                      />
                    </button>
                  </div>

                  {/* Price Row */}
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-brand font-bold text-base">₦{car.pricePerDay.toLocaleString()}</span>
                    <span className="text-gray-400 text-xs font-medium">/Day</span>
                  </div>

                  {/* Rating & Avatars Row */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-star stroke-star" />
                      <span className="text-sm font-medium text-gray-600">{car.rating}</span>
                    </div>
                    {car.reviewerAvatars.length > 0 && (
                      <div className="flex -space-x-2 ml-1">
                        {car.reviewerAvatars.slice(0, 3).map((avatar, i) => (
                          <img
                            key={i}
                            src={avatar}
                            className="w-6 h-6 rounded-full border-2 border-white object-cover"
                            style={{ zIndex: 3 - i }}
                            alt=""
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* CTA Button - Compact, left-aligned */}
                <Button
                  onClick={() => navigate(`/booking/${car.id}`)}
                  className="w-full h-10 bg-brand hover:bg-brand-light text-white rounded-2xl text-xs font-semibold tracking-wide shadow-none mt-3 active:scale-[0.98] transition-all"
                >
                  Book Now
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

// Helper for brand logos (placeholders)
function brandLogo(logoName: string) {
  // In a real app, these would be SVG imports or image URLs
  const logos: Record<string, React.ReactNode> = {
    'bmw': <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg" className="w-[42px] h-[42px] object-contain" alt="BMW" />,
    'mercedes': <img src="https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Logo.svg" className="w-[42px] h-[42px] object-contain" alt="Mercedes" />,
    'toyota': <img src="https://upload.wikimedia.org/wikipedia/commons/9/9d/Toyota_carlogo.svg" className="w-[42px] h-[42px] object-contain" alt="Toyota" />,
    'tesla': <img src="https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg" className="w-[42px] h-[42px] object-contain" alt="Tesla" />,
    'honda': <img src="https://upload.wikimedia.org/wikipedia/commons/3/38/Honda.svg" className="w-[42px] h-[42px] object-contain" alt="Honda" />,
    'ford': <img src="https://upload.wikimedia.org/wikipedia/commons/3/3e/Ford_logo_flat.svg" className="w-[52px] h-[52px] object-contain" alt="Ford" />,
    'audi': <img src="https://upload.wikimedia.org/wikipedia/commons/9/92/Audi-Logo_2016.svg" className="w-[42px] h-[42px] object-contain" alt="Audi" />,
    'hyundai': <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Hyundai_Motor_Company_logo.svg" className="w-[42px] h-[42px] object-contain" alt="Hyundai" />,
  };
  return logos[logoName] || null;
}