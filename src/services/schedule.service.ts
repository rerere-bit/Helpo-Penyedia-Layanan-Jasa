import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import type { ProviderSchedule } from "@/types";

const COLLECTION = "provider_schedules";

// Default settings jika belum diatur
const DEFAULT_SCHEDULE: ProviderSchedule = {
  providerId: "",
  workingDays: [1, 2, 3, 4, 5], // Senin - Jumat
  workingHours: { start: "08:00", end: "17:00" },
  exceptions: []
};

/**
 * Ambil Pengaturan Jadwal Provider
 */
export const getProviderSchedule = async (providerId: string): Promise<ProviderSchedule> => {
  try {
    const docRef = doc(db, COLLECTION, providerId);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      return snap.data() as ProviderSchedule;
    } else {
      return { ...DEFAULT_SCHEDULE, providerId };
    }
  } catch (error) {
    console.error("Error get schedule:", error);
    throw error;
  }
};

/**
 * Simpan Pengaturan Jadwal
 */
export const saveProviderSchedule = async (providerId: string, data: ProviderSchedule) => {
  try {
    const docRef = doc(db, COLLECTION, providerId);
    // Kita gunakan merge: true agar aman
    await setDoc(docRef, { ...data, providerId }, { merge: true });
    return true;
  } catch (error) {
    console.error("Error save schedule:", error);
    throw error;
  }
};