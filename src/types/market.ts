import { Timestamp } from 'firebase/firestore';

// Pastikan ada kata 'export' di sini
export interface Category {
  id: string; 
  label: string;
  icon: string; 
}

export interface Service {
  id?: string;
  providerId: string;
  title: string;
  category: string; // Ini string, tapi nanti valuenya diambil dari ID Category
  description: string;
  price: number;
  thumbnailUrl: string;
  isActive: boolean;
  rating: number;
  reviewCount: number;
  location: string;
  createdAt: Timestamp | Date; 
}

export interface Review {
  id?: string;
  orderId: string;
  serviceId: string;
  providerId: string;
  customerId: string;
  rating: number; 
  comment: string;
  createdAt: Timestamp | Date;
}