import DashboardLayout from '@/components/layout/DashboardLayout'; // Pastikan ini DashboardLayout, bukan MainLayout
import { Container } from '@/components/common/Container';
import { ServiceCard } from '@/components/sections/services/ServiceCard';
import { FilterSidebar } from '@/components/sections/services/FilterSidebar';
import { Search } from 'lucide-react';
import type { Service } from '@/types';

// DATA DUMMY (Sesuai Gambar Desain Tim Anda)
const SERVICES_DATA: Service[] = [
  {
    id: '1',
    title: 'Bersih Rumah Premium',
    slug: 'bersih-rumah',
    category: 'Pembersihan',
    price: 150000,
    priceUnit: '',
    rating: 4.9,
    reviewCount: 127,
    description: 'Layanan profesional dengan hasil berkualitas tinggi dan harga terjangkau.',
    thumbnailUrl: 'https://awsimages.detik.net.id/community/media/visual/2022/04/26/ilustrasi-membersihkan-rumah_169.jpeg?w=1200',
    provider: { name: 'Helpo Clean', avatarUrl: '', location: 'Jakarta', isVerified: true }
  },
  {
    id: '2',
    title: 'Tukang Pipa Profesional',
    slug: 'tukang-pipa',
    category: 'Perbaikan',
    price: 200000,
    priceUnit: '',
    rating: 4.8,
    reviewCount: 89,
    description: 'Layanan profesional dengan hasil berkualitas tinggi dan harga terjangkau.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=800&q=80',
    provider: { name: 'Fix It', avatarUrl: '', location: 'Jakarta', isVerified: true }
  },
  {
    id: '3',
    title: 'Ahli Listrik Bersertifikat',
    slug: 'ahli-listrik',
    category: 'Listrik',
    price: 250000,
    priceUnit: '',
    rating: 5,
    reviewCount: 156,
    description: 'Layanan profesional dengan hasil berkualitas tinggi dan harga terjangkau.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80',
    provider: { name: 'Volt Master', avatarUrl: '', location: 'Bandung', isVerified: true }
  },
  {
    id: '4',
    title: 'Jasa Taman & Landscape',
    slug: 'jasa-taman',
    category: 'Taman',
    price: 300000,
    priceUnit: '',
    rating: 4.7,
    reviewCount: 64,
    description: 'Layanan profesional dengan hasil berkualitas tinggi dan harga terjangkau.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=800&q=80',
    provider: { name: 'Green Garden', avatarUrl: '', location: 'Bandung', isVerified: true }
  },
  {
    id: '5',
    title: 'Cat Rumah Berkualitas',
    slug: 'cat-rumah',
    category: 'Cat',
    price: 180000,
    priceUnit: '',
    rating: 4.9,
    reviewCount: 98,
    description: 'Layanan profesional dengan hasil berkualitas tinggi dan harga terjangkau.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80',
    provider: { name: 'Color Pro', avatarUrl: '', location: 'Surabaya', isVerified: true }
  },
  {
    id: '6',
    title: 'Renovasi & Bangunan',
    slug: 'renovasi',
    category: 'Tukang',
    price: 350000,
    priceUnit: '',
    rating: 4.6,
    reviewCount: 72,
    description: 'Layanan profesional dengan hasil berkualitas tinggi dan harga terjangkau.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
    provider: { name: 'Build Strong', avatarUrl: '', location: 'Surabaya', isVerified: true }
  },
];

const ServiceListingPage = () => {
  return (
    <DashboardLayout>
      <Container>
        {/* 1. Big Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Cari jasa atau penyedia..." 
            className="w-full pl-14 pr-6 py-4 rounded-full border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-gray-700 bg-white"
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* 2. Sidebar Filter */}
          <aside className="hidden lg:block w-72 shrink-0">
            <FilterSidebar />
          </aside>

          {/* 3. Grid Content */}
          <div className="flex-1 w-full">
            <h2 className="text-gray-500 font-medium mb-6">Ditemukan {SERVICES_DATA.length} jasa</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {SERVICES_DATA.map((service) => (
                <ServiceCard key={service.id} data={service} />
              ))}
            </div>
          </div>

        </div>
      </Container>
    </DashboardLayout>
  );
};

export default ServiceListingPage;