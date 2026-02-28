// Mock data for RideNaira

export interface Car {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  image: string;
  images: string[];
  pricePerDay: number;
  rating: number;
  reviewCount: number;
  location: string;
  host: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    joinedDate: string;
  };
  overview: string;
  specs: {
    seats: number;
    transmission: 'Automatic' | 'Manual';
    fuelType: string;
    doors: number;
    maxSpeed: string;
    luggage: number;
  };
  features: string[];
  driverAvailable: boolean;
  deliveryAvailable: boolean;
  reviewerAvatars: string[];
}

export interface Booking {
  id: string;
  bookingCode: string; // New field for Booking Code (e.g., CB-2025-001)
  carId: string;
  userId: string;
  startDate: string;
  endDate: string;
  withDriver: boolean;
  deliveryOption: 'pickup' | 'delivery';
  status: 'upcoming' | 'active' | 'completed' | 'cancelled' | 'confirmed' | 'awaiting_confirm' | 'ongoing' | 'paid';
  totalPrice: number;
  deliveryAddress?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  tripsCount: number;
  rating: number;
  memberSince: string;
  hostRating: number;
  isVerified: boolean;
}

export interface Notification {
  id: string;
  type: 'ride' | 'promo' | 'system' | 'wallet';
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  icon?: string;
}

// Mock car brands
export const carBrands = [
  { id: '1', name: 'BMW', logo: 'bmw' },
  { id: '2', name: 'Ford', logo: 'ford' },
  { id: '3', name: 'Mercedes', logo: 'mercedes' },
  { id: '4', name: 'Toyota', logo: 'toyota' },
  { id: '5', name: 'Hyundai', logo: 'hyundai' },
  { id: '6', name: 'Tesla', logo: 'tesla' },
  { id: '7', name: 'Lexus', logo: 'lexus' },
  { id: '8', name: 'Audi', logo: 'audi' },
  { id: '9', name: 'Honda', logo: 'honda' },
];

