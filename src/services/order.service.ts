import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc, 
  serverTimestamp, 
  orderBy, 
  getDoc 
} from "firebase/firestore";
import { db } from "../lib/firebase";
import type { Order, OrderStatus } from "@/types";
import { sendNotification } from "./notification.service";

const COLLECTION_NAME = "orders";

/**
 * Membuat Pesanan Baru (Booking)
 * Digunakan oleh: BookingPage
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
    // 1. Ambil Data Snapshot (Jasa & Customer) 
    // Kita mengambil data real-time saat ini untuk disimpan sebagai 'history' di dalam tiket order.
    const serviceRef = doc(db, "services", serviceId);
    const serviceSnap = await getDoc(serviceRef);
    const serviceData = serviceSnap.data();

    const customerRef = doc(db, "users", customerId);
    const customerSnap = await getDoc(customerRef);
    const customerData = customerSnap.data();

    if (!serviceData || !customerData) {
      throw new Error("Data jasa atau user tidak valid/ditemukan");
    }

    // 2. Susun Object Order
    const newOrder = {
      customerId,
      providerId,
      serviceId,
      
      // Snapshot Data: Menyalin data penting agar tidak berubah meski data asli diedit
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

      bookingDate, // Format String: YYYY-MM-DD
      bookingTime, // Format String: HH:mm
      notes,
      
      status: 'pending' as OrderStatus, // Status Awal
      totalPrice: Number(totalPrice),
      createdAt: serverTimestamp()
    };

    // 3. Simpan ke Firestore
    const docRef = await addDoc(collection(db, COLLECTION_NAME), newOrder);

    // 4. Kirim Notifikasi
    // Ke Provider: Ada order baru
    await sendNotification(
      providerId,
      "Pesanan Baru Masuk!",
      `Pelanggan ${customerData.displayName} memesan ${serviceData.title}. Segera cek jadwal Anda.`,
      "info"
    );

    // Ke Customer: Konfirmasi pembuatan
    await sendNotification(
      customerId,
      "Pesanan Dibuat",
      `Pesanan ${serviceData.title} berhasil dibuat. Silakan lakukan pembayaran.`,
      "info"
    );

    return docRef.id;
  } catch (error: any) {
    console.error("Create Order Error:", error);
    throw new Error("Gagal membuat pesanan: " + error.message);
  }
};

/**
 * Mengambil Daftar Pesanan
 * Digunakan oleh: HistoryPage (Customer), SchedulePage, ProviderOrdersPage (Provider)
 */
export const getOrders = async (userId: string, role: 'customer' | 'provider', statusFilter?: OrderStatus[]) => {
  try {
    // Tentukan field mana yang dicek berdasarkan role yang sedang login
    const userField = role === 'customer' ? 'customerId' : 'providerId';
    
    // Query Dasar: Ambil order milik user ini, urutkan dari yang terbaru
    const q = query(
      collection(db, COLLECTION_NAME), 
      where(userField, "==", userId),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);
    
    let orders = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Konversi Timestamp Firestore ke String ISO agar aman di React State
        createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString()
      } as Order;
    });

    // Filter Status di sisi Client (Opsional, jika ingin filter spesifik)
    if (statusFilter && statusFilter.length > 0) {
      orders = orders.filter(o => statusFilter.includes(o.status));
    }

    return orders;
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    // Return array kosong agar aplikasi tidak crash
    return [];
  }
};

/**
 * Update Status Pesanan
 * Digunakan oleh: ProviderOrdersPage (Terima/Tolak/Selesai) & PaymentService (Konfirmasi Bayar)
 */
export const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
  try {
    const orderRef = doc(db, COLLECTION_NAME, orderId);
    
    // Ambil data order dulu untuk tahu siapa customer-nya (untuk kirim notif)
    const orderSnap = await getDoc(orderRef);
    if (!orderSnap.exists()) throw new Error("Order not found");
    const orderData = orderSnap.data() as Order;

    // Update Status di Database
    await updateDoc(orderRef, { status: newStatus });

    // Logic Notifikasi berdasarkan Status Baru
    let title = "Update Status Pesanan";
    let message = `Status pesanan Anda berubah menjadi ${newStatus}.`;
    let type: 'success' | 'warning' | 'error' | 'info' = 'info';

    switch (newStatus) {
      case 'confirmed':
        title = "Pesanan Diterima!";
        message = "Penyedia jasa telah menerima pesanan Anda. Mereka akan datang sesuai jadwal.";
        type = "success";
        break;
      case 'in_progress':
        title = "Layanan Dimulai";
        message = "Penyedia jasa sedang mengerjakan layanan Anda.";
        type = "info";
        break;
      case 'completed':
        title = "Layanan Selesai";
        message = "Layanan telah selesai. Terima kasih telah menggunakan jasa kami.";
        type = "success";
        break;
      case 'cancelled':
        title = "Pesanan Dibatalkan";
        message = "Mohon maaf, pesanan Anda telah dibatalkan.";
        type = "error";
        break;
    }

    // Kirim notif ke Customer
    await sendNotification(orderData.customerId, title, message, type);

    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
};