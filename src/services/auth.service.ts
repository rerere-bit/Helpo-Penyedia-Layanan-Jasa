import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  type UserCredential
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

interface RegisterParams {
  email: string;
  pass: string;
  name: string;
  role: 'customer' | 'provider';
}

export const registerUser = async ({ email, pass, name, role }: RegisterParams) => {
  try {
    console.debug('[auth] registerUser start', { email, role });
    // 1. Buat user di Auth
    const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;

    // 2. Simpan data di Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: email,
      displayName: name,
      role: role,
      createdAt: new Date().toISOString(),
      photoURL: null
    });

    console.debug('[auth] registerUser success', { uid: user.uid });
    return user;
  } catch (error: any) {
    console.error('[auth] registerUser error', error);
    throw new Error(error?.message || 'Register gagal');
  }
};

export const loginUser = async (email: string, pass: string) => {
  try {
    console.debug('[auth] loginUser start', { email });
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    console.debug('[auth] loginUser success', { uid: userCredential.user.uid });
    return userCredential.user;
  } catch (error: any) {
    console.error('[auth] loginUser error', error);
    throw new Error(error?.message || 'Login gagal');
  }
};

export const logoutUser = async () => {
  console.debug('[auth] logoutUser');
  return await signOut(auth);
};