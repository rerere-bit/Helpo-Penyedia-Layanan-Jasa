import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Container } from '@/components/common/Container';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Fitur', href: '#features' },
    { name: 'Layanan', href: '#services' },
    { name: 'Cara Kerja', href: '#how-it-works' },
    { name: 'Tentang', href: '#about' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
      <Container>
        <div className="flex items-center justify-between h-20">
          
          {/* 1. Logo */}
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-blue-200 shadow-lg">
              <span className="text-xl font-light">H</span>
            </div>
            <span className="text-2xl font-bold text-gray-800 tracking-tight">Helpo</span>
          </div>

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

          {/* 3. Desktop Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="md">
              Masuk
            </Button>
            <Button variant="primary" size="md">
              Daftar Sekarang
            </Button>
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
        <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b shadow-lg p-4 flex flex-col gap-4 animate-in slide-in-from-top-5">
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
            <Button variant="ghost" fullWidth onClick={() => setIsOpen(false)}>
              Masuk
            </Button>
            <Button variant="primary" fullWidth onClick={() => setIsOpen(false)}>
              Daftar Sekarang
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;