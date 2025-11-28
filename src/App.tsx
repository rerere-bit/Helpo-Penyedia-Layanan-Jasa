import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Halaman
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ServiceListingPage from './pages/ServiceListingPage';
import HistoryPage from './pages/HistoryPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* 1. Route Utama (Landing Page) */}
        <Route path="/" element={<LandingPage />} />
        
        {/* 2. Auth Routes (Halaman Login & Register) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* 3. Product Routes (Halaman Cari Jasa) */}
        <Route path="/services" element={<ServiceListingPage />} />

        {/* 4. History Routes (Halaman Riwayat Pesanan) */} 
        <Route path="/history" element={<HistoryPage />} />
        
        {/* 4. Route 404 (Jika halaman tidak ditemukan) */}
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>
              <p className="text-gray-600">Halaman tidak ditemukan</p>
              <a href="/" className="text-primary hover:underline mt-4 block">Kembali ke Beranda</a>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;