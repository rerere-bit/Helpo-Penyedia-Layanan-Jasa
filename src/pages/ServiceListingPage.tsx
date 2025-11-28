import { useState, useMemo } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Container } from '@/components/common/Container';
import { ServiceCard } from '@/components/sections/services/ServiceCard';
import { FilterSidebar } from '@/components/sections/services/FilterSidebar';
import { Search, SlidersHorizontal } from 'lucide-react';
import type { Service, FilterState } from '@/types';

// DATA DUMMY LENGKAP
const SERVICES_DATA: Service[] = [
  {
    id: '1',
    title: 'Bersih Rumah Premium',
    category: 'Pembersihan',
    price: 150000,
    rating: 4.9,
    reviewCount: 127,
    description: 'Layanan kebersihan menyeluruh untuk rumah Anda.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581578731117-104f2a8d23e9?auto=format&fit=crop&w=800&q=80',
    provider: { name: 'Helpo Clean', location: 'Jakarta', isVerified: true }
  },
  {
    id: '2',
    title: 'Service AC Profesional',
    category: 'Perbaikan',
    price: 75000,
    rating: 4.5,
    reviewCount: 85,
    description: 'Cuci AC dan isi freon dengan teknisi bersertifikat.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
    provider: { name: 'Cool Air', location: 'Bandung', isVerified: true }
  },
  {
    id: '3',
    title: 'Ahli Listrik 24 Jam',
    category: 'Listrik',
    price: 200000,
    rating: 5.0,
    reviewCount: 42,
    description: 'Perbaikan instalasi listrik dan korsleting.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80',
    provider: { name: 'Volt Master', location: 'Jakarta', isVerified: true }
  },
  {
    id: '4',
    title: 'Jasa Taman & Landscape',
    category: 'Taman',
    price: 300000,
    rating: 4.7,
    reviewCount: 64,
    description: 'Pembuatan dan perawatan taman rumah minimalis.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=800&q=80',
    provider: { name: 'Green Garden', location: 'Bandung', isVerified: true }
  },
  {
    id: '5',
    title: 'Cat Dinding Interior',
    category: 'Cat',
    price: 500000,
    rating: 4.8,
    reviewCount: 110,
    description: 'Pengecatan ulang dinding rumah dengan cat premium.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80',
    provider: { name: 'Color Pro', location: 'Surabaya', isVerified: true }
  }
];

const ServiceListingPage = () => {
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  
  // State Filter Utama
  const [filters, setFilters] = useState<FilterState>({
    keyword: '',
    category: 'Semua',
    location: 'Semua',
    minPrice: 0,
    maxPrice: 1000000,
    minRating: 0
  });

  // Logika Filtering (dijalankan setiap kali filters berubah)
  const filteredServices = useMemo(() => {
    return SERVICES_DATA.filter(service => {
      // 1. Filter Keyword (Judul atau Deskripsi)
      const matchKeyword = 
        service.title.toLowerCase().includes(filters.keyword.toLowerCase()) || 
        service.description.toLowerCase().includes(filters.keyword.toLowerCase());

      // 2. Filter Kategori
      const matchCategory = filters.category === 'Semua' || service.category === filters.category;

      // 3. Filter Lokasi
      const matchLocation = filters.location === 'Semua' || service.provider.location === filters.location;

      // 4. Filter Harga
      const matchPrice = service.price <= filters.maxPrice;

      // 5. Filter Rating
      const matchRating = service.rating >= filters.minRating;

      return matchKeyword && matchCategory && matchLocation && matchPrice && matchRating;
    });
  }, [filters]);

  return (
    <DashboardLayout>
      <Container>
        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Cari jasa (misal: cuci ac, taman)..." 
            value={filters.keyword}
            onChange={(e) => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
            className="w-full pl-14 pr-6 py-4 rounded-full border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-gray-700 bg-white"
          />
        </div>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-6">
          <button 
            onClick={() => setShowMobileFilter(!showMobileFilter)}
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 font-medium text-gray-700"
          >
            <SlidersHorizontal size={18} /> Filter
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Sidebar Filter */}
          <aside className={`lg:block w-72 shrink-0 ${showMobileFilter ? 'block' : 'hidden'}`}>
            <FilterSidebar filters={filters} setFilters={setFilters} />
          </aside>

          {/* Grid Content */}
          <div className="flex-1 w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-gray-500 font-medium">
                Ditemukan <span className="text-gray-900 font-bold">{filteredServices.length}</span> jasa
              </h2>
            </div>
            
            {filteredServices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredServices.map((service) => (
                  <ServiceCard key={service.id} data={service} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-500 text-lg">Tidak ada layanan yang cocok dengan filter Anda.</p>
                <button 
                  onClick={() => setFilters({ keyword: '', category: 'Semua', location: 'Semua', minPrice: 0, maxPrice: 1000000, minRating: 0 })}
                  className="mt-4 text-primary font-bold hover:underline"
                >
                  Reset Filter
                </button>
              </div>
            )}
          </div>

        </div>
      </Container>
    </DashboardLayout>
  );
};

export default ServiceListingPage;