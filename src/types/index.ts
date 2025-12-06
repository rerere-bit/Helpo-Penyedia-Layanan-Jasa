// --- TIPE DATA UMUM ---

export interface FilterState {
  keyword: string;
  category: string;
  location: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
}

export interface Category {
  id: string;
  label: string;
  icon?: string;
}

// --- TIPE DATA UTAMA (SERVICE) ---

export interface Service {
  id: string;
  title: string;
  category: string;
  description: string;
  price: number;
  thumbnailUrl: string;
  rating: number;
  reviewCount: number;

  // --- Field Flexible (Optional) ---
  // Kita buat optional (?) agar tidak error saat salah satu belum tersedia
  
  // Field Backend (Raw)
  providerId?: string;
  isActive?: boolean;
  createdAt?: string | any; // Bisa string ISO atau Firestore Timestamp

  // Field Frontend (UI Display)
  // Kita wajibkan ada object 'provider', tapi isinya boleh partial jika data belum lengkap
  provider: {
    name: string;
    location: string;
    avatarUrl?: string;
    isVerified: boolean;
  };
}

// Input saat membuat jasa baru
export interface ServiceInput {
  title: string;
  category: string;
  description: string;
  price: number;
  imageFile?: File | null;
  thumbnailUrl?: string; // Support manual URL
}

// --- TIPE DATA TRANSAKSI (ORDER & NOTIF) ---

export type OrderStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  customerId: string;
  providerId: string;
  serviceId: string;
  
  // Snapshot Data
  serviceSnapshot: {
    title: string;
    price: number;
    thumbnailUrl: string;
    category: string;
  };
  customerSnapshot: {
    displayName: string;
    phoneNumber: string;
    address: string;
  };

  bookingDate: string;
  bookingTime: string;
  notes?: string;
  
  status: OrderStatus;
  totalPrice: number;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
}

// --- TIPE DATA REVIEW ---

export interface Review {
  id: string;
  serviceId: string;
  providerId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string | any;
}

export interface ReviewInput {
  serviceId: string;
  providerId: string;
  rating: number;
  comment: string;
}

export interface ProviderSchedule {
  providerId: string;
  workingDays: number[];
  workingHours: {
    start: string; 
    end: string;   
  };
  exceptions: string[]; 
}