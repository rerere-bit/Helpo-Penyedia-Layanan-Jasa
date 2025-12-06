import { useState, useEffect } from 'react';
import ProviderLayout from '@/components/layout/ProviderLayout';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useAuth } from '@/context/AuthContext';
import { updateUserProfile } from '@/services/user.service';
import { Save, Loader2 } from 'lucide-react';

const ProviderSettingsPage = () => {
  const { user, refreshUserProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    phoneNumber: '',
    address: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || '',
        phoneNumber: user.phoneNumber || '',
        address: user.address || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsLoading(true);
    try {
      await updateUserProfile(user.uid, formData);
      if (refreshUserProfile) await refreshUserProfile();
      alert("Profil berhasil diperbarui!");
    } catch (error) {
      alert("Gagal update profil");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProviderLayout>
      <div className="max-w-3xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Pengaturan Akun</h1>
        
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input 
              label="Nama Usaha / Nama Lengkap" 
              value={formData.displayName} 
              onChange={e => setFormData({...formData, displayName: e.target.value})}
            />
            
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input disabled value={user?.email || ''} className="w-full px-4 py-3 bg-gray-100 rounded-xl text-gray-500 cursor-not-allowed" />
            </div>

            <Input 
              label="Nomor Telepon" 
              value={formData.phoneNumber} 
              onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
              placeholder="+62..."
            />

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Alamat Usaha</label>
              <textarea 
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-100"
                value={formData.address} 
                onChange={e => setFormData({...formData, address: e.target.value})}
              />
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <Button type="submit" disabled={isLoading} icon={isLoading ? <Loader2 className="animate-spin"/> : <Save size={18}/>}>
                {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </ProviderLayout>
  );
};

export default ProviderSettingsPage;