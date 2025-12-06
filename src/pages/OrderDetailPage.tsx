import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, MapPin, Calendar, AlertCircle, Loader2, Check } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Container } from '@/components/common/Container';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';

// Backend Logic
import { getOrderById, updateOrderStatus } from '@/services/order.service';
import type { Order } from '@/types';
import { useAuth } from '@/context/AuthContext';

const OrderDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Order Data
  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      try {
        const data = await getOrderById(id);
        setOrder(data);
      } catch (error) {
        console.error("Gagal ambil detail:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  // 2. Logic Pembatalan (Hanya jika status masih pending/confirmed)
  const handleCancel = async () => {
    if (!order || !confirm("Yakin ingin membatalkan pesanan ini?")) return;
    try {
      await updateOrderStatus(order.id, 'cancelled');
      // Refresh manual sederhana
      setOrder(prev => prev ? { ...prev, status: 'cancelled' } : null);
    } catch (e) {
      alert("Gagal membatalkan");
    }
  };

  // Helper Format Rupiah
  const formatRupiah = (val: number) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  // 3. Logic Timeline Dinamis
  const generateTimeline = (status: string) => {
    const steps = [
      { key: 'pending', label: 'Menunggu Pembayaran' },
      { key: 'confirmed', label: 'Pesanan Dikonfirmasi' },
      { key: 'in_progress', label: 'Sedang Dikerjakan' },
      { key: 'completed', label: 'Selesai' }
    ];

    // Jika cancelled, timeline stop/merah
    if (status === 'cancelled') {
      return [{ key: 'cancelled', label: 'Pesanan Dibatalkan', active: true, error: true }];
    }

    // Cari index status saat ini
    const currentIndex = steps.findIndex(s => s.key === status);
    
    return steps.map((step, index) => ({
      ...step,
      active: index <= currentIndex, // Step sebelumnya dianggap selesai/aktif
      isCurrent: index === currentIndex
    }));
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;
  
  if (!order) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <p className="text-gray-500">Pesanan tidak ditemukan.</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate('/history')}>Kembali</Button>
        </div>
      </DashboardLayout>
    );
  }

  // Generate timeline berdasarkan status order saat ini
  const timeline = generateTimeline(order.status);

  return (
    <DashboardLayout>
      <Container>
        <div className="max-w-5xl mx-auto pb-20">
          
          {/* Header Nav */}
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-gray-500 hover:text-primary mb-6 transition-colors group"
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
            Kembali
          </button>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* KOLOM KIRI: Status & Detail Utama */}
            <div className="flex-1 w-full space-y-6">
              
              {/* 1. Status Banner */}
              <Card className={`p-6 border-l-4 ${order.status === 'cancelled' ? 'border-l-red-500 bg-red-50/30' : 'border-l-blue-500 bg-blue-50/30'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">ID Pesanan: #{order.id.slice(0, 8)}</p>
                    <h1 className="text-2xl font-bold text-gray-900">{order.serviceSnapshot.title}</h1>
                    <div className="mt-2 flex gap-2">
                      <Badge variant="neutral">{order.serviceSnapshot.category}</Badge>
                    </div>
                  </div>
                  {/* Thumbnail Service */}
                  <img 
                    src={order.serviceSnapshot.thumbnailUrl || "https://placehold.co/100"} 
                    alt="Service" 
                    className="w-16 h-16 rounded-lg object-cover bg-gray-200 border border-white shadow-sm"
                  />
                </div>
              </Card>

              {/* 2. Pelacakan Status (Timeline) */}
              <Card className="p-6">
                <h3 className="font-bold text-gray-900 mb-6">Status Pesanan</h3>
                <div className="space-y-0 relative">
                  {/* Garis Vertikal */}
                  <div className="absolute left-[11px] top-2 h-[80%] w-0.5 bg-gray-100 z-0"></div>

                  {timeline.map((step, index) => (
                    <div key={index} className="relative flex gap-4 pb-6 last:pb-0 z-10 bg-white">
                      {/* Dot Indicator */}
                      <div className={`
                        w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2
                        ${(step as any).error 
                            ? 'bg-red-100 border-red-500 text-red-600' 
                            : step.active 
                                ? 'bg-blue-600 border-blue-600 text-white' 
                                : 'bg-white border-gray-300 text-gray-300'}
                      `}>
                        {step.active ? <Check size={14} strokeWidth={3} /> : <div className="w-2 h-2 bg-gray-300 rounded-full"></div>}
                      </div>
                      
                      <div className="pt-0.5">
                        <p className={`text-sm font-bold ${(step as any).error ? 'text-red-600' : step.active ? 'text-gray-900' : 'text-gray-400'}`}>
                          {step.label}
                        </p>
                        {/* Tampilkan tanggal hanya jika aktif & langkah terakhir yg aktif */}
                        {(step as any).isCurrent && (
                          <p className="text-xs text-blue-600 mt-1 font-medium">Status Saat Ini</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* 3. Detail Lokasi & Jadwal */}
              <Card className="p-6">
                <h3 className="font-bold text-gray-900 mb-4">Detail Layanan</h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="p-2 bg-blue-50 text-primary rounded-lg h-fit">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Tanggal & Waktu</p>
                      <p className="font-semibold text-gray-900">{order.bookingDate}</p>
                      <p className="text-sm text-gray-700">{order.bookingTime}</p>
                    </div>
                  </div>
                  
                  <div className="w-full h-px bg-gray-100"></div>

                  <div className="flex gap-4">
                    <div className="p-2 bg-orange-50 text-orange-600 rounded-lg h-fit">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Lokasi Pengerjaan</p>
                      <p className="font-semibold text-gray-900">{order.customerSnapshot.address || "-"}</p>
                      {order.notes && (
                        <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded mt-2 border border-gray-100 italic">
                          "Catatan: {order.notes}"
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* KOLOM KANAN: Penyedia & Aksi */}
            <div className="w-full lg:w-96 space-y-6">
              
              {/* 1. Rincian Pembayaran */}
              <Card className="p-6">
                <h3 className="font-bold text-gray-900 mb-4">Rincian Pembayaran</h3>
                <div className="space-y-2 text-sm text-gray-600 pb-4 border-b border-gray-100">
                  <div className="flex justify-between">
                    <span>Harga Jasa</span>
                    <span>{formatRupiah(order.totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Biaya Aplikasi</span>
                    <span>Rp 0</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4 mb-4">
                  <span className="font-bold text-gray-900">Total Bayar</span>
                  <span className="font-bold text-lg text-primary">{formatRupiah(order.totalPrice)}</span>
                </div>
                
                {/* Status Bayar */}
                <div className={`text-xs px-3 py-2 rounded-lg flex items-center justify-between font-bold ${
                    order.status === 'pending' ? 'bg-yellow-50 text-yellow-700' : 'bg-green-50 text-green-700'
                }`}>
                  <span>Status Pembayaran</span>
                  <span className="uppercase">{order.status === 'pending' ? 'BELUM LUNAS' : 'LUNAS'}</span>
                </div>
              </Card>

              {/* 2. Aksi Cepat */}
              <div className="space-y-3">
                {/* Jika Customer & status pending, tampilkan tombol bayar */}
                {user?.role === 'customer' && order.status === 'pending' && (
                   <Button fullWidth onClick={() => navigate(`/payment/${order.id}`)}>
                     Bayar Sekarang
                   </Button>
                )}

                {/* Tombol Batalkan (Hanya muncul jika belum selesai/batal) */}
                {['pending', 'confirmed'].includes(order.status) && (
                  <Button fullWidth variant="outline" onClick={handleCancel} className="border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200">
                    Batalkan Pesanan
                  </Button>
                )}

                {/* Tombol Bantuan */}
                <button 
                  onClick={() => navigate('/help')}
                  className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-primary text-sm font-medium py-2"
                >
                  <AlertCircle size={16} /> Laporkan Masalah
                </button>
              </div>

            </div>
          </div>
        </div>
      </Container>
    </DashboardLayout>
  );
};

export default OrderDetailPage;