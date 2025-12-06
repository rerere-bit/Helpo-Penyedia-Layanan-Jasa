// src/pages/BookingPage.tsx

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
import { MarketService } from '@/services/market.service';
import { BookingService } from '@/services/booking.service';
import type { Service } from '@/types/market';

const BookingPage = () => {
  const { id } = useParams<{ id: string }>(); // Ambil ID service dari URL
  const navigate = useNavigate();
  
  // State
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // --- 1. FETCH SERVICE DATA ---
  useEffect(() => {
    if(id) {
      loadService(id);
    }
  }, [id]);

  const loadService = async (serviceId: string) => {
    try {
      const data = await MarketService.getServiceById(serviceId);
      if(!data) {
        alert("Layanan tidak ditemukan");
        navigate('/services');
        return;
      }
      setService(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const timeSlots = [
    "08:00", "09:00", "10:00",
    "11:00", "13:00", "14:00",
    "15:00", "16:00", "17:00"
  ];

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
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((dayName, i) => (
            <div key={i} className="text-center text-xs font-medium text-gray-400 py-2">
              {dayName}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-y-2">
          {dayList.map((dayItem, i) => {
            const isSelected = isSameDay(dayItem, selectedDate);
            const isCurrentMonth = isSameMonth(dayItem, monthStart);
            const isPast = dayItem < new Date(new Date().setHours(0,0,0,0)); // Disable tanggal lewat
            
            let btnStateClass = '';
            if (!isCurrentMonth || isPast) {
              btnStateClass = 'text-gray-300 cursor-not-allowed';
            } else if (isSelected) {
              btnStateClass = 'bg-blue-800 text-white hover:bg-blue-800 shadow-md shadow-blue-200';
            } else {
              btnStateClass = 'hover:bg-blue-50 text-gray-700';
            }

            return (
              <div key={i} className="flex justify-center">
                <button
                  onClick={() => !isPast && setSelectedDate(dayItem)}
                  disabled={!isCurrentMonth || isPast}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${btnStateClass}`}
                >
                  {format(dayItem, "d")}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // --- 2. HANDLE CONFIRM BOOKING ---
  const handleConfirm = async () => {
    if (!selectedTime || !service) {
      alert("Mohon lengkapi data pemesanan.");
      return;
    }

    if(!confirm("Apakah Anda yakin ingin memesan layanan ini?")) return;

    setIsSubmitting(true);
    try {
      // Create Booking ke Firestore
      const bookingId = await BookingService.createBooking({
        customerId: "user_customer_001", // Hardcode User ID sementara (nanti pakai Auth Context)
        providerId: service.providerId,
        serviceId: service.id!,
        
        // Simpan Snapshot Detail Jasa
        serviceSnapshot: {
          title: service.title,
          price: service.price,
          category: service.category,
          thumbnailUrl: service.thumbnailUrl
        },

        bookingDate: selectedDate,
        bookingTime: selectedTime,
        totalPrice: service.price
      });

      // Redirect ke Payment (atau Success page)
      // Gunakan ID booking yang asli dari Firestore
      navigate(`/payment/${bookingId}`); 

    } catch (error) {
      console.error(error);
      alert("Gagal membuat pesanan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
        <DashboardLayout>
            <div className="flex justify-center items-center h-[60vh]">
                <Loader2 className="animate-spin text-primary" size={32} />
            </div>
        </DashboardLayout>
    );
  }

  if (!service) return null;

  return (
    <DashboardLayout>
      <Container>
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
          
          {/* 1. Detail Layanan (Real Data) */}
          <Card className="p-6">
            <h2 className="text-gray-500 font-medium mb-4 text-sm">Detail Layanan</h2>  
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                {/* Thumbnail Kecil */}
                <img src={service.thumbnailUrl} className="w-16 h-16 rounded-lg object-cover bg-gray-100" alt="service" />
                <div>
                    <h3 className="text-lg font-bold text-gray-900">{service.title}</h3>
                    <span className="inline-block mt-1 bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">
                    {service.category}
                    </span>
                </div>
              </div>
              <p className="text-primary font-bold text-lg">
                Rp {service.price.toLocaleString('id-ID')}
              </p>
            </div>
          </Card>

          {/* 2. Pilih Tanggal (Calendar) */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <CalendarIcon size={20} className="text-gray-700" />
              <h2 className="font-bold text-gray-900">Pilih Tanggal</h2>
            </div>
            
            <div className="border border-gray-100 rounded-2xl p-4">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6 px-2">
                <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                  <ChevronLeft size={20} />
                </button>
                <span className="font-bold text-gray-800">
                  {format(currentMonth, 'MMMM yyyy', { locale: localeId })}
                </span>
                <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Calendar Grid */}
              {renderCalendar()}
            </div>
          </Card>

          {/* 3. Pilih Waktu */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Clock size={20} className="text-gray-700" />
              <h2 className="font-bold text-gray-900">Pilih Waktu</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`
                    py-3 px-4 rounded-xl border text-sm font-medium transition-all
                    ${selectedTime === time 
                      ? 'border-primary bg-blue-50 text-primary shadow-sm' 
                      : 'border-gray-200 text-gray-600 hover:border-blue-200 hover:bg-gray-50'}
                  `}
                >
                  {time}
                </button>
              ))}
            </div>
          </Card>

          {/* 4. Ringkasan Pesanan */}
          <Card className="p-6 bg-gray-50 border-0">
            <h2 className="font-bold text-gray-900 mb-6">Ringkasan Pesanan</h2>
            
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Layanan</span>
                <span className="font-medium text-gray-900 text-right">{service.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tanggal</span>
                <span className="font-medium text-gray-900">
                  {format(selectedDate, 'dd/MM/yyyy')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Waktu</span>
                <span className="font-medium text-gray-900">
                  {selectedTime || '-'}
                </span>
              </div>
              
              <hr className="border-gray-200 my-4" />
              
              <div className="flex justify-between items-center">
                <span className="text-gray-900 font-bold">Total</span>
                <span className="text-primary font-bold text-lg">
                  Rp {service.price.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </Card>

          {/* Action Button */}
          <Button 
            fullWidth 
            size="lg" 
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="shadow-xl shadow-blue-200"
          >
            {isSubmitting ? (
                <>
                 <Loader2 className="animate-spin mr-2" /> Memproses...
                </>
            ) : "Konfirmasi Pesanan"}
          </Button>

        </div>
      </Container>
    </DashboardLayout>
  );
};

export default BookingPage;