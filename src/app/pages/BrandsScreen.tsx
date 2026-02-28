import { useNavigate } from 'react-router';
import { ArrowLeft, Search } from 'lucide-react';
import { carBrands } from '../../data/mockData';

export function BrandsScreen() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background pb-safe">
            {/* Header */}
            <div className="bg-white sticky top-0 z-10 px-4 pt-safe-top pb-4 flex items-center gap-4 border-b border-gray-100">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-900" />
                </button>
                <h1 className="text-lg font-bold text-gray-900">All Brands</h1>
            </div>

            {/* Search (Optional but good for UX) */}
            <div className="p-4">
                <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3">
                    <Search className="w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search brands..."
                        className="flex-1 bg-transparent border-none outline-none text-base placeholder:text-gray-400"
                    />
                </div>
            </div>

            {/* Brands Grid */}
            <div className="px-4 grid grid-cols-4 gap-4">
                {carBrands.map((brand) => (
                    <button
                        key={brand.id}
                        className="flex flex-col items-center gap-2"
                    >
                        <div className="w-16 h-16 bg-white border border-gray-100 rounded-full flex items-center justify-center shadow-sm">
                            <span className="text-sm font-bold text-gray-700">{brand.name.substring(0, 2)}</span>
                        </div>
                        <span className="text-xs text-center text-gray-700 font-medium truncate w-full">
                            {brand.name}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
