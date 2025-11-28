import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, MapPin, Calendar, Clock, MessageSquare, Phone, ShieldCheck, AlertCircle, FileText } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Container } from '@/components/common/Container';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';

const OrderDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // MOCK DATA DETAIL PESANAN
  const order = {
    id: id || 'ORD-2025-001',
    status: 'Dikonfirmasi', // Bisa: Menunggu, Dikonfirmasi, Diproses, Selesai, Dibatalkan
    service: {
      title: 'Pembersihan Rumah Premium',
      category: 'Pembersihan',
      thumbnail: 'https://images.unsplash.com/photo-1581578731117-104f2a8d23e9?auto=format&fit=crop&w=800&q=80',
    },
    provider: {
      name: 'Helpo Clean',
      phone: '+62 812-3456-7890',
      avatar: 'H',
      isVerified: true,
    },
    schedule: {
      date: '5 November 2025',
      time: '10:00 - 13:00',
    },
    location: {
      address: 'Jl. Sudirman No. 123, Jakarta Selatan',
      notes: 'Rumah pagar hitam, samping minimarket.',
    },
    payment: {
      method: 'GoPay',
      total: 250000,
      status: 'Lunas',
    },
    timeline: [
      { status: 'Pesanan Dibuat', time: '04 Nov, 14:00', active: true },
      { status: 'Pembayaran Berhasil', time: '04 Nov, 14:05', active: true },
      { status: 'Dikonfirmasi Mitra', time: '04 Nov, 15:30', active: true },
      { status: 'Layanan Dikerjakan', time: '-', active: false },
      { status: 'Selesai', time: '-', active: false },
    ]
  };

  const formatRupiah = (val: number) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

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
              <Card className="p-6 border-l-4 border-l-blue-500 bg-blue-50/30">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">ID Pesanan: #{order.id}</p>
                    <h1 className="text-2xl font-bold text-gray-900">{order.service.title}</h1>
                    <Badge variant="primary" className="mt-2">
                      {order.status}
                    </Badge>
                  </div>
                  {/* Thumbnail Service */}
                  <img 
                    src={order.service.thumbnail} 
                    alt="Service" 
                    className="w-16 h-16 rounded-lg object-cover bg-gray-200"
                  />
                </div>
              </Card>

              {/* 2. Pelacakan Status (Timeline) */}
              <Card className="p-6">
                <h3 className="font-bold text-gray-900 mb-6">Status Pesanan</h3>
                <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:h-[85%] before:w-0.5 before:bg-gray-100">
                  {order.timeline.map((step, index) => (
                    <div key={index} className="relative flex gap-4">
                      {/* Dot Indicator */}
                      <div className={`w-4 h-4 rounded-full mt-1 shrink-0 z-10 ring-4 ring-white ${step.active ? 'bg-primary' : 'bg-gray-300'}`}></div>
                      
                      <div className="flex-1">
                        <p className={`text-sm font-semibold ${step.active ? 'text-gray-900' : 'text-gray-400'}`}>
                          {step.status}
                        </p>
                        <p className="text-xs text-gray-500">{step.time}</p>
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
                      <p className="text-sm text-gray-500">Tanggal & Waktu</p>
                      <p className="font-semibold text-gray-900">{order.schedule.date}</p>
                      <p className="text-sm text-gray-700">{order.schedule.time}</p>
                    </div>
                  </div>
                  
                  <div className="w-full h-px bg-gray-100"></div>

                  <div className="flex gap-4">
                    <div className="p-2 bg-orange-50 text-orange-600 rounded-lg h-fit">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Lokasi Pengerjaan</p>
                      <p className="font-semibold text-gray-900">{order.location.address}</p>
                      <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded mt-1 border border-gray-100">
                        Catatan: {order.location.notes}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* KOLOM KANAN: Penyedia, Pembayaran & Aksi */}
            <div className="w-full lg:w-96 space-y-6">
              
              {/* 1. Info Penyedia */}
              <Card className="p-6">
                <h3 className="font-bold text-gray-900 mb-4">Penyedia Jasa</h3>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gray-800 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {order.provider.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <p className="font-bold text-gray-900">{order.provider.name}</p>
                      {order.provider.isVerified && <ShieldCheck size={14} className="text-blue-500" />}
                    </div>
                    <p className="text-xs text-gray-500">Mitra Resmi Helpo</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" fullWidth className="gap-2 h-10 text-sm">
                    <MessageSquare size={16} /> Chat
                  </Button>
                  <Button variant="outline" fullWidth className="gap-2 h-10 text-sm">
                    <Phone size={16} /> Telepon
                  </Button>
                </div>
              </Card>

              {/* 2. Rincian Pembayaran */}
              <Card className="p-6">
                <h3 className="font-bold text-gray-900 mb-4">Rincian Pembayaran</h3>
                <div className="space-y-2 text-sm text-gray-600 pb-4 border-b border-gray-100">
                  <div className="flex justify-between">
                    <span>Harga Jasa</span>
                    <span>{formatRupiah(245000)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Biaya Aplikasi</span>
                    <span>{formatRupiah(5000)}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4 mb-4">
                  <span className="font-bold text-gray-900">Total Bayar</span>
                  <span className="font-bold text-lg text-primary">{formatRupiah(order.payment.total)}</span>
                </div>
                <div className="bg-green-50 text-green-700 text-xs px-3 py-2 rounded-lg flex items-center justify-between font-medium">
                  <span>Metode: {order.payment.method}</span>
                  <span className="uppercase">{order.payment.status}</span>
                </div>
              </Card>

              {/* 3. Aksi Cepat */}
              <div className="space-y-3">
                <Button fullWidth variant="outline" className="border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200">
                  Batalkan Pesanan
                </Button>
                <button className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-primary text-sm font-medium py-2">
                  <AlertCircle size={16} /> Laporkan Masalah
                </button>
                <button className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-primary text-sm font-medium py-2">
                  <FileText size={16} /> Unduh Invoice
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