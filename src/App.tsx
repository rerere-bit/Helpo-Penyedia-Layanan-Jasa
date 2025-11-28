import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Halaman
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ServiceListingPage from '@/pages/ServiceListingPage';
import ServiceDetailPage from '@/pages/ServiceDetailPage';
import BookingPage from '@/pages/BookingPage';
import SchedulePage from '@/pages/SchedulePage';
import PaymentPage from '@/pages/PaymentPage';
import PaymentSuccessPage from '@/pages/PaymentSuccessPage';
import NotificationPage from '@/pages/NotificationPage';
import UserReviewsPage from '@/pages/UserReviewsPage';
import ProviderReviewsPage from '@/pages/ProviderReviewsPage';
import OrderDetailPage from '@/pages/OrderDetailPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Route Utama (Landing Page) */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Auth Routes (Halaman Login & Register) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Product Routes (Halaman Cari Jasa) */}
        <Route path="/services" element={<ServiceListingPage />} />

        {/* Payment Routes */}
        <Route path="/payment/:id" element={<PaymentPage />} />
        <Route path="/payment/success" element={<PaymentSuccessPage />} />

        {/* Service Detail Routes (Halaman Detail Jasa)*/}
        <Route path="/service/:id" element={<ServiceDetailPage />} />

        {/* Service Booking Routes (Halaman Booking Jasa) */}
        <Route path="/booking/:id" element={<BookingPage />} />

        {/* Schedule Routes (Halaman Penjadwalan) */}
        <Route path="/schedule" element={<SchedulePage />} />

        {/* Route Baru untuk Detail Pesanan (bisa diakses dari Jadwal atau Riwayat) */}
        <Route path="/order/:id" element={<OrderDetailPage />} />

        {/* Notification Routes (Halaman Notifikasi) */}
        <Route path="/notification" element={<NotificationPage />} />

        {/* Review Routes */}
          {/* user */}
        <Route path="/user/reviews" element={<UserReviewsPage />} />
          {/* admin */}
        <Route path="/provider/reviews" element={<ProviderReviewsPage />} /> 

        {/* Route 404 (Jika halaman tidak ditemukan) */}
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