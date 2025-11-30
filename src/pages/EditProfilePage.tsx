import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, ChevronLeft, Save } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Container } from '@/components/common/Container';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

const EditProfilePage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Mock Initial Data
  const [formData, setFormData] = useState({
    name: "Ahmad Fauzi",
    email: "ahmad.fauzi@email.com",
    phone: "+62 812-3456-7890",
    address: "Jl. Sudirman No. 123, Jakarta"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulasi API call
    setTimeout(() => {
      setIsLoading(false);
      navigate('/profile'); // Balik ke halaman profil setelah simpan
    }, 1000);
  };

  return (
    <DashboardLayout>
      <Container>
        <div className="max-w-2xl mx-auto pb-20">
          
          {/* Header Nav */}
          <button 
            onClick={() => navigate('/profile')} 
            className="flex items-center gap-2 text-gray-500 hover:text-primary mb-6 transition-colors"
          >
            <ChevronLeft size={20} /> Kembali ke Profil
          </button>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Edit Profil</h1>
            <p className="text-gray-500">Perbarui informasi pribadi Anda</p>
          </div>

          <form onSubmit={handleSave}>
            <Card className="p-8">
              
              {/* Foto Profil */}
              <div className="flex flex-col items-center mb-8 border-b border-gray-100 pb-8">
                <div className="relative mb-4 group cursor-pointer">
                  <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-lg overflow-hidden group-hover:opacity-90 transition-opacity">
                    {/* Simulasi jika ada gambar */}
                    {/* <img src="..." className="w-full h-full object-cover" /> */}
                    AF
                  </div>
                  <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="text-white" size={24} />
                  </div>
                </div>
                <p className="text-sm text-primary font-semibold cursor-pointer hover:underline">
                  Ubah Foto Profil
                </p>
              </div>

              {/* Form Input */}
              <div className="space-y-5">
                <Input 
                  label="Nama Lengkap" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                />
                
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input 
                    disabled 
                    value={formData.email} 
                    className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-transparent text-gray-500 cursor-not-allowed"
                    title="Email tidak dapat diubah"
                  />
                  <p className="text-xs text-gray-400">Email tidak dapat diubah</p>
                </div>

                <Input 
                  label="Nomor Telepon" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                />

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">Alamat</label>
                  <textarea 
                    name="address"
                    value={formData.address}
                    // @ts-ignore
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary focus:ring-2 focus:ring-blue-100 transition-all outline-none text-gray-800 resize-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8 pt-6 border-t border-gray-100">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1 border-gray-300 text-gray-700"
                  onClick={() => navigate('/profile')}
                >
                  Batal
                </Button>
                <Button 
                  type="submit" 
                  variant="primary" 
                  className="flex-1"
                  disabled={isLoading}
                  icon={<Save size={18} />}
                >
                  {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </Button>
              </div>

            </Card>
          </form>

        </div>
      </Container>
    </DashboardLayout>
  );
};

export default EditProfilePage;