// Mock cars data
export const mockCars: Car[] = [
  {
    id: '1',
    name: 'Mercedes-Benz GLE',
    brand: 'Mercedes',
    model: 'GLE 450',
    year: 2023,
    image: '/assets/images/cars/Car2.jpg',
    images: [
      '/assets/images/cars/Car2.jpg',
      'https://images.unsplash.com/photo-1617654112368-307921291f42?w=800',
      'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800',
    ],
    pricePerDay: 45000,
    rating: 4.9,
    reviewCount: 128,
    location: 'Lagos, NG',
    host: {
      id: 'h1',
      name: 'Chidi Okafor',
      avatar: 'https://i.pravatar.cc/150?img=11',
      rating: 4.9,
      joinedDate: '2023-01-15',
    },
    overview: 'Experience the pinnacle of luxury and performance with the Mercedes-Benz GLE 450. Featuring a spacious interior, advanced technology, and a smooth ride, this SUV is perfect for both city driving and long-distance travel.',
    specs: {
      seats: 5,
      transmission: 'Automatic',
      fuelType: 'Petrol',
      doors: 4,
      maxSpeed: '155mph',
      luggage: 3,
    },
    features: ['GPS Navigation', 'Bluetooth', 'Leather Seats', 'Sunroof', 'Parking Sensors'],
    driverAvailable: true,
    deliveryAvailable: true,
    reviewerAvatars: [
      'https://i.pravatar.cc/100?img=1',
      'https://i.pravatar.cc/100?img=5',
      'https://i.pravatar.cc/100?img=8',
    ],
  },
  {
    id: '2',
    name: 'BMW X5',
    brand: 'BMW',
    model: 'X5 M50i',
    year: 2024,
    image: '/assets/images/cars/Car2.jpg',
    images: [
      '/assets/images/cars/Car2.jpg',
      'https://images.unsplash.com/photo-1617531653520-bd466c5bd19b?w=800',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800',
    ],
    pricePerDay: 50000,
    rating: 4.8,
    reviewCount: 95,
    location: 'Abuja, NG',
    host: {
      id: 'h2',
      name: 'Amaka Johnson',
      avatar: 'https://i.pravatar.cc/150?img=32',
      rating: 4.8,
      joinedDate: '2022-11-20',
    },
    overview: 'The BMW X5 M50i combines sports car performance with SUV practicality. Its powerful engine and precise handling make every drive exhilarating, while the premium interior ensures maximum comfort.',
    specs: {
      seats: 5,
      transmission: 'Automatic',
      fuelType: 'Petrol',
      doors: 4,
      maxSpeed: '155mph',
      luggage: 3,
    },
    features: ['GPS Navigation', 'Bluetooth', 'Leather Seats', 'Premium Sound', 'Heated Seats'],
    driverAvailable: true,
    deliveryAvailable: true,
    reviewerAvatars: [
      'https://i.pravatar.cc/100?img=12',
      'https://i.pravatar.cc/100?img=15',
      'https://i.pravatar.cc/100?img=22',
    ],
  },
  {
    id: '3',
    name: 'Toyota Land Cruiser',
    brand: 'Toyota',
    model: 'Prado',
    year: 2023,
    image: '/assets/images/cars/Car2.jpg',
    images: [
      '/assets/images/cars/Car2.jpg',
      'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800',
      'https://images.unsplash.com/photo-1623928662481-86598ea215e8?w=800',
    ],
    pricePerDay: 60000,
    rating: 5.0,
    reviewCount: 42,
    location: 'Victoria Island, Lagos',
    host: {
      id: 'h2',
      name: 'RideNaira Logistics',
      avatar: 'https://i.pravatar.cc/150?img=53',
      rating: 4.7,
      joinedDate: '2022-11-20',
    },
    overview: 'Built for any terrain, the Toyota Land Cruiser Prado offers unmatched reliability and off-road capability without compromising on luxury. Ideal for executive travel and family adventures alike.',
    specs: {
      seats: 7,
      transmission: 'Automatic',
      fuelType: 'Diesel',
      doors: 4,
      maxSpeed: '120mph',
      luggage: 4,
    },
    features: ['GPS', 'Bluetooth', 'Leather', 'Third Row Seating', '4WD'],
    driverAvailable: true,
    deliveryAvailable: true,
    reviewerAvatars: [
      'https://i.pravatar.cc/100?img=33',
      'https://i.pravatar.cc/100?img=47',
      'https://i.pravatar.cc/100?img=49',
    ],
  },
  {
    id: '4',
    name: 'Lexus LX 570',
    brand: 'Lexus',
    model: 'LX 570',
    year: 2021,
    image: '/assets/images/cars/Car2.jpg',
    images: [
      '/assets/images/cars/Car2.jpg',
      '/assets/images/cars/Car4.jpg',
    ],
    pricePerDay: 75000,
    rating: 4.9,
    reviewCount: 67,
    location: 'Ikoyi, Lagos',
    host: {
      id: 'h3',
      name: 'Premium Autos',
      avatar: 'https://i.pravatar.cc/150?img=60',
      rating: 4.8,
      joinedDate: '2023-03-10',
    },
    overview: 'The Lexus LX 570 is the definition of commanding luxury. With a powerful V8 engine and a lavish interior, it provides a serene and powerful driving experience for discerning passengers.',
    specs: {
      seats: 7,
      transmission: 'Automatic',
      fuelType: 'Petrol',
      doors: 4,
      maxSpeed: '137mph',
      luggage: 4,
    },
    features: ['Luxury Interior', 'Rear Entertainment', 'Cool Box', 'Sunroof'],
    driverAvailable: true,
    deliveryAvailable: true,
    reviewerAvatars: [
      'https://i.pravatar.cc/100?img=3',
      'https://i.pravatar.cc/100?img=9',
      'https://i.pravatar.cc/100?img=16',
    ],
  },
  {
    id: '5',
    name: 'Range Rover Sport',
    brand: 'Range Rover',
    model: 'Sport HSE',
    year: 2022,
    image: '/assets/images/cars/Car2.jpg',
    images: [
      '/assets/images/cars/Car2.jpg',
      '/assets/images/cars/Car5.jpg',
    ],
    pricePerDay: 80000,
    rating: 4.7,
    reviewCount: 34,
    location: 'Maitama, Abuja',
    host: {
      id: 'h1',
      name: 'Chidi Okafor',
      avatar: 'https://i.pravatar.cc/150?img=11',
      rating: 4.9,
      joinedDate: '2023-01-15',
    },
    overview: 'Dynamic, agile, and responsive. The Range Rover Sport is designed to be driven. With its contemporary feel and advanced technology, it delivers a confident and connected drive.',
    specs: {
      seats: 5,
      transmission: 'Automatic',
      fuelType: 'Petrol',
      doors: 4,
      maxSpeed: '150mph',
      luggage: 3,
    },
    features: ['Panoramic Roof', 'Meridian Sound', 'Air Suspension'],
    driverAvailable: true,
    deliveryAvailable: false,
    reviewerAvatars: [
      'https://i.pravatar.cc/100?img=25',
      'https://i.pravatar.cc/100?img=36',
      'https://i.pravatar.cc/100?img=41',
    ],
  },
  {
    id: '6',
    name: 'Audi Q7',
    brand: 'Audi',
    model: 'Q7 Premium',
    year: 2023,
    image: '/assets/images/cars/Car2.jpg',
    images: [
      '/assets/images/cars/Car2.jpg',
    ],
    pricePerDay: 42000,
    rating: 4.8,
    reviewCount: 89,
    location: 'Abuja, NG',
    host: {
      id: 'h6',
      name: 'Funmi Adeyemi',
      avatar: 'https://i.pravatar.cc/150?img=44',
      rating: 4.8,
      joinedDate: '2023-04-22',
    },
    overview: 'The Audi Q7 offers an impressive combination of performance, style, and technology. With its room interior and advanced driver assistance systems, it is the perfect family SUV.',
    specs: {
      seats: 7,
      transmission: 'Automatic',
      fuelType: 'Petrol',
      doors: 4,
      maxSpeed: '130mph',
      luggage: 4,
    },
    features: ['GPS Navigation', 'Bluetooth', 'Leather Seats', 'Third Row Seating', 'Panoramic Roof'],
    driverAvailable: true,
    deliveryAvailable: true,
    reviewerAvatars: [
      'https://i.pravatar.cc/100?img=7',
      'https://i.pravatar.cc/100?img=18',
      'https://i.pravatar.cc/100?img=28',
    ],
  },
  {
    id: '7',
    name: 'Honda Accord',
    brand: 'Honda',
    model: 'Accord Sport',
    year: 2024,
    image: '/assets/images/cars/Car2.jpg',
    images: [
      '/assets/images/cars/Car2.jpg',
    ],
    pricePerDay: 18000,
    rating: 4.6,
    reviewCount: 167,
    location: 'Lagos, NG',
    host: {
      id: 'h7',
      name: 'Emeka Obi',
      avatar: 'https://i.pravatar.cc/150?img=57',
      rating: 4.7,
      joinedDate: '2023-05-18',
    },
    overview: 'The Honda Accord sets the standard for midsize sedans with its blend of performance, comfort, and efficiency. A reliable choice for business trips and daily commutes.',
    specs: {
      seats: 5,
      transmission: 'Automatic',
      fuelType: 'Petrol',
      doors: 4,
      maxSpeed: '125mph',
      luggage: 2,
    },
    features: ['GPS Navigation', 'Bluetooth', 'Air Conditioning', 'Backup Camera'],
    driverAvailable: false,
    deliveryAvailable: true,
    reviewerAvatars: [
      'https://i.pravatar.cc/100?img=31',
      'https://i.pravatar.cc/100?img=42',
      'https://i.pravatar.cc/100?img=56',
    ],
  },
  {
    id: '8',
    name: 'Tesla Model 3',
    brand: 'Tesla',
    model: 'Model 3 Long Range',
    year: 2024,
    image: '/assets/images/cars/Car2.jpg',
    images: [
      '/assets/images/cars/Car2.jpg',
    ],
    pricePerDay: 55000,
    rating: 4.9,
    reviewCount: 64,
    location: 'Lagos, NG',
    host: {
      id: 'h8',
      name: 'Yemi Adebayo',
      avatar: 'https://i.pravatar.cc/150?img=68',
      rating: 4.9,
      joinedDate: '2023-06-30',
    },
    overview: 'Experience the future of driving with this Tesla Model 3. Fully Electric with autopilot features, premium interior, and cutting edge technology. Perfect for eco-conscious travelers.',
    specs: {
      seats: 5,
      transmission: 'Automatic',
      fuelType: 'Electric',
      doors: 4,
      maxSpeed: '162mph',
      luggage: 2,
    },
    features: ['Autopilot', 'Premium Sound', 'Glass Roof', 'Supercharging', 'Tesla App'],
    driverAvailable: true,
    deliveryAvailable: true,
    reviewerAvatars: [
      'https://i.pravatar.cc/100?img=10',
      'https://i.pravatar.cc/100?img=20',
      'https://i.pravatar.cc/100?img=35',
    ],
  },
];

