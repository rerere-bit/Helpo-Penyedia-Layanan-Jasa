// src/pages/ServiceListingPage.tsx

import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Jika dibutuhkan navigasi
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Container } from '@/components/common/Container';
import { ServiceCard } from '@/components/sections/services/ServiceCard';
import { FilterSidebar } from '@/components/sections/services/FilterSidebar';
import { Search, SlidersHorizontal, Database, Loader2 } from 'lucide-react';

// Import Logic Backend
import { MarketService } from '@/services/market.service';
// Import Tipe Backend (Alias agar tidak bentrok dengan tipe Frontend)
import type { Service as BackendService } from '@/types/market'; 
import type { Service as FrontendService, FilterState } from '@/types';

const ServiceListingPage = () => {
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [dbServices, setDbServices] = useState<FrontendService[]>([]); // Data dari Firebase
  const [loading, setLoading] = useState(true);

  // State Filter Utama
  const [filters, setFilters] = useState<FilterState>({
    keyword: '',
    category: 'Semua',
    location: 'Semua',
    minPrice: 0,
    maxPrice: 5000000, // Adjusted max price
    minRating: 0
  });

  // --- 1. FETCH DATA DARI FIREBASE ---
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      // Ambil data mentah dari Firestore
      const rawData = await MarketService.getServices();
      
      // TRANSFORMASI DATA: Backend Type -> Frontend Type
      // Kita sesuaikan struktur agar ServiceCard tidak error
      const mappedData: FrontendService[] = rawData.map((item: BackendService) => ({
        id: item.id || 'unknown',
        title: item.title,
        category: item.category,
        price: item.price,
        rating: item.rating,
        reviewCount: item.reviewCount,
        description: item.description,
        thumbnailUrl: item.thumbnailUrl,
        // Mocking Provider Object (Karena di backend baru simpan providerId)
        provider: { 
          name: 'Mitra Helpo', // Nanti kita ambil dari collection Users
          location: item.location, 
          isVerified: true 
        }
      }));

      setDbServices(mappedData);
    } catch (error) {
      console.error("Gagal load data:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. SEED DATA FUNCTION (Tombol Rahasia) ---
  const handleSeedData = async () => {
    if(!confirm("Isi database dengan data dummy?")) return;
    setLoading(true);
    try {
      // Contoh data dummy 1
      await MarketService.createService({
        providerId: "prov_001",
        title: "Cuci AC Split 1 PK",
        category: "Pembersihan", // Sesuaikan dengan filter Anda
        description: "Pembersihan AC menyeluruh, anti bocor, garansi 30 hari.",
        price: 85000,
        thumbnailUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
        isActive: true,
        location: "Jakarta Selatan"
      });
      // Contoh data dummy 2
      await MarketService.createService({
        providerId: "prov_002",
        title: "Service Kulkas 2 Pintu",
        category: "Elektronik",
        description: "Perbaikan kulkas tidak dingin, ganti freon.",
        price: 150000,
        thumbnailUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
        isActive: true,
        location: "Bandung"
      });
      
      await fetchServices(); // Refresh data
      alert("Data berhasil ditambahkan!");
    } catch (e) {
      alert("Gagal seed data");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // --- 3. LOGIKA FILTERING (Client Side) ---
  const filteredServices = useMemo(() => {
    return dbServices.filter(service => {
      const matchKeyword = 
        service.title.toLowerCase().includes(filters.keyword.toLowerCase()) || 
        service.description.toLowerCase().includes(filters.keyword.toLowerCase());

      const matchCategory = filters.category === 'Semua' || service.category === filters.category;
      
      // Pencocokan lokasi agak loose (contains)
      const matchLocation = filters.location === 'Semua' || service.provider.location.includes(filters.location);
      
      const matchPrice = service.price <= filters.maxPrice && service.price >= filters.minPrice;
      const matchRating = service.rating >= filters.minRating;

      return matchKeyword && matchCategory && matchLocation && matchPrice && matchRating;
    });
  }, [filters, dbServices]); // Dependency array diupdate ke dbServices

  return (
    <DashboardLayout>
      <Container>
        {/* Header & Search */}
        <div className="flex justify-between items-center mb-4">
           {/* Tombol Seed Data (Development Only) */}
           <button 
              onClick={handleSeedData}
              className="flex items-center gap-2 text-xs text-gray-400 hover:text-blue-600 border border-dashed border-gray-300 px-3 py-1 rounded"
              title="Isi database dengan dummy data"
           >
             <Database size={12} /> Seed DB
           </button>
        </div>

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
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="animate-spin text-primary mb-2" size={32} />
                <p className="text-gray-400">Mengambil data layanan...</p>
              </div>
            ) : filteredServices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredServices.map((service) => (
                  // Pastikan ServiceCard menerima data sesuai tipe FrontendService
                  <ServiceCard key={service.id} data={service} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-500 text-lg">Tidak ada layanan yang cocok.</p>
                {dbServices.length === 0 && (
                   <p className="text-sm text-gray-400 mt-2">Database masih kosong. Coba klik tombol 'Seed DB' di atas.</p>
                )}
                <button 
                  onClick={() => setFilters({ keyword: '', category: 'Semua', location: 'Semua', minPrice: 0, maxPrice: 5000000, minRating: 0 })}
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