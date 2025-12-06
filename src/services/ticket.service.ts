import { 
  collection, addDoc, query, where, getDocs, orderBy, serverTimestamp 
} from "firebase/firestore";
import { db } from "../lib/firebase";
import type { Ticket, TicketStatus } from "@/types";

const COLLECTION = "support_tickets";

/**
 * Membuat Tiket Bantuan Baru
 */
export const createTicket = async (
  userId: string,
  category: string,
  subject: string,
  description: string
) => {
  try {
    const newTicket = {
      userId,
      category,
      subject, // BRD menyebutnya "Deskripsi Masalah" tapi kita pisah jadi Judul & Isi agar rapi
      description,
      status: 'open' as TicketStatus,
      createdAt: serverTimestamp(),
      adminReply: '' // Kosong di awal
    };

    await addDoc(collection(db, COLLECTION), newTicket);
    return true;
  } catch (error: any) {
    console.error("Error create ticket:", error);
    throw new Error(error.message);
  }
};

/**
 * Mengambil Riwayat Tiket User
 */
export const getUserTickets = async (userId: string): Promise<Ticket[]> => {
  try {
    const q = query(
      collection(db, COLLECTION),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Konversi Timestamp ke String
      createdAt: doc.data().createdAt?.toDate().toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
      })
    } as Ticket));
  } catch (error: any) {
    console.error("Error fetching tickets:", error);
    return [];
  }
};