// Mock user
export const mockUser: User = {
  id: 'u1',
  name: 'Balogun Uthman',
  email: 'balogun@example.com',
  phone: '+234 803 456 7890',
  avatar: 'https://i.pravatar.cc/150?img=52',
  tripsCount: 24,
  rating: 4.8,
  memberSince: '2025',
  hostRating: 4.9,
  isVerified: true,
};

// Mock bookings
export const mockBookings: Booking[] = [
  {
    id: 'b1',
    bookingCode: 'CB-2025-001',
    carId: '1', // Mercedes
    userId: 'u1',
    startDate: '2025-08-21T10:00:00',
    endDate: '2025-08-29T12:00:00',
    withDriver: true,
    deliveryOption: 'delivery',
    status: 'confirmed',
    totalPrice: 400000,
    deliveryAddress: 'Lagos, NG',
  },
  {
    id: 'b5',
    bookingCode: 'CB-2026-005',
    carId: '2', // BMW
    userId: 'u1',
    startDate: '2026-02-17T12:00:00',
    endDate: '2026-02-28T12:00:00',
    withDriver: true,
    deliveryOption: 'pickup',
    status: 'awaiting_confirm',
    totalPrice: 400000,
    deliveryAddress: 'Lagos, NG',
  },
  {
    id: 'b2',
    bookingCode: 'CB-2024-002',
    carId: '3', // Toyota
    userId: 'u1',
    startDate: '2024-03-10T09:00:00',
    endDate: '2024-03-12T18:00:00',
    withDriver: true,
    deliveryOption: 'pickup',
    status: 'completed',
    totalPrice: 180000,
    deliveryAddress: 'Victoria Island, Lagos',
  },
  {
    id: 'b3',
    bookingCode: 'CB-2025-003',
    carId: '1',
    userId: 'u1',
    startDate: '2025-06-12T09:00:00',
    endDate: '2025-06-15T10:00:00',
    withDriver: false,
    deliveryOption: 'delivery',
    status: 'ongoing',
    totalPrice: 400000,
    deliveryAddress: 'Lagos, NG',
  },
  {
    id: 'b4',
    bookingCode: 'CB-2023-004',
    carId: '5', // Range Rover
    userId: 'u1',
    startDate: '2023-11-05T08:00:00',
    endDate: '2023-11-06T20:00:00',
    withDriver: false,
    deliveryOption: 'pickup',
    status: 'cancelled',
    totalPrice: 80000,
    deliveryAddress: 'Maitama, Abuja',
  }
];

