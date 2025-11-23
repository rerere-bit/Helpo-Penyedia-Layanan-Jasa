import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { User, Briefcase } from 'lucide-react';

const RegisterPage = () => {
  const [role, setRole] = useState<'customer' | 'provider'>('customer');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulasi register
    setTimeout(() => {
      setIsLoading(false);
      navigate('/services'); 
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

          <div className="bg-gray-100 p-1 rounded-xl flex mb-6 relative">
            <Link to="/login" className="w-1/2 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-700 text-center transition-all">
              Masuk
            </Link>
            <button className="w-1/2 py-2 rounded-lg bg-white shadow-sm text-sm font-semibold text-gray-800 transition-all">
              Daftar
            </button>
          </div>

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

            <Input label="Nama Lengkap" type="text" placeholder="John Doe" required />
            <Input label="Email" type="email" placeholder="nama@email.com" required />
            <Input label="Password" type="password" placeholder="••••••••" required />

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