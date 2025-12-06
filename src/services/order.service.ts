import { 
  collection, addDoc, query, where, getDocs, doc, updateDoc, serverTimestamp, orderBy, getDoc 
} from "firebase/firestore";
import { db } from "../lib/firebase";
import type { Order, OrderStatus } from "@/types";

const COLLECTION_NAME = "orders";

/**
 * Membuat Pesanan Baru (Booking)
 */
export const createOrder = async (
  customerId: string, 
  serviceId: string, 
  providerId: string,
  bookingDate: string,
  bookingTime: string,
  totalPrice: number,
  notes: string = ""
) => {
  try {
    // 1. Ambil Data Snapshot (Jasa & Customer) agar history aman jika data asli berubah
    // Kita butuh fetch manual data service & user di sini untuk snapshot
    const serviceRef = doc(db, "services", serviceId);
    const serviceSnap = await getDoc(serviceRef);
    const serviceData = serviceSnap.data();

    const customerRef = doc(db, "users", customerId);
    const customerSnap = await getDoc(customerRef);
    const customerData = customerSnap.data();

    if (!serviceData || !customerData) throw new Error("Data jasa atau user tidak valid");

    // 2. Susun Data Order
    const newOrder = {
      customerId,
      providerId,
      serviceId,
      
      // Snapshot Data
      serviceSnapshot: {
        title: serviceData.title,
        price: Number(serviceData.price),
        thumbnailUrl: serviceData.thumbnailUrl || "",
        category: serviceData.category
      },
      customerSnapshot: {
        displayName: customerData.displayName || 'Pelanggan',
        phoneNumber: customerData.phoneNumber || '-',
        address: customerData.address || '-'
      },

      bookingDate, // Format YYYY-MM-DD
      bookingTime, // Format HH:mm
      notes,
      
      status: 'pending' as OrderStatus, // Status Awal
      totalPrice: Number(totalPrice),
      createdAt: serverTimestamp()
    };

    // 3. Simpan ke Firestore
    const docRef = await addDoc(collection(db, COLLECTION_NAME), newOrder);
    return docRef.id;
  } catch (error: any) {
    throw new Error("Gagal membuat pesanan: " + error.message);
  }
};

/**
 * Mengambil Daftar Pesanan (Bisa untuk Customer atau Provider)
 */
export const getOrders = async (userId: string, role: 'customer' | 'provider', statusFilter?: OrderStatus[]) => {
  try {
    // Tentukan field mana yang dicek berdasarkan role
    const userField = role === 'customer' ? 'customerId' : 'providerId';
    
    // Query Dasar
    const q = query(
      collection(db, COLLECTION_NAME), 
      where(userField, "==", userId),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);
    
    let orders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Konversi Timestamp Firestore ke String ISO untuk UI
      createdAt: doc.data().createdAt?.toDate().toISOString()
    } as Order));

    // Filter Status di sisi Client (Opsional)
    if (statusFilter && statusFilter.length > 0) {
      orders = orders.filter(o => statusFilter.includes(o.status));
    }

    return orders;
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    return [];
  }
};

/**
 * Update Status Pesanan (Contoh: Provider menerima pesanan / Selesai)
 */
export const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
  try {
    const orderRef = doc(db, COLLECTION_NAME, orderId);
    await updateDoc(orderRef, { status: newStatus });
    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
};