// Nigerian cities
export const nigerianCities = [
  'Lagos',
  'Abuja',
  'Port Harcourt',
  'Kano',
  'Ibadan',
  'Benin City',
  'Kaduna',
  'Enugu',
  'Calabar',
  'Akure',
  'Warri',
  'Akure',
  'Asaba',
  'Onitsha',
  'Bauchi'
];

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'ride',
    title: 'Ride Confirmed',
    description: 'Your ride with Chidi Okafor has been confirmed for tomorrow.',
    time: '2 mins ago',
    isRead: false
  },
  {
    id: 'n2',
    type: 'promo',
    title: '50% Off Your Next Ride!',
    description: 'Use code RIDENAIRA-50 to get 50% discount on your next booking.',
    time: '1 hour ago',
    isRead: false
  },
  {
    id: 'n3',
    type: 'system',
    title: 'Identity Verified',
    description: 'Congratulations! Your identity has been successfully verified.',
    time: '5 hours ago',
    isRead: true
  },
  {
    id: 'n4',
    type: 'wallet',
    title: 'Payment Successful',
    description: 'You have successfully added ₦10,000 to your wallet.',
    time: 'Yesterday',
    isRead: true
  },
  {
    id: 'n5',
    type: 'ride',
    title: 'Trip Completed',
    description: 'How was your trip with Emeka Obi? Rate your experience now.',
    time: '2 days ago',
    isRead: true
  }
];
