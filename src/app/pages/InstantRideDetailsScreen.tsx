import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Phone, MessageCircle, Star, Shield, HelpCircle, FileText, Share2, MapPin, Navigation, Clock, X, Loader2, Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useState, useEffect, useRef } from 'react';
import { mockCars, Booking } from '../../data/mockData';
import { RideChatSheet } from '../components/RideChatSheet';
import { InAppCallOverlay } from '../components/InAppCallOverlay';

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

export function InstantRideDetailsScreen() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [booking, setBooking] = useState<Booking | null>(null);

    // Cancel Flow States
    const [showCancelFlow, setShowCancelFlow] = useState(false);
    const [selectedReason, setSelectedReason] = useState<string | null>(null);
    const [otherReason, setOtherReason] = useState('');
    const [isCancelling, setIsCancelling] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const otherTextareaRef = useRef<HTMLDivElement>(null);

    const [showChat, setShowChat] = useState(false);
    const [showCall, setShowCall] = useState(false);

    useEffect(() => {
        // TEMPORARY: Inject a test Instant Ride to match BookingsScreen
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
            deliveryAddress: 'Lagos, NG', // Updated to Lagos, NG
            pickupAddress: 'Lekki Phase 1',
        };

        // Load from localStorage to find the booking
        try {
            const stored = localStorage.getItem('ride_history');
            const history = stored ? JSON.parse(stored) : [];

            // Search in: Test Ride + LocalStorage
            const all = [testInstantRide, ...history];
            const foundBooking = all.find((b: any) => b.id === id);

            if (foundBooking) {
                setBooking(foundBooking as any);
            } else {
                setBooking(null);
            }

        } catch (e) {
            console.error(e);
            setBooking(null);
        }
    }, [id]);

    const handleCancelRide = () => {
        if (!selectedReason) return;
        setIsCancelling(true);

        // Simulate API call
        setTimeout(() => {
            setIsCancelling(false);
            setShowSuccess(true);

            // Update local state if it's the test ride
            if (booking?.id === 'test_ir_1') {
                setBooking(prev => prev ? { ...prev, status: 'cancelled' } : null);
            }

            // In a real app, update localStorage or backend here
        }, 1500);
    };

    if (!booking) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500 mb-4">Loading trip details...</p>
                    <Button variant="outline" onClick={() => navigate('/bookings')}>
                        Go Back
                    </Button>
                </div>
            </div>
        );
    }

    // Virtual Car Logic (Copied/Adapted from BookingsScreen for consistency)
    let car = mockCars.find(c => c.id === booking.carId);
    const isInstantRide = booking.carId === 'classic' || booking.carId === 'executive';

    if (!car && isInstantRide) {
        car = {
            id: booking.carId,
            name: booking.carId === 'executive' ? 'Executive Ride' : 'Classic Ride',
            brand: 'N/A',
            model: booking.carId === 'executive' ? 'Luxury Sedan' : 'Standard Sedan',
            year: 2024,
            image: booking.carId === 'executive' ? '/assets/images/cars/Executive.jpg' : '/assets/images/cars/Classic.jpg',
            pricePerDay: booking.totalPrice,
            location: 'Lagos, NG',
            host: {
                id: 'h_ir',
                name: booking.carId === 'executive' ? 'Executive Driver' : 'RideNaira Driver',
                avatar: booking.carId === 'executive' ? 'https://i.pravatar.cc/150?img=33' : 'https://i.pravatar.cc/150?img=12',
            }
        } as any;
    }

    if (!car) return <div>Car not found</div>;

    const isOngoing = booking.status === 'ongoing';

    // ─── LIVE TRACKING VIEW (For On-going Rides) ───
    if (isOngoing) {
        return (
            <div className="h-screen w-full bg-gray-100 relative flex flex-col overflow-hidden">
                {/* Map Background (Full Screen) */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/assets/images/map_placeholder.png"
                        alt="Live Map"
                        className="w-full h-full object-cover"
                    />
                    {/* Simulated Path Overlay */}
                    <div className="absolute inset-0 bg-black/5 pointer-events-none" />
                </div>

                {/* Top Header Floating */}
                <div className="relative z-10 px-5 pt-4 pb-2 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/bookings')}
                        className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <div className="bg-white px-4 py-2 rounded-full shadow-md">
                        <h1 className="text-sm font-bold text-brand flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            Current Ride
                        </h1>
                    </div>
                    <button className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 text-gray-700">
                        <Shield className="w-5 h-5" />
                    </button>
                </div>

                {/* Bottom Sheet Control - Pushes content up */}
                <div className="flex-1" />

                {/* Driver & Status Card */}
                <div className="relative z-10 bg-white rounded-t-3xl shadow-negative-lg animate-in slide-in-from-bottom-5 duration-500">
                    {/* Pull Handle */}
                    <div className="w-full h-6 flex items-center justify-center">
                        <div className="w-12 h-1 bg-gray-200 rounded-full" />
                    </div>

                    <div className="px-6 pb-8">
                        {/* Status */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-brand">Arriving in 5 mins</h2>
                                <p className="text-sm text-gray-500">Your driver is on the way</p>
                            </div>
                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                                <Clock className="w-6 h-6 text-brand" />
                            </div>
                        </div>

                        {/* Driver Info */}
                        <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                                        <img src={car.host.avatar} alt={car.host.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                                        <Star className="w-3 h-3 text-star fill-star" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-brand text-sm">{car.host.name}</h3>
                                    <p className="text-xs text-gray-500">{car.model} • <span className="font-medium text-gray-700">KJA-245-XD</span></p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowChat(true)}
                                    className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setShowCall(true)}
                                    className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-white hover:bg-brand/90 active:scale-95 transition-all shadow-sm"
                                >
                                    <Phone className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-2 gap-3">
                            <Button variant="outline" className="h-12 border-gray-200 text-gray-700 font-medium rounded-2xl active:scale-[0.98] transition-all">
                                <Share2 className="w-4 h-4 mr-2" />
                                Share Trip
                            </Button>
                            <Button
                                onClick={() => setShowCancelFlow(true)}
                                variant="destructive"
                                className="h-12 bg-red-50 text-red-600 hover:bg-red-100 border-none font-medium rounded-2xl active:scale-[0.98] transition-all"
                            >
                                Cancel Ride
                            </Button>
                        </div>
                    </div>
                </div>

                {/* ─── CANCELLATION OVERLAY ─── */}
                {showCancelFlow && (
                    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40 animate-in fade-in duration-300">
                        <div
                            className="bg-white rounded-t-3xl w-full max-h-[90vh] flex flex-col animate-in slide-in-from-bottom duration-500 ease-out"
                        >
                            {!showSuccess ? (
                                <>
                                    <div className="flex items-center justify-between px-6 pt-6 pb-2">
                                        <div className="w-8" />
                                        <h2 className="text-lg font-bold text-brand">Cancel Ride</h2>
                                        <button
                                            onClick={() => { setShowCancelFlow(false); setSelectedReason(null); }}
                                            className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full"
                                        >
                                            <X className="w-4 h-4 text-brand" />
                                        </button>
                                    </div>

                                    <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
                                        <h3 className="text-xl font-bold text-brand mb-6 leading-tight">Please select the reason for cancellation</h3>

                                        <div className="space-y-1 mb-6">
                                            {CANCEL_REASONS.map((reason) => (
                                                <button
                                                    key={reason}
                                                    onClick={() => {
                                                        setSelectedReason(reason);
                                                        if (reason === 'Others') {
                                                            setTimeout(() => {
                                                                otherTextareaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                                            }, 100);
                                                        }
                                                    }}
                                                    className="w-full flex items-center gap-4 py-3.5 group"
                                                >
                                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${selectedReason === reason
                                                        ? 'border-brand bg-brand'
                                                        : 'border-gray-300 group-hover:border-gray-400'
                                                        }`}>
                                                        {selectedReason === reason && <div className="w-2 h-2 rounded-full bg-white animate-in zoom-in duration-200" />}
                                                    </div>
                                                    <span className={`text-[15px] transition-colors ${selectedReason === reason ? 'font-bold text-brand' : 'text-gray-600'
                                                        }`}>
                                                        {reason}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>

                                        {selectedReason === 'Others' && (
                                            <div ref={otherTextareaRef} className="animate-in slide-in-from-top-2 duration-300 mb-6">
                                                <textarea
                                                    value={otherReason}
                                                    onChange={(e) => setOtherReason(e.target.value)}
                                                    placeholder="Please tell us more..."
                                                    className="w-full h-32 p-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-brand/20 resize-none outline-none"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-6 border-t border-gray-50">
                                        <Button
                                            onClick={handleCancelRide}
                                            disabled={!selectedReason || (selectedReason === 'Others' && !otherReason.trim()) || isCancelling}
                                            className="w-full h-14 bg-brand hover:bg-brand/90 text-white font-bold text-base rounded-2xl transition-all shadow-lg shadow-brand/20 active:scale-[0.98]"
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
                                </>
                            ) : (
                                <div className="p-10 flex flex-col items-center text-center">
                                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-500">
                                        <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center">
                                            <Check className="w-8 h-8 text-white" />
                                        </div>
                                    </div>
                                    <h2 className="text-2xl font-bold text-brand mb-2">Cancelled Successfully</h2>
                                    <p className="text-gray-500 mb-8 leading-relaxed">
                                        Your ride has been cancelled. We hope to see you again soon!
                                    </p>
                                    <Button
                                        onClick={() => navigate('/bookings')}
                                        className="w-full h-14 bg-brand text-white font-bold text-base rounded-2xl active:scale-[0.98] transition-all"
                                    >
                                        Done
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

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

    // ─── COMPLETED RIDE VIEW (Original Layout) ───
    return (
        <div className="min-h-screen bg-gray-50 pb-8">
            {/* Header */}
            <div className="bg-white px-5 py-4 flex items-center gap-4 sticky top-0 z-10 border-b border-gray-100">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-700" />
                </button>
                <div className="flex-1">
                    <h1 className="text-lg font-bold text-brand">Trip Details</h1>
                    <p className="text-xs text-gray-400">
                        {new Date(booking.startDate).toLocaleString('en-US', { hour12: false, weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: 'numeric' })}
                    </p>
                </div>
                <button className="text-gray-400 hover:text-brand">
                    <Share2 className="w-5 h-5" />
                </button>
            </div>

            {/* Map Placeholder */}
            <div className="w-full h-[240px] bg-gray-200 relative">
                <img
                    src="/assets/images/map_placeholder.png"
                    alt="Route Visual"
                    className="w-full h-full object-cover opacity-60"
                />
                {/* Route Overlay (Fake Visuals for POC) */}
                <div className="absolute inset-x-8 top-8 bottom-8 flex flex-col justify-between pointer-events-none">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-brand ring-4 ring-white shadow-sm" />
                        <span className="bg-white px-3 py-1.5 rounded-full text-xs font-bold shadow-sm">{(booking as any).pickupAddress}</span>
                    </div>
                    <div className="flex items-center gap-3 self-end">
                        <span className="bg-white px-3 py-1.5 rounded-full text-xs font-bold shadow-sm">{booking.deliveryAddress || 'Lagos, NG'}</span>
                        <div className="w-3 h-3 rounded-full bg-black ring-4 ring-white shadow-sm" />
                    </div>
                </div>
            </div>

            <div className="px-5 -mt-6 relative z-10">
                {/* Driver Card */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden">
                                <img src={car.host.avatar} alt={car.host.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h3 className="font-bold text-brand">{car.host.name}</h3>
                                <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3 text-star fill-star" />
                                    <span className="text-xs text-gray-600 font-medium">4.9</span>
                                    <span className="text-xs text-gray-300">•</span>
                                    <span className="text-xs text-gray-600">{car.model}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowChat(true)}
                                className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-700 hover:bg-gray-100 active:scale-95 transition-all shadow-sm"
                            >
                                <MessageCircle className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setShowCall(true)}
                                className="w-9 h-9 rounded-full bg-brand flex items-center justify-center text-white hover:bg-brand/90 active:scale-95 transition-all shadow-sm"
                            >
                                <Phone className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-50">
                        <div className="text-center p-2 bg-gray-50 rounded-xl">
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">LICENSE PLATE</p>
                            <p className="font-bold text-brand uppercase">KJA-245-XD</p>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded-xl">
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">RIDE CODE</p>
                            <p className="font-bold text-brand">{booking.bookingCode || '****'}</p>
                        </div>
                    </div>
                </div>

                {/* Fare Breakdown */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
                    <h3 className="font-bold text-brand mb-4">Payment Breakdown</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Base Fare</span>
                            <span className="font-medium text-brand">₦{(booking.totalPrice * 0.4).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Distance & Time</span>
                            <span className="font-medium text-brand">₦{(booking.totalPrice * 0.55).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Booking Fee</span>
                            <span className="font-medium text-brand">₦{(booking.totalPrice * 0.05).toLocaleString()}</span>
                        </div>
                        <div className="h-px bg-gray-100 my-2" />
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-brand">Total</span>
                            <span className="font-bold text-lg text-brand">₦{booking.totalPrice.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Support Actions */}
                <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start h-14 bg-white border-gray-200 hover:bg-gray-50 text-brand rounded-2xl active:scale-[0.98] transition-all">
                        <FileText className="w-5 h-5 mr-3 text-gray-400" />
                        Get Receipt
                    </Button>
                    <Button variant="outline" className="w-full justify-start h-14 bg-white border-gray-200 hover:bg-gray-50 text-brand rounded-2xl active:scale-[0.98] transition-all">
                        <Shield className="w-5 h-5 mr-3 text-gray-400" />
                        Report an Issue
                    </Button>
                    <Button variant="outline" className="w-full justify-start h-14 bg-white border-gray-200 hover:bg-gray-50 text-brand rounded-2xl active:scale-[0.98] transition-all">
                        <HelpCircle className="w-5 h-5 mr-3 text-gray-400" />
                        Get Help
                    </Button>
                </div>
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
