import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Onboarding
import { SplashScreen } from "./pages/SplashScreen";
import { WelcomeScreen } from "./pages/WelcomeScreen";
import { SignupScreen } from "./pages/SignupScreen";
import { LoginScreen } from "./pages/LoginScreen";
import { OTPScreen } from "./pages/OTPScreen";
import { SignupSuccessScreen } from "./pages/SignupSuccessScreen";
import { CompleteProfileScreen } from "./pages/CompleteProfileScreen";
import { IdentityVerificationScreen } from "./pages/IdentityVerificationScreen";
import { VerificationPendingScreen } from "./pages/VerificationPendingScreen";

// Main App
import { HomeScreen } from "./pages/HomeScreen";
import { BrandsScreen } from "./pages/BrandsScreen";
import { BrandCarsScreen } from "./pages/BrandCarsScreen";
import { SearchScreen } from "./pages/SearchScreen";
import { CarListingScreen } from "./pages/CarListingScreen";
import { CarDetailsScreen } from "./pages/CarDetailsScreen";
import { BookingScreen } from "./pages/BookingScreen";
import { BookingSummaryScreen } from "./pages/BookingSummaryScreen";
import { PaymentScreen } from "./pages/PaymentScreen";
import { BookingConfirmedScreen } from "./pages/BookingConfirmedScreen";
import { BookingsScreen } from "./pages/BookingsScreen";
import { BookingDetailsScreen } from "./pages/BookingDetailsScreen";
import { ActiveTripScreen } from "./pages/ActiveTripScreen";
import { HostScreen } from "./pages/HostScreen";
import { ProfileScreen } from "./pages/ProfileScreen";
import { ListCarScreen } from "./pages/ListCarScreen";
import { EditProfileScreen } from "./pages/EditProfileScreen";
import { InstantRideScreen } from "./pages/InstantRideScreen";
import { InstantRideDetailsScreen } from "./pages/InstantRideDetailsScreen";
import { SecurityScreen } from "./pages/SecurityScreen";
import { AppSettingsScreen } from "./pages/AppSettingsScreen";
import { ReferralScreen } from "./pages/ReferralScreen";
import { PaymentMethodsScreen } from "./pages/PaymentMethodsScreen";
import { AddressesScreen } from "./pages/AddressesScreen";
import { NotificationsScreen } from "./pages/NotificationsScreen";
import { ScrollToTop } from "./components/ScrollToTop";

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen w-full bg-white text-brand font-sans">
        <Routes>
          {/* Onboarding Flow */}
          <Route path="/" element={<SplashScreen />} />
          <Route path="/welcome" element={<WelcomeScreen />} />
          <Route path="/signup" element={<SignupScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/verify-otp" element={<OTPScreen />} />
          <Route path="/signup-success" element={<SignupSuccessScreen />} />
          <Route path="/complete-profile" element={<CompleteProfileScreen />} />
          <Route path="/verify-identity" element={<IdentityVerificationScreen />} />
          <Route path="/verification-pending" element={<VerificationPendingScreen />} />

          {/* Main App */}
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/instant-ride" element={<InstantRideScreen />} />
          <Route path="/brands" element={<BrandsScreen />} />
          <Route path="/brand/:id" element={<BrandCarsScreen />} />
          <Route path="/search" element={<SearchScreen />} />
          <Route path="/cars/:type" element={<CarListingScreen />} />
          <Route
            path="/car/:id"
            element={<CarDetailsScreen />}
          />
          <Route
            path="/booking/:id"
            element={<BookingScreen />}
          />
          <Route
            path="/booking-summary/:id"
            element={<BookingSummaryScreen />}
          />
          <Route
            path="/payment/:id"
            element={<PaymentScreen />}
          />
          <Route
            path="/booking-confirmed"
            element={<BookingConfirmedScreen />}
          />

          {/* Bookings */}
          <Route
            path="/bookings"
            element={<BookingsScreen />}
          />
          <Route
            path="/booking-details/:id"
            element={<BookingDetailsScreen />}
          />
          <Route
            path="/instant-ride-details/:id"
            element={<InstantRideDetailsScreen />}
          />
          <Route
            path="/trip/:id"
            element={<ActiveTripScreen />}
          />

          {/* Host */}
          <Route path="/host" element={<HostScreen />} />
          <Route path="/list-car" element={<ListCarScreen />} />

          {/* Profile */}
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/edit-profile" element={<EditProfileScreen />} />
          <Route path="/security" element={<SecurityScreen />} />
          <Route path="/settings" element={<AppSettingsScreen />} />
          <Route path="/referral" element={<ReferralScreen />} />
          <Route path="/payment-methods" element={<PaymentMethodsScreen />} />
          <Route path="/addresses" element={<AddressesScreen />} />
          <Route path="/notifications" element={<NotificationsScreen />} />

          {/* Fallback */}
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </div>
    </Router >
  );
}