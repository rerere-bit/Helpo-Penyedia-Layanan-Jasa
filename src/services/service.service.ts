import { 
  collection, addDoc, query, where, getDocs, doc, deleteDoc, updateDoc, serverTimestamp 
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../lib/firebase";
import type { Service, ServiceInput } from "@/types";

const COLLECTION_NAME = "services";

/**
 * Upload gambar thumbnail jasa ke Storage
 */
const uploadServiceImage = async (file: File, providerId: string) => {
  const filename = `services/${providerId}_${Date.now()}_${file.name}`;
  const storageRef = ref(storage, filename);
  const snapshot = await uploadBytes(storageRef, file);
  return await getDownloadURL(snapshot.ref);
};

export const addService = async (providerId: string, input: ServiceInput) => {
  try {
    const imageUrl = await uploadServiceImage(input.imageFile, providerId);

    // Data yang akan masuk ke Firestore
    const newService = {
      providerId,
      title: input.title,
      category: input.category,
      description: input.description,
      price: Number(input.price),
      thumbnailUrl: imageUrl,
      isActive: true, // Default aktif saat dibuat
      rating: 0,
      reviewCount: 0,
      createdAt: serverTimestamp(), // Menggunakan waktu server
    };

    await addDoc(collection(db, COLLECTION_NAME), newService);
    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getProviderServices = async (providerId: string): Promise<Service[]> => {
  try {
    // Query: Ambil services diman providerId == UID user yang login
    const q = query(collection(db, COLLECTION_NAME), where("providerId", "==", providerId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Service));
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