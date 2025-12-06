import { useState, useMemo, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Container } from '@/components/common/Container';
import { ServiceCard } from '@/components/sections/services/ServiceCard';
import { FilterSidebar } from '@/components/sections/services/FilterSidebar';
import { Search, SlidersHorizontal, Database, Loader2 } from 'lucide-react';

// Import Logic Backend & Types
import { MarketService } from '@/services/market.service';
import { getCategories } from '@/services/category.service';
import type { Service as FrontendService, FilterState, Category } from '@/types'; 

const ServiceListingPage = () => {
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  
  // State Data
  const [dbServices, setDbServices] = useState<FrontendService[]>([]);
  const [categories, setCategories] = useState<Category[]>([]); 
  const [loading, setLoading] = useState(true);

  // State Filter Utama
  const [filters, setFilters] = useState<FilterState>({
    keyword: '',
    category: 'Semua',
    location: 'Semua',
    minPrice: 0,
    maxPrice: 5000000, 
    minRating: 0
  });

  // --- 1. FETCH DATA DARI FIREBASE ---
  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      try {
        const [rawServices, fetchedCategories] = await Promise.all([
          MarketService.getServices(),
          getCategories()
        ]);

        setCategories(fetchedCategories);

        // TRANSFORMASI DATA (Mapping Manual agar Tipe Data Cocok)
        // Kita paksa tipe 'any' pada input map agar TypeScript tidak rewel soal field yang hilang
        const mappedData: FrontendService[] = rawServices.map((item: any) => ({
          id: item.id || 'unknown',
          title: item.title || "Layanan Tanpa Judul",
          category: item.category || "Umum",
          price: Number(item.price) || 0,
          rating: Number(item.rating) || 0,
          reviewCount: Number(item.reviewCount) || 0,
          description: item.description || "Deskripsi tidak tersedia.",
          thumbnailUrl: item.thumbnailUrl || "https://placehold.co/400x300?text=No+Image",
          
          // PENTING: Membentuk object provider secara manual
          // Karena di database 'location' ada di root, tapi di frontend diminta di dalam 'provider'
          provider: { 
            name: 'Mitra Helpo', // Placeholder (karena kita belum join tabel user)
            location: item.location || "Indonesia", 
            avatarUrl: "",
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

    initData();
  }, []);

  // --- 2. SEED DATA FUNCTION ---
  const handleSeedData = async () => {
    if(!confirm("Isi database dengan data dummy?")) return;
    setLoading(true);
    try {
      await MarketService.createService({
        providerId: "prov_001",
        title: "Cuci AC Split 1 PK",
        category: "Cleaning", 
        description: "Pembersihan AC menyeluruh, anti bocor, garansi 30 hari.",
        price: 85000,
        thumbnailUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
        isActive: true,
        location: "Jakarta Selatan"
      });
      window.location.reload();
      alert("Data berhasil ditambahkan!");
    } catch (e) {
      alert("Gagal seed data");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // --- 3. LOGIKA FILTERING ---
  const filteredServices = useMemo(() => {
    return dbServices.filter(service => {
      // Ambil data dengan aman (Optional Chaining)
      const sTitle = service.title || "";
      const sDesc = service.description || "";
      
      // PERBAIKAN: Akses location lewat provider object yang sudah kita mapping di atas
      const sLoc = service.provider?.location || ""; 

      const matchKeyword = 
        sTitle.toLowerCase().includes(filters.keyword.toLowerCase()) || 
        sDesc.toLowerCase().includes(filters.keyword.toLowerCase());

      const matchCategory = filters.category === 'Semua' || service.category === filters.category;
      
      const matchLocation = filters.location === 'Semua' || sLoc.toLowerCase().includes(filters.location.toLowerCase());
      
      const matchPrice = service.price <= filters.maxPrice && service.price >= filters.minPrice;
      const matchRating = service.rating >= filters.minRating;

      return matchKeyword && matchCategory && matchLocation && matchPrice && matchRating;
    });
  }, [filters, dbServices]); 

  return (
    <DashboardLayout>
      <Container>
        {/* Header & Seed Button */}
        <div className="flex justify-between items-center mb-4">
           <button 
              onClick={handleSeedData}
              className="flex items-center gap-2 text-xs text-gray-400 hover:text-blue-600 border border-dashed border-gray-300 px-3 py-1 rounded"
              title="Isi database dengan dummy data"
           >
             <Database size={12} /> Seed DB
           </button>
        </div>

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
            <FilterSidebar 
              filters={filters} 
              setFilters={setFilters} 
              categories={categories}
            />
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