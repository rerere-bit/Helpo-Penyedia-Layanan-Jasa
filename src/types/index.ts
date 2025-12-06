// src/types/index.ts

// export interface Service {
//   id: string;
//   providerId: string; // Relasi ke Users
//   title: string;
//   category: string;
//   price: number;
//   rating: number;
//   reviewCount: number;
//   description: string;
//   thumbnailUrl: string;
//   provider: {
//     name: string;
//     location: string;
//     avatarUrl?: string;
//     isVerified: boolean;
//   };
// }

export interface FilterState {
  keyword: string;
  category: string;
  location: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
}

export interface Service {
  id: string;
  providerId: string; // Relasi ke Users
  title: string;
  category: string;
  description: string;
  price: number;
  thumbnailUrl: string;
  isActive: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string; 
}

// Tipe data untuk input form tambah jasa
export interface ServiceInput {
  title: string;
  category: string;
  description: string;
  price: number;
  imageFile: File;
}

export interface Category {
  id: string; 
  label: string; 
}

// Tambahkan di bawah yang sudah ada
export interface Review {
  id: string;
  serviceId: string;
  providerId: string;
  userId: string;
  userName: string; 
  userAvatar?: string;
  rating: number; 
  comment: string;
  createdAt: string;
}

export interface ReviewInput {
  serviceId: string;
  providerId: string;
  rating: number;
  comment: string;
}