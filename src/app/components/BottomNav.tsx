import { Search, Calendar, PlusCircle, User, Car } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'explore', label: 'Explore', icon: Search, path: '/home' },
    { id: 'bookings', label: 'Bookings', icon: Calendar, path: '/bookings' },
    { id: 'host', label: 'Host', icon: PlusCircle, path: '/host' },
    { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
  ];

  return (
    <>
      {/* Floating Action Button - Only on Home */}
      {location.pathname === '/home' && (
        <button
          className="fixed bottom-24 right-6 w-14 h-14 bg-brand rounded-full flex items-center justify-center shadow-lg z-50 hover:bg-brand-light transition-colors"
          onClick={() => navigate('/instant-ride')}
        >
          <img
            src="/assets/images/Icons/float-icon.jpg"
            alt="Instant Ride"
            className="w-8 h-8 object-contain"
          />
        </button>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-inset-bottom z-50">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center justify-center gap-1 flex-1 py-2"
              >
                <Icon
                  className={`w-6 h-6 ${isActive ? 'stroke-black' : 'stroke-gray-400'}`}
                  fill={isActive ? 'none' : 'none'} // Kept outline style for consistency
                  strokeWidth={2}
                />
                <span className={`text-xs ${isActive ? 'text-black font-medium' : 'text-gray-400'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}