import { 
  collection, doc, runTransaction, serverTimestamp 
} from "firebase/firestore";
import { db } from "../lib/firebase";

const COLLECTION_TRANSACTIONS = "transactions";
const COLLECTION_ORDERS = "orders";

/**
 * Memproses Pembayaran (Simulasi)
 * Menggunakan Transaction agar data konsisten:
 * Jika gagal simpan transaksi, status order tidak berubah.
 */
export const processPayment = async (
  orderId: string, 
  userId: string, 
  amount: number, 
  method: string
) => {
  try {
    await runTransaction(db, async (transaction) => {
      // 1. Referensi Dokumen
      const orderRef = doc(db, COLLECTION_ORDERS, orderId);
      const newTransactionRef = doc(collection(db, COLLECTION_TRANSACTIONS));

      // 2. Cek apakah order masih ada/valid (Opsional tapi bagus)
      const orderSnap = await transaction.get(orderRef);
      if (!orderSnap.exists()) {
        throw new Error("Pesanan tidak ditemukan!");
      }

      // 3. Update Status Order jadi 'confirmed'
      transaction.update(orderRef, { 
        status: 'confirmed',
        paymentStatus: 'paid', // Tambahan field untuk penanda lunas
        updatedAt: serverTimestamp()
      });

      // 4. Catat Bukti Transaksi
      transaction.set(newTransactionRef, {
        orderId,
        userId,
        amount,
        method,
        status: 'success',
        createdAt: serverTimestamp()
      });
    });

    console.log("Pembayaran berhasil diproses.");
    return true;
  } catch (error: any) {
    console.error("Gagal memproses pembayaran:", error);
    throw new Error(error.message);
  }
};