import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  updateDoc, 
  doc, 
  serverTimestamp, 
  orderBy 
} from "firebase/firestore";
import { db } from "../lib/firebase";
import type { Notification } from "@/types";

const COLLECTION = "notifications";

/**
 * Mengirim Notifikasi Baru
 */
export const sendNotification = async (
  userId: string, 
  title: string, 
  message: string, 
  type: 'info' | 'success' | 'warning' | 'error' = 'info'
) => {
  try {
    await addDoc(collection(db, COLLECTION), {
      userId,
      title,
      message,
      type,
      isRead: false,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Gagal kirim notif", error);
  }
};

/**
 * Mengambil Notifikasi User
 */
export const getUserNotifications = async (userId: string) => {
  try {
    const q = query(
      collection(db, COLLECTION), 
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    
    return snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Konversi Timestamp ke string ISO untuk UI
      createdAt: doc.data().createdAt?.toDate().toISOString()
    } as Notification));
  } catch (error) {
    console.error("Gagal ambil notif:", error);
    return [];
  }
};

/**
 * Tandai Notifikasi Sudah Dibaca
 */
export const markAsRead = async (notifId: string) => {
  try {
    const notifRef = doc(db, COLLECTION, notifId);
    await updateDoc(notifRef, { isRead: true });
  } catch (error) {
    console.error("Gagal update status notif", error);
  }
};