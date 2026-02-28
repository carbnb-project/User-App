import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Upload, CheckCircle2, ChevronRight, Info } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

export function ListCarScreen() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model: '',
    year: '',
    category: '',
    plateNumber: '',
    location: '',
    pricePerDay: '',
    description: '',
  });

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission
    navigate('/host', { state: { submissionStatus: 'pending' } });
  };

  const renderStep1 = () => (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-semibold mb-2 block text-brand/70 uppercase tracking-wider">Identity</Label>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Vehicle Display Name</Label>
              <Input
                id="name"
                placeholder="e.g. Mercedes-Benz GLE 450"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-14 rounded-2xl border-gray-100 bg-gray-50/50"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  placeholder="e.g. Mercedes"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="h-14 rounded-2xl border-gray-100 bg-gray-50/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  placeholder="e.g. GLE"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className="h-14 rounded-2xl border-gray-100 bg-gray-50/50"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="year">Manufacturing Year</Label>
            <Input
              id="year"
              type="number"
              placeholder="2023"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              className="h-14 rounded-2xl border-gray-100 bg-gray-50/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="plate">Plate Number</Label>
            <Input
              id="plate"
              placeholder="e.g. LND-123XY"
              value={formData.plateNumber}
              onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
              className="h-14 rounded-2xl border-gray-100 bg-gray-50/50"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Category</Label>
          <Select onValueChange={(v) => setFormData({ ...formData, category: v })}>
            <SelectTrigger className="h-14 rounded-2xl border-gray-100 bg-gray-50/50">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Everyday">Everyday</SelectItem>
              <SelectItem value="Luxury">Luxury</SelectItem>
              <SelectItem value="Exotic">Exotic</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>City / Location</Label>
          <Select onValueChange={(v) => setFormData({ ...formData, location: v })}>
            <SelectTrigger className="h-14 rounded-2xl border-gray-100 bg-gray-50/50">
              <SelectValue placeholder="Where is the car located?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Lagos">Lagos</SelectItem>
              <SelectItem value="Abuja">Abuja</SelectItem>
              <SelectItem value="Port Harcourt">Port Harcourt</SelectItem>
              <SelectItem value="Ibadan">Ibadan</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price per Day (₦)</Label>
          <Input
            id="price"
            type="number"
            placeholder="e.g. 45000"
            value={formData.pricePerDay}
            onChange={(e) => setFormData({ ...formData, pricePerDay: e.target.value })}
            className="h-14 rounded-2xl border-gray-100 bg-gray-50/50"
          />
          <p className="text-xs text-gray-400 pl-2">Recommendation: ₦35,000 - ₦55,000 for luxury SUVs</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Vehicle Description</Label>
          <Textarea
            id="description"
            placeholder="Tell users why they should book your car..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="min-h-[160px] rounded-2xl border-gray-100 bg-gray-50/50 resize-none p-4"
          />
        </div>

        <div className="bg-brand/5 p-4 rounded-2xl flex gap-3 items-start border border-brand/10">
          <Info className="w-5 h-5 text-brand shrink-0 mt-0.5" />
          <p className="text-xs text-brand/80 leading-relaxed font-medium">
            Standard specifications like Seats, Fuel, and Transmission will be automatically updated after our physical inspection.
          </p>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      <div className="space-y-4">
        <Label className="text-sm font-semibold text-brand/70 uppercase tracking-wider block">Verification Photos</Label>

        <div className="grid grid-cols-1 gap-4">
          <div className="border-2 border-dashed border-gray-200 rounded-3xl p-8 text-center bg-gray-50/50 hover:bg-gray-100/50 transition-colors cursor-pointer group">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8 text-brand" />
            </div>
            <p className="font-bold text-brand mb-1">Exterior Photos</p>
            <p className="text-xs text-gray-400">Front, Back, and Sides</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="border-2 border-dashed border-gray-200 rounded-3xl p-6 text-center bg-gray-50/50 hover:bg-gray-100/50 transition-colors cursor-pointer group">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6 text-brand" />
              </div>
              <p className="text-sm font-bold text-brand mb-1">Interior</p>
              <p className="text-[10px] text-gray-400 tracking-tight">Seats & Upholstery</p>
            </div>
            <div className="border-2 border-dashed border-gray-200 rounded-3xl p-6 text-center bg-gray-50/50 hover:bg-gray-100/50 transition-colors cursor-pointer group">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6 text-brand" />
              </div>
              <p className="text-sm font-bold text-brand mb-1">Dashboard</p>
              <p className="text-[10px] text-gray-400 tracking-tight">Mileage & Indicators</p>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 p-4 rounded-2xl flex gap-3 items-start border border-amber-100">
          <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-900/80 leading-relaxed">
            Ensure photos are clear and taken in good lighting. Blurry photos may delay approval.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white pb-32 font-sans">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md z-20 px-5 pt-14 pb-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => step > 1 ? prevStep() : navigate(-1)}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100"
          >
            <ArrowLeft className="w-5 h-5 text-brand" />
          </button>
          <div className="flex flex-col items-center">
            <h1 className="text-lg font-bold text-brand">List Your Car</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Step {step} of 3</p>
          </div>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden flex gap-1">
          <div className={`h-full bg-brand transition-all duration-500 rounded-full ${step >= 1 ? 'flex-1' : 'w-0'}`} />
          <div className={`h-full bg-brand transition-all duration-500 rounded-full ${step >= 2 ? 'flex-1' : 'w-0'}`} />
          <div className={`h-full bg-brand transition-all duration-500 rounded-full ${step >= 3 ? 'flex-1' : 'w-0'}`} />
        </div>
      </div>

      <div className="px-5 pt-4 max-w-lg mx-auto">
        <div className="mb-0">
          <h2 className="text-2xl font-black text-brand mb-2">
            {step === 1 && "Vehicle Identity"}
            {step === 2 && "Financing & Story"}
            {step === 3 && "Visual Verification"}
          </h2>
          <p className="text-sm text-gray-500 font-medium leading-normal mb-8">
            {step === 1 && "Start by identifying your vehicle and its current general location."}
            {step === 2 && "Set your daily rental rate and tell prospective renters about the car."}
            {step === 3 && "Finally, upload real photos of your vehicle for our review process."}
          </p>
        </div>

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </div>

      {/* Navigation Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-6 pb-10 flex gap-4 z-20">
        {step > 1 && (
          <Button
            onClick={prevStep}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-brand h-14 rounded-2xl font-bold transition-all"
          >
            Back
          </Button>
        )}
        <Button
          onClick={step === 3 ? handleSubmit : nextStep}
          className="flex-[2] bg-brand hover:bg-brand-light text-white h-14 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-brand/10"
        >
          {step === 3 ? "Submit for Review" : "Continue"}
          {step < 3 && <ChevronRight className="w-5 h-5" />}
          {step === 3 && <CheckCircle2 className="w-5 h-5" />}
        </Button>
      </div>
    </div>
  );
}