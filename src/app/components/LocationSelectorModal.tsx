import React, { useState } from 'react';
import { X, MapPin, Navigation, Search } from 'lucide-react';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from './ui/drawer';

interface LocationSelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (location: string) => void;
    currentLocation: string;
}

const LOCATIONS = [
    "Lagos, NG",
    "Abuja, NG",
    "Port Harcourt, NG",
    "Ibadan, NG",
    "Kano, NG",
    "Benin City, NG",
    "Calabar, NG",
    "Enugu, NG"
];

export function LocationSelectorModal({ isOpen, onClose, onSelect, currentLocation }: LocationSelectorModalProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredLocations = LOCATIONS.filter(loc =>
        loc.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DrawerContent className="bg-white rounded-t-[32px] max-h-[90vh]">
                <div className="w-full max-w-md mx-auto">
                    {/* Header */}
                    <DrawerHeader className="relative border-b border-gray-100 pb-4 pt-4">
                        <DrawerTitle className="text-center text-[18px] font-bold text-brand">
                            Select Location
                        </DrawerTitle>
                        <DrawerClose className="absolute right-4 top-4 rounded-full p-1 bg-gray-50 hover:bg-gray-100 transition-colors">
                            <X className="w-5 h-5 text-gray-500" />
                        </DrawerClose>
                    </DrawerHeader>

                    <div className="px-6 pt-4 pb-8 space-y-6">
                        {/* Search */}
                        <div className="bg-gray-50 rounded-xl flex items-center px-4 h-12">
                            <Search className="w-5 h-5 text-gray-400 mr-3" />
                            <input
                                type="text"
                                placeholder="Search city..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 bg-transparent border-none outline-none text-brand placeholder-gray-400 text-sm font-medium"
                            />
                        </div>

                        {/* Current Location Option */}
                        <button
                            onClick={() => {
                                onSelect("Lagos, NG"); // Reset or detect real location
                                onClose();
                            }}
                            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-brand/5 hover:bg-brand/10 transition-colors group"
                        >
                            <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center group-hover:bg-brand/20 transition-colors">
                                <Navigation className="w-5 h-5 text-brand fill-brand" />
                            </div>
                            <div className="text-left">
                                <div className="font-bold text-brand">Use Current Location</div>
                                <div className="text-xs text-gray-500">Enable location access</div>
                            </div>
                        </button>

                        {/* Location List */}
                        <div className="space-y-1">
                            {filteredLocations.map((loc) => (
                                <button
                                    key={loc}
                                    onClick={() => {
                                        onSelect(loc);
                                        onClose();
                                    }}
                                    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${currentLocation === loc
                                            ? 'bg-gray-100'
                                            : 'hover:bg-gray-50'
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentLocation === loc ? 'bg-white shadow-sm' : 'bg-gray-50'
                                        }`}>
                                        <MapPin className={`w-5 h-5 ${currentLocation === loc ? 'text-brand' : 'text-gray-400'
                                            }`} />
                                    </div>
                                    <span className={`font-semibold ${currentLocation === loc ? 'text-brand' : 'text-gray-600'
                                        }`}>
                                        {loc}
                                    </span>
                                    {currentLocation === loc && (
                                        <div className="ml-auto w-2 h-2 rounded-full bg-brand" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
