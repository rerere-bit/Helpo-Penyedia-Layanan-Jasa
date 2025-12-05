import DashboardLayout from '@/components/layout/DashboardLayout';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Bell, Lock, Shield, HelpCircle, LogOut, ChevronRight, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const navigate = useNavigate();

  // MOCK DATA USER
  const user = {
    name: "Fahmi Starboy",
    email: "ZulGantengSekali@email.com",
    phone: "+62 812-3456-7890",
    address: "Kost Biru, Gowa",
    initials: "ZX"
  };

  const menuItems = [
    // Mengarahkan ke halaman Notifikasi
    { icon: <Bell size={20} />, label: "Notifikasi", href: "/notification" }, 
    // Mengarahkan ke Settings (Tab Keamanan)
    { icon: <Lock size={20} />, label: "Ubah Password", href: "/settings" }, 
    { icon: <Shield size={20} />, label: "Privasi & Keamanan", href: "/settings" },
    { icon: <HelpCircle size={20} />, label: "Bantuan & Dukungan", href: "/help" },
  ];

  const handleLogout = () => {
    // Simulasi logout: Hapus token (jika ada) dan kembali ke login
    navigate('/login');
  };

  return (
    <DashboardLayout>
      <Container>
        <div className="max-w-3xl mx-auto pb-20">
          
          {/* Header Avatar */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-4">
              <div className="w-24 h-24 bg-blue-800 rounded-full flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-lg">
                {user.initials}
              </div>
              <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md text-gray-600 hover:text-primary border border-gray-100">
                <Camera size={16} />
              </button>
            </div>
            <h1 className="text-xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-gray-500">{user.email}</p>
          </div>

          {/* Form Data Diri (Read Only) */}
          <Card className="p-8 mb-6">
            <div className="space-y-6">
              {/* Nama Lengkap */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Nama Lengkap</label>
                <div className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 text-gray-600">
                  {user.name}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Email</label>
                <div className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 text-gray-600">
                  {user.email}
                </div>
              </div>

              {/* Nomor Telepon */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Nomor Telepon</label>
                <div className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 text-gray-600">
                  {user.phone}
                </div>
              </div>

              {/* Alamat */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Alamat</label>
                <div className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 text-gray-600">
                  {user.address}
                </div>
              </div>

              {/* Tombol Edit */}
              <Button 
                fullWidth 
                className="mt-4"
                onClick={() => navigate('/profile/edit')} // Navigasi ke Edit
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
                onClick={() => navigate(item.href)} // Navigasi Menu
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
            onClick={handleLogout} // Navigasi Logout
          >
            Keluar
          </Button>

        </div>
      </Container>
    </DashboardLayout>
  );
};

export default ProfilePage;