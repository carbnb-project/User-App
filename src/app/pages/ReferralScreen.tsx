import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Gift, Copy, Share2, Users } from 'lucide-react';

export function ReferralScreen() {
    const navigate = useNavigate();
    const referralCode = "RN-USER-4421";

    const copyToClipboard = () => {
        navigator.clipboard.writeText(referralCode);
        alert('Referral code copied to clipboard!');
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
            {/* Header */}
            <div className="bg-white px-6 pt-safe-top pb-6 shadow-sm flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 -ml-2 flex items-center justify-center text-slate-400 active:scale-90 transition-all"
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-xl font-black">Refer & Earn</h1>
            </div>

            <div className="p-6 space-y-8">
                {/* Hero Section */}
                <div className="bg-brand rounded-[40px] p-8 text-center relative overflow-hidden shadow-2xl shadow-brand/20">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />

                    <div className="w-20 h-20 bg-white rounded-3xl mx-auto flex items-center justify-center text-brand mb-6 shadow-xl">
                        <Gift size={40} strokeWidth={1.5} />
                    </div>

                    <h2 className="text-2xl font-black text-white leading-tight mb-2">Invite friends,<br />Earn N500 each!</h2>
                    <p className="text-brand-light/70 text-sm font-medium">Share your code with friends and get rewards when they take their first ride.</p>
                </div>

                {/* Referral Code Box */}
                <div className="space-y-3">
                    <h3 className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] px-2 leading-none">Your Unique Code</h3>
                    <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-6 flex items-center justify-between">
                        <span className="text-2xl font-black tracking-widest text-brand">{referralCode}</span>
                        <button
                            onClick={copyToClipboard}
                            className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-brand active:scale-90 transition-all hover:bg-slate-100"
                        >
                            <Copy size={20} />
                        </button>
                    </div>
                </div>

                {/* How it works */}
                <div className="space-y-4">
                    <h3 className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] px-2 leading-none">How It Works</h3>
                    <div className="space-y-3">
                        <div className="bg-white rounded-3xl p-5 flex items-center gap-4 shadow-sm">
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                                <Share2 size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-black text-slate-900 leading-none mb-1">Send Invitations</p>
                                <p className="text-xs text-slate-400 font-medium leading-none">Share your link via WhatsApp or SMS</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-3xl p-5 flex items-center gap-4 shadow-sm">
                            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600">
                                <Users size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-black text-slate-900 leading-none mb-1">Friends Sign Up</p>
                                <p className="text-xs text-slate-400 font-medium leading-none">They use your code during registration</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-3xl p-5 flex items-center gap-4 shadow-sm">
                            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                                <Gift size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-black text-slate-900 leading-none mb-1">Get Rewarded</p>
                                <p className="text-xs text-slate-400 font-medium leading-none">N500 is added to your wallet automatically</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Invite Button */}
                <button
                    onClick={() => alert('Opening share sheet... (Demo)')}
                    className="w-full bg-brand text-white h-[72px] rounded-3xl flex items-center justify-center gap-3 shadow-xl shadow-brand/20 active:scale-[0.98] transition-all"
                >
                    <Share2 size={24} strokeWidth={2.5} />
                    <span className="text-lg font-black uppercase tracking-widest">Invite Friends Now</span>
                </button>
            </div>
        </div>
    );
}
