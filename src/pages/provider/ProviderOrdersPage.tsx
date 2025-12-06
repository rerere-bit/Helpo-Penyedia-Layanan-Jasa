import { useState, useEffect, useMemo } from 'react';
import ProviderLayout from '@/components/layout/ProviderLayout';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Calendar, MapPin, User, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getOrders, updateOrderStatus } from '@/services/order.service';
import type { Order, OrderStatus } from '@/types';

const ProviderOrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('pending');

  // 1. Fetch Data
  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getOrders(user.uid, 'provider');
      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // 2. Handle Status Change
  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    if (!confirm(`Ubah status pesanan menjadi ${newStatus}?`)) return;
    try {
      await updateOrderStatus(orderId, newStatus);
      fetchData(); // Refresh UI
    } catch (error) {
      alert("Gagal update status");
    }
  };

  // 3. Filter Logic
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      if (activeTab === 'pending') return o.status === 'pending';
      if (activeTab === 'active') return ['confirmed', 'in_progress'].includes(o.status);
      if (activeTab === 'completed') return o.status === 'completed';
      if (activeTab === 'cancelled') return o.status === 'cancelled';
      return true;
    });
  }, [orders, activeTab]);

  const tabs = [
    { id: 'pending', label: 'Menunggu' },
    { id: 'active', label: 'Aktif' },
    { id: 'completed', label: 'Selesai' },
    { id: 'cancelled', label: 'Dibatalkan' }
  ];

  return (
    <ProviderLayout>
      <div className="max-w-5xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Manajemen Pesanan</h1>

        {/* Tabs */}
        <div className="bg-white p-1 rounded-xl border border-gray-200 flex overflow-x-auto mb-6 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[100px] py-2.5 text-sm font-semibold rounded-lg transition-all ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* List Content */}
        {loading ? (
          <div className="text-center py-20"><Loader2 className="animate-spin text-primary mx-auto" /></div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <Card key={order.id} className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-lg text-gray-900">{order.serviceSnapshot.title}</h3>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">#{order.id.slice(0,6)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-start gap-3">
                          <User size={18} className="text-gray-400 mt-0.5" />
                          <div>
                            <p className="font-semibold text-gray-900">{order.customerSnapshot.displayName}</p>
                            <p className="text-xs">{order.customerSnapshot.phoneNumber}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Calendar size={18} className="text-gray-400 mt-0.5" />
                          <div>
                            <p className="font-semibold text-gray-900">{order.bookingDate}</p>
                            <p className="text-xs">Pukul {order.bookingTime}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 md:col-span-2">
                          <MapPin size={18} className="text-gray-400 mt-0.5" />
                          <p>{order.customerSnapshot.address}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between items-end gap-4 min-w-[200px] border-l border-gray-100 pl-0 md:pl-6 pt-4 md:pt-0 border-t md:border-t-0">
                      <p className="text-xl font-bold text-blue-600">Rp {order.totalPrice.toLocaleString()}</p>
                      
                      <div className="w-full space-y-2">
                        {order.status === 'pending' && (
                          <>
                            <Button fullWidth onClick={() => handleUpdateStatus(order.id, 'confirmed')} className="bg-blue-600 hover:bg-blue-700" icon={<CheckCircle size={16} />}>
                              Terima
                            </Button>
                            <Button fullWidth variant="outline" onClick={() => handleUpdateStatus(order.id, 'cancelled')} className="border-red-200 text-red-600 hover:bg-red-50">
                              Tolak
                            </Button>
                          </>
                        )}

                        {order.status === 'confirmed' && (
                          <Button fullWidth onClick={() => handleUpdateStatus(order.id, 'in_progress')} className="bg-purple-600 hover:bg-purple-700">
                            Mulai Kerjakan
                          </Button>
                        )}

                        {order.status === 'in_progress' && (
                          <Button fullWidth onClick={() => handleUpdateStatus(order.id, 'completed')} className="bg-green-600 hover:bg-green-700" icon={<CheckCircle size={16} />}>
                            Selesai
                          </Button>
                        )}

                        {(order.status === 'completed' || order.status === 'cancelled') && (
                          <div className="text-center text-sm font-medium text-gray-500 py-2 bg-gray-50 rounded-lg w-full">
                            {order.status === 'completed' ? 'Pesanan Selesai' : 'Pesanan Dibatalkan'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400">
                Tidak ada pesanan di status ini.
              </div>
            )}
          </div>
        )}
      </div>
    </ProviderLayout>
  );
};

export default ProviderOrdersPage;