import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Search, Star, Heart, SlidersHorizontal } from 'lucide-react';
import { mockCars } from '../../data/mockData';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { FilterModal } from '../components/FilterModal';

export function SearchScreen() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredCars = mockCars.filter(car =>
    car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    car.model.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background border-b border-gray-100 px-4 pb-4 pt-safe-top">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6 text-brand" />
          </button>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for cars..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 h-12 rounded-xl border-gray-200"
              autoFocus
            />
          </div>
          <button
            onClick={() => setIsFilterOpen(true)}
            className="w-12 h-12 bg-brand rounded-xl flex items-center justify-center shadow-lg active:scale-95 transition-transform shrink-0"
          >
            <SlidersHorizontal className="w-5 h-5 text-white" strokeWidth={2} />
          </button>
        </div>
      </div>

      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={(filters) => console.log('Filters applied:', filters)}
      />

      {/* Results */}
      <div className="p-4">
        {searchQuery === '' ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 text-sm">Start typing to search for cars</p>
          </div>
        ) : filteredCars.length > 0 ? (
          <div className="space-y-3">
            {filteredCars.map((car, index) => (
              <div
                key={`${car.id}-${index}`}
                className="group bg-white p-4 rounded-[24px] flex gap-4 shadow-sm border border-gray-100/50 items-stretch hover:shadow-md transition-all"
              >
                {/* Car Image (Left) - Stretches to full height */}
                <div className="w-[150px] bg-gray-50 rounded-[20px] overflow-hidden relative shrink-0">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="absolute inset-0 w-full h-full object-contain p-1 transform group-hover:scale-105 transition-transform duration-500"
                    onClick={() => navigate(`/car/${car.id}`)}
                  />
                </div>

                {/* Details (Right) - Uniform Vertical Spacing */}
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
                      {/* Note: Favorites state needs to be lifted or locally managed here if we want functionality. 
                          For now, just a button for visual consistency. */}
                      <button
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-100 hover:bg-gray-50 shrink-0 transition-colors"
                      >
                        <Heart className="w-4 h-4 text-gray-400 stroke-[2px]" />
                      </button>
                    </div>

                    {/* Price Row */}
                    <div className="flex items-baseline gap-1">
                      <span className="text-brand font-bold text-sm">₦{car.pricePerDay.toLocaleString()}</span>
                      <span className="text-gray-400 text-[13px] font-medium">/Day</span>
                    </div>

                    {/* Rating & Avatars Row */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-[#9CA3AF] stroke-[#9CA3AF]" />
                        <span className="text-[13px] font-medium text-gray-500">{car.rating}</span>
                      </div>
                      {car.reviewerAvatars.length > 0 && (
                        <div className="flex -space-x-2 pl-1.5 border-l border-gray-200 ml-1.5 h-6 items-center">
                          {car.reviewerAvatars.slice(0, 3).map((avatar, i) => (
                            <img
                              key={i}
                              src={avatar}
                              className="w-6 h-6 rounded-full border-2 border-white object-cover relative"
                              style={{ zIndex: 3 - i }}
                              alt=""
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* CTA Button - Aligned Bottom */}
                  <Button
                    onClick={() => navigate(`/booking/${car.id}`)}
                    className="w-full h-10 bg-brand hover:bg-brand-light text-white rounded-xl text-xs font-semibold tracking-wide shadow-none mt-3"
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 text-sm">No cars found for "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  );
}