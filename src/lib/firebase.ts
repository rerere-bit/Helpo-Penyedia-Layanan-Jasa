// Import fungsi yang dibutuhkan dari SDK Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Konfigurasi menggunakan Environment Variables yang kita buat tadi
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Validasi konfigurasi singkat supaya error terlihat di console saat development
const missing = Object.entries(firebaseConfig).filter(([, v]) => !v);
if (missing.length > 0) {
  console.warn('[firebase] Missing config values:', missing.map(([k]) => k).join(', '));
}

// Extra validation for storage bucket common misconfiguration
if (firebaseConfig.storageBucket) {
  const sb = String(firebaseConfig.storageBucket);
  // Common expected pattern contains 'appspot' or ends with '.appspot.com'
  if (!/appspot\.com|storage\.googleapis\.com/.test(sb) && !sb.includes('.')) {
    console.warn('[firebase] Suspicious storageBucket value:', sb, '\n  Expected something like "<project>.appspot.com". Please verify VITE_FIREBASE_STORAGE_BUCKET in your .env');
  }
}

// 1. Inisialisasi Aplikasi
const app = initializeApp(firebaseConfig);

// 2. Export service yang akan sering kita pakai
export const auth = getAuth(app);       // Untuk Login/Register
export const db = getFirestore(app);    // Untuk Database
export const storage = getStorage(app); // Untuk Upload Foto

export default app;