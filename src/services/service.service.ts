import { 
  collection, addDoc, query, where, getDocs, doc, deleteDoc, updateDoc, serverTimestamp
} from "firebase/firestore";
import { db } from "../lib/firebase"; // Hapus import 'storage' karena kita pakai link manual
import type { Service, ServiceInput } from "@/types";

const COLLECTION_NAME = "services";

// --- CRUD ---

export const addService = async (providerId: string, input: ServiceInput) => {
  try {
    const newService = {
      providerId,
      title: input.title,
      category: input.category,
      description: input.description,
      price: Number(input.price),
      
      // [UBAH] Langsung pakai URL dari input, atau default jika kosong
      thumbnailUrl: input.thumbnailUrl || "https://placehold.co/600x400?text=Layanan",
      
      isActive: true,
      rating: 0,
      reviewCount: 0,
      createdAt: serverTimestamp(),
    };

    await addDoc(collection(db, COLLECTION_NAME), newService);
    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// [BARU] Fungsi Update Service
export const updateService = async (serviceId: string, input: Partial<ServiceInput>) => {
  try {
    const serviceRef = doc(db, COLLECTION_NAME, serviceId);
    
    // Kita buat object update dinamis (hanya field yang dikirim yang diupdate)
    const updateData: any = {
      title: input.title,
      category: input.category,
      description: input.description,
      price: Number(input.price),
      updatedAt: serverTimestamp()
    };

    // Jika user memasukkan URL baru, update. Jika tidak, biarkan yang lama.
    if (input.thumbnailUrl) {
      updateData.thumbnailUrl = input.thumbnailUrl;
    }

    await updateDoc(serviceRef, updateData);
    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getProviderServices = async (providerId: string): Promise<Service[]> => {
  try {
    const q = query(collection(db, COLLECTION_NAME), where("providerId", "==", providerId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const deleteService = async (serviceId: string) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, serviceId));
    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const toggleServiceStatus = async (serviceId: string, currentStatus: boolean) => {
  try {
    const serviceRef = doc(db, COLLECTION_NAME, serviceId);
    await updateDoc(serviceRef, { isActive: !currentStatus });
    return !currentStatus;
  } catch (error: any) {
    throw new Error(error.message);
  }
};