import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, ChevronLeft, Save, Loader2 } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Container } from '@/components/common/Container';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useAuth } from '@/context/AuthContext';
import { updateUserProfile, uploadProfileImage } from '@/services/user.service';

const EditProfilePage = () => {
  const navigate = useNavigate();
  const { user, refreshUserProfile } = useAuth(); // Pastikan AuthContext menyediakan refreshUserProfile
  
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    phoneNumber: '',
    address: ''
  });

  // Inisialisasi form dengan data user saat ini
  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '', // Pastikan field ini ada di tipe User context Anda
        address: user.address || ''        // Pastikan field ini ada di tipe User context Anda
      });
      if (user.photoURL) {
        setImagePreview(user.photoURL);
      }
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validasi ukuran file (maksimal 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Ukuran file maksimal 5MB');
        return;
      }
      
      // Validasi tipe file
      if (!file.type.startsWith('image/')) {
        setError('File harus berupa gambar');
        return;
      }

      setImageFile(file);
      setError('');
      
      // Preview gambar lokal sebelum upload
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!user) return;

    // Validasi sederhana
    if (!formData.displayName.trim()) {
      setError('Nama lengkap tidak boleh kosong');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Jika ada file gambar baru, upload ke Cloudinary dulu
      if (imageFile) {
        await uploadProfileImage(user.uid, imageFile);
      }

      // 2. Update data profil (Nama, Telp, Alamat) ke Firestore
      await updateUserProfile(user.uid, {
        displayName: formData.displayName,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
      });

      // 3. Trigger refresh data user di aplikasi agar UI update otomatis
      if (refreshUserProfile) {
        await refreshUserProfile();
      }

      setSuccess('Profil berhasil diperbarui!');
      
      // Redirect kembali ke halaman profil setelah 1.5 detik
      setTimeout(() => {
        navigate('/profile');
      }, 1500);

    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan profil');
      console.error('Error saving profile:', err);
    } finally {
      setIsLoading(false);
    }
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

          {/* Alert Messages */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm animate-in fade-in slide-in-from-top-2">
              {success}
            </div>
          )}

          <form onSubmit={handleSave}>
            <Card className="p-8">
              
              {/* Foto Profil */}
              <div className="flex flex-col items-center mb-8 border-b border-gray-100 pb-8">
                <div className="relative mb-4 group cursor-pointer">
                  <div className="w-24 h-24 bg-blue-800 rounded-full flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-lg overflow-hidden group-hover:opacity-90 transition-opacity">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      user?.displayName?.slice(0, 2).toUpperCase() || 'U'
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="text-white" size={24} />
                  </div>
                  {/* Input File Tersembunyi */}
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isLoading}
                  />
                </div>
                <p className="text-sm text-primary font-semibold hover:underline cursor-pointer">
                  Ubah Foto Profil
                </p>
                <p className="text-xs text-gray-400 mt-1">Maks. 5MB (JPG, PNG)</p>
              </div>

              {/* Form Input */}
              <div className="space-y-5">
                <Input 
                  label="Nama Lengkap" 
                  name="displayName" 
                  value={formData.displayName} 
                  onChange={handleChange}
                  disabled={isLoading}
                  placeholder="Nama Anda"
                />
                
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input 
                    disabled 
                    value={formData.email} 
                    className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-transparent text-gray-500 cursor-not-allowed focus:outline-none"
                    title="Email tidak dapat diubah"
                  />
                  <p className="text-xs text-gray-400">Email tidak dapat diubah</p>
                </div>

                <Input 
                  label="Nomor Telepon" 
                  name="phoneNumber" 
                  value={formData.phoneNumber} 
                  onChange={handleChange}
                  placeholder="+62 812-xxxx-xxxx"
                  disabled={isLoading}
                />

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">Alamat</label>
                  <textarea 
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Masukkan alamat lengkap Anda"
                    disabled={isLoading}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary focus:ring-2 focus:ring-blue-100 transition-all outline-none text-gray-800 resize-none disabled:opacity-50 "
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
                  disabled={isLoading}
                >
                  Batal
                </Button>
                <Button 
                  type="submit" 
                  variant="primary" 
                  className="flex-1"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin mr-2" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save size={18} className="mr-2" />
                      Simpan Perubahan
                    </>
                  )}
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