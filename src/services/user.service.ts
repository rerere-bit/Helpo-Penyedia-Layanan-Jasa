import { doc, setDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../lib/firebase";

// Tipe data yang bisa di-update
export interface UserProfileUpdate {
  displayName?: string;
  phoneNumber?: string;
  address?: string;
  photoURL?: string;
}

/**
 * Mengambil data profil user terbaru dari Firestore
 */
export const getUserProfile = async (uid: string) => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    throw new Error("User tidak ditemukan");
  }
};

/**
 * Update data teks user di Firestore
 */
export const updateUserProfile = async (uid: string, data: UserProfileUpdate) => {
  try {
    const userRef = doc(db, "users", uid);
    // Use setDoc with merge to create the document if it doesn't exist
    await setDoc(userRef, {
      ...data,
      updatedAt: new Date().toISOString() // Good practice: Catat kapan terakhir update
    }, { merge: true });
    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

/**
 * Upload foto ke Firebase Storage & ambil URL-nya
 */
export const uploadProfileImage = async (uid: string, file: File) => {
  try {
    // 1. Buat alamat file: profile_images/UID_USER.jpg
    // Kita pakai UID sebagai nama file agar 1 user cuma punya 1 foto (foto lama tertimpa otomatis)
    // Ini menghemat storage.
    const storageRef = ref(storage, `profile_images/${uid}`);

    // 2. Proses Upload
    console.info('[user.service] Starting upload for', uid, file.name, file.size);
    const snapshot = await uploadBytes(storageRef, file);
    console.info('[user.service] Upload finished, snapshot:', snapshot.metadata?.name || '(no name)');

    // 3. Ambil URL public-nya
    const downloadURL = await getDownloadURL(snapshot.ref);

    // 4. Update langsung field photoURL di database user
    console.info('[user.service] Saving downloadURL to user doc', downloadURL);
    await updateUserProfile(uid, { photoURL: downloadURL });

    console.info('[user.service] photoURL saved for', uid);

    return downloadURL;
  } catch (error: any) {
    throw new Error("Gagal upload gambar: " + error.message);
  }
};