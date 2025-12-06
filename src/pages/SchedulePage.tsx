import { useState, useMemo, useEffect } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, MapPin, Clock, CalendarX, BellRing, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Container } from '@/components/common/Container';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';

// Backend Imports
import { useAuth } from '@/context/AuthContext';
import { getOrders } from '@/services/order.service';
import type { Order } from '@/types';

const SchedulePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // State UI
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isReminderOn, setIsReminderOn] = useState(true);
  
  // State Data
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper: Format Rupiah
  const formatRupiah = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
  };

  // Helper: Warna Badge Status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-700'; // Dikonfirmasi
      case 'pending': return 'bg-yellow-100 text-yellow-700'; // Menunggu Bayar
      case 'in_progress': return 'bg-purple-100 text-purple-700'; // Sedang Dikerjakan
      case 'completed': return 'bg-green-100 text-green-700'; // Selesai
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // --- 1. Fetch Orders dari Firebase ---
  useEffect(() => {
    const fetchSchedule = async () => {
      if (!user) return;
      try {
        // Ambil semua order kecuali yang dibatalkan
        const data = await getOrders(user.uid, 'customer');
        // Filter lokal untuk membuang yang cancelled (opsional, tergantung kebutuhan)
        const activeOrders = data.filter(o => o.status !== 'cancelled');
        setOrders(activeOrders);
      } catch (error) {
        console.error("Gagal memuat jadwal:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [user]);

  // --- 2. Filter Jadwal Harian (Berdasarkan Tanggal yang Dipilih) ---
  const selectedSchedules = useMemo(() => {
    return orders.filter(order => {
      // Pastikan bookingDate ada dan valid
      if (!order.bookingDate) return false;
      const orderDate = new Date(order.bookingDate);
      return isSameDay(orderDate, selectedDate);
    });
  }, [orders, selectedDate]);

  // --- 3. Render Kalender ---
  const renderCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const dayList = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div className="grid grid-cols-7 gap-y-4 gap-x-2 text-center text-sm mb-4">
        {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(d => (
          <div key={d} className="text-gray-400 font-medium text-xs uppercase tracking-wider">{d}</div>
        ))}
        
        {dayList.map((dayItem, i) => {
          const isSelected = isSameDay(dayItem, selectedDate);
          const isCurrentMonth = isSameMonth(dayItem, monthStart);
          
          // Cek apakah ada jadwal di tanggal ini
          const hasSchedule = orders.some(order => {
             if (!order.bookingDate) return false;
             return isSameDay(new Date(order.bookingDate), dayItem);
          });

          return (
            <button
              key={i}
              onClick={() => setSelectedDate(dayItem)}
              className={`
                h-9 w-9 mx-auto rounded-full flex items-center justify-center relative transition-all duration-200
                ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-100'}
                ${isSelected ? 'bg-blue-800 text-white hover:bg-blue-700 shadow-md shadow-blue-200 scale-110 font-bold' : ''}
              `}
            >
              {format(dayItem, 'd')}
              
              {/* Dot Indikator Biru */}
              {hasSchedule && !isSelected && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full ring-2 ring-white"></span>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <Container>
        <div className="max-w-6xl mx-auto pb-20">
          
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Pengingat & Jadwal</h1>
            <p className="text-gray-500">Kelola jadwal layanan yang akan datang</p>
          </div>

          {/* Toggle Pengingat */}
          <div className="bg-white border border-gray-100 p-5 rounded-2xl flex items-center justify-between mb-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
               <div className={`p-3 rounded-xl transition-colors ${isReminderOn ? 'bg-blue-50 text-blue-800' : 'bg-gray-100 text-gray-400'}`}>
                 <BellRing size={24} />
               </div>
               <div>
                 <h3 className="font-bold text-gray-900">Pengingat Otomatis</h3>
                 <p className="text-sm text-gray-500">
                   {isReminderOn ? 'Aktif: Notifikasi dikirim H-1 sebelum layanan' : 'Pengingat dimatikan'}
                 </p>
               </div>
            </div>
            
            <button 
              onClick={() => setIsReminderOn(!isReminderOn)}
              className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 focus:outline-none ${isReminderOn ? 'bg-blue-800' : 'bg-gray-300'}`}
            >
              <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isReminderOn ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Kiri: Kalender Interaktif */}
            <Card className="lg:w-1/3 p-6 shrink-0 sticky top-28">
              <div className="flex items-center justify-between mb-8">
                <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
                  <ChevronLeft size={20} />
                </button>
                <span className="font-bold text-lg text-gray-900 capitalize">
                  {format(currentMonth, 'MMMM yyyy', { locale: localeId })}
                </span>
                <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
                  <ChevronRight size={20} />
                </button>
              </div>
              
              {renderCalendar()}
              
              <div className="flex justify-center gap-6 text-xs text-gray-500 mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-blue-500 rounded-full ring-2 ring-gray-100"></span> Ada Jadwal
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-blue-800 rounded-full"></span> Dipilih
                </div>
              </div>
            </Card>

            {/* Kanan: List Pesanan (Dinamis) */}
            <div className="lg:w-2/3 w-full space-y-4">
              <div className="flex justify-between items-end mb-2">
                <h3 className="font-bold text-gray-900 text-lg capitalize">
                  Jadwal: {format(selectedDate, 'dd MMMM yyyy', { locale: localeId })}
                </h3>
                <span className="text-sm text-gray-500">{selectedSchedules.length} layanan</span>
              </div>

              {loading ? (
                <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" /></div>
              ) : selectedSchedules.length > 0 ? (
                selectedSchedules.map((item) => (
                  <Card key={item.id} className="p-6 flex flex-col md:flex-row justify-between items-start gap-4 hover:border-primary transition-colors group">
                      <div className="space-y-3 flex-1">
                         <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${getStatusColor(item.status)}`}>
                           {item.status === 'pending' ? 'Menunggu Bayar' : item.status}
                         </span>
                         <h4 className="font-bold text-gray-900 text-xl group-hover:text-primary transition-colors">
                           {item.serviceSnapshot?.title || "Layanan"}
                         </h4>
                         <div className="space-y-2 text-sm text-gray-500">
                            <div className="flex items-center gap-2.5">
                               <Clock size={16} className="text-primary" /> 
                               <span className="font-medium text-gray-700">{item.bookingTime}</span>
                            </div>
                            <div className="flex items-start gap-2.5">
                               <MapPin size={16} className="text-gray-400 mt-0.5" /> 
                               {/* Gunakan data customer snapshot atau user profile */}
                               <span>{item.customerSnapshot?.address || "Alamat belum diatur"}</span>
                            </div>
                         </div>
                      </div>
                      <div className="text-right flex flex-col items-end justify-between self-stretch">
                         <span className="font-bold text-primary text-xl">{formatRupiah(item.totalPrice)}</span>
                         <Button 
                           variant="outline" 
                           size="sm" 
                           className="mt-4"
                           onClick={() => navigate(`/order/${item.id}`)}
                         >
                           Detail Pesanan
                         </Button>
                      </div>
                  </Card>
                ))
              ) : (
                // Empty State
                <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-12 text-center">
                  <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CalendarX size={32} />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">Tidak ada jadwal</h3>
                  <p className="text-gray-500">Anda tidak memiliki layanan terjadwal pada tanggal ini.</p>
                  <Button className="mt-6" onClick={() => navigate('/services')}>
                    Cari Layanan Baru
                  </Button>
                </div>
              )}
            </div>

          </div>
        </div>
      </Container>
    </DashboardLayout>
  );
};

export default SchedulePage;