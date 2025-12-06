import React from 'react';
import { RotateCcw, ChevronDown, Star } from 'lucide-react';
import { Button } from '@/components/common/Button';
import type { FilterState, Category } from '@/types'; 

interface FilterSidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  categories: Category[]; // Tambahan Props
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, setFilters, categories }) => {
  
  const handleReset = () => {
    setFilters({
      keyword: '',
      category: 'Semua',
      location: 'Semua',
      minPrice: 0,
      maxPrice: 1000000,
      minRating: 0
    });
  };

  const handleChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 sticky top-28">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-bold text-gray-800">Filter</h3>
        <button onClick={handleReset} className="text-gray-400 hover:text-primary transition-colors">
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Dynamic Category Dropdown */}
      <div className="mb-6">
        <label className="block text-xs font-semibold text-gray-500 mb-2">Kategori</label>
        <div className="relative">
          <select 
            value={filters.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full appearance-none bg-gray-50 border border-transparent rounded-xl px-4 py-3 text-sm text-gray-700 focus:bg-white focus:border-primary focus:outline-none cursor-pointer"
          >
            <option value="Semua">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.label}>
                {cat.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
        </div>
      </div>
      
      {/* Lokasi */}
      <div className="mb-8">
        <label className="block text-xs font-semibold text-gray-500 mb-2">Lokasi</label>
        <div className="relative">
          <select 
            value={filters.location}
            onChange={(e) => handleChange('location', e.target.value)}
            className="w-full appearance-none bg-gray-50 border border-transparent rounded-xl px-4 py-3 text-sm text-gray-700 focus:bg-white focus:border-primary focus:outline-none cursor-pointer"
          >
            <option value="Semua">Semua Lokasi</option>
            <option value="Jakarta">Jakarta</option>
            <option value="Bandung">Bandung</option>
            <option value="Surabaya">Surabaya</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
        </div>
      </div>

      {/* Range Harga */}
      <div className="mb-8">
        <div className="flex justify-between text-xs font-semibold text-gray-500 mb-2">
          <span>Maksimal Harga</span>
          <span className="text-primary">Rp {filters.maxPrice.toLocaleString('id-ID')}</span>
        </div>
        <input 
          type="range"
          min="0"
          max="1000000"
          step="50000"
          value={filters.maxPrice}
          onChange={(e) => handleChange('maxPrice', Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
      </div>

      {/* Rating Minimum */}
      <div className="mb-10">
        <div className="flex justify-between text-xs font-semibold text-gray-500 mb-2">
          <span>Rating Minimum</span>
          <span className="flex items-center gap-1 text-primary">
            {filters.minRating} <Star size={10} fill="currentColor" />
          </span>
        </div>
        <input 
          type="range"
          min="0"
          max="5"
          step="0.5"
          value={filters.minRating}
          onChange={(e) => handleChange('minRating', Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-400"
        />
        <div className="flex justify-between text-[10px] text-gray-400 font-medium mt-2">
          <span>0 Bintang</span>
          <span>5 Bintang</span>
        </div>
      </div>

      <Button variant="outline" fullWidth onClick={handleReset} className="border-gray-200 text-gray-600 hover:text-primary hover:border-primary gap-2">
        <RotateCcw size={16} />
        Reset Filter
      </Button>
    </div>
  );  
};