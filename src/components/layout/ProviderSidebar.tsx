import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ListOrdered, Briefcase, LogOut, Settings, Calendar } from 'lucide-react'; 
import { useAuth } from '@/context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const ProviderSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    if (confirm('Keluar dari panel mitra?')) {
      await signOut(auth);
      navigate('/login');
    }
  };

  const menus = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/provider/dashboard' },
    { name: 'Pesanan', icon: <ListOrdered size={20} />, path: '/provider/orders' },
    { name: 'Layanan Saya', icon: <Briefcase size={20} />, path: '/provider/services' },
    { name: 'Atur Jadwal', icon: <Calendar size={20} />, path: '/provider/schedule' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col sticky top-0 left-0">
      
      {/* 1. Logo Area */}
      <div className="h-16 flex items-center gap-2 px-6 border-b border-gray-100">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
          H
        </div>
        <div>
          <span className="text-lg font-bold text-gray-800 block leading-none">Helpo</span>
          <span className="text-[10px] text-blue-600 font-semibold tracking-wider">MITRA</span>
        </div>
      </div>

      {/* 2. Navigation Menu */}
      <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        <p className="px-3 text-xs font-semibold text-gray-400 mb-2">MENU UTAMA</p>
        {menus.map((menu) => (
          <Link
            key={menu.path}
            to={menu.path}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive(menu.path)
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            {menu.icon}
            {menu.name}
          </Link>
        ))}
        
        <div className="pt-4 mt-4 border-t border-gray-100">
          <p className="px-3 text-xs font-semibold text-gray-400 mb-2">LAINNYA</p>
          <Link 
            to="/provider/settings" 
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive('/provider/settings') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Settings size={20} /> Pengaturan
          </Link>
        </div>
      </div>

      {/* 3. User Profile & Logout */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 overflow-hidden">
             {user?.photoURL ? <img src={user.photoURL} alt="p" className="w-full h-full object-cover"/> : (user?.displayName?.[0] || 'M')}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-sm font-bold text-gray-800 truncate">{user?.displayName || 'Mitra'}</h4>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 text-red-500 bg-red-50 hover:bg-red-100 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <LogOut size={16} /> Keluar
        </button>
      </div>

    </aside>
  );
};

export default ProviderSidebar;