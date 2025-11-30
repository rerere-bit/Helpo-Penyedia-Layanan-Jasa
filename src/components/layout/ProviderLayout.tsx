import React from 'react';
import ProviderSidebar from './ProviderSidebar';
import { Bell, Menu } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

const ProviderLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      
      {/* Sidebar (Desktop) */}
      <div className="hidden lg:block shrink-0">
        <ProviderSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="bg-white h-16 border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Menu size={20} />
            </button>
            <h1 className="font-bold text-gray-800 text-lg lg:hidden">Helpo Mitra</h1>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="p-4 lg:p-8 flex-1 overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
  );
};

export default ProviderLayout;