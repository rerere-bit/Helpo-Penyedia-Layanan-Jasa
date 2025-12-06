import { Timestamp } from 'firebase/firestore';

export interface Category {
  id: string; // contoh: "cleaning", "electronic"
  label: string;
  icon: string; // nama icon atau url
}

export interface Service {
  id?: string; // Optional karena saat create belum ada ID
  providerId: string;
  title: string;
  category: string;
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
  rating: number; // 1 - 5
  comment: string;
  createdAt: Timestamp | Date;
}