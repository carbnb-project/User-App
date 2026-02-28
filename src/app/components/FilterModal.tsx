import React, { useState } from 'react';
import { X, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerFooter,
} from './ui/drawer';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/select';

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (filters: any) => void;
}

const FEATURES = [
    "Air Conditioner", "Alarm", "Bluetooth", "Buck Seat",
    "Camera System", "Flat Screen", "Glass Roof", "GPS",
    "Wi-Fi", "Heated Seats", "Radio", "USB Outlets"
];

export function FilterModal({ isOpen, onClose, onApply }: FilterModalProps) {
    const [priceRange, setPriceRange] = useState([250000, 1790000]);
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
    const [category, setCategory] = useState<string>("");

    const toggleFeature = (feature: string) => {
        setSelectedFeatures(prev =>
            prev.includes(feature)
                ? prev.filter(f => f !== feature)
                : [...prev, feature]
        );
    };

    const handleReset = () => {
        setPriceRange([250000, 1790000]);
        setSelectedFeatures([]);
        setCategory("");
    };

    const handleApply = () => {
        onApply({ priceRange, selectedFeatures, category });
        onClose();
    };

    return (
        <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DrawerContent className="bg-white rounded-t-3xl max-h-[90vh]">
                <div className="w-full max-w-md mx-auto">
                    {/* Header */}
                    <DrawerHeader className="relative border-b border-gray-100 pb-4 pt-4">
                        <DrawerTitle className="text-center text-[18px] font-bold text-brand">
                            Filter
                        </DrawerTitle>
                        <DrawerClose className="absolute right-4 top-4 rounded-full p-1 bg-gray-50 hover:bg-gray-100 transition-colors">
                            <X className="w-5 h-5 text-gray-500" />
                        </DrawerClose>
                    </DrawerHeader>

                    <div className="px-6 pt-4 pb-5 space-y-6 overflow-y-auto max-h-[70vh]">
                        {/* Price Range */}
                        <div className="space-y-4">
                            <h3 className="text-[16px] font-bold text-brand">Price Range (Per Day)</h3>
                            <div className="px-2">
                                <Slider
                                    defaultValue={[250000, 1790000]}
                                    max={2000000}
                                    step={10000}
                                    value={priceRange}
                                    onValueChange={setPriceRange}
                                    className="py-4"
                                />
                            </div>
                            <div className="flex justify-between text-[14px] font-medium text-gray-600">
                                <span>₦{priceRange[0].toLocaleString()}</span>
                                <span>₦{priceRange[1].toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="space-y-3">
                            <h3 className="text-[16px] font-bold text-brand">Feature</h3>
                            <div className="flex flex-wrap gap-3">
                                {FEATURES.map((feature) => {
                                    const isSelected = selectedFeatures.includes(feature);
                                    return (
                                        <button
                                            key={feature}
                                            onClick={() => toggleFeature(feature)}
                                            className={`px-4 py-2.5 rounded-full text-[13px] font-medium transition-all border ${isSelected
                                                ? 'bg-brand text-white border-brand'
                                                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            {feature}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Category */}
                        <div className="space-y-3">
                            <h3 className="text-[16px] font-bold text-brand">Car Category</h3>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger className="w-full !h-[60px] rounded-2xl border border-gray-200 bg-white text-brand px-4 text-[15px]">
                                    <div className="flex items-center gap-3">
                                        <svg className="w-5 h-5 text-gray-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="4" width="18" height="16" rx="2" />
                                            <line x1="3" y1="8" x2="21" y2="8" />
                                            <line x1="8" y1="4" x2="8" y2="8" />
                                            <line x1="16" y1="4" x2="16" y2="8" />
                                            <line x1="3" y1="12" x2="21" y2="12" />
                                        </svg>
                                        <SelectValue placeholder="Select category" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent className="bg-white rounded-xl border-gray-100 shadow-xl p-1">
                                    <SelectItem className="rounded-lg py-3 px-3 text-[14px] hover:bg-gray-50 cursor-pointer transition-colors" value="luxury">Luxury</SelectItem>
                                    <SelectItem className="rounded-lg py-3 px-3 text-[14px] hover:bg-gray-50 cursor-pointer transition-colors" value="sedan">Sedan</SelectItem>
                                    <SelectItem className="rounded-lg py-3 px-3 text-[14px] hover:bg-gray-50 cursor-pointer transition-colors" value="suv">SUV</SelectItem>
                                    <SelectItem className="rounded-lg py-3 px-3 text-[14px] hover:bg-gray-50 cursor-pointer transition-colors" value="sports">Sports</SelectItem>
                                    <SelectItem className="rounded-lg py-3 px-3 text-[14px] hover:bg-gray-50 cursor-pointer transition-colors" value="convertible">Convertible</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Footer Action */}
                    <div className="px-6 pt-4 pb-6 border-t border-gray-50 flex gap-3 text-brand">
                        <Button
                            onClick={handleReset}
                            variant="outline"
                            className="flex-1 h-[52px] rounded-2xl text-[16px] font-bold border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-brand shadow-none transition-all active:scale-[0.98]"
                        >
                            Reset
                        </Button>
                        <Button
                            onClick={handleApply}
                            className="flex-[2] h-[52px] bg-brand hover:bg-black text-white rounded-2xl text-[16px] font-bold tracking-wide shadow-none active:scale-[0.98] transition-all"
                        >
                            Save
                        </Button>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
