import { 
  collection, doc, runTransaction, serverTimestamp 
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { sendNotification } from "./notification.service"; 

const COLLECTION_TRANSACTIONS = "transactions";
const COLLECTION_ORDERS = "orders";

export const processPayment = async (
  orderId: string, 
  userId: string, 
  amount: number, 
  method: string
) => {
  try {
    await runTransaction(db, async (transaction) => {
      const orderRef = doc(db, COLLECTION_ORDERS, orderId);
      const newTransactionRef = doc(collection(db, COLLECTION_TRANSACTIONS));

      // 1. Cek keberadaan Order
      const orderSnap = await transaction.get(orderRef);
      if (!orderSnap.exists()) {
        throw new Error("Pesanan tidak ditemukan!");
      }
      
      // [PERBAIKAN] Baris 'const orderData = ...' dihapus karena tidak dipakai.
      // Kita cukup tahu ordernya exists, langsung update saja.

      // 2. Update Status Order
      transaction.update(orderRef, { 
        status: 'confirmed', 
        paymentStatus: 'paid',
        updatedAt: serverTimestamp()
      });

      // 3. Catat Transaksi
      transaction.set(newTransactionRef, {
        orderId,
        userId,
        amount,
        method,
        status: 'success',
        createdAt: serverTimestamp()
      });
    });

    // Kirim Notifikasi (Di luar transaksi DB)
    await sendNotification(
      userId, 
      "Pembayaran Berhasil", 
      `Pembayaran Rp ${amount.toLocaleString()} telah diterima.`, 
      "success"
    );
    
    console.log("Pembayaran berhasil diproses.");
    return true;
  } catch (error: any) {
    console.error("Gagal memproses pembayaran:", error);
    throw new Error(error.message);
  }
};