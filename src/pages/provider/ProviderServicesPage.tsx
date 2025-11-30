import { useState } from 'react';
import ProviderLayout from '@/components/layout/ProviderLayout';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Plus, Edit2, Trash2, Star, Eye, MoreVertical } from 'lucide-react';

const ProviderServicesPage = () => {
  // MOCK DATA: Jasa yang dimiliki Mitra
  const [services, setServices] = useState([
    {
      id: 1,
      title: 'Cuci AC Split 0.5 - 2 PK',
      category: 'Service AC',
      price: 75000,
      rating: 4.8,
      reviews: 120,
      views: 1450,
      isActive: true,
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 2,
      title: 'Isi Freon R32 / R410',
      category: 'Service AC',
      price: 150000,
      rating: 4.9,
      reviews: 85,
      views: 890,
      isActive: true,
      image: 'https://images.unsplash.com/photo-1581578731117-104f2a8d23e9?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 3,
      title: 'Bongkar Pasang AC',
      category: 'Service AC',
      price: 350000,
      rating: 0, // Belum ada rating
      reviews: 0,
      views: 45,
      isActive: false, // Sedang non-aktif
      image: 'https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=400&q=80'
    }
  ]);

  const toggleStatus = (id: number) => {
    setServices(services.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s));
  };

  const formatRupiah = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
  };

  return (
    <ProviderLayout>
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Layanan Saya</h1>
            <p className="text-gray-500">Kelola daftar layanan yang Anda tawarkan kepada pelanggan.</p>
          </div>
          <Button icon={<Plus size={18} />}>
            Tambah Layanan Baru
          </Button>
        </div>

        {/* Grid Layanan */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.id} className="group flex flex-col overflow-hidden border border-gray-200 hover:border-blue-200 transition-colors">
              
              {/* Image & Status Badge */}
              <div className="relative h-48 bg-gray-100">
                <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-1 rounded-md text-xs font-bold ${service.isActive ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                    {service.isActive ? 'Aktif' : 'Non-Aktif'}
                  </span>
                </div>
                {/* Menu Option Button */}
                <button className="absolute top-3 right-3 p-1.5 bg-white/80 rounded-full hover:bg-white text-gray-600">
                  <MoreVertical size={18} />
                </button>
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="mb-4">
                  <p className="text-xs text-gray-500 font-medium mb-1">{service.category}</p>
                  <h3 className="font-bold text-gray-900 text-lg leading-snug group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                </div>

                {/* Stats Row */}
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-1.5">
                    <Star size={14} className="text-yellow-500 fill-current" />
                    <span className="font-semibold text-gray-900">{service.rating || '-'}</span>
                  </div>
                  <div className="w-px h-4 bg-gray-300"></div>
                  <div className="flex items-center gap-1.5">
                    <Eye size={14} />
                    <span>{service.views} views</span>
                  </div>
                </div>

                {/* Footer: Price & Actions */}
                <div className="mt-auto flex items-center justify-between">
                  <span className="font-bold text-lg text-primary">{formatRupiah(service.price)}</span>
                  
                  <div className="flex gap-2">
                    {/* Toggle Button */}
                    <button 
                      onClick={() => toggleStatus(service.id)}
                      title={service.isActive ? "Matikan Layanan" : "Aktifkan Layanan"}
                      className={`p-2 rounded-lg border transition-colors ${
                        service.isActive 
                          ? 'border-green-200 text-green-600 hover:bg-green-50' 
                          : 'border-gray-200 text-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`w-3 h-3 rounded-full ${service.isActive ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    </button>
                    
                    {/* Edit Button */}
                    <button title="Edit" className="p-2 rounded-lg border border-gray-200 text-blue-600 hover:bg-blue-50 transition-colors">
                      <Edit2 size={18} />
                    </button>

                    {/* Delete Button */}
                    <button title="Hapus" className="p-2 rounded-lg border border-gray-200 text-red-500 hover:bg-red-50 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>

            </Card>
          ))}
          
          {/* Empty State Card (Add New Placeholder) */}
          <button className="border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center p-8 hover:border-primary hover:bg-blue-50/30 transition-all group h-full min-h-[350px]">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4 group-hover:bg-blue-100 group-hover:text-primary transition-colors">
              <Plus size={32} />
            </div>
            <h3 className="font-bold text-gray-600 group-hover:text-primary">Tambah Layanan Baru</h3>
            <p className="text-sm text-gray-400 mt-2 text-center px-4">Tawarkan jasa keahlian Anda lainnya kepada pelanggan.</p>
          </button>

        </div>

      </div>
    </ProviderLayout>
  );
};

export default ProviderServicesPage;