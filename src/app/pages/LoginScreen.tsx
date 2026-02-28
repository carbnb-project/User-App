import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Eye, EyeOff, Lock, User, Fingerprint } from 'lucide-react';

export function LoginScreen() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header Image */}
      <div className="h-[35vh] w-full relative">
        <img
          src="/assets/images/Onboarding4.jpg"
          alt="Login Header"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
      </div>

      {/* Content */}
      <div className="flex-1 bg-background -mt-8 rounded-t-3xl relative px-6 py-8">
        <h1 className="text-2xl font-bold text-center text-brand mb-8">
          Welcome Back!
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email/Phone */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold text-brand">
              Email or Phone Number
            </Label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="email"
                type="text"
                placeholder="Enter your email or phone number"
                className="pl-12 h-14 rounded-2xl bg-white border-gray-100 focus:bg-white transition-all border shadow-sm"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-semibold text-brand">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className="pl-12 pr-12 h-14 rounded-2xl bg-white border-gray-100 focus:bg-white transition-all border shadow-sm"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            <div className="flex justify-end">
              <button type="button" className="text-sm font-medium text-gray-500 hover:text-brand">
                Forgot password?
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-2">
            <Button
              type="submit"
              className="flex-1 h-14 text-base font-semibold bg-brand hover:brightness-90 text-white rounded-2xl active:scale-[0.98] transition-all"
            >
              Log In
            </Button>
            <button
              type="button"
              className="w-14 h-14 flex items-center justify-center border border-gray-200 rounded-2xl hover:bg-gray-50 transition-all active:scale-[0.98]"
            >
              <Fingerprint className="w-6 h-6 text-brand" strokeWidth={1.5} />
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 py-4">
            <div className="flex-1 h-[1px] bg-[#BAB2B2]"></div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">OR</span>
            <div className="flex-1 h-[1px] bg-[#BAB2B2]"></div>
          </div>

          {/* Social Login */}
          <div className="flex justify-center gap-6">
            <button type="button" className="p-2 hover:bg-gray-50 rounded-full transition-colors">
              <GoogleIcon className="w-8 h-8" />
            </button>
            <button type="button" className="p-2 hover:bg-gray-50 rounded-full transition-colors">
              <AppleIcon className="w-8 h-8" />
            </button>
          </div>

          {/* Footer */}
          <p className="text-center text-gray-600 text-sm">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="font-bold text-brand hover:underline"
            >
              Sign up
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.45-1.66 4.67-1.54 1.85.1 3.04.99 3.65 1.84-2.77 1.4-2.24 5.36.93 6.64-.6 1.74-1.36 3.49-2.53 4.69l-.6.6zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}