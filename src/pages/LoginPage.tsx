import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod'; 
import { User, Briefcase, AlertCircle, Clock, Eye, EyeOff } from 'lucide-react';

// Import Component (Menggunakan relative path agar aman)
import MainLayout from '../components/layout/MainLayout';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';

// Import Service (Disesuaikan dengan lokasi file service yang sudah kita buat)
import { loginUser } from '../services/auth.service';
import { getUserProfile } from '../services/user.service';

// 1. Schema Validasi (Sanitasi Input menggunakan Zod)
const loginSchema = z.object({
  email: z.string().min(1, "Email wajib diisi").email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

const LoginPage = () => {
  const navigate = useNavigate();
  
  // State Management
  const [role, setRole] = useState<'customer' | 'provider'>('customer');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [errors, setErrors] = useState<{[key: string]: string}>({}); // Error per field
  const [authError, setAuthError] = useState<string | null>(null); // Error global (auth)
  const [showPassword, setShowPassword] = useState(false);

  // Handle Input Change & Clear Errors
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Hapus error field saat user mengetik ulang
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // 2. Logic Login Utama
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setErrors({});

    // A. Tahap Validasi (Sanitasi) Frontend
    const validationResult = loginSchema.safeParse(formData);
    if (!validationResult.success) {
      const formattedErrors: { [key: string]: string } = {};
      const fieldErrors: { [key: string]: string[] | undefined } = validationResult.error.flatten().fieldErrors;
      for (const key in fieldErrors) {
        if (fieldErrors[key]) {
          formattedErrors[key] = fieldErrors[key]![0];
        }
      }
      setErrors(formattedErrors);
      return;
    }

    setStatus('loading');

    try {
      // B. Tahap Autentikasi (Firebase Auth)
      const authResult = await loginUser(formData.email, formData.password);
      
      if (!authResult || !authResult.uid) {
        throw new Error("Gagal mendapatkan sesi pengguna.");
      }

      // C. Tahap Verifikasi Role (Database Check)
      const userProfile = await getUserProfile(authResult.uid);

      if (!userProfile) {
        throw new Error("Data profil pengguna tidak ditemukan.");
      }

      // Logic Pengecekan: Apakah role di database COCOK dengan role yang dipilih di dropdown?
      // Kita cek field 'role' dari database
      if (userProfile.role !== role) {
        throw new Error(`Akun ini terdaftar sebagai ${userProfile.role === 'customer' ? 'Pelanggan' : 'Penyedia Jasa'}, bukan ${role === 'customer' ? 'Pelanggan' : 'Penyedia Jasa'}. Silakan ganti pilihan peran.`);
      }

      setStatus('success');
      
      // D. Redirect sesuai Role yang SUDAH TERVERIFIKASI
      const destination = userProfile.role === 'provider' ? '/provider/dashboard' : '/services'; // Disesuaikan ke /services untuk customer
      navigate(destination);

    } catch (err: any) {
      console.error("Login Error:", err);
      
      // Sanitasi pesan error dari Firebase agar lebih user-friendly
      let errorMessage = "Terjadi kesalahan saat login.";
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        errorMessage = "Email atau password salah.";
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setAuthError(errorMessage);
      setStatus('idle');
    }
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-center min-h-[calc(100vh-140px)] bg-gray-50/50 py-12">
        <Card className="w-full max-w-md p-8 shadow-xl border-0">
          
          {/* Header Section */}
          <div className="flex justify-center mb-4">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-blue-200 shadow-lg">
              <Clock size={20} />
            </div>
          </div>
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Selamat Datang di Helpo</h1>
            <p className="text-gray-500 text-sm mt-2">Temukan penyedia jasa terbaik untuk kebutuhan Anda</p>
          </div>

          {/* Toggle Switch (Visual Only) */}
          <div className="bg-gray-100 p-1 rounded-xl flex mb-6 relative">
            <button className="w-1/2 py-2 rounded-lg bg-white shadow-sm text-sm font-semibold text-gray-800 transition-all cursor-default">
              Masuk
            </button>
            <Link to="/register" className="w-1/2 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-700 text-center transition-all focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-200">
              Daftar
            </Link>
          </div>

          <form className="space-y-5" onSubmit={handleLogin} noValidate>
            
            {/* Global Error Alert */}
            {authError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-start gap-2 animate-pulse-fast">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <p>{authError}</p>
              </div>
            )}

            {/* Role Selection */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Masuk Sebagai</label>
              <div className="relative">
                <select 
                  className="w-full px-10 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-primary focus:ring-2 focus:ring-blue-100 transition-all outline-none appearance-none cursor-pointer text-gray-700"
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'customer' | 'provider')}
                >
                  <option value="customer">Pelanggan</option>
                  <option value="provider">Penyedia Jasa</option>
                </select>
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {role === 'customer' ? <User size={18} /> : <Briefcase size={18} />}
                </div>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  ▼
                </div>
              </div>
            </div>

            {/* Email Input */}
            <div>
              <Input
                label="Email"
                type="email"
                name="email"
                placeholder="nama@email.com"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "border-red-300 focus:border-red-500 focus:ring-red-200" : ""}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1 ml-1">{errors.email}</p>}
            </div>

            {/* Password Input */}
            <div>
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={
                    (errors.password
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                      : "") + " pr-10"
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute bottom-3 right-3 flex items-center text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? "Sembunyikan sandi" : "Tampilkan sandi"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1 ml-1">{errors.password}</p>}
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              variant="primary" 
              fullWidth 
              className="mt-2"
              disabled={status === 'loading' || status === 'success'}
            >
              {status === 'loading' ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Memverifikasi...
                </span>
              ) : status === 'success' ? 'Berhasil!' : 'Masuk'}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Belum punya akun? <Link to="/register" className="text-blue-600 font-semibold hover:underline">Daftar sekarang</Link>
          </p>

        </Card>
      </div>
    </MainLayout>
  );
};

export default LoginPage;