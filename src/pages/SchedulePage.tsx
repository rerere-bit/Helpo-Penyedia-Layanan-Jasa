import { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import { id } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, MapPin, Clock } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Container } from '@/components/common/Container';
import { Card } from '@/components/common/Card';

const SchedulePage = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isReminderOn, setIsReminderOn] = useState(true);

  // DATA DUMMY JADWAL
  const scheduledDates = [5, 7, 10, 26]; // Tanggal yang ada titik birunya

  const upcomingOrders = [
    { id: 1, status: 'Dikonfirmasi', title: 'Pembersihan Rumah Premium', date: '5 Nov', time: '10:00 - 13:00', address: 'Jl. Sudirman No. 123, Jakarta', price: 'Rp 250.000', statusColor: 'bg-blue-100 text-blue-700' },
    { id: 2, status: 'Dikonfirmasi', title: 'Perbaikan AC', date: '7 Nov', time: '14:00 - 16:00', address: 'Jl. Thamrin No. 45, Jakarta', price: 'Rp 150.000', statusColor: 'bg-blue-100 text-blue-700' },
    { id: 3, status: 'Menunggu', title: 'Service Listrik', date: '10 Nov', time: '09:00 - 11:00', address: 'Jl. Gatot Subroto No. 78, Jakarta', price: 'Rp 200.000', statusColor: 'bg-yellow-100 text-yellow-700' },
  ];

  // Logic Kalender (Simplified)
  const renderCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const dayList = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div className="grid grid-cols-7 gap-y-4 gap-x-2 text-center text-sm mb-4">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d} className="text-gray-400 font-medium">{d}</div>)}
        
        {dayList.map((dayItem, i) => {
          const isSelected = isSameDay(dayItem, selectedDate);
          const isCurrentMonth = isSameMonth(dayItem, monthStart);
          const hasSchedule = scheduledDates.includes(dayItem.getDate()) && isCurrentMonth;

          return (
            <button
              key={i}
              onClick={() => setSelectedDate(dayItem)}
              className={`
                h-8 w-8 mx-auto rounded-full flex items-center justify-center relative
                ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-100'}
                ${isSelected ? 'bg-primary text-white hover:bg-primary shadow-lg shadow-blue-200' : ''}
              `}
            >
              {format(dayItem, 'd')}
              {/* Dot Biru untuk Jadwal */}
              {hasSchedule && !isSelected && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></span>
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
            <p className="text-gray-500">Lihat jadwal layanan dan atur pengingat Anda</p>
          </div>

          {/* Toggle Pengingat */}
          <div className="bg-white border border-gray-100 p-4 rounded-2xl flex items-center justify-between mb-8 shadow-sm">
            <div className="flex items-center gap-4">
               <div className="p-2 bg-blue-50 text-primary rounded-lg">
                 <Clock size={20} />
               </div>
               <div>
                 <h3 className="font-bold text-gray-800">Pengingat Otomatis</h3>
                 <p className="text-xs text-gray-500">Dapatkan notifikasi 1 hari sebelum layanan dimulai</p>
               </div>
            </div>
            {/* Custom Switch Toggle */}
            <button 
              onClick={() => setIsReminderOn(!isReminderOn)}
              className="w-12 h-6 rounded-full p-1 transition-colors ${isReminderOn ? 'bg-primary' : 'bg-gray-300'}"
            >
              <div className="w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${isReminderOn ? 'translate-x-6' : 'translate-x-0'}" />
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Kiri: Kalender */}
            <Card className="lg:w-1/3 p-6 h-fit">
              <div className="flex items-center justify-between mb-6">
                <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1 hover:bg-gray-100 rounded"><ChevronLeft size={20} /></button>
                <span className="font-bold text-gray-800">{format(currentMonth, 'MMMM yyyy', { locale: id })}</span>
                <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1 hover:bg-gray-100 rounded"><ChevronRight size={20} /></button>
              </div>
              {renderCalendar()}
              
              <div className="flex justify-center gap-6 text-xs text-gray-500 mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2"><span className="w-2 h-2 bg-primary rounded-full"></span> Ada Jadwal</div>
                <div className="flex items-center gap-2"><span className="w-2 h-2 border border-primary rounded-full"></span> Dipilih</div>
              </div>
            </Card>

            {/* Kanan: List Pesanan */}
            <div className="lg:w-2/3 space-y-4">
              <h3 className="font-semibold text-gray-700 mb-2">Pesanan Mendatang</h3>
              {upcomingOrders.map((item) => (
                <Card key={item.id} className="p-6 flex flex-col md:flex-row justify-between items-start gap-4">
                   <div className="space-y-3">
                      <span className="text-[10px] font-bold px-2 py-1 rounded ${item.statusColor}">
                        {item.status}
                      </span>
                      <h4 className="font-bold text-gray-900 text-lg">{item.title}</h4>
                      <div className="space-y-1 text-sm text-gray-500">
                         <div className="flex items-center gap-2">
                            <Clock size={14} /> {item.time}
                         </div>
                         <div className="flex items-center gap-2">
                            <MapPin size={14} /> {item.address}
                         </div>
                      </div>
                   </div>
                   <div className="text-right">
                      <span className="text-xs text-gray-400 block mb-1">{item.date}</span>
                      <span className="font-bold text-primary text-lg">{item.price}</span>
                   </div>
                </Card>
              ))}
            </div>

          </div>
        </div>
      </Container>
    </DashboardLayout>
  );
};

export default SchedulePage;