import { Link, useLocation, useNavigate } from 'react-router-dom'; // 1. Tambahkan useLocation, useNavigate
import { Home, Search, Clock, Calendar, HelpCircle, Bell, User, LogOut } from 'lucide-react';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';

const DashboardNavbar = () => {
  const location = useLocation(); // 2. Ambil data lokasi/URL saat ini
  const currentPath = location.pathname; // 3. Simpan path saat ini
  const navigate = useNavigate();

  const handleLogout = () => {
    // Konfirmasi keluar
    if (window.confirm('Anda yakin ingin keluar?')) {
      try {
        // Hapus kemungkinan token / user data dari storage
        localStorage.removeItem('token');
        localStorage.removeItem('auth');
        localStorage.removeItem('user');
        sessionStorage.clear();
      } catch (e) {
        // ignore
      }
      // Arahkan ke halaman login
      navigate('/login');
    }
  };
  
  // 4. Ubah logika 'active' menjadi dinamis (membandingkan path)
  const menus = [
    { 
      name: 'Beranda', 
      icon: <Home size={18} />, 
      href: '/dashboard', 
      active: currentPath === '/dashboard' 
    },
    { 
      name: 'Cari Jasa', 
      icon: <Search size={18} />, 
      href: '/services', 
      // Menggunakan startsWith agar tetap aktif saat masuk ke detail jasa (/service/1)
      active: currentPath.startsWith('/services') || currentPath.startsWith('/service') 
    },
    { 
      name: 'Riwayat', 
      icon: <Clock size={18} />, 
      href: '/history', 
      active: currentPath === '/history' 
    },
    { 
      name: 'Jadwal', 
      icon: <Calendar size={18} />, 
      href: '/schedule', 
      active: currentPath === '/schedule' 
    },
    { 
      name: 'Bantuan', 
      icon: <HelpCircle size={18} />, 
      href: '/help', 
      active: currentPath === '/help' 
    },
  ];

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <Container>
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-blue-200 shadow-lg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <span className="text-2xl font-light text-gray-800 tracking-tight">Helpo</span>
          </Link>

          {/* Center Menu */}
          <div className="hidden lg:flex items-center gap-2 bg-gray-50 p-1.5 rounded-full">
            {menus.map((menu) => (
              <Link 
                key={menu.name} 
                to={menu.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  menu.active 
                    ? 'bg-blue-100 text-primary' // Style jika Aktif
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100' // Style jika Tidak Aktif
                }`}
              >
                {menu.icon}
                {menu.name}
              </Link>
            ))}
          </div>

          {/* Right Menu (Profile) */}
          <div className="flex items-center gap-4">
            <Link to="/notification" className="relative text-gray-500 hover:text-primary p-1">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </Link>
          
            <Link to="/profile" className="text-gray-500 hover:text-primary p-1">
              <User size={20} />
            </Link>          
            
            <div className="h-6 w-px bg-gray-200 mx-1"></div>

            <Button 
              variant="outline" 
              className="border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200 h-9 px-4 text-sm gap-2"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              Keluar
            </Button>
          </div>
        </div>
      </Container>
    </nav>
  );
};

export default DashboardNavbar;