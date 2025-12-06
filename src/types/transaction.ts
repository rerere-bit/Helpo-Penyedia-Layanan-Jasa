// src/types/transaction.ts
import { Timestamp } from 'firebase/firestore';

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Booking {
  id?: string;
  customerId: string; // ID User yang login
  providerId: string; // ID Provider pemilik jasa
  serviceId: string;  // ID Jasa aslinya
  
  // Service Snapshot (PENTING: Simpan detail saat ini agar aman jika harga berubah nanti)
  serviceSnapshot: {
    title: string;
    price: number;
    category: string;
    thumbnailUrl: string;
  };

  bookingDate: Timestamp | Date; // Tanggal pengerjaan
  bookingTime: string;           // Jam pengerjaan
  status: BookingStatus;
  totalPrice: number;
  
  note?: string; // Catatan tambahan (opsional)
  createdAt: Timestamp | Date;
}