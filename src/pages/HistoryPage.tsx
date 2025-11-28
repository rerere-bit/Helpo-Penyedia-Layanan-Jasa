import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Calendar, Clock, History } from 'lucide-react';

// Tipe Data untuk Pesanan
interface Order {
  id: string;
  serviceName: string;
  category: string;
  date: string;
  time: string;
  price: number;
  status: 'active' | 'completed' | 'cancelled';
  statusLabel: string;
  thumbnail: string;
}

// MOCK DATA
const ORDERS: Order[] = [
  {
    id: 'ORD-001',
    serviceName: 'Bersih Rumah Premium',
    category: 'Pembersihan',
    date: '15 November 2025',
    time: '10:00',
    price: 150000,
    status: 'active',
    statusLabel: 'Sedang Berlangsung',
    thumbnail: 'https://images.unsplash.com/photo-1581578731117-104f2a8d23e9?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 'ORD-002',
    serviceName: 'Service AC 1PK',
    category: 'Perbaikan',
    date: '10 November 2025',
    time: '13:00',
    price: 75000,
    status: 'completed',
    statusLabel: 'Selesai',
    thumbnail: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 'ORD-003',
    serviceName: 'Tukang Pipa Air',
    category: 'Perbaikan',
    date: '01 November 2025',
    time: '09:00',
    price: 200000,
    status: 'completed',
    statusLabel: 'Selesai',
    thumbnail: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=150&q=80',
  }
];

const HistoryPage = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  // Filter Data Berdasarkan Tab
  const filteredOrders = ORDERS.filter(order => {
    if (activeTab === 'active') return order.status === 'active';
    return order.status === 'completed' || order.status === 'cancelled';
  });

  const formatRupiah = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
  };

  return (
    <DashboardLayout>
      <Container>
        <div className="max-w-4xl mx-auto min-h-[60vh]">
          
          {/* 1. Tabs Segment */}
          <div className="bg-gray-100 p-1 rounded-xl flex mb-8">
            <button
              onClick={() => setActiveTab('active')}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                activeTab === 'active' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Aktif (1)
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                activeTab === 'completed' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Selesai ({ORDERS.filter(o => o.status !== 'active').length})
            </button>
          </div>

          {/* 2. Order List */}
          <div className="space-y-4">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <Card key={order.id} className="p-6 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow">
                  
                  {/* Thumbnail */}
                  <div className="w-full md:w-32 h-32 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                    <img src={order.thumbnail} alt={order.serviceName} className="w-full h-full object-cover" />
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{order.serviceName}</h3>
                        <span className="inline-block bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded mt-1 font-medium">
                          {order.category}
                        </span>
                      </div>
                      
                      {/* Status Badge */}
                      <div className={`
                        flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold
                        ${order.status === 'active' ? 'bg-blue-500 text-white' : 'bg-green-100 text-green-700'}
                      `}>
                        {order.status === 'active' && <History size={12} />}
                        {order.statusLabel}
                      </div>
                    </div>

                    {/* Date & Time */}
                    <div className="flex flex-col gap-1 text-sm text-gray-500 mt-3 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-primary" />
                        <span>{order.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-gray-400" />
                        <span>{order.time}</span>
                      </div>
                    </div>

                    <p className="font-bold text-primary">{formatRupiah(order.price)}</p>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-4">
                      <Button variant="outline" size="sm" className="h-9 px-4 text-xs">
                        Lihat Detail
                      </Button>
                      
                      {order.status === 'active' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-9 px-4 text-xs border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                        >
                          Batalkan
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              // Empty State
              <div className="text-center py-20 text-gray-400">
                <History size={48} className="mx-auto mb-4 opacity-20" />
                <p>Belum ada pesanan di tab ini</p>
              </div>
            )}
          </div>

        </div>
      </Container>
    </DashboardLayout>
  );
};

export default HistoryPage;