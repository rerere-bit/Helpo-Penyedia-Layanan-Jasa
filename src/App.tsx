import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardHomePage from './pages/DashboardHomePage';
import ServiceListingPage from './pages/ServiceListingPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import BookingPage from './pages/BookingPage';
import SchedulePage from './pages/SchedulePage';
import PaymentPage from './pages/PaymentPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import NotificationPage from './pages/NotificationPage';
import SettingsPage from './pages/SettingsPage';
import UserReviewsPage from './pages/UserReviewsPage';
import ProviderReviewsPage from './pages/ProviderReviewsPage';
import OrderDetailPage from './pages/OrderDetailPage';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import HelpPage from './pages/HelpPage';
import ProviderDashboard from './pages/provider/ProviderDashboard';
import ProviderOrdersPage from './pages/provider/ProviderOrdersPage';
import ProviderServicesPage from './pages/provider/ProviderServicesPage';
import ProviderSettingsPage from './pages/provider/ProviderSettingsPage';
import ProviderNotificationPage from './pages/provider/ProviderNotificationPage';
import ProviderSchedulePage from './pages/provider/ProviderSchedulePage';


function App() {
  const { loading } = useAuth();

  // Tampilkan loading screen saat Firebase sedang inisialisasi auth state
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Memuat aplikasi...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* === PUBLIC ROUTES (Bisa diakses siapa saja) === */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        
        {/* Strategi Marketing: Biarkan orang lihat list jasa tanpa login */}
        <Route path="/services" element={<ServiceListingPage />} />
        <Route path="/service/:id" element={<ServiceDetailPage />} />
        <Route path="/help" element={<HelpPage />} />


        {/* === PROTECTED CUSTOMER ROUTES (Harus Login) === */}
        {/* Cara bacanya: "Lindungi BookingPage. Jika gak login, tendang." */}
        
        <Route path="/booking/:id" element={
          <ProtectedRoute>
            <BookingPage />
          </ProtectedRoute>
        } />

        <Route path="/payment/:id" element={
          <ProtectedRoute>
            <PaymentPage />
          </ProtectedRoute>
        } />

        <Route path="/payment/success" element={
          <ProtectedRoute>
            <PaymentSuccessPage />
          </ProtectedRoute>
        } />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardHomePage />
          </ProtectedRoute>
        } />

        <Route path="/history" element={
          <ProtectedRoute>
            <HistoryPage />
          </ProtectedRoute>
        } />

        <Route path="/schedule" element={
          <ProtectedRoute>
            <SchedulePage />
          </ProtectedRoute>
        } />

        <Route path="/order/:id" element={
          <ProtectedRoute>
            <OrderDetailPage />
          </ProtectedRoute>
        } />

        <Route path="/notification" element={
          <ProtectedRoute>
            <NotificationPage />
          </ProtectedRoute>
        } />

        <Route path="/settings" element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        
        <Route path="/profile/edit" element={
          <ProtectedRoute>
            <EditProfilePage />
          </ProtectedRoute>
        } />

        <Route path="/user/reviews" element={
          <ProtectedRoute>
            <UserReviewsPage />
          </ProtectedRoute>
        } />


        {/* === PROTECTED PROVIDER ROUTES (Harus Login + Harus Provider) === */}
        {/* Kita tambahkan props onlyProvider={true} */}

        <Route path="/provider/dashboard" element={
          <ProtectedRoute onlyProvider={true}>
            <ProviderDashboard />
          </ProtectedRoute>
        } />

        <Route path="/provider/orders" element={
          <ProtectedRoute onlyProvider={true}>
            <ProviderOrdersPage />
          </ProtectedRoute>
        } />

        <Route path="/provider/services" element={
          <ProtectedRoute onlyProvider={true}>
            <ProviderServicesPage />
          </ProtectedRoute>
        } />

        <Route path="/provider/reviews" element={
          <ProtectedRoute onlyProvider={true}>
            <ProviderReviewsPage />
          </ProtectedRoute>
        } />

        {/* Catch-all untuk provider sub-routes */}
        <Route path="/provider/*" element={
          <ProtectedRoute onlyProvider={true}>
            <ProviderDashboard />
          </ProtectedRoute>
        } />

        <Route path="/provider/settings" element={
          <ProtectedRoute onlyProvider={true}>
            <ProviderSettingsPage />
          </ProtectedRoute>
        } />

        <Route path="/provider/notifications" element={
          <ProtectedRoute onlyProvider={true}>
            <ProviderNotificationPage />
          </ProtectedRoute>
        } />

        <Route path="/provider/schedule" element={
          <ProtectedRoute onlyProvider={true}>
            <ProviderSchedulePage />
          </ProtectedRoute>
        } />


        {/* === 404 NOT FOUND === */}
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>
              <p className="text-gray-600">Halaman tidak ditemukan</p>
              <a href="/" className="text-blue-600 hover:underline mt-4 block">Kembali ke Beranda</a>
            </div>
          </div>
        } />

      </Routes>
    </Router>
  );
}

export default App;