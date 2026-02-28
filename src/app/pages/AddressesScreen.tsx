import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Home, Briefcase, Plus, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';

export function AddressesScreen() {
    const navigate = useNavigate();

    const savedAddresses = [
        {
            id: '1',
            label: 'Home',
            address: '12, Admiralty Way, Lekki Phase 1, Lagos',
            icon: Home,
        },
        {
            id: '2',
            label: 'Work',
            address: 'Heritage Place, 21 Alfred Rewane Rd, Ikoyi, Lagos',
            icon: Briefcase,
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-32 font-sans text-brand flex flex-col">
            {/* Header */}
            <div className="bg-gray-50 flex items-center px-6 pt-safe-top pb-4 sticky top-0 z-10">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm active:scale-95 transition-transform"
                >
                    <ArrowLeft className="w-5 h-5 text-brand" />
                </button>
                <div className="flex-1 text-center mr-10">
                    <span className="text-xl font-bold text-brand">Saved Addresses</span>
                </div>
            </div>

            <div className="px-6 space-y-6 flex-1">
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest ml-1">My Locations</h3>

                    {savedAddresses.map((loc) => {
                        const Icon = loc.icon;
                        return (
                            <div key={loc.id} className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-transparent hover:border-brand/5 transition-all">
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
                                        <Icon className="w-6 h-6 text-brand" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-brand">{loc.label}</p>
                                        <p className="text-xs text-gray-400 font-medium line-clamp-1">{loc.address}</p>
                                    </div>
                                </div>
                                <button className="text-gray-300 hover:text-red-500 transition-colors ml-4">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        );
                    })}
                </div>

                <div className="space-y-4">
                    <button className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm active:scale-[0.98] transition-all group">
                        <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center">
                            <Plus className="w-5 h-5 text-emerald-600" />
                        </div>
                        <span className="font-bold text-brand text-sm">Add New Address</span>
                    </button>

                    <button className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm active:scale-[0.98] transition-all group">
                        <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-brand" />
                        </div>
                        <span className="font-bold text-brand text-sm">Pick on Map</span>
                    </button>
                </div>
            </div>

            <div className="p-6">
                <Button
                    onClick={() => navigate(-1)}
                    className="w-full bg-brand hover:brightness-90 text-white h-14 rounded-2xl text-base font-bold shadow-md active:scale-[0.98] transition-all"
                >
                    Save Changes
                </Button>
            </div>
        </div>
    );
}
