import { Clock, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Header = () => {
    const navLinks = [
        { href: '#', label: 'Fitur' },
        { href: '#', label: 'Layanan' },
        { href: '#', label: 'Cara Kerja' },
        { href: '#', label: 'Tentang' },
    ];

    const NavLinks = ({ className }: { className?: string }) => (
        <nav className={className}>
            {navLinks.map((link) => (
                <a key={link.label} href={link.href} className="text-slate-600 font-medium hover:text-blue-600 transition-colors">{link.label}</a>
            ))}
        </nav>
    );

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className='w-full bg-white py-4 md:px-10 flex items-center justify-between shadow-sm relative px-4'>

            {/* Logo */}
            <div className="flex items-center justify-center">
                <div className='bg-blue-600 p-2 rounded-xl items-center text-white'>
                    <Clock size={20} strokeWidth={2.5} />
                </div>
                <span className='text-xl p-2 font-light text-slate-700'>Helpo</span>
            </div>

            {/*Navigasi*/}
            <NavLinks className='hidden md:flex items-center gap-10' />


            {/*Tombol Aksi*/}
            <div className='hidden md:flex items-center gap-4'>
                <button className="px-4 py-2.5 border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-amber-500 transition-colors">Masuk</button>
                <button className="px-4 py-2.5 bg-blue-600 border border-blue-700 rounded-xl text-white font-medium hover:bg-blue-50 transition-colors">Daftar Sekarang</button>
            </div>

            {/* Mobile Menu Button */}
            <div className='md:hidden'>
                <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className='absolute top-full left-0 w-full bg-white shadow-md md:hidden'>
                    <NavLinks className='flex flex-col items-center gap-4 py-4' />
                    <div className='flex flex-col items-center gap-4 py-4'>
                        <button className="px-4 py-2.5 border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-amber-500 transition-colors">Masuk</button>
                        <button className="px-4 py-2.5 bg-blue-600 border border-blue-700 rounded-xl text-white font-medium hover:bg-blue-50 transition-colors">Daftar Sekarang</button>
                    </div>
                </div>
            )}

        </header>
    )
}

export default Header;