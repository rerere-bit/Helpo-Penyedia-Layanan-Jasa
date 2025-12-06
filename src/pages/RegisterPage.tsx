import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Briefcase, AlertCircle, Clock, Eye, EyeOff } from 'lucide-react';

// Menggunakan RELATIVE PATH agar aman
import MainLayout from '../components/layout/MainLayout';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { registerUser } from '../services/auth.service';

const RegisterPage = () => {
  // 1. STATE: Variable untuk menampung input user
  const [role, setRole] = useState<'customer' | 'provider'>('customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // State untuk UX (Loading & Error message)
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // 2. LOGIC: Fungsi ini jalan saat form disubmit
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setIsLoading(true);
    setError(''); 

    try {
      // Panggil fungsi Backend
      await registerUser({
        email: email,
        pass: password,
        name: name,
        role: role
      });

      // Redirect sukses
      if (role === 'provider') {
        navigate('/provider/dashboard'); 
      } else {
        navigate('/services');
      }

    } catch (err: any) {
      console.error("Register Error:", err);
      let message = err.message;
      if (message.includes("email-already-in-use")) message = "Email ini sudah terdaftar.";
      if (message.includes("weak-password")) message = "Password terlalu lemah (min 6 karakter).";
      
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-center min-h-[calc(100vh-140px)] bg-gray-50/50 py-12">
        <Card className="w-full max-w-md p-8 shadow-xl border-0">
          
          <div className="flex justify-center mb-4">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-blue-200 shadow-lg">
              <Clock size={20} />
            </div>
          </div>

          <div className="bg-gray-100 p-1 rounded-xl flex mb-6 relative">
            <Link to="/login" className="w-1/2 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-700 text-center transition-all">
              Masuk
            </Link>
            <button className="w-1/2 py-2 rounded-lg bg-white shadow-sm text-sm font-semibold text-gray-800 transition-all">
              Daftar
            </button>
          </div>

          {/* Menampilkan Error Alert jika ada error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleRegister}>
            
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Daftar Sebagai</label>
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
              label="Nama Lengkap" 
              type="text" 
              placeholder="John Doe" 
              required 
              value={name}
              onChange={(e: any) => setName(e.target.value)}
            />
            
            <Input 
              label="Email" 
              type="email" 
              placeholder="nama@email.com" 
              required 
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
            />
            
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
                className="pr-10"
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

            <Button type="submit" variant="primary" fullWidth className="mt-2" disabled={isLoading}>
              {isLoading ? 'Memproses...' : 'Daftar'}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Sudah punya akun? <Link to="/login" className="text-primary font-semibold hover:underline">Masuk disini</Link>
          </p>

        </Card>
      </div>
    </MainLayout>
  );
};

export default RegisterPage;