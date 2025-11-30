import ProviderLayout from '@/components/layout/ProviderLayout';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { DollarSign, ShoppingBag, Star, TrendingUp, ChevronRight } from 'lucide-react';

const ProviderDashboard = () => {
  // Mock Stats
  const stats = [
    { label: 'Total Pendapatan', value: 'Rp 4.500.000', icon: <DollarSign size={24} />, color: 'bg-green-100 text-green-600', trend: '+12%' },
    { label: 'Pesanan Selesai', value: '48', icon: <ShoppingBag size={24} />, color: 'bg-blue-100 text-blue-600', trend: '+5' },
    { label: 'Rating Rata-rata', value: '4.8', icon: <Star size={24} />, color: 'bg-yellow-100 text-yellow-600', trend: 'Stabil' },
    { label: 'Total Layanan', value: '5', icon: <TrendingUp size={24} />, color: 'bg-purple-100 text-purple-600', trend: 'Aktif' },
  ];

  // Mock Recent Orders
  const recentOrders = [
    { id: '#ORD-009', service: 'Cuci AC Split 2PK', customer: 'Budi Santoso', date: 'Hari ini, 14:00', price: 'Rp 75.000', status: 'Baru' },
    { id: '#ORD-008', service: 'Isi Freon R32', customer: 'Siti Aminah', date: 'Besok, 09:00', price: 'Rp 150.000', status: 'Baru' },
    { id: '#ORD-007', service: 'Cuci AC Inverter', customer: 'Ahmad Dani', date: '17 Nov, 10:00', price: 'Rp 85.000', status: 'Diproses' },
  ];

  return (
    <ProviderLayout>
      <div className="max-w-6xl mx-auto">
        
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Mitra</h1>
          <p className="text-gray-500">Selamat datang kembali, pantau performa bisnis Anda hari ini.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <Card key={idx} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  {stat.icon}
                </div>
                <span className="text-xs font-semibold bg-gray-50 text-gray-600 px-2 py-1 rounded">
                  {stat.trend}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </Card>
          ))}
        </div>

        {/* Recent Orders Table */}
        <Card className="overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-lg text-gray-800">Pesanan Masuk Terbaru</h3>
            <Button variant="ghost" size="sm" className="text-primary hover:bg-blue-50">
              Lihat Semua <ChevronRight size={16} />
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-4">ID Pesanan</th>
                  <th className="px-6 py-4">Layanan</th>
                  <th className="px-6 py-4">Pelanggan</th>
                  <th className="px-6 py-4">Jadwal</th>
                  <th className="px-6 py-4">Harga</th>
                  <th className="px-6 py-4">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-medium text-gray-900">{order.id}</td>
                    <td className="px-6 py-4">{order.service}</td>
                    <td className="px-6 py-4">{order.customer}</td>
                    <td className="px-6 py-4 text-gray-500">{order.date}</td>
                    <td className="px-6 py-4 font-bold text-primary">{order.price}</td>
                    <td className="px-6 py-4">
                      {order.status === 'Baru' ? (
                        <div className="flex gap-2">
                          <button className="bg-blue-800 text-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-blue-700 transition">Terima</button>
                          <button className="bg-red-50 text-red-600 px-3 py-1.5 rounded text-xs font-semibold hover:bg-red-100 transition">Tolak</button>
                        </div>
                      ) : (
                        <span className="inline-block px-3 py-1 rounded bg-yellow-50 text-yellow-700 text-xs font-semibold">
                          {order.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

      </div>
    </ProviderLayout>
  );
};

export default ProviderDashboard;