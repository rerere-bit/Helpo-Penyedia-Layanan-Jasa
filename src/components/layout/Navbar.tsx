import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom'; 
import { Button } from '@/components/common/Button';
import { Container } from '@/components/common/Container';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Fitur', href: '/#features' }, 
    { name: 'Layanan', href: '/#services' },
    { name: 'Cara Kerja', href: '/#how-it-works' },
    { name: 'Tentang', href: '/#about' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
      <Container>
        <div className="flex items-center justify-between h-20">
          
          {/* 1. Logo (Klik balik ke Home) */}
          <Link to="/" className="flex items-center gap-2 cursor-pointer">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-blue-200 shadow-lg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <span className="text-2xl font-light text-gray-800 tracking-tight">Helpo</span>
          </Link>

          {/* 2. Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-gray-500 hover:text-primary font-medium transition-colors text-sm lg:text-base"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* 3. Desktop Buttons (DIBUNGKUS LINK) */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="md">
                Masuk
              </Button>
            </Link>
            
            <Link to="/register">
              <Button variant="primary" size="md">
                Daftar Sekarang
              </Button>
            </Link>
          </div>

          {/* 4. Mobile Menu Toggle */}
          <button 
            className="md:hidden text-gray-600 p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </Container>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b shadow-lg p-4 flex flex-col gap-4 animate-in slide-in-from-top-5 z-50">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="block text-gray-600 font-medium p-2 hover:bg-gray-50 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </a>
          ))}
          
          <div className="flex flex-col gap-3 pt-2 border-t mt-2">
            {/* Mobile Buttons (DIBUNGKUS LINK) */}
            <Link to="/login" className="w-full" onClick={() => setIsOpen(false)}>
              <Button variant="ghost" fullWidth>
                Masuk
              </Button>
            </Link>
            
            <Link to="/register" className="w-full" onClick={() => setIsOpen(false)}>
              <Button variant="primary" fullWidth>
                Daftar Sekarang
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;