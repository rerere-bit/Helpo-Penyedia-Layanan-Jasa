import { useState } from 'react';
import { Check, Calendar, CreditCard, Star, Package, Bell } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';

// Tipe Data Notifikasi
interface Notification {
  id: number;
  type: 'booking' | 'payment' | 'review' | 'system' | 'promo';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

const NotificationPage = () => {
  // MOCK DATA (Sesuai Gambar)
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'booking',
      title: 'Pesanan Dikonfirmasi',
      message: 'Pesanan pembersihan rumah Anda telah dikonfirmasi untuk tanggal 5 November 2025',
      time: '2 jam yang lalu',
      isRead: false,
    },
    {
      id: 2,
      type: 'payment',
      title: 'Pembayaran Berhasil',
      message: 'Pembayaran sebesar Rp 250.000 telah berhasil diproses',
      time: '5 jam yang lalu',
      isRead: false,
    },
    {
      id: 3,
      type: 'review',
      title: 'Ulasan Baru',
      message: 'Penyedia jasa telah memberi Anda rating 5 bintang. Lihat ulasan lengkap.',
      time: '1 hari yang lalu',
      isRead: true, // Contoh yang sudah dibaca (tidak ada titik biru)
    },
    {
      id: 4,
      type: 'system',
      title: 'Layanan Selesai',
      message: 'Layanan perbaikan AC telah selesai. Berikan ulasan Anda.',
      time: '2 hari yang lalu',
      isRead: true,
    },
    {
      id: 5,
      type: 'promo',
      title: 'Promo Spesial!',
      message: 'Dapatkan diskon 20% untuk semua layanan pembersihan minggu ini',
      time: '3 hari yang lalu',
      isRead: true,
    },
  ]);

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  // Hitung notifikasi belum dibaca
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Handler: Tandai semua dibaca
  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, isRead: true }));
    setNotifications(updated);
  };

  // Handler: Hapus semua notifikasi
  const deleteAll = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus semua notifikasi?')) {
      setNotifications([]);
    }
  };

  // Filter notifications
  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.isRead;
    return true;
  });

  // Helper: Render Icon berdasarkan tipe
  const getIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <div className="p-3 rounded-xl bg-blue-50 text-blue-600"><Calendar size={24} /></div>;
      case 'payment':
        return <div className="p-3 rounded-xl bg-green-50 text-green-600"><CreditCard size={24} /></div>;
      case 'review':
        return <div className="p-3 rounded-xl bg-orange-50 text-orange-500"><Star size={24} /></div>;
      case 'system':
        return <div className="p-3 rounded-xl bg-purple-50 text-purple-600"><Package size={24} /></div>;
      case 'promo':
        return <div className="p-3 rounded-xl bg-yellow-50 text-yellow-600"><Bell size={24} /></div>;
      default:
        return <div className="p-3 rounded-xl bg-gray-50 text-gray-600"><Bell size={24} /></div>;
    }
  };

  return (
    <DashboardLayout>
      <Container>
        <div className="max-w-4xl mx-auto pb-20">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Notifikasi</h1>
              <p className="text-gray-500 text-sm mt-1">
                {unreadCount > 0 
                  ? `${unreadCount} notifikasi belum dibaca` 
                  : 'Semua notifikasi telah dibaca'}
              </p>
            </div>
            
            <div className="flex gap-2">
              {notifications.length > 0 && (
                 <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2 border-gray-200 text-red-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50"
                  onClick={deleteAll}
                >
                  Hapus Semua
                </Button>
              )}
              {unreadCount > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2 border-gray-200 text-gray-600 hover:text-primary hover:border-primary"
                  onClick={markAllAsRead}
                >
                  <Check size={16} />
                  Tandai Semua Dibaca
                </Button>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-6">
            <button 
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === 'all' 
                  ? 'bg-blue-800 text-white shadow-md shadow-blue-200' 
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              Semua
            </button>
            <button 
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === 'unread' 
                  ? 'bg-blue-800 text-white shadow-md shadow-blue-200' 
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              Belum Dibaca
            </button>
          </div>

          {/* Notification List */}
          <div className="space-y-4">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notif) => (
                <Card 
                  key={notif.id} 
                  className={`p-6 flex gap-4 transition-all hover:shadow-md cursor-pointer ${!notif.isRead ? 'border-l-4 border-l-blue-800 bg-blue-50/10' : ''}`}
                >
                  {/* Icon */}
                  <div className="shrink-0">
                    {getIcon(notif.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className={`text-base mb-1 ${!notif.isRead ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                        {notif.title}
                      </h3>
                      
                      {/* Dot Indikator Belum Dibaca */}
                      {!notif.isRead && (
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-800 mt-1.5 shrink-0"></span>
                      )}
                    </div>
                    
                    <p className="text-gray-500 text-sm leading-relaxed mb-2">
                      {notif.message}
                    </p>
                    
                    <p className="text-xs text-gray-400">
                      {notif.time}
                    </p>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                  <Bell size={32} />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Tidak ada notifikasi</h3>
                <p className="text-gray-500 text-sm mt-1">
                  {filter === 'unread' ? 'Anda telah membaca semua notifikasi' : 'Belum ada notifikasi untuk saat ini'}
                </p>
              </div>
            )}
          </div>

        </div>
      </Container>
    </DashboardLayout>
  );
};

export default NotificationPage;