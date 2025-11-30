import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ListOrdered, Briefcase, Wallet, Store, LogOut, Settings } from 'lucide-react';

const ProviderSidebar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const menus = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/provider/dashboard' },
    { name: 'Pesanan', icon: <ListOrdered size={20} />, path: '/provider/orders' },
    { name: 'Layanan Saya', icon: <Briefcase size={20} />, path: '/provider/services' },
    { name: 'Keuangan', icon: <Wallet size={20} />, path: '/provider/finance' },
    { name: 'Profil Usaha', icon: <Store size={20} />, path: '/provider/profile' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col sticky top-0 left-0">
      
      {/* 1. Logo Area */}
      <div className="h-16 flex items-center gap-2 px-6 border-b border-gray-100">
         <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-blue-200 shadow-lg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <span className="text-2xl font-light text-gray-800 tracking-tight">Helpo</span>
          <span className="text-[10px] text-blue-600 font-semibold tracking-wider">MITRA</span>
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
          <Link to="/provider/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900">
            <Settings size={20} /> Pengaturan
          </Link>
        </div>
      </div>

      {/* 3. User Profile & Logout */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <img 
            src="https://ui-avatars.com/api/?name=Mitra+Helpo&background=0D8ABC&color=fff" 
            alt="Mitra" 
            className="w-10 h-10 rounded-full"
          />
          <div className="overflow-hidden">
            <h4 className="text-sm font-bold text-gray-800 truncate">Mitra Helpo</h4>
            <p className="text-xs text-gray-500 truncate">mitra@helpo.id</p>
          </div>
        </div>
        <button className="w-full flex items-center justify-center gap-2 text-red-500 bg-red-50 hover:bg-red-100 py-2 rounded-lg text-sm font-medium transition-colors">
          <LogOut size={16} /> Keluar
        </button>
      </div>

    </aside>
  );
};

export default ProviderSidebar;