// src/services/booking.service.ts

import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { type Booking } from '../types/transaction';

const BOOKING_COLLECTION = 'bookings';

export const BookingService = {
  // Fungsi Membuat Booking Baru
  createBooking: async (data: Omit<Booking, 'id' | 'createdAt' | 'status'>) => {
    try {
      const newBooking = {
        ...data,
        status: 'pending', // Status awal selalu pending
        createdAt: Timestamp.now(),
        // Pastikan bookingDate dikonversi ke Timestamp jika belum
        bookingDate: data.bookingDate instanceof Date 
            ? Timestamp.fromDate(data.bookingDate) 
            : data.bookingDate
      };

      const docRef = await addDoc(collection(db, BOOKING_COLLECTION), newBooking);
      return docRef.id; // Kembalikan ID Booking baru untuk dipakai redirect
    } catch (error) {
      console.error("Error creating booking:", error);
      throw error;
    }
  }
};