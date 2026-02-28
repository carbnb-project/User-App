# RideNaira - Car Rental Marketplace

## Project Overview
RideNaira is a peer-to-peer car rental marketplace (like Turo/Airbnb for cars) targeting the Nigerian market. Users can browse, book, and rent cars with options for self-drive or with a driver.

## Tech Stack
- **React** with TypeScript
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Radix UI** components
- **Lucide React** for icons
- **Date-fns** for date formatting

## Project Structure

```
/src
  /app
    /components
      - BottomNav.tsx          # Bottom navigation bar
      /ui                      # Reusable UI components (Radix)
    /pages
      # Onboarding
      - SplashScreen.tsx
      - WelcomeScreen.tsx      # 3-slide carousel
      - GetStartedScreen.tsx
      - SignupScreen.tsx
      - LoginScreen.tsx
      - OTPScreen.tsx
      - SignupSuccessScreen.tsx
      
      # Main App
      - HomeScreen.tsx         # Car listings with search/filters
      - SearchScreen.tsx       # Search functionality
      - CarDetailsScreen.tsx   # Full car details
      - BookingScreen.tsx      # Date selection, options
      - BookingSummaryScreen.tsx
      - PaymentScreen.tsx
      - BookingConfirmedScreen.tsx
      
      # Bookings
      - BookingsScreen.tsx     # List of bookings (tabs)
      - ActiveTripScreen.tsx   # Active trip tracking
      
      # Host
      - HostScreen.tsx         # Host dashboard (empty state)
      - ListCarScreen.tsx      # List a car form
      
      # Profile
      - ProfileScreen.tsx      # User profile & settings
      
    - App.tsx                  # Main router configuration
    
  /data
    - mockData.ts             # Mock cars, users, bookings data
    
  /styles
    - index.css
    - theme.css
    - fonts.css
    - tailwind.css
```

## Key Features

### Complete User Flows
1. **Onboarding**: Splash → Welcome → Sign Up → OTP → Success
2. **Browse & Book**: Home → Car Details → Booking → Payment → Confirmation
3. **Active Trip**: Track rental in progress with map view
4. **Host**: List your car for rental
5. **Profile**: Manage account and settings

### Design System
- **Primary CTA**: Black (#000000)
- **Background**: White (#FFFFFF)
- **Text**: Dark for headings, gray for secondary
- **Currency**: Nigerian Naira (₦)
- **Mobile-First**: Max-width 512px (lg breakpoint)

## Mock Data
All data is stored in `/src/data/mockData.ts`:
- 8 sample cars (various brands and prices)
- Mock user data
- Sample bookings (upcoming & completed)
- Nigerian cities list

## Navigation Structure
- **Bottom Nav** (Main screens): Explore, Bookings, Host, Profile
- **Routes**: All screens accessible via React Router

## Running the Project
```bash
npm install
npm run dev
```

## Notes
- Frontend-only (no backend integration)
- Mock data for demonstration
- Fully responsive mobile-first design
- All images from Unsplash
