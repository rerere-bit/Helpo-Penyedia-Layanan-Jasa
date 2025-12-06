import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Bell, Lock, Shield, HelpCircle, LogOut, ChevronRight, Camera } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Ambil inisial dari nama user
  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name.split(' ').slice(0, 2).map(part => part[0].toUpperCase()).join('');
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const menuItems = [
    { icon: <Bell size={20} />, label: "Notifikasi", href: "/notification" },
    { icon: <Lock size={20} />, label: "Ubah Password", href: "/settings" },
    { icon: <Shield size={20} />, label: "Privasi & Keamanan", href: "/settings" },
    { icon: <HelpCircle size={20} />, label: "Bantuan & Dukungan", href: "/help" },
  ];

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <Container>
        <div className="max-w-3xl mx-auto pb-20">
          
          {/* Header Avatar */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-4">
              <div className="w-24 h-24 bg-blue-800 rounded-full flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-lg overflow-hidden">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover" />
                ) : (
                  getInitials(user.displayName)
                )}
              </div>
              <button 
                onClick={() => navigate('/profile/edit')}
                className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md text-gray-600 hover:text-primary border border-gray-100"
              >
                <Camera size={16} />
              </button>
            </div>
            <h1 className="text-xl font-bold text-gray-900">{user.displayName || 'User'}</h1>
            <p className="text-gray-500">{user.email}</p>
          </div>

          {/* Form Data Diri */}
          <Card className="p-8 mb-6">
            <div className="space-y-6">
              {/* Nama Lengkap */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Nama Lengkap</label>
                <div className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 text-gray-600">
                  {user.displayName || '-'}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Email</label>
                <div className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 text-gray-600">
                  {user.email || '-'}
                </div>
              </div>

              {/* Nomor Telepon */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Nomor Telepon</label>
                <div className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 text-gray-600">
                  {user.phoneNumber || '-'}
                </div>
              </div>

              {/* Alamat */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Alamat</label>
                <div className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 text-gray-600 max-h-20 overflow-y-auto">
                  {user.address || '-'}
                </div>
              </div>

              {/* Tombol Edit */}
              <Button 
                fullWidth 
                className="mt-4"
                onClick={() => navigate('/profile/edit')}
              >
                Edit Profil
              </Button>
            </div>
          </Card>

          {/* Menu Pengaturan */}
          <div className="space-y-3 mb-8">
            {menuItems.map((item, index) => (
              <button 
                key={index}
                onClick={() => navigate(item.href)}
                className="w-full bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between hover:bg-gray-50 transition-colors shadow-sm"
              >
                <div className="flex items-center gap-4 text-gray-700">
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </div>
                <ChevronRight size={18} className="text-gray-400" />
              </button>
            ))}
          </div>

          {/* Tombol Logout */}
          <Button 
            fullWidth 
            className="bg-red-500 hover:bg-red-600 border-transparent text-white shadow-red-100"
            icon={<LogOut size={18} />}
            onClick={handleLogout}
          >
            Keluar
          </Button>

        </div>
      </Container>
    </DashboardLayout>
  );
};

export default ProfilePage;