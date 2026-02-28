import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Camera,
    User,
    Smartphone,
    Mail,
    FileText,
    PenLine,
    Search,
    Star,
    Check,
    MessageCircle, // WhatsApp
    MessageSquare, // SMS
    X,
    CheckCircle
} from 'lucide-react';
import { mockUser } from '../../data/mockData';
import { Button } from '../components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { useState, useRef, useEffect } from 'react';

type ViewState = 'main' | 'name' | 'phone' | 'email' | 'otp';

export function EditProfileScreen() {
    const navigate = useNavigate();
    const [view, setView] = useState<ViewState>('main');

    // Global Form Data
    const [formData, setFormData] = useState({
        name: mockUser.name,
        phone: mockUser.phone,
        email: mockUser.email,
        avatar: mockUser.avatar,
    });

    // Temp states for editing
    const [firstName, setFirstName] = useState(formData.name.split(' ')[0]);
    const [lastName, setLastName] = useState(formData.name.split(' ').slice(1).join(' '));
    const [tempPhone, setTempPhone] = useState(formData.phone.replace('+234', '').trim());
    const [tempEmail, setTempEmail] = useState(formData.email);
    const [verificationMethod, setVerificationMethod] = useState<'whatsapp' | 'sms' | 'email'>('whatsapp');
    const [otp, setOtp] = useState(['', '', '', '']);
    const [showSuccess, setShowSuccess] = useState(false);

    // Focus management for OTP
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleNameSave = () => {
        setFormData({ ...formData, name: `${firstName} ${lastName}` });
        setView('main');
    };

    const handlePhoneSubmit = () => {
        setVerificationMethod('whatsapp'); // Default to whatsapp or whatever was selected
        setOtp(['', '', '', '']); // Reset OTP
        setView('otp');
    };

    const handleEmailSubmit = () => {
        setVerificationMethod('email');
        setOtp(['', '', '', '']); // Reset OTP
        setView('otp');
    };

    const handleOtpVerify = () => {
        // Trigger Success Modal instead of immediate update
        setShowSuccess(true);
    };

    const handleSuccessContinue = () => {
        // Apply changes
        if (verificationMethod === 'email') {
            setFormData({ ...formData, email: tempEmail });
        } else {
            setFormData({ ...formData, phone: `+234 ${tempPhone}` });
        }
        setShowSuccess(false);
        setView('main');
    };

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto advance
        if (value && index < 3) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    // ─── VIEWS ───

    // 1. Update Name View
    if (view === 'name') {
        return (
            <div className="min-h-screen bg-gray-50 font-sans text-brand flex flex-col">
                <div className="bg-gray-50 px-6 pt-safe-top pb-4 flex items-center justify-between">
                    <button onClick={() => setView('main')} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <ArrowLeft className="w-5 h-5 text-brand" />
                    </button>
                    <div className="flex-1" />
                </div>

                <div className="px-6 flex-1">
                    <h1 className="text-xl font-bold text-brand mb-2 text-center">Update your name</h1>
                    <p className="text-sm text-gray-500 text-center mb-8 px-4">
                        Please enter your name as it appears on your means of identification
                    </p>

                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-medium text-gray-500 mb-1.5 block ml-1">First name</label>
                            <input
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-full h-14 px-4 rounded-2xl border-none text-brand font-medium bg-white shadow-sm ring-1 ring-gray-100 focus:ring-2 focus:ring-brand focus:outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-500 mb-1.5 block ml-1">Last name</label>
                            <input
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-full h-14 px-4 rounded-2xl border-none text-brand font-medium bg-white shadow-sm ring-1 ring-gray-100 focus:ring-2 focus:ring-brand focus:outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <Button
                        onClick={handleNameSave}
                        disabled={!firstName || !lastName}
                        className="w-full h-14 bg-brand text-white text-base font-bold rounded-2xl active:scale-[0.98] transition-all"
                    >
                        Continue
                    </Button>
                </div>
            </div>
        );
    }

    // 2. Update Phone View
    if (view === 'phone') {
        return (
            <div className="min-h-screen bg-gray-50 font-sans text-brand flex flex-col">
                <div className="bg-gray-50 px-6 pt-safe-top pb-4 flex items-center justify-between">
                    <button onClick={() => setView('main')} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <ArrowLeft className="w-5 h-5 text-brand" />
                    </button>
                    <div className="flex-1" />
                </div>

                <div className="px-6 flex-1">
                    <h1 className="text-xl font-bold text-brand mb-2 text-center">Update your number</h1>
                    <p className="text-sm text-gray-500 text-center mb-8 px-4">
                        We'll send a code for verification
                    </p>

                    {/* Phone Input */}
                    <div className="flex gap-3 mb-8">
                        <div className="w-24 h-14 bg-white rounded-xl shadow-sm ring-1 ring-gray-100 flex items-center justify-center gap-2">
                            {/* Flag placeholder */}
                            <div className="w-5 h-3.5 bg-green-700 relative overflow-hidden rounded-[1px]">
                                <div className="absolute inset-x-[33%] inset-y-0 bg-white"></div>
                            </div>
                            <span className="text-sm font-medium text-brand">+234</span>
                        </div>
                        <div className="flex-1 relative">
                            <input
                                type="tel"
                                value={tempPhone}
                                onChange={(e) => setTempPhone(e.target.value)}
                                className="w-full h-14 pl-4 pr-10 rounded-2xl border-none text-brand font-medium bg-white shadow-sm ring-1 ring-gray-100 focus:ring-2 focus:ring-brand focus:outline-none transition-all"
                            />
                            {tempPhone && (
                                <button onClick={() => setTempPhone('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Verification Method */}
                    <div className="space-y-4">
                        {/* WhatsApp */}
                        <button
                            onClick={() => setVerificationMethod('whatsapp')}
                            className="w-full flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-transparent hover:border-brand/10 transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <MessageCircle className="w-6 h-6 text-brand" />
                                <span className="text-sm font-medium text-brand">Verify via WhatsApp</span>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${verificationMethod === 'whatsapp' ? 'border-brand' : 'border-gray-300'}`}>
                                {verificationMethod === 'whatsapp' && <div className="w-2.5 h-2.5 bg-brand rounded-full" />}
                            </div>
                        </button>

                        {/* SMS */}
                        <button
                            onClick={() => setVerificationMethod('sms')}
                            className="w-full flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-transparent hover:border-brand/10 transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <MessageSquare className="w-6 h-6 text-brand" />
                                <span className="text-sm font-medium text-brand">Verify via SMS</span>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${verificationMethod === 'sms' ? 'border-brand' : 'border-gray-300'}`}>
                                {verificationMethod === 'sms' && <div className="w-2.5 h-2.5 bg-brand rounded-full" />}
                            </div>
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    <Button
                        onClick={handlePhoneSubmit}
                        disabled={tempPhone.length < 10}
                        className="w-full h-14 bg-brand text-white text-base font-bold rounded-2xl active:scale-[0.98] transition-all"
                    >
                        Continue
                    </Button>
                </div>
            </div>
        );
    }

    // 3. Update Email View (New)
    if (view === 'email') {
        return (
            <div className="min-h-screen bg-gray-50 font-sans text-brand flex flex-col">
                <div className="bg-gray-50 px-6 pt-safe-top pb-4 flex items-center justify-between">
                    <button onClick={() => setView('main')} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <ArrowLeft className="w-5 h-5 text-brand" />
                    </button>
                    <div className="flex-1" />
                </div>

                <div className="px-6 flex-1">
                    <h1 className="text-xl font-bold text-brand mb-2 text-center">Update your email</h1>
                    <p className="text-sm text-gray-500 text-center mb-8 px-4">
                        We'll send a code for verification
                    </p>

                    <div className="relative">
                        <input
                            type="email"
                            value={tempEmail}
                            onChange={(e) => setTempEmail(e.target.value)}
                            className="w-full h-14 px-4 rounded-2xl border-none text-brand font-medium bg-white shadow-sm ring-1 ring-gray-100 focus:ring-2 focus:ring-brand focus:outline-none transition-all"
                            placeholder="Enter your email"
                        />
                        {tempEmail && (
                            <button onClick={() => setTempEmail('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="p-6">
                    <Button
                        onClick={handleEmailSubmit}
                        disabled={!tempEmail || !tempEmail.includes('@')}
                        className="w-full h-14 bg-brand text-white text-base font-bold rounded-2xl active:scale-[0.98] transition-all"
                    >
                        Continue
                    </Button>
                </div>
            </div>
        );
    }

    // 4. OTP View (Shared for Phone and Email)
    if (view === 'otp') {
        const isEmail = verificationMethod === 'email';
        const displayTarget = isEmail ? tempEmail : `+234 ${tempPhone}`;
        const targetType = isEmail ? 'email' : (verificationMethod === 'whatsapp' ? 'WhatsApp' : 'Phone');

        return (
            <div className="min-h-screen bg-gray-50 font-sans text-brand flex flex-col relative">
                <div className="bg-gray-50 px-6 pt-safe-top pb-4 flex items-center justify-between">
                    <button onClick={() => setView(isEmail ? 'email' : 'phone')} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <ArrowLeft className="w-5 h-5 text-brand" />
                    </button>
                    <div className="flex-1" />
                </div>

                <div className="px-6 flex-1 flex flex-col items-center">
                    <h1 className="text-xl font-bold text-brand mb-4 text-center">Enter the verification code</h1>
                    <p className="text-sm text-gray-500 text-center mb-1 max-w-[280px]">
                        A 4 digit code was sent to your {targetType}
                    </p>
                    <p className="text-sm font-bold text-brand mb-10">{displayTarget}</p>

                    <div className="flex gap-4 mb-8">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={el => { otpRefs.current[index] = el; }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-14 h-14 rounded-2xl bg-white border border-gray-100 text-center text-2xl font-bold text-brand focus:border-brand focus:ring-1 focus:ring-brand focus:outline-none shadow-sm"
                            />
                        ))}
                    </div>

                    <p className="text-sm text-gray-500">
                        <button className="text-brand font-semibold underline decoration-brand/30 underline-offset-4">Click here to resend OTP</button>
                    </p>
                </div>

                <div className="p-6">
                    <Button
                        onClick={handleOtpVerify}
                        disabled={otp.some(d => !d)}
                        className="w-full h-14 bg-brand text-white text-base font-bold rounded-2xl active:scale-[0.98] transition-all"
                    >
                        Verify
                    </Button>
                </div>

                {/* Success Modal */}
                {showSuccess && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
                        <div className="bg-white rounded-3xl w-full max-w-xs p-6 flex flex-col items-center animate-in zoom-in-95 duration-200 text-center shadow-xl">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>

                            <h3 className="text-xl font-bold text-brand mb-2">
                                Verification Successful
                            </h3>

                            <p className="text-gray-500 text-sm leading-relaxed mb-6">
                                Your {isEmail ? 'email address' : 'phone number'} has been successfully updated.
                            </p>

                            <Button
                                onClick={handleSuccessContinue}
                                className="w-full h-12 bg-brand text-white font-bold rounded-2xl hover:bg-brand/90 active:scale-[0.98] transition-all"
                            >
                                Continue
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // 0. Main View
    return (
        <div className="min-h-screen bg-gray-50 pb-32 font-sans text-brand">
            {/* Header */}
            <div className="bg-gray-50 flex items-center px-6 pt-safe-top pb-4 sticky top-0 z-10">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm active:scale-95 transition-transform"
                >
                    <ArrowLeft className="w-5 h-5 text-brand" />
                </button>
                <div className="flex-1 text-center mr-10">
                    <span className="text-xl font-bold text-brand">Edit Profile</span>
                </div>
            </div>

            <div className="px-6 space-y-6">
                {/* Profile Info Card */}
                <div className="bg-white rounded-3xl p-8 shadow-sm flex flex-col items-center">
                    <div className="relative mb-4">
                        <Avatar className="w-24 h-24 border-4 border-white shadow-md">
                            <AvatarImage src={formData.avatar} className="object-cover" />
                            <AvatarFallback className="text-2xl">{formData.name[0]}</AvatarFallback>
                        </Avatar>
                        <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-100 active:scale-90 transition-transform">
                            <Camera className="w-4 h-4 text-brand" />
                        </button>
                    </div>

                    <h2 className="text-xl font-bold text-brand mb-2">{formData.name}</h2>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-star stroke-star" />
                            <span className="text-base font-bold">4.9</span>
                        </div>
                        <div className="bg-brand text-white text-[10px] font-bold px-3 py-1 rounded-md tracking-wider uppercase">
                            Verified
                        </div>
                    </div>
                </div>

                {/* Input Fields */}
                <div className="space-y-3">
                    {/* Full Name */}
                    <div className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-4 flex-1">
                            <div className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full">
                                <User className="w-5 h-5 text-brand" strokeWidth={2} />
                            </div>
                            <p className="text-base font-medium text-brand">{formData.name}</p>
                        </div>
                        <button
                            onClick={() => setView('name')}
                            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 active:scale-90 transition-all text-gray-400 hover:text-brand"
                        >
                            <PenLine className="w-5 h-5" strokeWidth={2} />
                        </button>
                    </div>

                    {/* Phone Number */}
                    <div className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-4 flex-1">
                            <div className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full">
                                <Smartphone className="w-5 h-5 text-brand" strokeWidth={2} />
                            </div>
                            <p className="text-base font-medium text-brand">{formData.phone}</p>
                        </div>
                        <button
                            onClick={() => setView('phone')}
                            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 active:scale-90 transition-all text-gray-400 hover:text-brand"
                        >
                            <PenLine className="w-5 h-5" strokeWidth={2} />
                        </button>
                    </div>

                    {/* Email Address */}
                    <div className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-4 flex-1">
                            <div className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full">
                                <Mail className="w-5 h-5 text-brand" strokeWidth={2} />
                            </div>
                            <p className="text-base font-medium text-brand truncate max-w-[200px]">{formData.email}</p>
                        </div>
                        <button
                            onClick={() => setView('email')}
                            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 active:scale-90 transition-all text-gray-400 hover:text-brand"
                        >
                            <PenLine className="w-5 h-5" strokeWidth={2} />
                        </button>
                    </div>

                    {/* Verification Document */}
                    <div className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-4 flex-1">
                            <div className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full">
                                <FileText className="w-5 h-5 text-brand" strokeWidth={2} />
                            </div>
                            <p className="text-base font-medium text-brand">IMG19845792084.jpeg</p>
                        </div>
                        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 active:scale-90 transition-all text-gray-400 hover:text-brand">
                            <Search className="w-5 h-5" strokeWidth={2} />
                        </button>
                    </div>
                </div>

                {/* Save Button (Navigates back) */}
                <div className="pt-4">
                    <Button
                        onClick={() => navigate(-1)}
                        className="w-full bg-brand hover:brightness-90 text-white h-14 rounded-2xl text-base font-bold shadow-md active:scale-[0.98] transition-all"
                    >
                        Save
                    </Button>
                </div>
            </div>
        </div>
    );
}
