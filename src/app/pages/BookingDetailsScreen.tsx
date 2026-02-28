import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    Calendar,
    Phone,
    MessageCircle,
    ArrowRightLeft,
    Loader2,
    X,
    Check,
    ShieldAlert,
    Flag
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { mockBookings, mockCars } from '../../data/mockData';
import { Button } from '../components/ui/button';
import { format } from 'date-fns';
import { Dialog, DialogContent } from '../components/ui/dialog';
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

export function BookingDetailsScreen() {
    const navigate = useNavigate();
    const { id } = useParams();

    const bookingIndex = mockBookings.findIndex(b => b.id === id);
    const booking = mockBookings[bookingIndex];
    const car = booking ? mockCars.find(c => c.id === booking.carId) : null;

    const [showCancelModal, setShowCancelModal] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);

    // On-going cancel flow states
    const [showCancelRide, setShowCancelRide] = useState(false);
    const [selectedReason, setSelectedReason] = useState<string | null>(null);
    const [otherReason, setOtherReason] = useState('');
    const otherTextareaRef = useRef<HTMLDivElement>(null);
    const [showCancelledSuccess, setShowCancelledSuccess] = useState(false);

    const [showChat, setShowChat] = useState(false);
    const [showCall, setShowCall] = useState(false);

    if (!booking || !car) {
        return <div className="p-6">Booking not found</div>;
    }

    const start = new Date(booking.startDate);
    const end = new Date(booking.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const otherFees = 300000;

    const isOngoing = booking.status === 'ongoing';

    const handleCancelBooking = () => {
        setIsCancelling(true);
        setTimeout(() => {
            if (bookingIndex !== -1) {
                mockBookings[bookingIndex].status = 'cancelled';
            }
            setIsCancelling(false);
            setShowCancelModal(false);
            navigate('/bookings');
        }, 1500);
    };

    const handleCancelRide = () => {
        if (!selectedReason) return;
        setIsCancelling(true);
        setTimeout(() => {
            if (bookingIndex !== -1) {
                mockBookings[bookingIndex].status = 'cancelled';
            }
            setIsCancelling(false);
            setShowCancelledSuccess(true);
        }, 1500);
    };

    const getStatusDisplay = () => {
        switch (booking.status) {
            case 'awaiting_confirm':
                return {
                    title: 'Awaiting Confirmation',
                    desc: 'Your booking is awaiting confirmation',
                    icon: (
                        <div className="w-10 h-10 shrink-0 flex items-center justify-center">
                            <img src="/assets/images/Icons/awaiting_confirmation_tick.jpg" alt="Awaiting" className="w-9 h-9 object-contain" />
                        </div>
                    )
                };
            case 'confirmed':
                return {
                    title: 'Awaiting Payment',
                    desc: 'Host confirmed! Please proceed to payment.',
                    icon: (
                        <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                            <img src="/assets/images/Icons/awaiting_confirmation_tick.jpg" alt="Awaiting" className="w-9 h-9 object-contain" />
                        </div>
                    )
                };
            case 'paid':
                return {
                    title: 'Ready for Trip',
                    desc: 'Payment received! Your Host is ready.',
                    icon: (
                        <div className="w-10 h-10 shrink-0 flex items-center justify-center">
                            <img src="/assets/images/Icons/confirmed_tick.jpg" alt="Confirmed" className="w-9 h-9 object-contain" />
                        </div>
                    )
                };
            case 'ongoing':
                return {
                    title: 'On-Going',
                    desc: 'Your trip is currently on the move',
                    icon: (
                        <div className="w-10 h-10 shrink-0 flex items-center justify-center">
                            <img src="/assets/images/Icons/on_going_tick.jpg" alt="On-Going" className="w-9 h-9 object-contain" />
                        </div>
                    )
                };
            case 'upcoming':
                return {
                    title: 'Upcoming Trip',
                    desc: 'Your trip is coming up soon',
                    icon: (
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                            <Calendar className="w-5 h-5 text-blue-600" />
                        </div>
                    )
                };
            default:
                return {
                    title: 'Booking Details',
                    desc: `Status: ${booking.status}`,
                    icon: null
                };
        }
    };

    const statusInfo = getStatusDisplay();
    const canCancel = ['awaiting_confirm', 'upcoming', 'confirmed'].includes(booking.status);
    const canPay = booking.status === 'confirmed';

    return (
        <div className="min-h-screen bg-background pb-32">

            {/* ═══════ Cancel Ride Overlay (slides up from bottom) ═══════ */}
            <div
                className="fixed inset-0 z-50 flex flex-col bg-white"
                style={{
                    transform: showCancelRide || showCancelledSuccess ? 'translateY(0)' : 'translateY(100%)',
                    transition: 'transform 0.45s cubic-bezier(0.32, 0.72, 0, 1)',
                    willChange: 'transform',
                }}
            >
                {/* ── Reason Selection View ── */}
                {!showCancelledSuccess && (
                    <>
                        <div className="flex items-center justify-between px-5 pt-14 pb-4">
                            <div className="w-10" />
                            <h1 className="text-lg font-bold text-brand">Cancel Ride</h1>
                            <button
                                onClick={() => { setShowCancelRide(false); setSelectedReason(null); setOtherReason(''); }}
                                className="w-10 h-10 flex items-center justify-center"
                            >
                                <X className="w-5 h-5 text-brand" />
                            </button>
                        </div>

                        <div className="flex-1 px-6 pt-4 pb-32 overflow-y-auto">
                            <h2 className="text-xl font-bold text-brand mb-6">Why are you cancelling?</h2>

                            <div className="space-y-1">
                                {CANCEL_REASONS.map((reason) => (
                                    <button
                                        key={reason}
                                        onClick={() => {
                                            setSelectedReason(prev => {
                                                // If toggling off Others, clear the text
                                                if (prev === 'Others' && reason !== 'Others') setOtherReason('');
                                                return reason;
                                            });
                                            // Scroll textarea into view when Others selected
                                            if (reason === 'Others') {
                                                setTimeout(() => {
                                                    otherTextareaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                                }, 100);
                                            }
                                        }}
                                        className="w-full flex items-center gap-4 py-4 text-left"
                                    >
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${selectedReason === reason
                                            ? 'border-brand bg-brand'
                                            : 'border-gray-300'
                                            }`}>
                                            {selectedReason === reason && (
                                                <div className="w-2 h-2 rounded-full bg-white" />
                                            )}
                                        </div>
                                        <span className={`text-[15px] ${selectedReason === reason ? 'font-semibold text-brand' : 'text-brand'
                                            }`}>
                                            {reason}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {/* Others text input — smooth open/close */}
                            <div
                                ref={otherTextareaRef}
                                className="overflow-hidden transition-all duration-300 ease-in-out"
                                style={{
                                    maxHeight: selectedReason === 'Others' ? '160px' : '0px',
                                    opacity: selectedReason === 'Others' ? 1 : 0,
                                    marginTop: selectedReason === 'Others' ? '16px' : '0px',
                                }}
                            >
                                <textarea
                                    value={otherReason}
                                    onChange={(e) => setOtherReason(e.target.value)}
                                    placeholder="Please tell us more..."
                                    className="w-full h-28 p-4 border border-gray-200 rounded-2xl text-sm text-brand placeholder:text-gray-400 resize-none focus:outline-none focus:border-brand transition-colors"
                                />
                            </div>
                        </div>

                        <div className="p-5 pb-8 bg-white">
                            <Button
                                onClick={handleCancelRide}
                                disabled={!selectedReason || (selectedReason === 'Others' && !otherReason.trim()) || isCancelling}
                                className="w-full h-14 bg-brand hover:brightness-90 text-white font-bold text-base rounded-2xl shadow-none disabled:opacity-50"
                            >
                                {isCancelling ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Cancelling...</span>
                                    </div>
                                ) : (
                                    'Confirm'
                                )}
                            </Button>
                        </div>
                    </>
                )}

                {/* ── Success View ── */}
                {showCancelledSuccess && (
                    <>
                        <div className="flex justify-end px-5 pt-14">
                            <button
                                onClick={() => navigate('/bookings')}
                                className="w-10 h-10 flex items-center justify-center"
                            >
                                <X className="w-5 h-5 text-brand" />
                            </button>
                        </div>

                        <div className="flex-1 flex flex-col items-center justify-center px-8 pb-32">
                            <div className="w-24 h-24 bg-brand rounded-full flex items-center justify-center mb-8">
                                <Check className="w-12 h-12 text-white" strokeWidth={3} />
                            </div>

                            <h2 className="text-2xl font-bold text-brand mb-3 text-center">
                                Ride has been canceled!
                            </h2>
                            <p className="text-base text-gray-500 text-center leading-relaxed max-w-[300px]">
                                Your ride has been canceled. Need another one? Request a new ride anytime!
                            </p>
                        </div>

                        <div className="p-5 pb-8 bg-white">
                            <Button
                                onClick={() => navigate('/bookings')}
                                className="w-full h-14 bg-brand hover:brightness-90 text-white font-bold text-base rounded-2xl shadow-none"
                            >
                                Confirm
                            </Button>
                        </div>
                    </>
                )}
            </div>

            {/* ───── Header ───── */}
            <div className="flex items-center px-5 pt-14 pb-4">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 flex items-center justify-center"
                >
                    <ArrowLeft className="w-5 h-5 text-brand" />
                </button>
                <h1 className="text-lg font-bold text-brand flex-1 text-center mr-10">Booking Details</h1>
            </div>

            <div className="px-5 space-y-4">

                {/* ───── Status Card ───── */}
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-3">
                            {statusInfo.icon}
                            <div>
                                <h2 className="font-bold text-brand text-[15px] leading-tight">{statusInfo.title}</h2>
                                <p className="text-gray-400 text-[13px] mt-1">{statusInfo.desc}</p>
                            </div>
                        </div>
                        <div className="w-[100px] h-[72px] rounded-2xl overflow-hidden bg-gray-100 shrink-0 ml-3">
                            <img src={car.image} alt={car.name} className="w-full h-full object-cover" />
                        </div>
                    </div>

                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">BOOKING CODE</p>
                        <p className="text-lg font-bold text-brand">{booking.bookingCode}</p>
                    </div>
                </div>

                {/* ───── Trip Details ───── */}
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                    <h3 className="font-bold text-brand text-base mb-5">Trip Details</h3>

                    <div className="grid grid-cols-2 gap-6 mb-5">
                        <div>
                            <p className="text-[10px] text-gray-400 font-bold tracking-wider uppercase mb-1.5">PICK UP</p>
                            <p className="text-[15px] font-bold text-brand mb-0.5">
                                {format(start, 'MMM. dd, yyyy')}
                            </p>
                            <p className="text-[13px] text-gray-400">
                                {format(start, 'hh:mm a')}
                            </p>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 font-bold tracking-wider uppercase mb-1.5">DROP OFF</p>
                            <p className="text-[15px] font-bold text-brand mb-0.5">
                                {format(end, 'MMM. dd, yyyy')}
                            </p>
                            <p className="text-[13px] text-gray-400">
                                {format(end, 'hh:mm a')}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 mb-5">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-2.5">
                                <div className="mt-0.5 shrink-0">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 2a8 8 0 0 0-8 8c0 5.4 7 12 8 12s8-6.6 8-12a8 8 0 0 0-8-8z" />
                                        <circle cx="12" cy="10" r="3" />
                                    </svg>
                                </div>
                                <div className="min-w-0">
                                    <p className="font-medium text-brand text-sm truncate">
                                        {booking.deliveryAddress?.split(',')[0] || '1901 Thornridge...'}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-0.5">Ikeja, Lagos</p>
                                </div>
                            </div>
                        </div>

                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                            <ArrowRightLeft className="w-4 h-4 text-gray-400" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-brand text-sm truncate text-right">
                                6391 Elgin St. Cel
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5 text-right">Lekki Phase 1</p>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-brand text-sm mb-1.5">Additional Notes</h4>
                        <p className="text-sm text-gray-500">Please have the car ready by 10:00AM. Thanks!</p>
                    </div>
                </div>

                {/* ───── Your Host ───── */}
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                    <h3 className="font-bold text-brand text-base mb-4">Your Host</h3>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-50 shrink-0">
                                <img src={car.host.avatar} alt={car.host.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <p className="font-bold text-brand text-[15px]">{car.host.name}</p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="#1a1a1a" stroke="none" />
                                    </svg>
                                    <span className="text-xs text-gray-500">{car.host.rating} • Host since 2020</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2.5">
                            <button
                                onClick={() => setShowChat(true)}
                                className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
                            >
                                <MessageCircle className="w-[18px] h-[18px] text-brand" />
                            </button>
                            <button
                                onClick={() => setShowCall(true)}
                                className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
                            >
                                <Phone className="w-[18px] h-[18px] text-brand" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* ───── Payment Summary ───── */}
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                    <h3 className="font-bold text-brand text-base mb-4">Payment Summary</h3>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">₦{car.pricePerDay.toLocaleString()} × {diffDays} Days</span>
                            <span className="text-sm font-semibold text-brand">₦{(car.pricePerDay * diffDays).toLocaleString()}</span>
                        </div>

                        <div className="flex justify-between items-center pb-3.5 border-b border-gray-100">
                            <span className="text-sm text-gray-500">Other Fees</span>
                            <span className="text-sm font-semibold text-brand">₦{otherFees.toLocaleString()}</span>
                        </div>

                        <div className="flex justify-between items-center pt-0.5">
                            <span className="text-sm text-gray-500 font-medium">Subtotal</span>
                            <span className="text-base font-bold text-brand">₦{(booking.totalPrice).toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* ───── Dispute / Safety ───── */}
                <div className="flex gap-3 mb-6">
                    <button
                        onClick={() => toast.error("SOS Alert Sent! Emergency services notified.")}
                        className="flex-1 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center gap-2 border border-rose-100 font-bold active:scale-95 transition-all"
                    >
                        <ShieldAlert size={20} />
                        SOS Emergency
                    </button>
                    <button
                        onClick={() => toast.info("Dispute report form opened (Simulation)")}
                        className="flex-1 h-14 bg-gray-50 text-gray-600 rounded-2xl flex items-center justify-center gap-2 border border-gray-200 font-bold active:scale-95 transition-all"
                    >
                        <Flag size={20} />
                        Report Issue
                    </button>
                </div>
            </div>

            {/* ───── Cancel Button ───── */}
            {(canCancel || isOngoing) && (
                <div className="fixed bottom-0 left-0 right-0 p-5 pb-8 bg-white border-t border-gray-100 z-20">
                    <Button
                        onClick={() => isOngoing ? setShowCancelRide(true) : setShowCancelModal(true)}
                        className="w-full h-14 bg-[#868686] hover:bg-[#707070] text-white font-bold text-base rounded-2xl shadow-none"
                    >
                        Cancel Booking
                    </Button>
                </div>
            )}

            {/* ───── Proceed to Pay Button ───── */}
            {canPay && (
                <div className="fixed bottom-0 left-0 right-0 p-5 pb-8 bg-white border-t border-gray-100 z-20">
                    <Button
                        onClick={() => navigate(`/payment/${booking.id}`)}
                        className="w-full h-14 bg-brand hover:brightness-90 text-white font-bold text-base rounded-2xl shadow-none"
                    >
                        Proceed to Pay
                    </Button>
                </div>
            )}

            {/* ───── Cancel Modal (awaiting_confirm / upcoming) ───── */}
            <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
                <DialogContent
                    className="sm:max-w-md rounded-3xl p-0 gap-0 overflow-hidden w-[88%] max-w-[360px] [&>button]:hidden border-none shadow-2xl"
                    onPointerDownOutside={(e) => e.preventDefault()}
                    onEscapeKeyDown={(e) => e.preventDefault()}
                >
                    <div className="flex flex-col items-center justify-center pt-10 pb-2 px-7 text-center">
                        {/* Icon with decorative ring */}
                        <div className="relative mb-7">
                            <div className="w-20 h-20 rounded-full bg-brand flex items-center justify-center">
                                <X className="w-8 h-8 text-white" strokeWidth={2.5} />
                            </div>
                            <div className="absolute -inset-2 rounded-full border-2 border-brand/15" />
                        </div>

                        <h2 className="text-2xl font-bold text-brand mb-2 leading-tight">Cancel Booking?</h2>
                        <p className="text-[15px] text-gray-500 mb-5 leading-relaxed">
                            Are you sure you want to cancel<br />this booking?
                        </p>

                        <div className="bg-amber-50 rounded-xl px-4 py-3 mb-6 w-full">
                            <p className="text-[12px] text-amber-700 leading-relaxed">
                                ⚠️ Cancellation may be subject to charges depending on our policy.
                            </p>
                        </div>
                    </div>

                    <div className="px-6 pb-7 space-y-3">
                        <Button
                            onClick={handleCancelBooking}
                            disabled={isCancelling}
                            className="w-full h-[52px] bg-red-500 hover:bg-red-600 text-white font-bold text-[15px] rounded-2xl shadow-none transition-colors"
                        >
                            {isCancelling ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Cancelling...</span>
                                </div>
                            ) : (
                                "Yes, Cancel"
                            )}
                        </Button>
                        <Button
                            onClick={() => setShowCancelModal(false)}
                            className="w-full h-[52px] bg-gray-50 hover:bg-gray-100 text-brand font-semibold text-[15px] rounded-2xl shadow-none border border-gray-200 transition-colors"
                        >
                            No, Keep Booking
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

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
