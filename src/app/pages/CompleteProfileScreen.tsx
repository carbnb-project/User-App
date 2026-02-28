import { useNavigate, useLocation } from 'react-router-dom';
import { Camera, User, Smartphone, Mail, PenLine, Star, ArrowLeft, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useState, useEffect, useRef } from 'react';

type ViewState = 'main' | 'name' | 'phone' | 'email';

export function CompleteProfileScreen() {
    const navigate = useNavigate();
    const location = useLocation();
    const contact = location.state?.contact || ''; // Passed from OTP

    const isEmail = contact.includes('@');

    // State
    const [view, setView] = useState<ViewState>('main');

    // Form Data
    const [name, setName] = useState('');
    const [phone, setPhone] = useState(isEmail ? '' : contact);
    const [email, setEmail] = useState(isEmail ? contact : '');

    // Editing States
    const [tempName, setTempName] = useState({ first: '', last: '' });
    const [tempPhone, setTempPhone] = useState('');
    const [tempEmail, setTempEmail] = useState('');

    // Image Upload
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handlers
    const handleNameSave = () => {
        setName(`${tempName.first} ${tempName.last}`);
        setView('main');
    };

    const handlePhoneSave = () => {
        setPhone(`+234 ${tempPhone}`);
        setView('main');
    };

    const handleEmailSave = () => {
        setEmail(tempEmail);
        setView('main');
    };

    // Derived Display Values
    const displayName = name || 'Full Name';
    const displayPhone = phone || 'Add Phone Number';
    const displayEmail = email || 'Add Email Address';

    // Views
    if (view === 'name') {
        return (
            <div className="min-h-screen bg-gray-50 font-sans text-brand flex flex-col">
                <div className="bg-gray-50 px-6 pt-safe-top pb-4 flex items-center">
                    <button onClick={() => setView('main')} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <ArrowLeft className="w-5 h-5 text-brand" />
                    </button>
                    <span className="ml-4 font-bold text-lg">Enter Name</span>
                </div>
                <div className="px-6 space-y-4 mt-4">
                    <div>
                        <label className="text-xs font-medium text-gray-500 mb-1.5 block ml-1">First Name</label>
                        <input
                            value={tempName.first}
                            onChange={(e) => setTempName({ ...tempName, first: e.target.value })}
                            className="w-full h-14 px-4 rounded-xl border-none text-brand font-medium bg-white shadow-sm ring-1 ring-gray-100 focus:ring-2 focus:ring-brand focus:outline-none"
                            placeholder="e.g. John"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-gray-500 mb-1.5 block ml-1">Last Name</label>
                        <input
                            value={tempName.last}
                            onChange={(e) => setTempName({ ...tempName, last: e.target.value })}
                            className="w-full h-14 px-4 rounded-xl border-none text-brand font-medium bg-white shadow-sm ring-1 ring-gray-100 focus:ring-2 focus:ring-brand focus:outline-none"
                            placeholder="e.g. Doe"
                        />
                    </div>
                    <Button onClick={handleNameSave} disabled={!tempName.first || !tempName.last} className="w-full h-14 bg-brand text-white rounded-xl font-bold mt-4">
                        Save
                    </Button>
                </div>
            </div>
        )
    }

    if (view === 'phone') {
        return (
            <div className="min-h-screen bg-gray-50 font-sans text-brand flex flex-col">
                <div className="bg-gray-50 px-6 pt-safe-top pb-4 flex items-center">
                    <button onClick={() => setView('main')} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <ArrowLeft className="w-5 h-5 text-brand" />
                    </button>
                    <span className="ml-4 font-bold text-lg">Enter Phone</span>
                </div>
                <div className="px-6 space-y-4 mt-4">
                    <div>
                        <label className="text-xs font-medium text-gray-500 mb-1.5 block ml-1">Phone Number</label>
                        <input
                            type="tel"
                            value={tempPhone}
                            onChange={(e) => setTempPhone(e.target.value)}
                            className="w-full h-14 px-4 rounded-xl border-none text-brand font-medium bg-white shadow-sm ring-1 ring-gray-100 focus:ring-2 focus:ring-brand focus:outline-none"
                            placeholder="812 345 6789"
                        />
                    </div>
                    <Button onClick={handlePhoneSave} disabled={tempPhone.length < 10} className="w-full h-14 bg-brand text-white rounded-xl font-bold mt-4">
                        Save
                    </Button>
                </div>
            </div>
        )
    }

    if (view === 'email') {
        return (
            <div className="min-h-screen bg-gray-50 font-sans text-brand flex flex-col">
                <div className="bg-gray-50 px-6 pt-safe-top pb-4 flex items-center">
                    <button onClick={() => setView('main')} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <ArrowLeft className="w-5 h-5 text-brand" />
                    </button>
                    <span className="ml-4 font-bold text-lg">Enter Email</span>
                </div>
                <div className="px-6 space-y-4 mt-4">
                    <div>
                        <label className="text-xs font-medium text-gray-500 mb-1.5 block ml-1">Email Address</label>
                        <input
                            type="email"
                            value={tempEmail}
                            onChange={(e) => setTempEmail(e.target.value)}
                            className="w-full h-14 px-4 rounded-xl border-none text-brand font-medium bg-white shadow-sm ring-1 ring-gray-100 focus:ring-2 focus:ring-brand focus:outline-none"
                            placeholder="john@example.com"
                        />
                    </div>
                    <Button onClick={handleEmailSave} disabled={!tempEmail.includes('@')} className="w-full h-14 bg-brand text-white rounded-xl font-bold mt-4">
                        Save
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-brand pb-8">
            {/* Header */}
            <div className="bg-gray-50 px-6 pt-safe-top pb-4 flex items-center shrink-0 sticky top-0 z-10">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100"
                >
                    <ArrowLeft className="w-5 h-5 text-brand" />
                </button>
                <div className="flex-1 text-center mr-10">
                    <span className="text-xl font-bold text-brand">Complete Your Profile</span>
                </div>
            </div>

            <div className="flex-1 px-6 space-y-6 pt-4">
                {/* Profile Avatar Card */}
                <div className="bg-white rounded-3xl p-8 shadow-sm flex flex-col items-center">
                    <div className="relative mb-4">
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center relative overflow-hidden border-4 border-white shadow-sm cursor-pointer"
                        >
                            {avatarPreview ? (
                                <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <Camera className="w-8 h-8 text-gray-300" />
                            )}
                        </div>

                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            accept="image/*"
                            className="hidden"
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-100 active:scale-90 transition-transform"
                        >
                            <Camera className="w-4 h-4 text-brand" />
                        </button>
                    </div>

                    <h2 className="text-xl font-bold text-brand mb-1">{name || 'Your Name'}</h2>
                    <p className="text-gray-500 mb-3 text-sm">{email || phone || 'Contact Info'}</p>

                    <div className="flex items-center gap-1.5 text-gray-400">
                        <Star className="w-4 h-4 fill-gray-300 stroke-gray-300" />
                        <span className="text-sm font-bold">0.0</span>
                    </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                    {/* Name */}
                    <button
                        onClick={() => setView('name')}
                        className="w-full bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm active:scale-[0.99] transition-transform"
                    >
                        <div className="flex items-center gap-4 flex-1">
                            <div className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full">
                                <User className="w-5 h-5 text-gray-500" strokeWidth={1.5} />
                            </div>
                            <span className={`font-medium ${name ? 'text-brand' : 'text-gray-400'}`}>
                                {displayName}
                            </span>
                        </div>
                        <PenLine className="w-5 h-5 text-gray-400" />
                    </button>

                    {/* Phone */}
                    <button
                        onClick={() => {
                            if (!isEmail) return; // Verified, cannot edit? Or allow edit? User said "registered with will be already available". Usually key identifiers shouldn't be easily changed during onboarding, but let's assume read-only if it was the registration method.
                            // Actually user said "the phone number and email number will be required to fill but the one they registered with will be already available by default"
                            // implying they *could* handle it, but it's pre-filled.
                            // Let's allow editing if needed, or maybe just "filling the empty ones".
                            // "The only information already filled should either be... other info left blank"
                            // If I registered with email, Phone is blank -> Click to add.
                            setView('phone');
                        }}
                        disabled={!isEmail && !!phone} // Disable if it was the registration method (Phone)
                        className={`w-full bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm ${(!isEmail && !!phone) ? 'opacity-80' : 'active:scale-[0.99] transition-transform'}`}
                    >
                        <div className="flex items-center gap-4 flex-1">
                            <div className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full">
                                <Smartphone className="w-5 h-5 text-gray-500" strokeWidth={1.5} />
                            </div>
                            <span className={`font-medium ${phone ? 'text-brand' : 'text-gray-400'}`}>
                                {displayPhone}
                            </span>
                        </div>
                        {isEmail && <PenLine className="w-5 h-5 text-gray-400" />}
                        {!isEmail && <div className="text-xs text-green-600 font-bold px-2 py-1 bg-green-50 rounded">Verified</div>}
                    </button>

                    {/* Email */}
                    <button
                        onClick={() => {
                            if (isEmail) return; // Verified
                            setView('email');
                        }}
                        disabled={isEmail && !!email} // Disable if it was the registration method (Email)
                        className={`w-full bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm ${(isEmail && !!email) ? 'opacity-80' : 'active:scale-[0.99] transition-transform'}`}
                    >
                        <div className="flex items-center gap-4 flex-1">
                            <div className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full">
                                <Mail className="w-5 h-5 text-gray-500" strokeWidth={1.5} />
                            </div>
                            <span className={`font-medium ${email ? 'text-brand' : 'text-gray-400'}`}>
                                {displayEmail}
                            </span>
                        </div>
                        {!isEmail && <PenLine className="w-5 h-5 text-gray-400" />}
                        {isEmail && <div className="text-xs text-green-600 font-bold px-2 py-1 bg-green-50 rounded">Verified</div>}
                    </button>
                </div>
            </div>

            {/* Actions */}
            <div className="px-6 space-y-8 mt-auto pt-6">
                <Button
                    onClick={() => navigate('/home')}
                    // disabled={!name || !phone || !email} // Should we enforce filling all? "required to fill"
                    disabled={!name || !phone || !email}
                    className="w-full bg-brand hover:brightness-90 text-white h-14 rounded-xl font-bold text-base shadow-lg shadow-brand/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Proceed to Dashboard
                </Button>

                <button
                    onClick={() => navigate('/verify-identity')}
                    className="w-full text-brand text-sm font-bold underline decoration-brand/30 underline-offset-4 hover:decoration-brand transition-all"
                >
                    Become a Verified User
                </button>
            </div>
        </div>
    );
}
