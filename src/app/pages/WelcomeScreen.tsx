import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronsRight } from 'lucide-react';
import { Button } from '../components/ui/button';

const slides = [
  {
    id: 1,
    image: '/assets/images/Onboarding1.jpg',
    title: 'Your Car, Your Way.',
    description: 'Rent, ride, or drive; choose from a wide range of cars for any moment, from everyday rides to luxury drives.',
  },
  {
    id: 2,
    image: '/assets/images/Onboarding2.jpg',
    title: 'Smart, Flexible and Hassle Free.',
    description: 'Book instantly or schedule ahead, self-drive or ride with a driver. We make every trip simple, secure, and seamless.',
  },
  {
    id: 3,
    image: '/assets/images/Onboarding3.jpg',
    title: 'Find Your Perfect Ride Today.',
    description: 'Explore cars near you, pick your style, and enjoy every moment on the move.',
  },
];

export function WelcomeScreen() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate('/signup');
    }
  };

  const handleSkip = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-forwards">
      {/* Skip button - Positioned below status bar */}
      <div className="flex justify-end p-6 pt-safe-top">
        <button
          onClick={handleSkip}
          className="text-gray-400 hover:text-brand transition-colors p-2"
        >
          <ChevronsRight className="w-8 h-8" strokeWidth={1.5} />
        </button>
      </div>

      {/* Slide content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="relative overflow-hidden rounded-2xl mb-8 w-full max-w-[400px] aspect-square shadow-md mx-auto">
            <img
              key={currentSlide}
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
              className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-500"
            />
          </div>

          <div className="space-y-3 text-center px-4">
            <h2 className="text-xl md:text-2xl font-bold text-brand animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 fill-mode-forwards tracking-tight whitespace-nowrap">
              {slides[currentSlide].title}
            </h2>

            <p className="text-gray-500 text-sm md:text-base leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200 fill-mode-forwards max-w-[280px] mx-auto">
              {slides[currentSlide].description}
            </p>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 my-8">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide
                  ? 'w-8 bg-brand'
                  : 'w-2 bg-gray-300'
                  }`}
              />
            ))}
          </div>

          <Button
            onClick={handleNext}
            className="w-full bg-brand hover:brightness-90 text-white h-14 rounded-xl text-lg font-semibold shadow-lg transition-transform active:scale-95"
          >
            {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
}