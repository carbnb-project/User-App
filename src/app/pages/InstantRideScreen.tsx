import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Navigation, Crosshair, ChevronLeft, ArrowRightLeft, Pencil, Car, MessageSquare, Phone, Star, ShieldCheck, X, Ticket, Clock, Gauge, ArrowRight, Check, Home, Briefcase, History, Share2, Loader2 } from 'lucide-react';
import { mockUser } from '../../data/mockData';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from '../components/ui/sheet';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

const CANCEL_REASONS = [
    'Change in plans',
    'Waiting for long time',
    'Unable to contact driver',
    'Driver denied to go to destination',
    'Wrong address shown',
    'The price is not reasonable',
    'Emergency situation',
    'Booking mistake',
    'Double booking',
    'Poor weather conditions',
    'Others',
];

import { useLocationContext } from '../context/LocationContext';
import { RideChatSheet } from '../components/RideChatSheet';
import { InAppCallOverlay } from '../components/InAppCallOverlay';

export function InstantRideScreen() {
    const navigate = useNavigate();
    const { location } = useLocationContext();

    // Form State
    const [pickupAddress, setPickupAddress] = useState(location); // Pre-fill with global location
    const [dropoffAddress, setDropoffAddress] = useState('');
    const [focusedInput, setFocusedInput] = useState<'pickup' | 'dropoff' | null>(null);
    const [locationConfirmed, setLocationConfirmed] = useState(false);

    // Trip State Machine
    const [step, setStep] = useState<'input' | 'selection' | 'searching' | 'found' | 'awaiting' | 'arrived_pickup' | 'ongoing' | 'completed' | 'review'>('input');
    const [selectedRide, setSelectedRide] = useState<'Classic' | 'Executive' | null>('Classic');

    // Cancel State
    const [showCancelSearchModal, setShowCancelSearchModal] = useState(false); // For Searching state
    const [showCancelReasonSheet, setShowCancelReasonSheet] = useState(false); // For Found/Awaiting state
    const [showCancelSuccessModal, setShowCancelSuccessModal] = useState(false); // Success after reason
    const [cancelReason, setCancelReason] = useState<string | null>(null);
    const [otherReason, setOtherReason] = useState('');
    const [isCancelling, setIsCancelling] = useState(false);

    const otherTextareaRef = React.useRef<HTMLTextAreaElement>(null);

    // Chat & Call State
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isCallActive, setIsCallActive] = useState(false);

    // Review State
    const [rating, setRating] = useState(0);
    const [tip, setTip] = useState<number | null>(null);
    const [promoCode, setPromoCode] = useState('');
    const [searchStatus, setSearchStatus] = useState('Connecting to nearby drivers...');

    // Simulate Trip Progress
    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;

        // Pause simulation if any modal is open
        if (showCancelSearchModal || showCancelReasonSheet || showCancelSuccessModal) return;

        if (step === 'searching') {
            setSearchStatus('Connecting to nearby hosts...');
            setTimeout(() => setSearchStatus('Negotiating with hosts...'), 1500);
            setTimeout(() => setSearchStatus('Finalizing trip details...'), 3000);
            timer = setTimeout(() => setStep('found'), 4500);
        } else if (step === 'found') {
            timer = setTimeout(() => setStep('awaiting'), 3000);
        } else if (step === 'awaiting') {
            timer = setTimeout(() => setStep('arrived_pickup'), 15000); // 15s waiting
        } else if (step === 'arrived_pickup') {
            timer = setTimeout(() => setStep('ongoing'), 10000); // 10s waiting
        } else if (step === 'ongoing') {
            timer = setTimeout(() => setStep('completed'), 20000); // 20s trip
        }

        return () => clearTimeout(timer);
    }, [step, showCancelSearchModal, showCancelReasonSheet, showCancelSuccessModal]);

    const mockLocations = [
        { name: 'MomaHill Montessori School', address: 'Odozi Street, Lagos, Nigeria', dist: '<1km', type: 'location' },
        { name: 'Our Father Savior Hospital', address: 'Aruna Close, Lagos, Nigeria', dist: '<5km', type: 'location' },
        { name: 'Murtala Muhammed Airport', address: 'Ikeja, Lagos', dist: '5.2 km', type: 'airport' },
        { name: 'Eko Hotels & Suites', address: 'Victoria Island, Lagos', dist: '12.5 km', type: 'hotel' },
    ];

    const savedPlaces = [
        { name: 'Home', address: '15, Odozi Street, Lagos', icon: Home, color: 'text-blue-500', bg: 'bg-blue-50' },
        { name: 'Work', address: 'Eko Tower, Victoria Island', icon: Briefcase, color: 'text-orange-500', bg: 'bg-orange-50' },
    ];

    const recentPlaces = [
        { name: 'Shoprite Ikeja City Mall', address: 'Obafemi Awolowo Way, Ikeja', icon: History, color: 'text-gray-500', bg: 'bg-gray-100' },
        { name: 'The Place Restaurant', address: 'Isaac John St, Ikeja GRA', icon: History, color: 'text-gray-500', bg: 'bg-gray-100' },
    ];



    const getFilteredLocations = () => {
        if (!focusedInput) return [];
        const query = focusedInput === 'pickup' ? pickupAddress : dropoffAddress;

        // If search is empty, show Saved & Recent places
        if (!query) return [...savedPlaces, ...recentPlaces];

        // Otherwise filter standard locations
        return mockLocations.filter(loc =>
            loc.name.toLowerCase().includes(query.toLowerCase()) ||
            loc.address.toLowerCase().includes(query.toLowerCase())
        );
    };

    const suggestions = getFilteredLocations();

    const handleConfirmLocation = () => {
        if (pickupAddress || dropoffAddress) {
            setLocationConfirmed(true);
        }
    };

    const handleLetsGo = () => {
        setStep('selection');
    };

    const handleFindRide = () => {
        setStep('searching');
    };

    const handleCancel = () => {
        // If searching, just show simple cancel confirmation
        if (step === 'searching') {
            setShowCancelSearchModal(true);
        } else {
            // If found/awaiting/ongoing, show reason sheet
            setShowCancelReasonSheet(true);
        }
    };

    const confirmCancelSearch = () => {
        setStep('input');
        setShowCancelSearchModal(false);
        setSearchStatus('Connecting to nearby drivers...');
    };

    const handleConfirmCancelRide = () => {
        if (!cancelReason) return;
        setIsCancelling(true);
        setTimeout(() => {
            setIsCancelling(false);
            setShowCancelReasonSheet(false);
            setStep('input'); // Reset to start
            setCancelReason(null);
            setOtherReason('');
            // Optional: Show a success toast or modal if needed
        }, 1500);
    };


    const handleComplete = () => {
        setStep('review');
    };

    const handlePayment = () => {
        // Create a new booking entry
        const newBooking: any = {
            id: `ir_${Date.now()}`,
            bookingCode: `CB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
            carId: selectedRide === 'Executive' ? 'executive' : 'classic',
            userId: 'user_1', // Mock user
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 26 * 60000).toISOString(), // +26 mins
            withDriver: true,
            deliveryOption: 'pickup',
            status: 'completed',
            totalPrice: 19000,
            deliveryAddress: dropoffAddress || 'Lagos, NG',
            pickupAddress: pickupAddress || 'Lagos, NG'
        };

        // Save to localStorage
        try {
            const existingHistory = localStorage.getItem('ride_history');
            const history = existingHistory ? JSON.parse(existingHistory) : [];
            history.unshift(newBooking);
            localStorage.setItem('ride_history', JSON.stringify(history));
        } catch (error) {
            console.error("Failed to save ride history", error);
        }

        // Reset everything and navigate to bookings
        setStep('input');
        setLocationConfirmed(false);
        setPickupAddress('');
        setDropoffAddress('');
        setRating(0);
        setTip(null);
        setPromoCode('');

        navigate('/bookings');
    };

    // Render Logic helpers
    const showMapOverlay = ['selection', 'searching', 'found', 'awaiting', 'arrived_pickup', 'ongoing', 'completed', 'review'].includes(step);
    const isTripActive = ['awaiting', 'arrived_pickup', 'ongoing', 'completed'].includes(step);

    // Mock Cars for Radar Effect
    const mockCars = [
        { top: '30%', left: '20%' },
        { top: '45%', left: '60%' },
        { top: '60%', left: '35%' },
        { top: '25%', left: '75%' },
        { top: '70%', left: '80%' },
        { top: '50%', left: '10%' },
    ];

    const tipOptions = [100, 200, 300, 400, 500, 1000];

    return (
        <div className="h-screen w-full relative overflow-hidden font-sans bg-brand">
            {/* Map Section */}
            {/* Map Placeholder */}
            <div className="absolute inset-0 bg-gray-200 z-0">
                <img
                    src="/assets/images/Map.jpg"
                    className="w-full h-[120vh] object-cover opacity-80"
                    alt="Map"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20"></div>
            </div>
            {/* Radar Overlay (Only visible during searching/found) */}
            {(step === 'searching' || step === 'found') && (
                <div className="absolute inset-0 z-10 pointer-events-none">
                    {mockCars.map((pos, i) => (
                        <div
                            key={i}
                            className="absolute w-12 h-12 flex items-center justify-center transition-all duration-1000"
                            style={{ top: pos.top, left: pos.left, opacity: step === 'found' ? 0.2 : 1 }}
                        >
                            <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping"></div>
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg relative z-10">
                                <Car className="w-4 h-4 text-brand fill-brand" />
                            </div>
                        </div>
                    ))}
                </div>
            )}



            {/* Active Trip Route Overlay */}
            {(isTripActive || step === 'review') && (
                <div className="absolute inset-0 z-10 pointer-events-none">
                    {/* Simulated Route Line */}
                    <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
                        <polyline
                            points="80,120 150,150 220,130 280,180 320,300"
                            fill="none"
                            stroke="white"
                            strokeWidth="5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="drop-shadow-lg"
                        />
                        {/* Start Marker */}
                        <circle cx="80" cy="120" r="6" fill="var(--color-brand)" stroke="white" strokeWidth="2" />
                        {/* End Marker */}
                        <circle cx="320" cy="300" r="6" fill="var(--color-brand)" stroke="white" strokeWidth="2" />
                    </svg>

                    {/* Moving Car Marker based on state */}
                    {step !== 'review' && (
                        <div
                            className="absolute w-12 h-12 bg-brand rounded-full flex items-center justify-center shadow-2xl border-[3px] border-white z-20 transition-all duration-[15000ms] ease-linear origin-center"
                            style={{
                                top: step === 'awaiting' ? '120px' : step === 'arrived_pickup' ? '150px' : step === 'ongoing' ? '280px' : '300px',
                                left: step === 'awaiting' ? '80px' : step === 'arrived_pickup' ? '150px' : step === 'ongoing' ? '300px' : '320px',
                                transitionDuration: step === 'awaiting' ? '15s' : step === 'ongoing' ? '20s' : '1s'
                            }}
                        >
                            <Car className="w-5 h-5 text-white fill-white" />
                        </div>
                    )}
                    {step === 'review' && (
                        <div
                            className="absolute w-12 h-12 bg-brand rounded-full flex items-center justify-center shadow-2xl border-[3px] border-white z-20"
                            style={{ top: '300px', left: '320px' }}
                        >
                            <Car className="w-5 h-5 text-white fill-white" />
                        </div>
                    )}
                </div>
            )}

            {/* Top Status Banner (Floating Pill) */}
            {
                isTripActive && (
                    <div className="absolute top-[136px] left-6 z-50 animate-in slide-in-from-top-4 duration-500">
                        <div className="bg-white rounded-2xl px-5 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100/50 flex items-center justify-between min-w-[140px]">
                            <div className="font-bold text-brand text-[13px]">
                                {step === 'awaiting' && "Arrival (10 mins)"}
                                {step === 'arrived_pickup' && "Your ride is here"}
                                {step === 'ongoing' && "Arrival (26 mins)"}
                                {step === 'completed' && "You have arrived"}
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Top Floating Location Row (Always visible steps) */}
            {
                (step === 'selection' || step === 'searching' || step === 'found' || isTripActive) && (
                    <div className="absolute top-12 left-6 right-6 z-20 animate-in slide-in-from-top-4 duration-500">
                        <div className="flex items-center bg-white rounded-[20px] p-4 shadow-lg border border-gray-100">
                            {/* Left: Pickup */}
                            <div className="flex-1 min-w-0 pr-2">
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-brand shrink-0 mt-0.5" strokeWidth={2} />
                                    <div className="min-w-0">
                                        <div className="font-bold text-brand text-[15px] truncate leading-tight mb-0.5">{pickupAddress || "Pickup Location"}</div>
                                        <p className="text-[13px] text-gray-500 truncate leading-tight">Akobo, Lagos</p>
                                    </div>
                                </div>
                            </div>

                            {/* Middle: Swap Icon */}
                            <div className="w-8 h-8 rounded-full bg-[#F3F5F7] flex items-center justify-center shrink-0 mx-2">
                                <ArrowRightLeft className="w-4 h-4 text-brand" />
                            </div>

                            {/* Right: Dropoff */}
                            <div className="flex-1 min-w-0 pl-2 text-right">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0 text-left">
                                        <div className="font-bold text-brand text-[15px] truncate leading-tight mb-0.5">{dropoffAddress || "Dropoff Location"}</div>
                                        <p className="text-[13px] text-gray-500 truncate leading-tight">Ikeja, Lagos</p>
                                    </div>
                                    <Pencil className="w-4 h-4 text-gray-400 shrink-0 mt-1" />
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }




            {/* Bottom Panel Logic */}
            {
                step === 'input' ? (
                    /* INPUT STEP PANEL */
                    <div className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-[32px] px-6 pt-10 shadow-[0_-12px_45px_rgba(0,0,0,0.18)] z-20 transition-all duration-500 ease-out min-h-[55vh]`}>
                        <Sheet>
                            <SheetTrigger asChild>
                                <div className="cursor-pointer">
                                    {!locationConfirmed ? (
                                        /* Initial State: Exposed Dual Inputs */
                                        <div className="space-y-6 relative pointer-events-none pb-48">
                                            <div className="absolute left-[29px] top-[28px] bottom-[108px] w-[2px] bg-gray-100 z-0"></div>
                                            <div className="relative z-10">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full flex items-center justify-center z-20 shadow-sm border border-gray-100">
                                                    <div className="w-2 h-2 rounded-full bg-brand"></div>
                                                </div>
                                                <Input
                                                    placeholder="Current Location"
                                                    className="h-14 pl-12 rounded-2xl border border-gray-200 bg-white text-base font-semibold text-brand shadow-sm placeholder:text-gray-500 placeholder:font-medium relative z-10"
                                                    value="Current Location"
                                                    readOnly
                                                />
                                            </div>
                                            <div className="relative z-10 mb-8">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-brand rounded-full flex items-center justify-center z-20 shadow-md">
                                                    <div className="w-2 h-2 rounded-sm bg-white"></div>
                                                </div>
                                                <Input
                                                    placeholder="Where to?"
                                                    className="h-14 pl-12 rounded-2xl border-none bg-[#F3F5F7] text-base font-semibold text-brand placeholder:text-gray-500 placeholder:font-medium relative z-10 shadow-inner"
                                                    value={dropoffAddress}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        /* Confirmed State: Filled Location Row */
                                        <div className="flex items-center bg-white rounded-[20px] p-4 shadow-sm border border-gray-100 pointer-events-none relative z-10 mb-48">
                                            <div className="flex-1 min-w-0 pr-2">
                                                <div className="flex items-start gap-3">
                                                    <MapPin className="w-5 h-5 text-brand shrink-0 mt-0.5" strokeWidth={2} />
                                                    <div className="min-w-0">
                                                        <div className="font-bold text-brand text-[15px] truncate leading-tight mb-0.5">{pickupAddress || "Pickup Location"}</div>
                                                        <p className="text-[13px] text-gray-500 truncate leading-tight">Akobo, Lagos</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-[#F3F5F7] flex items-center justify-center shrink-0 mx-2">
                                                <ArrowRightLeft className="w-4 h-4 text-brand" />
                                            </div>
                                            <div className="flex-1 min-w-0 pl-2 text-right">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="min-w-0 text-left">
                                                        <div className="font-bold text-brand text-[15px] truncate leading-tight mb-0.5">{dropoffAddress || "Dropoff Location"}</div>
                                                        <p className="text-[13px] text-gray-500 truncate leading-tight">Ikeja, Lagos</p>
                                                    </div>
                                                    <Pencil className="w-4 h-4 text-gray-400 shrink-0 mt-1" />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </SheetTrigger>
                            <SheetContent side="bottom" className="rounded-t-[32px] p-0 h-[85vh] [&>button]:hidden">
                                <div className="h-full flex flex-col bg-white rounded-t-[32px]">
                                    <div className="px-6 pt-6 pb-2 flex items-center justify-between">
                                        <SheetTitle className="text-lg font-bold text-brand">Enter Your Location</SheetTitle>
                                        <SheetClose className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-brand"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                        </SheetClose>
                                    </div>
                                    <div className="px-6 py-4 space-y-4 border-b border-gray-50 relative">
                                        {/* Connecting Line */}
                                        <div className="absolute left-[39px] top-[40px] bottom-[40px] w-[2px] bg-gray-100 z-0"></div>

                                        <div className="relative z-10">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full flex items-center justify-center z-20 shadow-sm border border-gray-100">
                                                <div className="w-2 h-2 rounded-full bg-brand"></div>
                                            </div>
                                            <Input
                                                placeholder="Current Location"
                                                className="pl-12 h-14 rounded-2xl border border-gray-100 bg-white text-base font-medium focus-visible:ring-brand shadow-sm"
                                                value={pickupAddress || "Current Location"}
                                                onChange={(e) => setPickupAddress(e.target.value)}
                                                onFocus={() => setFocusedInput('pickup')}
                                            />
                                        </div>
                                        <div className="relative z-10">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-brand rounded-full flex items-center justify-center z-20 shadow-md">
                                                <div className="w-2 h-2 rounded-sm bg-white"></div>
                                            </div>
                                            <Input
                                                placeholder="Where to?"
                                                className="pl-12 h-14 rounded-2xl border-none bg-[#F3F5F7] text-base font-semibold focus-visible:ring-brand shadow-inner"
                                                value={dropoffAddress}
                                                onChange={(e) => setDropoffAddress(e.target.value)}
                                                onFocus={() => setFocusedInput('dropoff')}
                                                autoFocus
                                            />
                                        </div>

                                        {/* Driver Avatar Circle - Removed as it was misplaced inside input logic */}
                                    </div>
                                    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
                                        {getFilteredLocations().map((loc: any, i) => {
                                            const Icon = loc.icon || MapPin;
                                            return (
                                                <div
                                                    key={i}
                                                    className="flex items-start gap-4 cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition-colors group"
                                                    onClick={() => {
                                                        if (focusedInput === 'pickup') {
                                                            setPickupAddress(loc.name);
                                                            setFocusedInput('dropoff');
                                                        } else {
                                                            setDropoffAddress(loc.name);
                                                            setFocusedInput(null);
                                                        }
                                                    }}
                                                >
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${loc.bg || 'bg-gray-100'}`}>
                                                        <Icon className={`w-5 h-5 ${loc.color || 'text-gray-500'}`} />
                                                    </div>
                                                    <div className="flex-1 min-w-0 pt-0.5">
                                                        <h4 className="font-bold text-brand text-[15px] truncate">{loc.name}</h4>
                                                        <p className="text-[13px] text-gray-500 mt-0.5 truncate">{loc.address}</p>
                                                    </div>
                                                    {loc.dist && <span className="text-xs font-semibold text-gray-400 mt-2">{loc.dist}</span>}
                                                </div>
                                            );
                                        })}
                                        <div className="flex items-center gap-4 py-3 cursor-pointer border-t border-gray-50 pt-4 mt-4 hover:bg-gray-50 rounded-xl px-2">
                                            <div className="w-10 h-10 flex items-center justify-center bg-brand/10 rounded-full">
                                                <Crosshair className="w-5 h-5 text-brand" />
                                            </div>
                                            <span className="font-bold text-brand text-[15px]">Set location on map</span>
                                        </div>
                                    </div>
                                    <div className="p-6 pt-2 border-t border-gray-50">
                                        <SheetClose asChild>
                                            <Button
                                                className="w-full h-14 bg-brand hover:bg-brand/90 text-white rounded-xl font-bold text-lg"
                                                onClick={handleConfirmLocation}
                                            >
                                                Save
                                            </Button>
                                        </SheetClose>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>

                        {/* Let's Go CTA */}
                        {locationConfirmed && (
                            <div className="absolute bottom-10 left-6 right-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                                <Button
                                    className="w-full h-14 bg-brand hover:bg-brand/90 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-900/20 active:scale-[0.98] transition-transform"
                                    onClick={handleLetsGo}
                                >
                                    Let's go
                                </Button>
                            </div>
                        )}
                    </div>
                ) : step === 'selection' ? (
                    /* SELECTION STEP PANEL */
                    <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[32px] px-6 pt-8 pb-10 shadow-[0_-12px_45px_rgba(0,0,0,0.18)] z-20 animate-in slide-in-from-bottom-10 duration-500">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-[20px] font-bold text-brand">Select your ride</h2>
                            <div className="bg-gray-100 rounded-full px-3 py-1 text-xs font-bold text-gray-600">
                                ~ 3 mins away
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            {/* Classic Ride Option */}
                            <div
                                className={`flex items-center p-4 rounded-2xl border-2 transition-all cursor-pointer ${selectedRide === 'Classic' ? 'border-brand bg-[#F3F5F7]' : 'border-gray-50 bg-white opacity-70 hover:opacity-100'}`}
                                onClick={() => setSelectedRide('Classic')}
                            >
                                <img src="/assets/images/cars/Classic.jpg" className="w-20 h-12 object-contain mr-4" alt="Classic Car" />
                                <div className="flex-1">
                                    <h3 className="font-bold text-brand text-base">Classic</h3>
                                    <p className="text-xs text-gray-500">Arrive in 10min</p>
                                </div>
                                <div className="text-right">
                                    <span className="font-bold text-brand text-[15px]">₦2500 - 3200</span>
                                </div>
                            </div>

                            {/* Executive Ride Option */}
                            <div
                                className={`flex items-center p-4 rounded-2xl border-2 transition-all cursor-pointer ${selectedRide === 'Executive' ? 'border-brand bg-[#F3F5F7]' : 'border-gray-50 bg-white opacity-70 hover:opacity-100'}`}
                                onClick={() => setSelectedRide('Executive')}
                            >
                                <img src="/assets/images/cars/Executive.jpg" className="w-20 h-12 object-contain mr-4" alt="Executive Car" />
                                <div className="flex-1">
                                    <h3 className="font-bold text-brand text-base">Executive</h3>
                                    <p className="text-xs text-gray-500">Arrive in 10min</p>
                                </div>
                                <div className="text-right">
                                    <span className="font-bold text-brand text-[15px]">₦5800 - 8100</span>
                                </div>
                            </div>
                        </div>

                        {/* Promo Code Input */}
                        <div className="mb-6 flex gap-2">
                            <div className="relative flex-1">
                                <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    placeholder="Add Promo Code"
                                    className="h-12 pl-10 rounded-xl border-gray-100 bg-gray-50/50 text-sm focus-visible:ring-brand"
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" className="h-12 rounded-xl border-gray-200 font-bold text-brand hover:bg-gray-50 px-6">
                                Apply
                            </Button>
                        </div>

                        <Button
                            className="w-full h-14 bg-brand hover:bg-brand/90 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-900/20 active:scale-[0.98] transition-all"
                            onClick={handleFindRide}
                        >
                            Find a Ride
                        </Button>
                    </div>
                ) : step === 'review' ? (
                    /* REVIEW & PAYMENT PANEL - Compact / No Scroll */
                    <div className="absolute inset-0 z-50 bg-white flex flex-col h-full overflow-hidden">
                        {/* Close Button - Absolute Position */}
                        <div className="absolute top-5 right-5 z-20">
                            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors" onClick={handlePayment}>
                                <X className="w-5 h-5 text-gray-500" />
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col px-6 pt-10 pb-6 h-full">
                            {/* Header Section */}
                            <div className="flex flex-col items-center flex-shrink-0">
                                <div className="w-20 h-20 rounded-full mb-3 overflow-hidden border-2 border-white shadow-sm ring-1 ring-gray-100">
                                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400" className="w-full h-full object-cover" />
                                </div>
                                <h2 className="text-[20px] font-bold text-brand mb-1">How was your driver?</h2>
                                <p className="text-[13px] text-gray-500 mb-4">Help us do better by rating your trip</p>
                            </div>

                            {/* Scrollable Content Container (if heavily populated) or just Flex-1 */}
                            <div className="flex-1 flex flex-col justify-evenly w-full space-y-4">

                                {/* Rating Stars */}
                                <div className="flex items-center justify-center gap-3">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`w-9 h-9 cursor-pointer transition-colors ${rating >= star ? 'fill-star text-star' : 'fill-[#E8E8E8] text-[#E8E8E8] opacity-50 hover:opacity-80'}`}
                                            onClick={() => setRating(star)}
                                        />
                                    ))}
                                </div>

                                {/* Promo Code */}
                                <div>
                                    <h3 className="font-bold text-brand text-[14px] mb-2.5">Have a Promo Code?</h3>
                                    <div className="flex gap-2.5">
                                        <Input
                                            placeholder="Enter code here"
                                            className="h-11 rounded-xl border-gray-200 bg-white flex-1 text-sm bg-gray-50/50"
                                            value={promoCode}
                                            onChange={(e) => setPromoCode(e.target.value)}
                                        />
                                        <Button className="h-11 px-5 bg-brand text-white rounded-xl font-medium text-sm">
                                            Redeem
                                        </Button>
                                    </div>
                                </div>

                                {/* Tip Section */}
                                <div>
                                    <h3 className="font-bold text-brand text-[14px] mb-2.5">Add a tip for your driver</h3>
                                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-2 px-2">
                                        {tipOptions.map((amount) => (
                                            <button
                                                key={amount}
                                                className={`flex-shrink-0 px-4 py-2 rounded-full text-[13px] font-medium border transition-colors ${tip === amount ? 'bg-brand text-white border-brand' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
                                                onClick={() => setTip(amount)}
                                            >
                                                ₦{amount}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Fare Breakdown - Compact */}
                                <div className="bg-white rounded-xl border border-gray-100 p-3.5 shadow-sm">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Navigation className="w-3.5 h-3.5" />
                                            <span className="text-[13px] font-medium">Base Fare</span>
                                        </div>
                                        <span className="text-[13px] font-bold text-brand">₦3,000</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Gauge className="w-3.5 h-3.5" />
                                            <span className="text-[13px] font-medium">Distance (2.1 km)</span>
                                        </div>
                                        <span className="text-[13px] font-bold text-brand">₦9,360</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span className="text-[13px] font-medium">Time (26 mins)</span>
                                        </div>
                                        <span className="text-[13px] font-bold text-brand">₦4,500</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Ticket className="w-3.5 h-3.5" />
                                            <span className="text-[13px] font-medium">Tolls & Surcharges</span>
                                        </div>
                                        <span className="text-[13px] font-bold text-brand">₦2,140</span>
                                    </div>

                                    <div className="w-full h-px bg-gray-100 mb-3"></div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-[14px] font-medium text-gray-600">Subtotal</span>
                                        <span className="text-[16px] font-bold text-brand">₦19,000</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 flex-shrink-0">
                                <Button className="w-full h-12 bg-brand text-white rounded-2xl font-bold text-[16px] shadow-lg hover:bg-brand/90 transition-all" onClick={handlePayment}>
                                    Proceed to Pay
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : isTripActive ? (
                    /* TRIP ACTIVE PANEL (Driver Details) */
                    <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[32px] px-6 pt-6 pb-8 shadow-[0_-12px_45px_rgba(0,0,0,0.18)] z-20 animate-in slide-in-from-bottom-10 duration-500">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-[20px] font-bold text-brand">Your Ride</h2>
                            <div className={`px-4 py-1.5 rounded-full text-[13px] font-bold animate-in fade-in duration-300 ${step === 'arrived_pickup' ? 'bg-green-100 text-green-700' :
                                step === 'ongoing' ? 'bg-blue-100 text-blue-700' :
                                    'bg-brand/10 text-brand'
                                }`}>
                                {step === 'awaiting' && "Host is 4 min away"}
                                {step === 'arrived_pickup' && "Host has arrived"}
                                {step === 'ongoing' && "Heading to destination"}
                                {step === 'completed' && "You have arrived"}
                            </div>
                        </div>

                        <div className="flex items-start gap-4 mb-8">
                            {/* Host Info */}
                            <div className="relative">
                                <Avatar className="w-16 h-16 border-2 border-white shadow-md">
                                    <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400" className="object-cover" />
                                    <AvatarFallback>SJ</AvatarFallback>
                                </Avatar>
                            </div>

                            <div className="flex-1 pt-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-bold text-brand text-xl">Sarah Johnson</h3>
                                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center" title="Verified Host">
                                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <Star className="w-4 h-4 text-star fill-star" />
                                    <span className="font-semibold text-brand text-sm">4.8 (1237 Reviews)</span>
                                </div>
                                <div className="text-sm text-gray-500 font-medium mt-1">1381 Trips • Since 2020</div>
                            </div>

                            {/* Car Image Top Right (Small) */}
                            <div className="text-right">
                                <img src="/assets/images/cars/Executive.jpg" className="w-24 object-contain mb-1" alt="BMW X5" />
                                <div className="font-bold text-brand text-sm">Grey • BMW X5</div>
                                <div className="text-xs font-bold bg-gray-100 text-gray-800 px-2 py-0.5 rounded inline-block mt-1">LND-832-XK</div>
                            </div>
                        </div>

                        {/* Actions Row */}
                        <div className="flex items-center gap-4 mb-6">
                            <Button
                                variant="outline"
                                className="h-12 w-12 rounded-full border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center shadow-sm"
                                onClick={() => setIsChatOpen(true)}
                            >
                                <MessageSquare className="w-5 h-5 text-brand" />
                            </Button>
                            <Button
                                variant="outline"
                                className="h-12 w-12 rounded-full border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center shadow-sm"
                                onClick={() => setIsCallActive(true)}
                            >
                                <Phone className="w-5 h-5 text-brand" />
                            </Button>
                            <Button variant="outline" className="h-12 w-12 rounded-full border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center shadow-sm">
                                <Share2 className="w-5 h-5 text-brand" />
                            </Button>

                            <div className="flex-1"></div>

                            {step === 'completed' ? (
                                <Button
                                    className="px-8 h-12 bg-brand hover:bg-brand/90 text-white rounded-xl font-bold text-base shadow-lg active:scale-[0.98] transition-all"
                                    onClick={handleComplete}
                                >
                                    Complete Ride
                                </Button>
                            ) : (
                                <Button
                                    variant="destructive"
                                    className="px-6 h-12 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 rounded-xl font-bold text-base shadow-sm active:scale-[0.98] transition-all"
                                    onClick={handleCancel}
                                >
                                    Cancel Ride
                                </Button>
                            )}
                        </div>
                    </div>
                ) : (
                    /* SEARCHING & FOUND PANEL */
                    <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[32px] px-6 pt-10 pb-12 min-h-[40vh] shadow-[0_-12px_45px_rgba(0,0,0,0.18)] z-20 animate-in slide-in-from-bottom-10 duration-500">
                        <div className="flex flex-col items-center">
                            {step === 'searching' && (
                                <>
                                    <div className="text-center mb-8">
                                        <h2 className="text-[20px] font-bold text-brand mb-1 animate-pulse">Matching you...</h2>
                                        <p className="text-[13px] text-gray-500">{searchStatus}</p>
                                    </div>

                                    <div className="relative w-40 h-40 mb-12">
                                        {/* Recursive Radar Rings */}
                                        <div className="absolute inset-0 rounded-full border-2 border-brand/20 animate-ping" style={{ animationDuration: '3s' }}></div>
                                        <div className="absolute inset-0 rounded-full border-2 border-brand/10 animate-ping" style={{ animationDuration: '3s', animationDelay: '1s' }}></div>
                                        <div className="absolute inset-0 rounded-full border-2 border-brand/5 animate-ping" style={{ animationDuration: '3s', animationDelay: '2s' }}></div>

                                        {/* Center Icon */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-24 h-24 bg-brand rounded-full flex items-center justify-center shadow-2xl shadow-brand/20 relative z-10 border-4 border-white">
                                                <Car className="w-10 h-10 text-white fill-white animate-bounce" />
                                            </div>
                                        </div>

                                        {/* Floating Markers (Simulated matching) */}
                                        <div className="absolute top-0 right-0 w-3 h-3 bg-brand rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                        <div className="absolute bottom-4 left-0 w-2 h-2 bg-brand/40 rounded-full animate-bounce [animation-delay:0.5s]"></div>
                                    </div>
                                </>
                            )}
                            {step === 'found' && (
                                <>
                                    <h2 className="text-[20px] font-bold text-brand mb-1">Driver Found!</h2>
                                    <p className="text-[13px] text-gray-500 mb-8">Connecting you to your driver...</p>
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-12 animate-in zoom-in duration-300">
                                        <Check className="w-10 h-10 text-green-600" strokeWidth={3} />
                                    </div>
                                </>
                            )}
                            <Button
                                className="w-full h-12 bg-gray-100 hover:bg-gray-200 text-brand font-bold rounded-xl"
                                onClick={handleCancel}
                            >
                                {step === 'searching' ? 'Cancel Search' : 'Cancel Ride'}
                            </Button>
                        </div>
                    </div>
                )
            }

            {/* Cancel Reason Sheet (Overlay) */}
            <Sheet open={showCancelReasonSheet} onOpenChange={setShowCancelReasonSheet}>
                <SheetContent side="bottom" className="rounded-t-[32px] p-0 h-[85vh] [&>button]:hidden">
                    <div className="h-full flex flex-col bg-white rounded-t-[32px]">
                        <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-gray-100">
                            <SheetTitle className="text-xl font-bold text-brand">Cancel Ride</SheetTitle>
                            <SheetClose className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100">
                                <X className="w-5 h-5 text-gray-500" />
                            </SheetClose>
                        </div>

                        <div className="flex-1 overflow-y-auto px-6 py-4">
                            <h3 className="text-base font-semibold text-brand mb-4">Please select a reason for cancellation:</h3>
                            <div className="bg-gray-50 rounded-2xl p-2 space-y-1">
                                {CANCEL_REASONS.map((reason) => (
                                    <div
                                        key={reason}
                                        onClick={() => setCancelReason(reason)}
                                        className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all ${cancelReason === reason ? 'bg-white shadow-sm ring-1 ring-brand/10' : 'hover:bg-white/50'
                                            }`}
                                    >
                                        <span className={`text-[15px] font-medium ${cancelReason === reason ? 'text-brand' : 'text-gray-600'}`}>{reason}</span>
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${cancelReason === reason ? 'border-brand bg-brand' : 'border-gray-300'
                                            }`}>
                                            {cancelReason === reason && <div className="w-2 h-2 rounded-full bg-white" />}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {cancelReason === 'Others' && (
                                <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                                    <textarea
                                        ref={otherTextareaRef}
                                        value={otherReason}
                                        onChange={(e) => setOtherReason(e.target.value)}
                                        placeholder="Please tell us more..."
                                        className="w-full h-32 p-4 rounded-2xl bg-gray-50 border-gray-200 focus:bg-white focus:border-brand/20 resize-none text-[15px]"
                                    />
                                </div>
                            )}

                            <div className="mt-6 p-4 bg-orange-50 rounded-2xl flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                                    <div className="text-orange-600 font-bold">!</div>
                                </div>
                                <p className="text-xs text-orange-800 leading-relaxed pt-1">
                                    Cancelling frequently may affect your ability to get rides in the future.
                                </p>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100">
                            <Button
                                disabled={!cancelReason || (cancelReason === 'Others' && !otherReason) || isCancelling}
                                onClick={handleConfirmCancelRide}
                                className="w-full h-14 bg-red-50 hover:bg-red-100 text-red-600 rounded-2xl font-bold text-lg shadow-sm border border-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isCancelling ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Cancelling...</span>
                                    </div>
                                ) : (
                                    'Confirm Cancellation'
                                )}
                            </Button>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Chat Sheet */}
            <RideChatSheet
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                driverName="Sarah Johnson"
                driverImage="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400"
            />

            {/* In-App Call Overlay */}
            <InAppCallOverlay
                isOpen={isCallActive}
                onEndCall={() => setIsCallActive(false)}
                driverName="Sarah Johnson"
                driverImage="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400"
            />

            {/* Cancel Success Modal */}
            {
                showCancelSuccessModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm animate-in fade-in">
                        <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center scale-100 animate-in zoom-in-95">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Check className="w-10 h-10 text-green-600" strokeWidth={3} />
                            </div>
                            <h2 className="text-2xl font-bold text-brand mb-2">Ride Cancelled</h2>
                            <p className="text-gray-500 mb-8">Your booking has been cancelled successfully.</p>
                            <Button
                                className="w-full h-14 bg-brand text-white rounded-2xl font-bold text-lg"
                                onClick={() => setShowCancelSuccessModal(false)}
                            >
                                Okay, Got it
                            </Button>
                        </div>
                    </div>
                )
            }

            {/* Simple Search Cancel Confirmation Modal */}
            {
                showCancelSearchModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                            <h2 className="text-xl font-bold text-center mb-2">Cancel Search?</h2>
                            <p className="text-gray-500 text-center mb-6">Are you sure you want to stop looking for a driver?</p>
                            <div className="flex gap-4">
                                <Button
                                    variant="outline"
                                    className="flex-1 h-12 rounded-xl font-bold border-gray-200"
                                    onClick={() => setShowCancelSearchModal(false)}
                                >
                                    No, Keep Waiting
                                </Button>
                                <Button
                                    className="flex-1 h-12 bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 rounded-xl font-bold"
                                    onClick={confirmCancelSearch}
                                >
                                    Yes, Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
