import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Loader2 } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';

// Backend Imports
import { useAuth } from '@/context/AuthContext';
import { createOrder } from '@/services/order.service';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Service } from '@/types';

const BookingPage = () => {
  const { id } = useParams(); // ID Service
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // State Data
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State Input User
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  const timeSlots = ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"];

  // 1. Fetch Detail Service saat load
  useEffect(() => {
    const fetchService = async () => {
      if(!id) return;
      try {
        const docRef = doc(db, "services", id);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setService({ id: snap.id, ...snap.data() } as Service);
        } else {
          alert("Layanan tidak ditemukan");
          navigate('/services');
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  // Logic Kalender
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const renderCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const dayList = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div className="w-full">
        <div className="grid grid-cols-7 mb-2">
          {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((dayName, i) => (
            <div key={i} className="text-center text-xs font-medium text-gray-400 py-2">{dayName}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-y-2">
          {dayList.map((dayItem, i) => {
            const isSelected = isSameDay(dayItem, selectedDate);
            const isCurrentMonth = isSameMonth(dayItem, monthStart);
            const isPast = dayItem < new Date(new Date().setHours(0,0,0,0)); // Disable hari lalu

            return (
              <div key={i} className="flex justify-center">
                <button
                  onClick={() => !isPast && setSelectedDate(dayItem)}
                  disabled={!isCurrentMonth || isPast}
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all
                    ${!isCurrentMonth || isPast ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-blue-50 text-gray-700'}
                    ${isSelected ? 'bg-blue-800 text-white hover:bg-blue-800 shadow-md shadow-blue-200' : ''}
                  `}
                >
                  {format(dayItem, 'd')}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // 2. Logic Konfirmasi Pesanan (Create Order)
  const handleConfirm = async () => {
    if (!selectedTime) return alert("Pilih waktu layanan");
    if (!user || !service) return;

    setIsSubmitting(true);
    try {
      // Panggil Backend
      const orderId = await createOrder(
        user.uid,
        service.id,
        service.providerId!, // Pastikan providerId ada di data service
        format(selectedDate, 'yyyy-MM-dd'), // Format tanggal standar DB
        selectedTime,
        service.price,
        notes
      );

      // Redirect ke halaman pembayaran (Next Step)
      navigate(`/payment/${orderId}`);
      
    } catch (error) {
      console.error(error);
      alert("Gagal membuat pesanan");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;
  if (!service) return null;

  return (
    <DashboardLayout>
      <Container>
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
          
          {/* Detail Layanan */}
          <Card className="p-6">
            <h2 className="text-gray-500 font-medium mb-4 text-sm">Detail Layanan</h2>  
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{service.title}</h3>
                <span className="inline-block mt-2 bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">
                  {service.category}
                </span>
              </div>
              <p className="text-primary font-bold text-lg">
                Rp {service.price.toLocaleString('id-ID')}
              </p>
            </div>
          </Card>

          {/* Pilih Tanggal */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <CalendarIcon size={20} className="text-gray-700" />
              <h2 className="font-bold text-gray-900">Pilih Tanggal</h2>
            </div>
            <div className="border border-gray-100 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-6 px-2">
                <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-full"><ChevronLeft size={20} /></button>
                <span className="font-bold text-gray-800">{format(currentMonth, 'MMMM yyyy', { locale: localeId })}</span>
                <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full"><ChevronRight size={20} /></button>
              </div>
              {renderCalendar()}
            </div>
          </Card>

          {/* Pilih Waktu */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Clock size={20} className="text-gray-700" />
              <h2 className="font-bold text-gray-900">Pilih Waktu</h2>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`
                    py-2 px-4 rounded-xl border text-sm font-medium transition-all
                    ${selectedTime === time ? 'border-primary bg-blue-50 text-primary' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}
                  `}
                >
                  {time}
                </button>
              ))}
            </div>
          </Card>

          {/* Catatan Tambahan */}
          <Card className="p-6">
             <h2 className="font-bold text-gray-900 mb-4">Catatan (Opsional)</h2>
             <textarea 
                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-primary"
                rows={3}
                placeholder="Contoh: Pagar warna hitam, tolong hubungi jika sudah sampai."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
             />
          </Card>

          {/* Ringkasan & Tombol */}
          <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 shadow-lg z-40">
             <Container>
               <div className="max-w-4xl mx-auto flex items-center justify-between">
                 <div>
                    <p className="text-xs text-gray-500">Total Pembayaran</p>
                    <p className="text-xl font-bold text-primary">Rp {service.price.toLocaleString('id-ID')}</p>
                 </div>
                 <Button 
                    className="w-48" 
                    onClick={handleConfirm}
                    disabled={isSubmitting}
                 >
                    {isSubmitting ? 'Memproses...' : 'Lanjut Bayar'}
                 </Button>
               </div>
             </Container>
          </div>

        </div>
      </Container>
    </DashboardLayout>
  );
};

export default BookingPage;