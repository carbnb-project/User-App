import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Fingerprint, Eye, ChevronRight, Download } from 'lucide-react';

export function SecurityScreen() {
    const navigate = useNavigate();

    const securityItems = [
        {
            icon: Lock,
            label: 'Change Password',
            subtitle: 'Update your login password',
            action: () => alert('Change Password flow starting... (Demo)')
        },
        {
            icon: Fingerprint,
            label: 'Biometric Login',
            subtitle: 'Use FaceID or Fingerprint',
            isToggle: true,
            enabled: true
        },
        {
            icon: Download,
            label: 'Export My Data',
            subtitle: 'Get a copy of your personal data',
            action: () => alert('Requesting data export... You will receive an email shortly. (Demo)')
        },
        {
            icon: Eye,
            label: 'Login Activity',
            subtitle: 'Check where you are logged in',
            action: () => alert('Showing login activity... (Demo)')
        },
        {
            icon: Shield,
            label: 'Two-Factor Auth',
            subtitle: 'Add an extra layer of security',
            action: () => alert('2FA setup flow starting... (Demo)')
        }
    ];

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
                <h1 className="text-xl font-black">Privacy & Security</h1>
            </div>

            <div className="p-6 space-y-8">
                <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 flex items-center gap-4">
                    <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                        <Shield size={28} />
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-emerald-900 leading-tight">Your account is secure</h2>
                        <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider mt-1 leading-none">All protections active</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] px-2 leading-none">Security Controls</h3>
                    <div className="space-y-3">
                        {securityItems.map((item, idx) => {
                            const Icon = item.icon;
                            return (
                                <div
                                    key={idx}
                                    onClick={item.action}
                                    className="w-full bg-white rounded-3xl p-5 flex items-center justify-between shadow-sm border border-transparent hover:border-slate-100 transition-all group active:scale-[0.99]"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                            <Icon size={24} />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-base font-bold text-slate-900 leading-none mb-1">{item.label}</p>
                                            <p className="text-xs text-slate-400 font-medium leading-none">{item.subtitle}</p>
                                        </div>
                                    </div>
                                    {item.isToggle ? (
                                        <div className={`w-12 h-6 rounded-full p-1 transition-colors ${item.enabled ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                                            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${item.enabled ? 'translate-x-6' : 'translate-x-0'}`} />
                                        </div>
                                    ) : (
                                        <ChevronRight className="text-slate-300 group-hover:text-slate-400" size={20} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="pt-4 px-2">
                    <button
                        className="text-rose-500 text-sm font-black uppercase tracking-widest active:scale-95 transition-all"
                        onClick={() => alert('Account deletion flow starting... Proceed with caution. (Demo)')}
                    >
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
}
