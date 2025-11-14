import { Clock } from 'lucide-react';

const Header = () =>{
    return(
        <header className='w-full bg-white py-4 md:px-10 flex items-center justify-between shadow-sm'>
            
            {/* Logo */}
            <div className="flex items-center justify-center">
                <div className='bg-blue-600 p-2 rounded-xl items-center text-white'>
                    <Clock size={20} strokeWidth={2.5}/>
                </div>
                <span className='text-xl p-2 font-light text-slate-700'>Helpo</span>
            </div>

            {/*Navigasi*/}
            <nav className='hidden md:flex items-center gap-10'>
                <a href="#" className="text-slate-600 font-medium hover:text-blue-600 transition-colors">Fitur</a>
                <a href="#" className="text-slate-600 font-medium hover:text-blue-600 transition-colors">Layanan</a>
                <a href="#" className="text-slate-600 font-medium hover:text-blue-600 transition-colors">Cara Kerja</a>
                <a href="#" className="text-slate-600 font-medium hover:text-blue-600 transition-colors">Tentang</a>
            </nav>

            {/*Tombol Aksi*/}
            <div className='flex items-center gap-4'>
                <button className="px-4 py-2.5 border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-amber-500 transition-colors">Masuk</button>
                <button className="px-4 py-2.5 bg-blue-600 border border-blue-700 rounded-xl text-white font-medium hover:bg-blue-50 transition-colors">Daftar Sekarang</button>
            </div>

        </header>
    )
}

export default Header;