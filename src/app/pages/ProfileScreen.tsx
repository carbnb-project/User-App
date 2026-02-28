import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  SquarePen,
  CreditCard,
  Bell,
  MapPin,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Star,
  Settings,
  Gift,
} from 'lucide-react';
import { mockUser } from '../../data/mockData';
import { BottomNav } from '../components/BottomNav';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { SupportModal } from '../components/SupportModal';

export function ProfileScreen() {
  const navigate = useNavigate();
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  const settingsItems = [
    {
      id: 'edit-profile',
      label: 'Edit Profile',
      subtitle: 'Update your personal information',
      icon: SquarePen,
      onClick: () => navigate('/edit-profile'),
    },
    {
      id: 'payment-method',
      label: 'Payment Method',
      subtitle: 'Manage cards and payment options',
      icon: CreditCard,
      onClick: () => navigate('/payment-methods'),
    },
    {
      id: 'notifications',
      label: 'Notifications',
      subtitle: 'Manage your notification preferences',
      icon: Bell,
      onClick: () => navigate('/notifications'),
    },
    {
      id: 'addresses',
      label: 'Addresses',
      subtitle: 'Manage your saved addresses',
      icon: MapPin,
      onClick: () => navigate('/addresses'),
    },
    {
      id: 'privacy-security',
      label: 'Privacy & Security',
      subtitle: 'Manage your privacy settings',
      icon: Shield,
      onClick: () => navigate('/security'),
    },
    {
      id: 'app-settings',
      label: 'App Settings',
      subtitle: 'Manage your app preferences',
      icon: Settings,
      onClick: () => navigate('/settings'),
    },
    {
      id: 'refer-earn',
      label: 'Refer & Earn',
      subtitle: 'Earn N500 for every friend you invite',
      icon: Gift,
      onClick: () => navigate('/referral'),
    },
    {
      id: 'help-support',
      label: 'Help & Support',
      subtitle: 'Get help and contact support',
      icon: HelpCircle,
      onClick: () => setIsSupportOpen(true),
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-32 font-sans text-brand">
      {/* Header */}
      <div className="px-6 pt-safe-top pb-4">
        <h1 className="text-2xl font-bold text-brand">Profile</h1>
      </div>

      <div className="px-6 space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-8 shadow-sm flex flex-col items-center">
          <div className="relative mb-4">
            <Avatar className="w-24 h-24 border-4 border-white shadow-md">
              <AvatarImage src={mockUser.avatar} className="object-cover" />
              <AvatarFallback className="text-2xl">{mockUser.name[0]}</AvatarFallback>
            </Avatar>
          </div>

          <h2 className="text-xl font-bold text-brand mb-2">{mockUser.name}</h2>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-star stroke-star" />
              <span className="text-base font-bold">{mockUser.rating}</span>
            </div>
            {mockUser.isVerified && (
              <div className="bg-brand text-white text-[10px] font-bold px-3 py-1 rounded-md tracking-wider uppercase">
                Verified
              </div>
            )}
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-3 w-full mt-8">
            <div className="bg-white border border-gray-100 rounded-xl p-3 text-center flex flex-col justify-center min-h-[85px]">
              <p className="text-lg font-bold text-brand">{mockUser.tripsCount}</p>
              <p className="text-xs text-gray-500 font-medium leading-tight mt-1">
                Trips<br />Completed
              </p>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-3 text-center flex flex-col justify-center min-h-[85px]">
              <p className="text-lg font-bold text-brand">{mockUser.memberSince}</p>
              <p className="text-xs text-gray-500 font-medium leading-tight mt-1">
                Member<br />Since
              </p>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-3 text-center flex flex-col justify-center min-h-[85px]">
              <p className="text-lg font-bold text-brand">{mockUser.hostRating}</p>
              <p className="text-xs text-gray-500 font-medium leading-tight mt-1">
                Host(s)<br />Rating
              </p>
            </div>
          </div>
        </div>

        {/* Settings List */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-brand tracking-tight">Settings</h3>

          <div className="space-y-3">
            {settingsItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={item.onClick}
                  className="w-full bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm hover:bg-gray-50 transition-colors group active:scale-[0.98]"
                >
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-10 h-10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-brand" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-base font-bold text-brand">{item.label}</p>
                      <p className="text-xs text-gray-400 font-medium">{item.subtitle}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-400 transition-colors" strokeWidth={2} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Sign Out */}
        <button
          onClick={() => navigate('/')}
          className="w-full bg-white rounded-2xl h-[72px] flex items-center justify-center gap-3 shadow-sm hover:bg-gray-50 transition-colors group mt-2 active:scale-[0.98]"
        >
          <LogOut className="w-5 h-5 text-brand" strokeWidth={2} />
          <span className="text-base font-bold text-brand">Sign Out</span>
        </button>
      </div>

      <SupportModal isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} />
      <BottomNav />
    </div>
  );
}