import { useState, useEffect } from 'react';
import ProviderLayout from '@/components/layout/ProviderLayout';
import { Card } from '@/components/common/Card';
import { DollarSign, ShoppingBag, Star, TrendingUp, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getOrders } from '@/services/order.service';
import { getProviderServices } from '@/services/service.service';
// Import komponen Chart dari Recharts
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';

const ProviderDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    revenue: 0,
    completedOrders: 0,
    rating: 0,
    totalServices: 0
  });
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const initData = async () => {
      if (!user) return;
      try {
        const [orders, services] = await Promise.all([
          getOrders(user.uid, 'provider'),
          getProviderServices(user.uid)
        ]);

        // 1. Kalkulasi Statistik Utama
        const completed = orders.filter(o => o.status === 'completed');
        const revenue = completed.reduce((acc, curr) => acc + curr.totalPrice, 0);
        
        const totalRating = services.reduce((acc, curr) => acc + (curr.rating || 0), 0);
        const avgRating = services.length > 0 ? (totalRating / services.length).toFixed(1) : 0;

        setStats({
          revenue,
          completedOrders: completed.length,
          rating: Number(avgRating),
          totalServices: services.length
        });

        // 2. Persiapkan Data Chart (Pendapatan 7 Hari Terakhir)
        // Buat array tanggal untuk 7 hari ke belakang
        const last7Days = [...Array(7)].map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - i);
          return d.toISOString().split('T')[0]; // Format YYYY-MM-DD
        }).reverse();

        // Mapping data pendapatan ke tanggal tersebut
        const data = last7Days.map(dateStr => {
          // Cari total pendapatan di tanggal ini
          // Kita membandingkan 10 karakter pertama dari createdAt (YYYY-MM-DD)
          const dayRevenue = completed
            .filter(o => o.createdAt.startsWith(dateStr)) 
            .reduce((acc, curr) => acc + curr.totalPrice, 0);
          
          return {
            name: new Date(dateStr).toLocaleDateString('id-ID', { weekday: 'short' }), // Output: Sen, Sel, Rab
            total: dayRevenue,
            fullDate: dateStr
          };
        });

        setChartData(data);

      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, [user]);

  const statItems = [
    { label: 'Total Pendapatan', value: `Rp ${stats.revenue.toLocaleString('id-ID')}`, icon: <DollarSign size={24} />, color: 'bg-green-100 text-green-600' },
    { label: 'Pesanan Selesai', value: stats.completedOrders, icon: <ShoppingBag size={24} />, color: 'bg-blue-100 text-blue-600' },
    { label: 'Rating Rata-rata', value: stats.rating, icon: <Star size={24} />, color: 'bg-yellow-100 text-yellow-600' },
    { label: 'Total Layanan', value: stats.totalServices, icon: <TrendingUp size={24} />, color: 'bg-purple-100 text-purple-600' },
  ];

  return (
    <ProviderLayout>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Mitra</h1>
          <p className="text-gray-500">Ringkasan performa bisnis Anda secara real-time.</p>
        </div>

        {loading ? (
          <div className="text-center py-20"><Loader2 className="animate-spin text-primary mx-auto" /></div>
        ) : (
          <>
            {/* Grid Statistik Kartu */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statItems.map((stat, idx) => (
                <Card key={idx} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-xl ${stat.color}`}>
                      {stat.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </Card>
              ))}
            </div>

            {/* Bagian Chart */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Analisis Pendapatan</h3>
                <span className="text-xs font-medium bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                  7 Hari Terakhir
                </span>
              </div>
              
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#6B7280', fontSize: 12 }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#6B7280', fontSize: 12 }} 
                      tickFormatter={(value) => `${value/1000}k`}
                    />
                    <Tooltip 
                      cursor={{ fill: '#F3F4F6' }}
                      contentStyle={{ 
                        borderRadius: '12px', 
                        border: 'none', 
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                        padding: '12px'
                      }}
                      formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, 'Pendapatan']}
                      labelStyle={{ color: '#6B7280', marginBottom: '4px' }}
                    />
                    <Bar dataKey="total" radius={[6, 6, 0, 0]} barSize={50}>
                      {chartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.total > 0 ? '#3B82F6' : '#E5E7EB'} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </>
        )}
      </div>
    </ProviderLayout>
  );
};

export default ProviderDashboard;