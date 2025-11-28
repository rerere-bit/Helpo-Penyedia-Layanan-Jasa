import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Calendar, MapPin, Clock, DollarSign } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Container } from '@/components/common/Container';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';

// Tipe Data Pesanan
interface OrderHistory {
  id: string;
  serviceName: string;
  providerName: string;
  date: string;
  price: number;
  status: 'Menunggu Pembayaran' | 'Dikonfirmasi' | 'Diproses' | 'Selesai' | 'Dibatalkan';
  thumbnail: string;
}

// MOCK DATA
const HISTORY_DATA: OrderHistory[] = [
  {
    id: 'ORD-2025-001',
    serviceName: 'Bersih Rumah Premium',
    providerName: 'Helpo Clean',
    date: '28 Nov 2025',
    price: 155000,
    status: 'Menunggu Pembayaran',
    thumbnail: 'https://images.unsplash.com/photo-1581578731117-104f2a8d23e9?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 'ORD-2025-002',
    serviceName: 'Service AC 1PK',
    providerName: 'Cool Air Teknik',
    date: '30 Nov 2025',
    price: 75000,
    status: 'Dikonfirmasi',
    thumbnail: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 'ORD-2025-003',
    serviceName: 'Instalasi Listrik Rumah',
    providerName: 'Volt Master',
    date: '05 Des 2025',
    price: 200000,
    status: 'Diproses',
    thumbnail: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 'ORD-2025-004',
    serviceName: 'Cuci Mobil Home Service',
    providerName: 'Auto Clean',
    date: '10 Nov 2025',
    price: 50000,
    status: 'Selesai',
    thumbnail: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 'ORD-2025-005',
    serviceName: 'Perbaikan Pipa Bocor',
    providerName: 'Pipa Mas',
    date: '01 Nov 2025',
    price: 120000,
    status: 'Dibatalkan',
    thumbnail: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=150&q=80',
  },
];

const HistoryPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'ongoing' | 'history'>('ongoing');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Logika Filter Data
  const filteredData = useMemo(() => {
    return HISTORY_DATA.filter((item) => {
      // Filter berdasarkan Tab Status
      const isOngoing = ['Menunggu Pembayaran', 'Dikonfirmasi', 'Diproses'].includes(item.status);
      const isHistory = ['Selesai', 'Dibatalkan'].includes(item.status);
      
      const matchTab = activeTab === 'ongoing' ? isOngoing : isHistory;

      // Filter berdasarkan Search Query
      const matchSearch = 
        item.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase());

      return matchTab && matchSearch;
    });
  }, [activeTab, searchQuery]);

  // Helper: Format Rupiah
  const formatRupiah = (price: number) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);

  // Helper: Badge Variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Menunggu Pembayaran': return 'warning';
      case 'Dikonfirmasi': return 'primary';
      case 'Diproses': return 'primary';
      case 'Selesai': return 'success';
      case 'Dibatalkan': return 'neutral';
      default: return 'neutral';
    }
  };

  return (
    <DashboardLayout>
      <Container>
        <div className="max-w-4xl mx-auto min-h-screen pb-20">
          
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Riwayat Pesanan</h1>
            <p className="text-gray-500">Pantau status pesanan aktif dan riwayat transaksi Anda</p>
          </div>

          {/* Search Bar & Filter */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text"
                placeholder="Cari ID pesanan atau nama layanan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
            <button className="bg-white p-3 rounded-xl border border-gray-200 text-gray-600 hover:border-primary hover:text-primary transition-colors">
              <Filter size={20} />
            </button>
          </div>

          {/* Tabs */}
          <div className="bg-white p-1 rounded-xl border border-gray-100 flex mb-8 shadow-sm">
            <button
              onClick={() => setActiveTab('ongoing')}
              className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${
                activeTab === 'ongoing' 
                  ? 'bg-blue-50 text-primary shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Berlangsung
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${
                activeTab === 'history' 
                  ? 'bg-blue-50 text-primary shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Riwayat Selesai
            </button>
          </div>

          {/* List Content */}
          <div className="space-y-4">
            {filteredData.length > 0 ? (
              filteredData.map((order) => (
                <Card key={order.id} className="p-0 overflow-hidden hover:shadow-md transition-all group">
                  <div className="p-6 flex flex-col md:flex-row gap-6">
                    
                    {/* Thumbnail */}
                    <div className="w-full md:w-32 h-32 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                      <img src={order.thumbnail} alt={order.serviceName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>

                    {/* Info Utama */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Order ID: {order.id}</p>
                            <h3 className="font-bold text-gray-900 text-lg">{order.serviceName}</h3>
                            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                              <MapPin size={14} /> {order.providerName}
                            </p>
                          </div>
                          {/* @ts-ignore */}
                          <Badge variant={getStatusBadge(order.status)}>{order.status}</Badge>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-4">
                          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                            <Calendar size={16} className="text-primary" />
                            {order.date}
                          </div>
                          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                            <DollarSign size={16} className="text-green-600" />
                            <span className="font-bold text-gray-900">{formatRupiah(order.price)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-white"
                      onClick={() => navigate(`/order/${order.id}`)}
                    >
                      Lihat Detail
                    </Button>

                    {/* Logika Tombol Dinamis */}
                    {order.status === 'Menunggu Pembayaran' && (
                      <Button 
                        size="sm" 
                        onClick={() => navigate(`/payment/${order.id}`)}
                      >
                        Bayar Sekarang
                      </Button>
                    )}

                    {order.status === 'Selesai' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-primary text-primary hover:bg-blue-50"
                        onClick={() => navigate(`/booking/reorder-${order.id}`)} // Simulasi reorder
                      >
                        Pesan Lagi
                      </Button>
                    )}
                  </div>
                </Card>
              ))
            ) : (
              // Empty State
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                  <Clock size={32} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Tidak ada pesanan</h3>
                <p className="text-gray-500 mb-6">Anda belum memiliki pesanan di kategori ini.</p>
                <Button onClick={() => navigate('/services')}>
                  Cari Layanan Baru
                </Button>
              </div>
            )}
          </div>

        </div>
      </Container>
    </DashboardLayout>
  );
};

export default HistoryPage;