import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import type { Category } from "../types";

const COLLECTION_NAME = "categories";

// Data awal (Seed)
const DEFAULT_CATEGORIES: Category[] = [
  { id: "ac", label: "Service AC" },
  { id: "cleaning", label: "Pembersihan" },
  { id: "plumbing", label: "Pipa & Ledeng" },
  { id: "electric", label: "Listrik" },
  { id: "renovation", label: "Renovasi & Cat" },
  { id: "gardening", label: "Taman" },
  { id: "massage", label: "Pijat & Refleksi" }
];

/**
 * Mengambil semua kategori dari Firestore
 */
export const getCategories = async (): Promise<Category[]> => {
  try {
    const snapshot = await getDocs(collection(db, COLLECTION_NAME));
    
    // Jika kosong, isi otomatis (Seeding)
    if (snapshot.empty) {
      await seedCategories();
      return DEFAULT_CATEGORIES;
    }

    return snapshot.docs.map(doc => doc.data() as Category);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

/**
 * Fungsi internal untuk mengisi data awal
 */
const seedCategories = async () => {
  const promises = DEFAULT_CATEGORIES.map(cat => 
    setDoc(doc(db, COLLECTION_NAME, cat.id), cat)
  );
  await Promise.all(promises);
  console.info('[category] Database seeded');
};