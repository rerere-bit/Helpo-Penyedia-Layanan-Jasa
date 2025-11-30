import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import MainLayout from '@/components/layout/MainLayout';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { User, Briefcase } from 'lucide-react';

const LoginPage = () => {
  const [role, setRole] = useState<'customer' | 'provider'>('customer');
  const navigate = useNavigate(); // 2. Inisialisasi hook navigasi
  const [isLoading, setIsLoading] = useState(false);

  // 3. Fungsi Logika Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); // Mencegah reload halaman
    setIsLoading(true);

    // Simulasi loading 1.5 detik (agar terasa seperti aplikasi nyata)
    setTimeout(() => {
      setIsLoading(false);
      // Redirect berdasarkan peran: jika provider, ke Provider Dashboard
      const destination = role === 'provider' ? '/provider/dashboard' : '/dashboard';
      navigate(destination);
    }, 1500);
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-center min-h-[calc(100vh-140px)] bg-gray-50/50 py-12">
        <Card className="w-full max-w-md p-8 shadow-xl border-0">
          
          <div className="flex justify-center mb-4">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-blue-200 shadow-lg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
          </div>
          <div className="text-center mb-8">
            
            <h1 className="text-2xl font-bold text-gray-800">Selamat Datang di Helpo</h1>
            <p className="text-gray-500 text-sm mt-2">Temukan penyedia jasa terbaik untuk kebutuhan Anda</p>
          </div>

          <div className="bg-gray-100 p-1 rounded-xl flex mb-6 relative">
            <button className="w-1/2 py-2 rounded-lg bg-white shadow-sm text-sm font-semibold text-gray-800 transition-all">
              Masuk
            </button>
            <Link to="/register" className="w-1/2 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-700 text-center transition-all">
              Daftar
            </Link>
          </div>

          {/* 4. Tambahkan onSubmit */}
          <form className="space-y-5" onSubmit={handleLogin}>
            
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Masuk Sebagai</label>
              <div className="relative">
                <select 
                  className="w-full px-10 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-primary focus:ring-2 focus:ring-blue-100 transition-all outline-none appearance-none cursor-pointer text-gray-700"
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
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

            <Input 
              label="Email" 
              type="email" 
              placeholder="nama@email.com" 
              required // Validasi HTML sederhana
            />
            
            <Input 
              label="Password" 
              type="password" 
              placeholder="••••••••" 
              required
            />

            {/* 5. Update Tombol: Tampilkan loading text */}
            <Button 
              type="submit" // Penting: type submit agar form bekerja
              variant="primary" 
              fullWidth 
              className="mt-2"
              disabled={isLoading}
            >
              {isLoading ? 'Memproses...' : 'Masuk'}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Belum punya akun? <Link to="/register" className="text-primary font-semibold hover:underline">Daftar sekarang</Link>
          </p>

        </Card>
      </div>
    </MainLayout>
  );
};

export default LoginPage;