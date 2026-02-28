import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Moon, Globe, Trash2, ChevronRight, Info, Navigation } from 'lucide-react';

export function AppSettingsScreen() {
    const navigate = useNavigate();

    const appSettings = [
        {
            icon: Bell,
            label: 'Notifications',
            subtitle: 'Push, Email, SMS',
            action: () => alert('Notification settings... (Demo)')
        },
        {
            icon: Moon,
            label: 'Dark Mode',
            subtitle: 'Follow system settings',
            isToggle: true,
            enabled: false
        },
        {
            icon: Globe,
            label: 'Language',
            subtitle: 'English (English, Hausa, Yoruba, Igbo)',
            action: () => alert('Select Language:\n1. English\n2. Hausa\n3. Yoruba\n4. Igbo\n(Demo)')
        },
        {
            icon: Navigation,
            label: 'Map Preference',
            subtitle: 'Google Maps',
            action: () => alert('Select Navigation App:\n1. Google Maps\n2. Waze\n(Demo)')
        },
        {
            icon: Trash2,
            label: 'Clear Cache',
            subtitle: 'Free up 24.5 MB',
            action: () => alert('Cache cleared successfully! (Demo)')
        },
        {
            icon: Info,
            label: 'About RideNaira',
            subtitle: 'Version 1.0.4',
            action: () => alert('RideNaira v1.0.4 - Built with love in Lagos. (Demo)')
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
                <h1 className="text-xl font-black">App Settings</h1>
            </div>

            <div className="p-6 space-y-8">
                <div className="space-y-4">
                    <h3 className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] px-2 leading-none">General</h3>
                    <div className="space-y-3">
                        {appSettings.map((item, idx) => {
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
                    <p className="text-[10px] text-slate-300 font-black uppercase tracking-widest text-center">
                        Designed & Developed by RideNaira Team
                    </p>
                </div>
            </div>
        </div>
    );
}
