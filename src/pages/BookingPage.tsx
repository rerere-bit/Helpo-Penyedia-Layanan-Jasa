import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import { id } from 'date-fns/locale'; // Bahasa Indonesia
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';

const BookingPage = () => {
  const navigate = useNavigate();
  
  // State
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // MOCK DATA (Layanan yang dipilih)
  const serviceDetail = {
    name: "Bersih Rumah Premium",
    tag: "Pembersihan",
    price: 150000
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

    const dateFormat = "d";

    // Generate Days grid
    const dayList = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div className="w-full">
        {/* Header Hari (Su Mo Tu...) */}
        <div className="grid grid-cols-7 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((dayName, i) => (
            <div key={i} className="text-center text-xs font-medium text-gray-400 py-2">
              {dayName}
            </div>
          ))}
        </div>
        
        {/* Tanggal */}
        <div className="grid grid-cols-7 gap-y-2">
          {dayList.map((dayItem, i) => {
            const isSelected = isSameDay(dayItem, selectedDate);
            const isCurrentMonth = isSameMonth(dayItem, monthStart);
            
            // Build classes explicitly to avoid conflicting text color utilities
            const baseBtn = 'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all';
            let btnStateClass = '';
            if (!isCurrentMonth) {
              btnStateClass = 'text-gray-300 cursor-default';
            } else if (isSelected) {
              btnStateClass = 'bg-primary text-white hover:bg-primary shadow-md shadow-blue-200';
            } else {
              btnStateClass = 'hover:bg-blue-50 text-gray-700';
            }

            return (
              <div key={i} className="flex justify-center">
                <button
                  onClick={() => setSelectedDate(dayItem)}
                  disabled={!isCurrentMonth}
                  className={`${baseBtn} ${btnStateClass}`}
                >
                  {format(dayItem, dateFormat)}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const handleConfirm = () => {
    if (!selectedTime) {
      alert("Mohon pilih waktu layanan terlebih dahulu");
      return;
    }
    // Arahkan ke halaman pembayaran dengan ID Booking (simulasi ID baru)
    const newBookingId = Math.floor(Math.random() * 10000);
    navigate(`/payment/${newBookingId}`);
  };

  return (
    <DashboardLayout>
      <Container>
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
          
          {/* 1. Detail Layanan */}
          <Card className="p-6">
            <h2 className="text-gray-500 font-medium mb-4 text-sm">Detail Layanan</h2>  
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{serviceDetail.name}</h3>
                <span className="inline-block mt-2 bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">
                  {serviceDetail.tag}
                </span>
              </div>
              <p className="text-primary font-bold text-lg">
                Rp {serviceDetail.price.toLocaleString('id-ID')}
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
                  {format(currentMonth, 'MMMM yyyy', { locale: id })}
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
                <span className="font-medium text-gray-900 text-right">{serviceDetail.name}</span>
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
                  Rp {serviceDetail.price.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </Card>

          {/* Action Button */}
          <Button 
            fullWidth 
            size="lg" 
            onClick={handleConfirm}
            className="shadow-xl shadow-blue-200"
          >
            Konfirmasi Pesanan
          </Button>

        </div>
      </Container>
    </DashboardLayout>
  );
};

export default BookingPage;