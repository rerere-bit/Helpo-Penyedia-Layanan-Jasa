// src/services/market.service.ts

import { 
  collection, 
  getDocs, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  doc, 
  getDoc,
  runTransaction,
  Timestamp,
  limit
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { type Service, type Review, type Category } from '../types/market';

const SERVICES_COLLECTION = 'services';
const REVIEWS_COLLECTION = 'reviews';
const CATEGORIES_COLLECTION = 'categories';

export const MarketService = {
  
  // --- READ OPERATIONS ---

  // 1. Ambil Semua Kategori
  getCategories: async (): Promise<Category[]> => {
    try {
      const snapshot = await getDocs(collection(db, CATEGORIES_COLLECTION));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  },

  // 2. Ambil List Jasa (Filter & Search)
  getServices: async (categoryFilter?: string): Promise<Service[]> => {
    try {
      // Base Query: Hanya ambil yang aktif & urutkan dari terbaru
      let q = query(
        collection(db, SERVICES_COLLECTION), 
        where('isActive', '==', true), 
        orderBy('createdAt', 'desc')
      );

      // Apply Category Filter if exists
      if (categoryFilter && categoryFilter !== 'All') {
        q = query(q, where('category', '==', categoryFilter));
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
    } catch (error) {
      console.error("Error fetching services:", error);
      throw error;
    }
  },

  // 3. Ambil Detail Satu Jasa
  getServiceById: async (serviceId: string): Promise<Service | null> => {
    try {
      const docRef = doc(db, SERVICES_COLLECTION, serviceId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Service;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching service detail:", error);
      throw error;
    }
  },

  // 4. Ambil Review berdasarkan Service ID
  getReviewsByService: async (serviceId: string): Promise<Review[]> => {
    try {
      const q = query(
        collection(db, REVIEWS_COLLECTION),
        where('serviceId', '==', serviceId),
        orderBy('createdAt', 'desc'),
        limit(20) // Batasi 20 review terbaru agar ringan
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return [];
    }
  },

  // --- WRITE OPERATIONS ---

  // 5. Tambah Jasa Baru (Provider)
  createService: async (data: Omit<Service, 'id' | 'createdAt' | 'rating' | 'reviewCount'>) => {
    try {
      const newService = {
        ...data,
        rating: 0, 
        reviewCount: 0,
        createdAt: Timestamp.now(),
      };
      
      const docRef = await addDoc(collection(db, SERVICES_COLLECTION), newService);
      return docRef.id;
    } catch (error) {
      console.error("Error creating service:", error);
      throw error;
    }
  },

  // 6. Submit Review & Update Rating (TRANSACTION)
  addReview: async (reviewData: Omit<Review, 'id' | 'createdAt'>) => {
    try {
      await runTransaction(db, async (transaction) => {
        // A. Referensi Dokumen
        const serviceRef = doc(db, SERVICES_COLLECTION, reviewData.serviceId);
        const reviewRef = doc(collection(db, REVIEWS_COLLECTION)); // Generate ID baru

        // B. Baca data service terbaru
        const serviceSnap = await transaction.get(serviceRef);
        if (!serviceSnap.exists()) {
          throw "Service does not exist!";
        }

        const currentData = serviceSnap.data() as Service;
        const currentRating = currentData.rating || 0;
        const currentCount = currentData.reviewCount || 0;

        // C. Kalkulasi Rating Baru (Weighted Average)
        const newCount = currentCount + 1;
        const newAverageRating = ((currentRating * currentCount) + reviewData.rating) / newCount;

        // D. Tulis Data (Review Baru + Update Service)
        transaction.set(reviewRef, {
          ...reviewData,
          createdAt: Timestamp.now()
        });

        transaction.update(serviceRef, {
          rating: Number(newAverageRating.toFixed(1)), // Simpan 1 angka di belakang koma
          reviewCount: newCount
        });
      });
      
      return true;
    } catch (error) {
      console.error("Transaction failed: ", error);
      throw error;
    }
  }
};