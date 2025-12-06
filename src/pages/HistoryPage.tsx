import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, MapPin, Loader2, Clock } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Container } from '@/components/common/Container';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';

import { useAuth } from '@/context/AuthContext';
import { getOrders } from '@/services/order.service'; // Backend
import type { Order } from '@/types';

const HistoryPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ongoing' | 'history'>('ongoing');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Fetch Orders dari Firebase
  useEffect(() => {
    const fetchData = async () => {
      if(!user) return;
      try {
        const data = await getOrders(user.uid, 'customer');
        setOrders(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  // 2. Filter Client Side (Tab & Search)
  const filteredData = useMemo(() => {
    return orders.filter((order) => {
      // Filter Tab
      const isOngoing = ['pending', 'confirmed', 'in_progress'].includes(order.status);
      const isHistory = ['completed', 'cancelled'].includes(order.status);
      const matchTab = activeTab === 'ongoing' ? isOngoing : isHistory;

      // Filter Search
      const sName = order.serviceSnapshot.title.toLowerCase();
      const matchSearch = sName.includes(searchQuery.toLowerCase()) || order.id.toLowerCase().includes(searchQuery.toLowerCase());

      return matchTab && matchSearch;
    });
  }, [orders, activeTab, searchQuery]);

  const formatRupiah = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return { variant: 'warning', label: 'Menunggu Bayar' };
      case 'confirmed': return { variant: 'primary', label: 'Dikonfirmasi' };
      case 'in_progress': return { variant: 'primary', label: 'Diproses' };
      case 'completed': return { variant: 'success', label: 'Selesai' };
      case 'cancelled': return { variant: 'neutral', label: 'Dibatalkan' };
      default: return { variant: 'neutral', label: status };
    }
  };

  return (
    <DashboardLayout>
      <Container>
        <div className="max-w-4xl mx-auto min-h-screen pb-20">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Riwayat Pesanan</h1>
          </div>

          {/* Search & Tabs */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text"
                placeholder="Cari ID pesanan atau nama layanan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="bg-white p-1 rounded-xl border border-gray-100 flex shadow-sm shrink-0">
              <button onClick={() => setActiveTab('ongoing')} className={`px-6 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'ongoing' ? 'bg-blue-50 text-primary' : 'text-gray-500'}`}>Berlangsung</button>
              <button onClick={() => setActiveTab('history')} className={`px-6 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'history' ? 'bg-blue-50 text-primary' : 'text-gray-500'}`}>Selesai</button>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="text-center py-20"><Loader2 className="animate-spin text-primary mx-auto" /></div>
          ) : (
            <div className="space-y-4">
              {filteredData.length > 0 ? filteredData.map((order) => {
                const badge = getStatusBadge(order.status);
                return (
                  <Card key={order.id} className="p-0 overflow-hidden hover:shadow-md transition-all group">
                    <div className="p-6 flex flex-col md:flex-row gap-6">
                      <div className="w-full md:w-32 h-32 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                        <img src={order.serviceSnapshot.thumbnailUrl || "https://placehold.co/150"} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">ID: {order.id}</p>
                            <h3 className="font-bold text-gray-900 text-lg">{order.serviceSnapshot.title}</h3>
                          </div>
                          {/* @ts-ignore */}
                          <Badge variant={badge.variant}>{badge.label}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-4">
                          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg"><Calendar size={16} className="text-primary" /> {order.bookingDate}</div>
                          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg"><Clock size={16} className="text-gray-400" /> {order.bookingTime}</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
                      <Button variant="outline" size="sm" onClick={() => navigate(`/order/${order.id}`)}>Lihat Detail</Button>
                      {order.status === 'pending' && (
                        <Button size="sm" onClick={() => navigate(`/payment/${order.id}`)}>Bayar Sekarang</Button>
                      )}
                    </div>
                  </Card>
                );
              }) : (
                <div className="text-center py-20 text-gray-400">Belum ada pesanan di kategori ini.</div>
              )}
            </div>
          )}
        </div>
      </Container>
    </DashboardLayout>
  );
};

export default HistoryPage;