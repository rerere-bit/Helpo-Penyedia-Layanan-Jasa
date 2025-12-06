import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, addMonths, subMonths } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { Save, Calendar as CalIcon, Clock, ChevronLeft, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import ProviderLayout from '@/components/layout/ProviderLayout';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/context/AuthContext';
import { getProviderSchedule, saveProviderSchedule } from '@/services/schedule.service';
import type { ProviderSchedule } from '@/types';

const DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

const ProviderSchedulePage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // State Jadwal
  const [schedule, setSchedule] = useState<ProviderSchedule>({
    providerId: '',
    workingDays: [],
    workingHours: { start: '08:00', end: '17:00' },
    exceptions: []
  });

  // State Kalender (untuk pilih libur)
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // 1. Fetch Data
  useEffect(() => {
    const init = async () => {
      if (!user) return;
      try {
        const data = await getProviderSchedule(user.uid);
        setSchedule(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [user]);

  // Handler: Toggle Hari Kerja
  const toggleDay = (dayIndex: number) => {
    setSchedule(prev => {
      const exists = prev.workingDays.includes(dayIndex);
      const newDays = exists 
        ? prev.workingDays.filter(d => d !== dayIndex)
        : [...prev.workingDays, dayIndex].sort();
      return { ...prev, workingDays: newDays };
    });
  };

  // Handler: Toggle Tanggal Libur (Exception)
  const toggleException = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    setSchedule(prev => {
      const exists = prev.exceptions.includes(dateStr);
      const newExceptions = exists
        ? prev.exceptions.filter(d => d !== dateStr)
        : [...prev.exceptions, dateStr];
      return { ...prev, exceptions: newExceptions };
    });
  };

  // Handler: Simpan
  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await saveProviderSchedule(user.uid, schedule);
      alert('Jadwal berhasil disimpan!');
    } catch (e) {
      alert('Gagal menyimpan jadwal');
    } finally {
      setIsSaving(false);
    }
  };

  // Render Kalender Mini
  const renderCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const dayList = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div className="select-none">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1 hover:bg-gray-100 rounded"><ChevronLeft size={20} /></button>
          <span className="font-semibold text-gray-700">{format(currentMonth, 'MMMM yyyy', { locale: localeId })}</span>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1 hover:bg-gray-100 rounded"><ChevronRight size={20} /></button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2 text-gray-400">
          {['Min','Sen','Sel','Rab','Kam','Jum','Sab'].map(d => <div key={d}>{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {dayList.map((day, i) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const isOff = schedule.exceptions.includes(dateStr);
            const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
            
            return (
              <div 
                key={i} 
                onClick={() => toggleException(day)}
                className={`
                  aspect-square flex items-center justify-center text-sm rounded cursor-pointer transition-colors
                  ${!isCurrentMonth ? 'text-gray-300' : ''}
                  ${isOff ? 'bg-red-100 text-red-600 font-bold border border-red-200' : 'hover:bg-gray-100 text-gray-700'}
                `}
              >
                {format(day, 'd')}
              </div>
            );
          })}
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">*Klik tanggal untuk menandai libur</p>
      </div>
    );
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <ProviderLayout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Atur Jadwal</h1>
            <p className="text-gray-500">Tentukan jam operasional dan hari libur Anda.</p>
          </div>
          <Button onClick={handleSave} disabled={isSaving} icon={isSaving ? <Loader2 className="animate-spin"/> : <Save size={18}/>}>
            {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Kolom Kiri: Jam Operasional */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4 text-gray-800 font-bold">
                <Clock size={20} className="text-primary" />
                <h3>Jam Operasional</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Jam Buka</label>
                  <input 
                    type="time" 
                    className="w-full border border-gray-300 rounded-lg p-2"
                    value={schedule.workingHours.start}
                    onChange={e => setSchedule({...schedule, workingHours: {...schedule.workingHours, start: e.target.value}})}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Jam Tutup</label>
                  <input 
                    type="time" 
                    className="w-full border border-gray-300 rounded-lg p-2"
                    value={schedule.workingHours.end}
                    onChange={e => setSchedule({...schedule, workingHours: {...schedule.workingHours, end: e.target.value}})}
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4 text-gray-800 font-bold">
                <CalIcon size={20} className="text-primary" />
                <h3>Hari Kerja Rutin</h3>
              </div>
              <div className="space-y-3">
                {DAYS.map((day, index) => {
                  const isActive = schedule.workingDays.includes(index);
                  return (
                    <div 
                      key={day} 
                      onClick={() => toggleDay(index)}
                      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                        isActive ? 'border-primary bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <span className={`text-sm font-medium ${isActive ? 'text-primary' : 'text-gray-600'}`}>{day}</span>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isActive ? 'bg-primary border-primary' : 'border-gray-300 bg-white'}`}>
                        {isActive && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Kolom Kanan: Pengecualian / Libur */}
          <div>
            <Card className="p-6 h-full">
              <div className="flex items-center gap-2 mb-4 text-gray-800 font-bold">
                <AlertCircle size={20} className="text-red-500" />
                <h3>Atur Tanggal Libur</h3>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-4">
                {renderCalendar()}
              </div>
              
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Daftar Libur Akan Datang:</h4>
                {schedule.exceptions.filter(d => new Date(d) >= new Date()).sort().slice(0, 5).length > 0 ? (
                  <div className="space-y-2">
                    {schedule.exceptions.filter(d => new Date(d) >= new Date()).sort().slice(0, 5).map(date => (
                      <div key={date} className="flex justify-between items-center text-sm bg-white border border-gray-200 p-2 rounded text-gray-600">
                        <span>{format(new Date(date), 'dd MMMM yyyy', { locale: localeId })}</span>
                        <button onClick={() => toggleException(new Date(date))} className="text-red-500 hover:text-red-700 text-xs font-bold">Hapus</button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic">Tidak ada jadwal libur mendatang.</p>
                )}
              </div>
            </Card>
          </div>

        </div>
      </div>
    </ProviderLayout>
  );
};

export default ProviderSchedulePage;