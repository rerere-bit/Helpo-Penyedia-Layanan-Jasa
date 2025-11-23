import { RotateCcw, ChevronDown, Star } from 'lucide-react'; // <--- Star ditambahkan
import { Button } from '@/components/common/Button';

export const FilterSidebar = () => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 sticky top-28">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-bold text-gray-800">Filter</h3>
        <button className="text-gray-400 hover:text-primary transition-colors">
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Kategori Dropdown */}
      <div className="mb-6">
        <label className="block text-xs font-semibold text-gray-500 mb-2">Kategori</label>
        <div className="relative">
          <select className="w-full appearance-none bg-gray-50 border border-transparent rounded-xl px-4 py-3 text-sm text-gray-700 focus:bg-white focus:border-primary focus:outline-none cursor-pointer">
            <option>Semua</option>
            <option>Pembersihan</option>
            <option>Perbaikan</option>
            <option>Listrik</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
        </div>
      </div>

      {/* Lokasi Dropdown */}
      <div className="mb-8">
        <label className="block text-xs font-semibold text-gray-500 mb-2">Lokasi</label>
        <div className="relative">
          <select className="w-full appearance-none bg-gray-50 border border-transparent rounded-xl px-4 py-3 text-sm text-gray-700 focus:bg-white focus:border-primary focus:outline-none cursor-pointer">
            <option>Semua Lokasi</option>
            <option>Jakarta</option>
            <option>Bandung</option>
            <option>Surabaya</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
        </div>
      </div>

      {/* Rentang Harga (Visual Slider) */}
      <div className="mb-8">
        <div className="flex justify-between text-xs font-semibold text-gray-500 mb-2">
          <span>Rentang Harga</span>
        </div>
        <div className="relative h-2 bg-blue-100 rounded-full mb-3">
          <div className="absolute left-0 top-0 h-full w-2/3 bg-primary rounded-full"></div>
          {/* Perbaikan: -translate-x-0 dihapus/diganti translate-x-0 */}
          <div className="absolute top-1/2 left-0 translate-x-0 -translate-y-1/2 w-4 h-4 bg-white border-2 border-primary rounded-full shadow cursor-pointer"></div>
          <div className="absolute top-1/2 left-2/3 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-primary rounded-full shadow cursor-pointer"></div>
        </div>
        <div className="flex justify-between text-[10px] text-gray-400 font-medium">
          <span>Rp 0</span>
          <span>Rp 500,000</span>
        </div>
      </div>

      {/* Rating (Visual Slider) */}
      <div className="mb-10">
        <div className="flex justify-between text-xs font-semibold text-gray-500 mb-2">
          <span>Rating</span>
        </div>
        <div className="relative h-2 bg-blue-100 rounded-full mb-3">
          <div className="absolute right-0 top-0 h-full w-1/4 bg-primary rounded-full"></div>
          <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-primary rounded-full shadow cursor-pointer"></div>
          <div className="absolute top-1/2 right-0 translate-x-0 -translate-y-1/2 w-4 h-4 bg-white border-2 border-primary rounded-full shadow cursor-pointer"></div>
        </div>
        <div className="flex justify-between text-[10px] text-gray-400 font-medium">
          {/* Icon Star sekarang sudah dikenali */}
          <span className="flex items-center gap-1">0 <Star size={10} fill="currentColor" className="text-yellow-400"/></span>
          <span className="flex items-center gap-1">5 <Star size={10} fill="currentColor" className="text-yellow-400"/></span>
        </div>
      </div>

      <Button variant="outline" fullWidth className="border-gray-200 text-gray-600 hover:text-primary hover:border-primary gap-2">
        <RotateCcw size={16} />
        Reset Filter
      </Button>
    </div>
  );
};