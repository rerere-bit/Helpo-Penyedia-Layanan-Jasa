import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Sesuaikan path ke AuthContext

interface ProtectedRouteProps {
  children: React.ReactNode;
  onlyProvider?: boolean; // Opsi tambahan: Apakah halaman ini KHUSUS provider?
}

const ProtectedRoute = ({ children, onlyProvider = false }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 1. Tampilkan Loading screen saat Firebase sedang mengecek status login
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Memuat akses...</p>
        </div>
      </div>
    );
  }

  // 2. Jika User BELUM Login, tendang ke halaman Login
  if (!user) {
    // state={{ from: location }} berguna agar setelah login, user dikembalikan ke halaman yang tadi mau dia buka
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Logic Khusus: Jika halaman ini KHUSUS Provider, tapi user BUKAN Provider
  if (onlyProvider && user.role !== 'provider') {
    // Tendang balik ke Dashboard Customer
    return <Navigate to="/dashboard" replace />;
  }

  // 4. Jika lolos semua pengecekan, tampilkan halaman yang diminta
  return <>{children}</>;
};

export default ProtectedRoute;