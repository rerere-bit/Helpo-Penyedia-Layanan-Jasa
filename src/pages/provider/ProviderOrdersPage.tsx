import { useState } from 'react';
import ProviderLayout from '@/components/layout/ProviderLayout';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Calendar, MapPin, User, Clock, CheckCircle, MessageSquare, Phone } from 'lucide-react';

// Tipe Data Pesanan
type OrderStatus = 'new' | 'in_progress' | 'completed' | 'cancelled';

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  serviceTitle: string;
  price: string;
  date: string;
  time: string;
  address: string;
  status: OrderStatus;
  notes?: string;
}

const ProviderOrdersPage = () => {
  const [activeTab, setActiveTab] = useState<OrderStatus>('new');

  // MOCK DATA
  const orders: Order[] = [
    {
      id: 'ORD-009',
      customerName: 'Budi Santoso',
      customerPhone: '08123456789',
      serviceTitle: 'Cuci AC Split 2PK',
      price: 'Rp 75.000',
      date: '16 Nov 2025',
      time: '14:00',
      address: 'Jl. Melati No. 45, Jakarta Selatan',
      status: 'new',
      notes: 'AC ada di lantai 2, tangga disediakan.'
    },
    {
      id: 'ORD-008',
      customerName: 'Siti Aminah',
      customerPhone: '08198765432',
      serviceTitle: 'Isi Freon R32',
      price: 'Rp 150.000',
      date: '16 Nov 2025',
      time: '10:00',
      address: 'Apartemen City Park, Tower A, Unit 12',
      status: 'in_progress',
    },
    {
      id: 'ORD-005',
      customerName: 'Ahmad Dani',
      customerPhone: '08122334455',
      serviceTitle: 'Cuci Besar + Anti Bakteri',
      price: 'Rp 120.000',
      date: '14 Nov 2025',
      time: '13:00',
      address: 'Jl. Sudirman Kav 50, Jakarta Pusat',
      status: 'completed',
    },
  ];

  // Filter Order Berdasarkan Tab
  const filteredOrders = orders.filter(o => o.status === activeTab);

  // Helper untuk Badge Status
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'new': return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">Pesanan Baru</span>;
      case 'in_progress': return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">Sedang Dikerjakan</span>;
      case 'completed': return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Selesai</span>;
      case 'cancelled': return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">Dibatalkan</span>;
    }
  };

  return (
    <ProviderLayout>
      <div className="max-w-5xl mx-auto">
        
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Manajemen Pesanan</h1>

        {/* 1. Tabs */}
        <div className="bg-white p-1 rounded-xl border border-gray-200 flex overflow-x-auto mb-6 shadow-sm no-scrollbar">
          {[
            { id: 'new', label: 'Baru Masuk' },
            { id: 'in_progress', label: 'Dalam Proses' },
            { id: 'completed', label: 'Selesai' },
            { id: 'cancelled', label: 'Dibatalkan' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as OrderStatus)}
              className={`flex-1 min-w-[120px] py-2.5 text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-blue-800 text-white shadow-md' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 2. Order List */}
        <div className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <Card key={order.id} className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  
                  {/* Info Utama */}
                  <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-lg text-gray-900">{order.serviceTitle}</h3>
                          {getStatusBadge(order.status)}
                        </div>
                        <p className="text-sm text-gray-400">Order ID: {order.id}</p>
                      </div>
                      <p className="text-lg font-bold text-primary md:hidden">{order.price}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-start gap-3">
                        <User size={18} className="text-gray-400 mt-0.5" />
                        <div>
                          <p className="font-semibold text-gray-900">{order.customerName}</p>
                          <p className="text-xs">{order.customerPhone}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Calendar size={18} className="text-gray-400 mt-0.5" />
                        <div>
                          <p className="font-semibold text-gray-900">{order.date}</p>
                          <p className="text-xs">Pukul {order.time}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 md:col-span-2">
                        <MapPin size={18} className="text-gray-400 mt-0.5" />
                        <p>{order.address}</p>
                      </div>
                      {order.notes && (
                        <div className="md:col-span-2 bg-yellow-50 p-3 rounded-lg border border-yellow-100 text-yellow-800 text-xs">
                          <span className="font-bold">Catatan:</span> {order.notes}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions (Kanan) */}
                  <div className="flex flex-col justify-between items-end gap-4 min-w-[200px] border-l border-gray-100 pl-0 md:pl-6 pt-4 md:pt-0 border-t md:border-t-0">
                    <p className="text-xl font-bold text-primary hidden md:block">{order.price}</p>
                    
                    <div className="w-full space-y-3">
                      
                      {/* Tombol Khusus Status 'Baru' */}
                      {order.status === 'new' && (
                        <>
                          <Button fullWidth className="bg-blue-600 hover:bg-blue-700" icon={<CheckCircle size={18} />}>
                            Terima Pesanan
                          </Button>
                          <Button fullWidth variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300">
                            Tolak
                          </Button>
                        </>
                      )}

                      {/* Tombol Khusus Status 'Dalam Proses' */}
                      {order.status === 'in_progress' && (
                        <>
                          <div className="flex gap-2">
                            <Button variant="outline" className="flex-1 gap-2 border-gray-300">
                              <Phone size={16} /> Hubungi
                            </Button>
                            <Button variant="outline" className="flex-1 gap-2 border-gray-300">
                              <MessageSquare size={16} /> Chat
                            </Button>
                          </div>
                          <Button fullWidth className="bg-green-600 hover:bg-green-700" icon={<CheckCircle size={18} />}>
                            Tandai Selesai
                          </Button>
                        </>
                      )}

                      {/* Tombol Khusus Status 'Selesai' */}
                      {order.status === 'completed' && (
                        <Button fullWidth variant="outline" disabled className="opacity-50 cursor-not-allowed">
                          Pesanan Selesai
                        </Button>
                      )}
                      
                    </div>
                  </div>

                </div>
              </Card>
            ))
          ) : (
            // Empty State
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                <Clock size={32} />
              </div>
              <h3 className="font-bold text-gray-900">Tidak ada pesanan</h3>
              <p className="text-gray-500 text-sm">Belum ada pesanan dengan status "{activeTab}"</p>
            </div>
          )}
        </div>

      </div>
    </ProviderLayout>
  );
};

export default ProviderOrdersPage;