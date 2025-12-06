import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  role?: 'customer' | 'provider';
  photoURL: string | null;
  phoneNumber?: string;
  address?: string;
}

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  isAdmin: boolean;
  refreshUserProfile?: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  refreshUserProfile: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUserProfile = async () => {
    if (!user) return;
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUser(prev => prev ? {
          ...prev,
          displayName: data.displayName || prev.displayName,
          photoURL: data.photoURL || prev.photoURL,
          phoneNumber: data.phoneNumber,
          address: data.address,
          role: data.role || prev.role
        } : null);
      }
    } catch (error) {
      console.error("Error refreshing user profile:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Ambil data tambahan (Role, dll) dari Firestore
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: data.displayName || firebaseUser.displayName,
              photoURL: data.photoURL || firebaseUser.photoURL,
              role: data.role,
              phoneNumber: data.phoneNumber,
              address: data.address
            });
          } else {
            // Fallback jika data Firestore belum ada (misal login via Google pertama kali)
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              role: 'customer', // Default role
              phoneNumber: '',
              address: ''
            });
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          // Tetap login user meskipun gagal ambil profil tambahan
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: null,
            phoneNumber: '',
            address: ''
          });
        }
      } else {
        // User Logout
        setUser(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Tampilan Loading Screen yang bersih
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isAdmin: user?.role === 'provider',
      refreshUserProfile
    }}>
      {children} 
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);