import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, SlidersHorizontal, Heart, Star } from 'lucide-react';
import { mockCars, Car } from '../../data/mockData';
import { Button } from '../components/ui/button';

import { FilterModal } from '../components/FilterModal';

export function CarListingScreen() {
    const { type } = useParams<{ type: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // determining title and base list based on type
    const pageTitle = type === 'featured' ? 'Featured Cars' : 'Latest Cars';

    // In a real app, you'd fetch different endpoints. 
    // Here we'll simulate it: 
    // - 'latest' = first 5 cars
    // - 'featured' = skip first 3, take next 5 (just for demo variety)
    const baseList = type === 'featured' ? mockCars.slice(3, 8) : mockCars.slice(0, 5);

    // Initial load
    const [displayCars, setDisplayCars] = useState<Car[]>(baseList.length > 0 ? baseList : mockCars);
    const [favorites, setFavorites] = useState<string[]>([]);

    // Infinite scroll
    const observerTarget = useRef<HTMLDivElement>(null);

    const toggleFavorite = (carId: string) => {
        setFavorites(prev =>
            prev.includes(carId)
                ? prev.filter(id => id !== carId)
                : [...prev, carId]
        );
    };

    const loadMoreCars = () => {
        if (loading) return;
        setLoading(true);
        setTimeout(() => {
            setDisplayCars(prev => [...prev, ...baseList]);
            setLoading(false);
        }, 1500);
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting) {
                    loadMoreCars();
                }
            },
            { threshold: 1.0 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [observerTarget, loading, baseList]);

    return (
        <div className="min-h-screen bg-background pb-8 pt-safe-top font-sans text-brand">
            {/* Header */}
            <div className="bg-background sticky top-0 z-10 px-6 py-4 flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100"
                >
                    <ChevronLeft className="w-5 h-5 text-brand" />
                </button>

                <h1 className="text-[18px] font-bold text-brand absolute left-1/2 transform -translate-x-1/2">
                    {pageTitle}
                </h1>

                <div className="w-10" />
            </div>

            {/* Search & Filter */}
            <div className="px-6 mb-6">
                <div className="flex gap-4">
                    <div className="flex-1 bg-white rounded-[16px] flex items-center px-4 h-[52px] shadow-sm border border-gray-100/50">
                        <Search className="w-5 h-5 text-brand mr-3" strokeWidth={2} />
                        <input
                            type="text"
                            placeholder="Search cars, brands, locations..."
                            className="flex-1 bg-transparent border-none outline-none text-[14px] text-brand placeholder-gray-400 font-medium"
                        />
                    </div>
                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className="w-14 h-14 bg-brand rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-transform shrink-0"
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

            {/* Car List */}
            <div className="px-6 space-y-4">
                {displayCars.map((car, index) => (
                    <div
                        key={`${car.id}-${index}`}
                        className="group bg-white p-4 rounded-[24px] flex gap-4 shadow-sm border border-gray-100/50 items-stretch hover:shadow-md transition-all"
                    >
                        {/* Car Image - Fixed Size & Cover */}
                        <div className="w-[130px] h-[120px] bg-gray-50 rounded-[20px] overflow-hidden relative shrink-0">
                            <img
                                src={car.image}
                                alt={car.name}
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                onClick={() => navigate(`/car/${car.id}`)}
                            />
                        </div>

                        {/* Details */}
                        <div className="flex-1 flex flex-col justify-between min-w-0 py-1">
                            <div>
                                {/* Title & Heart */}
                                <div className="flex justify-between items-start gap-2">
                                    <h3
                                        className="font-bold text-brand text-[16px] leading-[1.3] truncate pt-1"
                                        onClick={() => navigate(`/car/${car.id}`)}
                                    >
                                        {car.name}
                                    </h3>
                                    <button
                                        onClick={() => toggleFavorite(car.id)}
                                        className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-100 hover:bg-gray-50 shrink-0 transition-colors -mt-1 -mr-1"
                                    >
                                        <Heart
                                            className={`w-4 h-4 ${favorites.includes(car.id) ? 'fill-danger stroke-danger' : 'text-gray-400 stroke-[2px]'}`}
                                        />
                                    </button>
                                </div>

                                {/* Price */}
                                <div className="flex items-baseline gap-1 mt-1">
                                    <span className="text-brand font-bold text-[15px]">₦{car.pricePerDay.toLocaleString()}</span>
                                    <span className="text-gray-400 text-[12px] font-medium">/Day</span>
                                </div>

                                {/* Rating */}
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="flex items-center gap-1">
                                        <Star className="w-3.5 h-3.5 fill-[#9CA3AF] stroke-[#9CA3AF]" />
                                        <span className="text-[13px] font-medium text-gray-500">{car.rating}</span>
                                    </div>
                                    {car.reviewerAvatars.length > 0 && (
                                        <div className="flex -space-x-2 pl-2 border-l border-gray-200 ml-2 h-6 items-center">
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

                            {/* Button */}
                            <Button
                                onClick={() => navigate(`/booking/${car.id}`)}
                                className="w-full h-10 bg-brand hover:bg-brand-light text-white rounded-xl text-xs font-semibold tracking-wide shadow-none mt-2"
                            >
                                Book Now
                            </Button>
                        </div>
                    </div>
                ))}

                {/* Loading Spinner */}
                <div ref={observerTarget} className="py-4 flex justify-center">
                    {loading && (
                        <div className="w-6 h-6 border-2 border-gray-200 border-t-brand rounded-full animate-spin" />
                    )}
                </div>
            </div>
        </div>
    );
}
