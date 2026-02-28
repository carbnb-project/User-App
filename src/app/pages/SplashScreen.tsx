import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Car } from 'lucide-react';

export function SplashScreen() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Slight delay to ensure the transition works on mount
    const progressTimer = setTimeout(() => {
      setProgress(100);
    }, 100);

    const navTimer = setTimeout(() => {
      navigate('/welcome');
    }, 3000);

    return () => {
      clearTimeout(progressTimer);
      clearTimeout(navTimer);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="flex flex-col items-center gap-10 animate-in fade-in duration-700">
        <div className="flex flex-col items-center">
          <img
            src="/assets/images/Logo.jpg"
            alt="RideNaira"
            className="w-48 h-auto object-contain"
          />
        </div>

        <div className="w-48 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand rounded-full transition-all duration-[2800ms] ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}