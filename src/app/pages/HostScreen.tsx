import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Car, Plus, Rocket, X, Clock, MapPin, ChevronRight, Info } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';
import { Button } from '../components/ui/button';

export function HostScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const isPending = location.state?.submissionStatus === 'pending';

  return (
    <div className="min-h-screen bg-white pb-32 font-sans">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-10 px-5 pt-14 pb-4 flex items-center justify-between border-b border-gray-100">
        <h1 className="text-2xl font-black text-brand tracking-tight">Host Dashboard</h1>
        <Button
          onClick={() => navigate('/list-car')}
          className="h-11 bg-brand text-white rounded-2xl px-5 text-sm font-bold hover:bg-brand/90 active:scale-95 transition-all shadow-lg shadow-brand/10"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Add Car
        </Button>
      </div>

      {/* Main Content */}
      <div className="px-5 pt-6 text-brand">
        {isPending ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-brand">My Fleet</h2>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">1 Vehicle</span>
            </div>

            {/* Pending Car Card */}
            <div
              className="bg-white rounded-[32px] p-2 border border-blue-50 shadow-xl shadow-blue-900/5 overflow-hidden group active:scale-[0.98] transition-all"
            >
              <div className="relative h-48 w-full rounded-[26px] overflow-hidden bg-gray-100 mb-4">
                <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                  <Car className="w-12 h-12" />
                </div>
                <div className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg shadow-blue-600/20">
                  <Clock className="w-3 h-3" />
                  Pending Approval
                </div>
              </div>

              <div className="px-4 pb-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-brand leading-none mb-2">Mercedes-Benz GLE 450</h3>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-sm text-gray-400 font-medium">Lagos, Nigeria</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-brand leading-none mb-1">₦45,000</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Per Day</p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                      <Info className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="text-[11px] text-gray-400 font-medium leading-tight text-left">
                      We are currently reviewing your listing. <br />
                      Expect feedback within <span className="text-blue-600 font-bold">24 hours</span>.
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-200" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center pt-24 px-6">
            <div className="w-28 h-28 bg-gray-50 rounded-full flex items-center justify-center mb-8 border border-gray-100 shadow-inner">
              <Car className="w-12 h-12 text-gray-300" strokeWidth={1.5} />
            </div>

            <h2 className="text-2xl font-black text-brand mb-3 text-center tracking-tight">
              Start Hosting Today
            </h2>

            <p className="text-gray-400 text-center mb-10 max-w-[280px] text-sm font-medium leading-relaxed">
              List your car and start earning money by sharing it with travelers in your area.
            </p>

            <Button
              onClick={() => navigate('/list-car')}
              className="w-full max-w-[200px] bg-brand hover:bg-brand-light text-white h-14 rounded-2xl font-bold text-sm shadow-xl shadow-brand/10 active:scale-95 transition-all"
            >
              List Your Car
            </Button>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}