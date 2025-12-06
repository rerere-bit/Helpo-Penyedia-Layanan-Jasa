import { 
  collection, addDoc, query, where, getDocs, doc, getDoc, updateDoc, serverTimestamp, orderBy 
} from "firebase/firestore";
import { db } from "../lib/firebase";
import type { Review, ReviewInput } from "../types";

const COLLECTION_NAME = "reviews";

/**
 * Menambah Review Baru & Update Rating Service
 */
export const addReview = async (userId: string, userName: string, userAvatar: string | null, input: ReviewInput) => {
  try {
    // 1. Simpan Review ke Collection 'reviews'
    const reviewData = {
      userId,
      userName,
      userAvatar: userAvatar || null,
      serviceId: input.serviceId,
      providerId: input.providerId,
      rating: input.rating,
      comment: input.comment,
      createdAt: serverTimestamp(),
    };

    await addDoc(collection(db, COLLECTION_NAME), reviewData);

    // 2. Hitung Ulang Rating di Collection 'services' (Agregasi Manual)
    const serviceRef = doc(db, "services", input.serviceId);
    const serviceSnap = await getDoc(serviceRef);

    if (serviceSnap.exists()) {
      const serviceData = serviceSnap.data();
      const currentRating = serviceData.rating || 0;
      const currentCount = serviceData.reviewCount || 0;

      // Rumus Running Average: ((Rata2 Lama * Jumlah Lama) + Rating Baru) / (Jumlah Lama + 1)
      const newCount = currentCount + 1;
      const newRating = ((currentRating * currentCount) + input.rating) / newCount;

      // Update Service dengan angka baru (dibulatkan 1 desimal)
      await updateDoc(serviceRef, {
        rating: Number(newRating.toFixed(1)),
        reviewCount: newCount
      });
    }

    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

/**
 * Mengambil Review berdasarkan ID Jasa
 */
export const getServiceReviews = async (serviceId: string): Promise<Review[]> => {
  try {
    // Ambil review untuk service tertentu, urutkan dari yang terbaru
    const q = query(
      collection(db, COLLECTION_NAME), 
      where("serviceId", "==", serviceId),
      orderBy("createdAt", "desc")
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Konversi Timestamp Firestore ke string agar aman di React
      createdAt: doc.data().createdAt?.toDate().toLocaleDateString('id-ID', { 
        day: 'numeric', month: 'long', year: 'numeric' 
      }) || 'Baru saja'
    } as Review));
  } catch (error: any) {
    console.error("Error fetching reviews:", error);
    return []; // Return kosong jika error (agar UI tidak crash)
  }
};