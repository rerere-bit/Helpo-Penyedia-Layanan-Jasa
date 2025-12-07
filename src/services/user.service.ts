import { auth, db } from '@/lib/firebase';
import { updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { uploadToCloudinary } from './cloudinary.service'; // Pastikan file ini sudah dibuat sesuai langkah sebelumnya

// Tipe data yang bisa di-update
export interface UserProfileUpdate {
  displayName?: string;
  phoneNumber?: string;
  address?: string;
  photoURL?: string;
  updatedAt?: string;
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
    // Jika dokumen user belum ada di Firestore (misal login pertama), return null atau object kosong
    return null;
  }
};

/**
 * Update data teks user di Firestore & Firebase Auth
 */
export const updateUserProfile = async (uid: string, data: UserProfileUpdate) => {
  try {
    const userRef = doc(db, "users", uid);
    
    // 1. Update di Firestore (Database Data Diri)
    // Gunakan setDoc dengan { merge: true } agar jika dokumen belum ada, akan dibuatkan
    await setDoc(userRef, {
      ...data,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    // 2. Update di Firebase Auth (Display Name)
    // Ini penting agar nama di pojok kanan atas (header) langsung berubah tanpa refresh page
    if (auth.currentUser && data.displayName) {
      await updateProfile(auth.currentUser, {
        displayName: data.displayName
      });
    }

    return true;
  } catch (error: any) {
    console.error("Error updating profile:", error);
    throw new Error(error.message);
  }
};

/**
 * Upload foto ke Cloudinary & Update URL di Profil User
 */
export const uploadProfileImage = async (uid: string, file: File) => {
  try {
    if (!auth.currentUser) throw new Error("User tidak login");

    // 1. Upload Gambar ke Cloudinary (Unsigned Upload)
    console.info('[user.service] Uploading to Cloudinary...');
    const downloadURL = await uploadToCloudinary(file);
    console.info('[user.service] Cloudinary URL:', downloadURL);

    // 2. Update URL foto di Firebase Authentication 
    // (Agar avatar di Navbar langsung berubah)
    await updateProfile(auth.currentUser, {
      photoURL: downloadURL
    });

    // 3. Update field photoURL di Firestore
    await updateUserProfile(uid, { photoURL: downloadURL });

    return downloadURL;
  } catch (error: any) {
    console.error("Gagal upload gambar:", error);
    throw new Error("Gagal upload gambar: " + error.message);
  }
};