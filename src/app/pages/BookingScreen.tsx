import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Calendar as CalendarIcon,
  ChevronRight,
  ChevronDown,
  User,
  Shield,
  Briefcase,
  ArrowRightLeft,
  CalendarClock,
  Loader2,
  Car,
  Pencil,
} from 'lucide-react';
import { mockCars, mockBookings } from '../../data/mockData';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Checkbox } from '../components/ui/checkbox';
import { Calendar } from '../components/ui/calendar';
import { TimeSlider } from '../components/ui/time-slider';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from '../components/ui/sheet';
import { Dialog, DialogContent } from '../components/ui/dialog';
import { cn } from '../components/ui/utils';
import { format } from 'date-fns';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';

export function BookingScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const car = mockCars.find(c => c.id === id);

  // Form State
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');

  // Processing State
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Area of Use State
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [accordionValue, setAccordionValue] = useState<string>("");

  // Location Selection State
  const [focusedInput, setFocusedInput] = useState<'pickup' | 'dropoff' | null>(null);

  // Date Selection State
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [pickupTime, setPickupTime] = useState(600);
  const [dropoffTime, setDropoffTime] = useState(600);

  const formatTime = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
  };

  // Add-ons State
  const [withDriver, setWithDriver] = useState(false);
  const [selfDrive, setSelfDrive] = useState(false);
  const [withSecurity, setWithSecurity] = useState(false);
  const [notes, setNotes] = useState('');

  // Mock Locations for Suggestions
  const mockLocations = [
    { name: 'Murtala Muhammed Airport', address: 'Ikeja, Lagos', dist: '5.2 km' },
    { name: 'Eko Hotels & Suites', address: 'Victoria Island, Lagos', dist: '12.5 km' },
    { name: 'Landmark Beach', address: 'Oniru, Victoria Island', dist: '14.0 km' },
    { name: 'Ikeja City Mall', address: 'Alausa, Ikeja', dist: '2.1 km' },
    { name: 'The Palms Shopping Mall', address: 'Lekki Peninsula, Lagos', dist: '13.8 km' },
  ];

  const locationData: Record<string, string[]> = {
    'Lagos': [
      'Lekki Phase 1', 'Lekki Phase 2', 'Ikoyi', 'Banana Island', 'Victoria Island', 'Ikeja GRA', 'Magodo Phase 2', 'Surulere', 'Yaba', 'Maryland'
    ],
    'Federal Capital Territory': [
      'Maitama', 'Asokoro', 'Wuse 2', 'Garki', 'Guzape', 'Jabi', 'Utako', 'Gwarinpa', 'Life Camp'
    ],
    'Port Harcourt': [
      'Old GRA', 'New GRA', 'Peter Odili', 'Trans Amadi', 'D-Line', 'Rumuola', 'Ada George'
    ]
  };

  const currentAreas = selectedState ? locationData[selectedState] || [] : [];

  const getFilteredLocations = () => {
    if (!focusedInput) return [];
    const query = focusedInput === 'pickup' ? pickupAddress : dropoffAddress;
    if (!query) return [];
    return mockLocations.filter(loc =>
      loc.name.toLowerCase().includes(query.toLowerCase()) ||
      loc.address.toLowerCase().includes(query.toLowerCase())
    );
  };

  const suggestions = getFilteredLocations();

  if (!car) {
    return <div>Car not found</div>;
  }

  const handleBookingSubmit = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const newBooking = {
        id: `b${Date.now()}`,
        carId: car.id,
        userId: 'u1',
        startDate: startDate?.toISOString() || new Date().toISOString(),
        endDate: endDate?.toISOString() || new Date().toISOString(),
        withDriver: withDriver,
        deliveryOption: 'pickup',
        status: 'awaiting_confirm',
        totalPrice: car.pricePerDay * 2,
        deliveryAddress: pickupAddress || 'Lagos, NG',
      };

      // @ts-ignore
      mockBookings.push(newBooking);

      setIsProcessing(false);
      setShowSuccess(true);
    }, 2000);
  };

  const toggleArea = (area: string) => {
    setSelectedAreas(prev =>
      prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]
    );
  };

  return (
    <div className="min-h-screen bg-background pb-32 font-sans">
      {/* Header */}
      <div className="flex items-center px-5 pt-14 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-brand" />
        </button>
        <h1 className="text-lg font-bold text-brand flex-1 text-center mr-10">Book Your Car</h1>
      </div>

      <div className="px-5 space-y-7">

        {/* ───── Car Summary Card ───── */}
        <div className="bg-white rounded-2xl p-3.5 flex items-start gap-3.5 shadow-sm">
          <img
            src={car.image}
            alt={car.name}
            className="w-[90px] h-[78px] object-cover rounded-xl bg-gray-100 shrink-0"
          />
          <div className="flex-1 min-w-0">
            {/* Name */}
            <h3 className="font-bold text-[15px] text-brand leading-snug">{car.name}</h3>

            {/* Location + Price */}
            <div className="flex items-center justify-between mt-1.5">
              <div className="flex items-center gap-1 text-gray-400">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="10" r="3" />
                  <path d="M12 2a8 8 0 0 0-8 8c0 5.4 7 12 8 12s8-6.6 8-12a8 8 0 0 0-8-8z" />
                </svg>
                <span className="text-xs">{car.location}</span>
              </div>
              <div>
                <span className="font-bold text-base text-brand">₦{car.pricePerDay.toLocaleString()}</span>
                <span className="text-[10px] text-gray-400">/Day</span>
              </div>
            </div>

            {/* Star Rating + Avatars */}
            <div className="flex items-center gap-1.5 mt-1.5">
              <svg className="w-4 h-4 fill-star stroke-star" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
              <span className="text-xs font-semibold text-brand">{car.rating}</span>
              <div className="flex -space-x-2 ml-0.5">
                {car.reviewerAvatars?.slice(0, 3).map((avatar, i) => (
                  <div key={i} className="w-5 h-5 rounded-full border-2 border-white overflow-hidden">
                    <img src={avatar} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ───── Pick-up & Drop-off Location ───── */}
        <div className="space-y-3">
          <h3 className="font-bold text-brand text-base">Pick-up & Drop-off Location</h3>

          <Sheet>
            <SheetTrigger asChild>
              <div className="cursor-pointer">
                {!pickupAddress && !dropoffAddress ? (
                  <div className="h-14 bg-white rounded-2xl flex items-center px-4 gap-3 shadow-sm cursor-pointer">
                    <img src="/assets/images/Icons/nimbus_location.jpg" alt="location" className="w-5 h-5 object-contain shrink-0" />
                    <span className="text-gray-400 text-sm">Enter your pick-up & drop-off location</span>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl p-4 shadow-sm relative flex items-center justify-between gap-2">
                    {/* Left: Pickup */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <img src="/assets/images/Icons/nimbus_location.jpg" alt="location" className="w-6 h-6 object-contain shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium text-brand text-base truncate pr-2">{pickupAddress?.split(',')[0]}</p>
                        <p className="text-sm text-gray-400 truncate pr-2 mt-0.5">{pickupAddress?.split(',').slice(1).join(', ')}</p>
                      </div>
                    </div>

                    {/* Middle: Swap Icon */}
                    <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center shrink-0">
                      <ArrowRightLeft className="w-4 h-4 text-gray-400" />
                    </div>

                    {/* Right: Dropoff */}
                    <div className="flex items-center justify-between gap-3 flex-1 min-w-0 pl-2">
                      <div className="min-w-0">
                        <p className="font-medium text-brand text-base truncate">{dropoffAddress?.split(',')[0]}</p>
                        <p className="text-sm text-gray-400 truncate">{dropoffAddress?.split(',').slice(1).join(', ')}</p>
                      </div>
                      <Pencil className="w-4 h-4 text-gray-300 shrink-0" />
                    </div>
                  </div>
                )}
              </div>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-3xl p-0 h-[90vh] [&>button]:hidden">
              <div className="h-full flex flex-col bg-white rounded-t-3xl">
                <div className="px-6 pt-6 pb-2 flex items-center justify-between">
                  <SheetTitle className="text-lg font-bold text-brand">Enter Your Location</SheetTitle>
                  <SheetClose className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-brand"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </SheetClose>
                </div>

                <div className="px-6 py-4 space-y-3 border-b border-gray-50">
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </div>
                    <Input
                      placeholder="Search your pick up location"
                      className="pl-12 h-14 rounded-2xl border border-gray-100 bg-white text-base focus-visible:ring-brand"
                      value={pickupAddress}
                      onChange={(e) => setPickupAddress(e.target.value)}
                      onFocus={() => setFocusedInput('pickup')}
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </div>
                    <Input
                      placeholder="Search your drop-off location"
                      className="pl-12 h-14 rounded-2xl border-none bg-[#F8F9FB] text-base focus-visible:ring-brand"
                      value={dropoffAddress}
                      onChange={(e) => setDropoffAddress(e.target.value)}
                      onFocus={() => setFocusedInput('dropoff')}
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
                  {suggestions.map((loc, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-4 cursor-pointer hover:opacity-70"
                      onClick={() => {
                        if (focusedInput === 'pickup') {
                          setPickupAddress(`${loc.name}, ${loc.address}`);
                          setFocusedInput('dropoff');
                        } else {
                          setDropoffAddress(`${loc.name}, ${loc.address}`);
                          setFocusedInput(null);
                        }
                      }}
                    >
                      <div className="mt-1">
                        <img src="/assets/images/Icons/nimbus_location.jpg" alt="location" className="w-5 h-5 object-contain" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-brand text-sm">{loc.name}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{loc.address}</p>
                      </div>
                      <span className="text-xs font-medium text-brand">{loc.dist}</span>
                    </div>
                  ))}

                  {suggestions.length === 0 && (
                    <div className="text-center text-gray-400 py-8 text-sm">
                      {focusedInput ? "Type to search locations..." : "Select a field to search"}
                    </div>
                  )}

                  <div className="flex items-center gap-4 py-2 cursor-pointer border-t border-gray-50 pt-6 mt-auto">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
                    </div>
                    <span className="font-medium text-brand text-sm">Choose on map</span>
                  </div>
                </div>

                <div className="p-6 pt-2 border-t border-gray-50">
                  <SheetClose asChild>
                    <Button className="w-full h-14 bg-brand hover:bg-brand/90 text-white rounded-2xl font-bold text-lg active:scale-[0.98] transition-all">
                      Save
                    </Button>
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* ───── Area of Use ───── */}
        <div className="space-y-3">
          <h3 className="font-bold text-brand text-base">Area of Use</h3>
          <Sheet>
            <SheetTrigger asChild>
              <div className="space-y-3 cursor-pointer">
                {/* State selector row */}
                <div className="h-14 bg-white rounded-2xl flex items-center px-4 justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <img src="/assets/images/Icons/area_of_use.jpg" alt="state" className="w-5 h-5 object-contain" />
                    <span className={selectedState ? "text-sm text-brand font-medium" : "text-sm text-gray-400"}>
                      {selectedState || "Select the state"}
                    </span>
                  </div>
                  <ChevronDown className="w-5 h-5 text-gray-300" />
                </div>

                {/* Area selector row */}
                <div className="h-14 bg-white rounded-2xl flex items-center px-4 justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <img src="/assets/images/Icons/carbon_task-location.jpg" alt="area" className="w-5 h-5 object-contain" />
                    <span className={selectedAreas.length > 0 ? "text-sm text-brand font-medium" : "text-sm text-gray-400"}>
                      {selectedAreas.length > 0 ? selectedAreas.join(', ').substring(0, 30) + (selectedAreas.join(', ').length > 30 ? '...' : '') : "Select the area"}
                    </span>
                  </div>
                  <ChevronDown className="w-5 h-5 text-gray-300" />
                </div>
              </div>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-3xl p-0 h-[85vh] [&>button]:hidden">
              <div className="p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <SheetTitle className="text-xl font-bold text-brand">Select Area of Use</SheetTitle>
                  <SheetClose className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-brand"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </SheetClose>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4">
                  <Accordion type="single" collapsible className="space-y-4" value={accordionValue} onValueChange={setAccordionValue}>
                    {/* State Selection */}
                    <AccordionItem value="state" className="border-none">
                      <AccordionTrigger className="h-14 px-4 rounded-2xl border border-gray-200 hover:no-underline data-[state=open]:border-brand bg-white">
                        <div className="flex items-center gap-3">
                          <img src="/assets/images/Icons/area_of_use.jpg" alt="state" className="w-5 h-5 object-contain" />
                          <span className={selectedState ? "text-brand" : "text-gray-400"}>{selectedState || "Select the state"}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-0">
                        <div className="space-y-1">
                          {Object.keys(locationData).map(state => (
                            <button
                              key={state}
                              onClick={() => {
                                setSelectedState(state);
                                setSelectedAreas([]);
                                setAccordionValue("area");
                              }}
                              className={cn(
                                "w-full h-14 flex items-center justify-between px-4 rounded-xl",
                                selectedState === state
                                  ? "bg-[#D9D9D9] font-medium"
                                  : "hover:bg-gray-50"
                              )}
                            >
                              <span>{state}</span>
                              {selectedState === state && (
                                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-brand">
                                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </button>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Area Selection */}
                    <AccordionItem value="area" className="border-none" disabled={!selectedState}>
                      <AccordionTrigger className={cn(
                        "h-14 px-4 rounded-2xl border border-gray-200 hover:no-underline data-[state=open]:border-brand bg-white",
                        !selectedState && "opacity-50 cursor-not-allowed bg-gray-50"
                      )}>
                        <div className="flex items-center gap-3">
                          <img src="/assets/images/Icons/carbon_task-location.jpg" alt="area" className="w-5 h-5 object-contain" />
                          <span className={cn("truncate pr-4", selectedAreas.length > 0 ? "text-brand" : "text-gray-400")}>
                            {selectedAreas.length > 0 ? selectedAreas.join(', ') : "Select the area"}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-0">
                        <div className="space-y-1">
                          {currentAreas.map(area => (
                            <div
                              key={area}
                              onClick={() => toggleArea(area)}
                              className={cn(
                                "w-full h-14 flex items-center justify-between px-4 rounded-xl cursor-pointer",
                                selectedAreas.includes(area) ? "bg-[#D9D9D9]" : "hover:bg-gray-50"
                              )}
                            >
                              <span className="font-medium">{area}</span>
                              <Checkbox
                                checked={selectedAreas.includes(area)}
                                className="w-5 h-5 rounded border-gray-400 data-[state=checked]:bg-brand data-[state=checked]:border-brand"
                              />
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <SheetClose asChild>
                    <Button className="w-full h-14 bg-brand hover:bg-brand/90 text-white rounded-2xl font-bold text-lg active:scale-[0.98] transition-all">
                      Save
                    </Button>
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* ───── Rental Period & Time ───── */}
        <div className="space-y-3">
          <h3 className="font-bold text-brand text-base">Rental Period & Time</h3>
          <Sheet>
            <SheetTrigger asChild>
              <div className="cursor-pointer">
                {startDate && endDate ? (
                  <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img src="/assets/images/Icons/hugeicons_date-time.jpg" alt="date" className="w-6 h-6 object-contain shrink-0" />
                      <div className="flex flex-col">
                        <span className="font-semibold text-brand text-[15px] whitespace-nowrap">{format(startDate, "d MMMM, yyyy")}</span>
                        <span className="text-sm text-gray-400 mt-0.5 whitespace-nowrap">{formatTime(pickupTime)}</span>
                      </div>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                      <ArrowRightLeft className="w-4 h-4 text-gray-400" />
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-end">
                        <span className="font-semibold text-brand text-[15px] whitespace-nowrap">{format(endDate, "d MMMM, yyyy")}</span>
                        <span className="text-sm text-gray-400 mt-0.5 whitespace-nowrap">{formatTime(dropoffTime)}</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-300 shrink-0" />
                    </div>
                  </div>
                ) : (
                  <div className="h-14 bg-white rounded-2xl flex items-center px-4 justify-between shadow-sm">
                    <div className="flex items-center gap-3 text-gray-400">
                      <img src="/assets/images/Icons/hugeicons_date-time.jpg" alt="date" className="w-5 h-5 object-contain" />
                      <span className="text-sm">Select rental period</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300" />
                  </div>
                )}
              </div>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-3xl p-0 h-[85vh] [&>button]:hidden">
              <div className="p-6 h-full flex flex-col bg-white rounded-t-3xl">
                <div className="flex items-center justify-between mb-6">
                  <SheetTitle className="text-xl font-bold text-brand">Select Date & Time</SheetTitle>
                  <SheetClose className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-brand"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </SheetClose>
                </div>

                <div className="flex-1 overflow-y-auto space-y-8 pb-20">
                  {/* Calendar */}
                  <div className="flex justify-center w-full px-2">
                    <Calendar
                      mode="range"
                      selected={{ from: startDate, to: endDate }}
                      onSelect={(range) => {
                        setStartDate(range?.from);
                        setEndDate(range?.to);
                      }}
                      initialFocus
                      showOutsideDays={true}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      className="border-none p-0 w-full"
                      classNames={{
                        months: "flex flex-col w-full",
                        month: "space-y-4 w-full",
                        caption: "bg-white border border-gray-100 rounded-2xl h-14 relative flex items-center justify-center mb-6 shadow-sm",
                        caption_label: "text-base font-bold uppercase tracking-widest text-brand",
                        nav: "flex items-center",
                        nav_button: "h-8 w-8 bg-transparent p-0 hover:bg-transparent hover:text-brand text-gray-400 opacity-100 flex items-center justify-center",
                        nav_button_previous: "absolute left-4",
                        nav_button_next: "absolute right-4",
                        table: "w-full border-collapse space-y-1",
                        head_row: "grid grid-cols-7 w-full mb-2",
                        head_cell: "text-brand font-bold text-base w-full h-10 flex items-center justify-center p-0",
                        row: "grid grid-cols-7 w-full mt-2",
                        cell: "h-10 w-full p-0 relative flex items-center justify-center [&:has([aria-selected])]:bg-[#F4F7FC] first:[&:has([aria-selected])]:rounded-l-full last:[&:has([aria-selected])]:rounded-r-full [&:has([aria-selected].day-range-end)]:rounded-r-full [&:has([aria-selected].day-range-start)]:rounded-l-full focus-within:relative focus-within:z-20",
                        day: "h-10 w-10 p-0 font-semibold text-gray-500 aria-selected:opacity-100 rounded-full flex items-center justify-center hover:bg-gray-50 focus:bg-transparent transition-none",
                        day_range_start: "day-range-start !bg-brand !text-white rounded-full hover:!bg-brand hover:!text-white z-10 relative font-bold ring-0 focus:ring-0",
                        day_range_end: "day-range-end !bg-brand !text-white rounded-full hover:!bg-brand hover:!text-white z-10 relative font-bold ring-0 focus:ring-0",
                        day_range_middle: "bg-transparent !text-brand hover:bg-transparent hover:!text-brand rounded-none font-semibold",
                        day_selected: "bg-transparent text-brand hover:bg-transparent hover:text-brand focus:bg-transparent focus:text-brand font-bold ring-0 focus:ring-0",
                        day_today: "text-brand font-bold bg-transparent",
                        day_outside: "text-gray-300 opacity-50",
                        day_disabled: "text-gray-300 opacity-50",
                        day_hidden: "invisible",
                      }}
                    />
                  </div>

                  {/* Time Sliders */}
                  <div className="space-y-14 px-4 pt-10">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-brand w-16">Pick-up</span>
                      <div className="flex-1 pt-6 pb-2">
                        <TimeSlider
                          value={[pickupTime]}
                          max={1440}
                          step={15}
                          onValueChange={(val) => setPickupTime(val[0])}
                          formatLabel={formatTime}
                          label="Pickup Time"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-brand w-16">Drop-off</span>
                      <div className="flex-1 pt-6 pb-2">
                        <TimeSlider
                          value={[dropoffTime]}
                          max={1440}
                          step={15}
                          onValueChange={(val) => setDropoffTime(val[0])}
                          formatLabel={formatTime}
                          label="Dropoff Time"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-auto bg-white sticky bottom-0 z-50">
                  <SheetClose asChild>
                    <Button className="w-full h-14 bg-brand hover:bg-brand/90 text-white rounded-2xl font-bold text-lg active:scale-[0.98] transition-all">
                      Save
                    </Button>
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* ───── Add-ons ───── */}
        <div className="space-y-3">
          <h3 className="font-bold text-brand text-base">Add-ons</h3>

          <div className="space-y-3">
            <RadioGroup
              value={withDriver ? "professional" : selfDrive ? "self" : ""}
              onValueChange={(val) => {
                if (val === "professional") {
                  setWithDriver(true);
                  setSelfDrive(false);
                } else if (val === "self") {
                  setSelfDrive(true);
                  setWithDriver(false);
                }
              }}
              className="space-y-3 gap-0"
            >
              {/* Professional Driver */}
              <label 
                htmlFor="r-professional"
                className="flex items-center justify-between bg-white h-14 px-4 rounded-2xl shadow-sm cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <img src="/assets/images/Icons/healthicons_truck-driver-outline.jpg" alt="driver" className="w-5 h-5 object-contain" />
                  <span className="text-sm text-brand">Professional Driver</span>
                </div>
                <RadioGroupItem
                  value="professional"
                  id="r-professional"
                  className="w-5 h-5 border-gray-300 text-brand data-[state=checked]:border-brand"
                />
              </label>

              {/* Self Drive */}
              <label
                htmlFor="r-self"
                className="flex items-center justify-between bg-white h-14 px-4 rounded-2xl shadow-sm cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <img src="/assets/images/Icons/hugeicons_steering.jpg" alt="self-drive" className="w-5 h-5 object-contain" />
                  <span className="text-sm text-brand">Self Drive</span>
                </div>
                <RadioGroupItem
                  value="self"
                  id="r-self"
                  className="w-5 h-5 border-gray-300 text-brand data-[state=checked]:border-brand"
                />
              </label>
            </RadioGroup>

            {/* Security & Escort */}
            <div className="flex items-center justify-between bg-white h-14 px-4 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3">
                <img src="/assets/images/Icons/hugeicons_security-check.jpg" alt="security" className="w-5 h-5 object-contain" />
                <span className="text-sm text-brand">Security & Escort</span>
              </div>
              <Checkbox
                checked={withSecurity}
                onCheckedChange={(c) => setWithSecurity(c as boolean)}
                className="w-5 h-5 rounded border-gray-300 data-[state=checked]:bg-brand data-[state=checked]:border-brand"
              />
            </div>
          </div>
        </div>

        {/* ───── Additional Notes ───── */}
        <div className="space-y-3">
          <h3 className="font-bold text-brand text-base">Additional Notes</h3>
          <Textarea
            placeholder="Any special requests or notes"
            className="min-h-[120px] rounded-2xl border-none bg-white resize-none p-4 text-sm text-gray-500 placeholder:text-gray-400 shadow-sm focus-visible:ring-0"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

      </div>

      {/* ───── Confirmation Dialog ───── */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent
          className="sm:max-w-[320px] rounded-2xl p-0 gap-0 overflow-hidden [&>button]:hidden border-none"
          style={{ boxShadow: '0 24px 48px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.08)' }}
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <div className="flex flex-col items-center justify-center px-8 pt-10 pb-7 text-center">
            {/* Car icon with success badge */}
            <div
              className="relative mb-7"
              style={{ animation: 'bkConfirmScale 0.45s ease-out 0.15s both' }}
            >
              <div
                className="flex items-center justify-center"
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(145deg, #fafbfc 0%, #f0f2f5 100%)',
                  border: '2px solid rgba(16,22,35,0.06)',
                }}
              >
                <img
                  src="/assets/images/Icons/lineicons_car-4.jpg"
                  alt="Car"
                  style={{ width: 40, height: 40, objectFit: 'contain' }}
                />
              </div>

              {/* Green check badge */}
              <div
                className="absolute flex items-center justify-center"
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  background: '#22c55e',
                  bottom: -1,
                  right: -1,
                  border: '2.5px solid #fff',
                  boxShadow: '0 2px 8px rgba(34,197,94,0.35)',
                  animation: 'bkConfirmBounce 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.45s both',
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h2
              className="text-xl font-bold text-brand mb-2"
              style={{ animation: 'bkConfirmFadeUp 0.4s ease-out 0.3s both' }}
            >
              Booking Confirmed
            </h2>

            {/* Subtitle */}
            <p
              className="text-sm text-gray-400 leading-relaxed"
              style={{
                maxWidth: 210,
                animation: 'bkConfirmFadeUp 0.4s ease-out 0.42s both',
              }}
            >
              Your car rental has been booked successfully
            </p>
          </div>

          {/* Divider + OK button */}
          <div
            style={{
              borderTop: '1px solid #f0f0f0',
              animation: 'bkConfirmFadeUp 0.3s ease-out 0.55s both',
            }}
          >
            <button
              onClick={() => navigate('/bookings')}
              className="w-full text-brand font-semibold hover:bg-gray-50 active:bg-gray-100 transition-colors"
              style={{
                height: 52,
                fontSize: 16,
                cursor: 'pointer',
                background: 'transparent',
                border: 'none',
              }}
            >
              OK
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Booking confirmation animations */}
      <style>{`
        @keyframes bkConfirmScale {
          0% { opacity: 0; transform: scale(0.3); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes bkConfirmBounce {
          0% { opacity: 0; transform: scale(0); }
          60% { transform: scale(1.3); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes bkConfirmFadeUp {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ───── Bottom CTA ───── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-5 pb-8 z-20">
        <Button
          onClick={handleBookingSubmit}
          disabled={isProcessing}
          className="w-full bg-brand hover:bg-brand/90 text-white h-14 rounded-2xl font-bold text-base active:scale-[0.98] transition-all"
        >
          {isProcessing ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Processing</span>
            </div>
          ) : (
            "Confirm Booking"
          )}
        </Button>
      </div>
    </div>
  );
}