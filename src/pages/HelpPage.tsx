import { useState } from 'react';
import { Upload, MessageSquare, Clock} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Container } from '@/components/common/Container';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';

const HelpPage = () => {
  const [activeTab, setActiveTab] = useState<'new' | 'history'>('new');

  // Mock Data Riwayat Tiket
  const tickets = [
    { id: 'TKT-001', title: 'Pembayaran tidak terproses', category: 'Pembayaran', date: '3 Nov 2025', status: 'Diproses', statusColor: 'bg-blue-100 text-blue-700', reply: 'Tim kami sedang memeriksa masalah pembayaran Anda.' },
    { id: 'TKT-002', title: 'Penyedia tidak datang tepat waktu', category: 'Layanan', date: '1 Nov 2025', status: 'Selesai', statusColor: 'bg-green-100 text-green-700', reply: 'Terima kasih atas laporan Anda. Kami telah menindaklanjuti dengan penyedia jasa.' },
    { id: 'TKT-003', title: 'Aplikasi error saat booking', category: 'Teknis', date: '2 Nov 2025', status: 'Menunggu', statusColor: 'bg-yellow-100 text-yellow-700', reply: null },
  ];

  return (
    <DashboardLayout>
      <Container>
        <div className="max-w-4xl mx-auto pb-20">
          
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Pusat Bantuan</h1>
            <p className="text-gray-500">Ajukan pertanyaan atau laporkan masalah yang Anda alami</p>
          </div>

          {/* Tabs */}
          <div className="bg-white p-1 rounded-full border border-gray-100 flex mb-8 shadow-sm">
            <button
              onClick={() => setActiveTab('new')}
              className={`flex-1 py-3 text-sm font-bold rounded-full transition-all ${activeTab === 'new' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Tiket Baru
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-3 text-sm font-bold rounded-full transition-all ${activeTab === 'history' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Riwayat Tiket
            </button>
          </div>

          {/* Konten Tab */}
          {activeTab === 'new' ? (
            <Card className="p-8">
              <h3 className="font-bold text-gray-900 mb-6 border-b pb-4">Buat Tiket Bantuan</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Kategori Masalah *</label>
                  <select className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-primary transition-colors text-gray-600">
                    <option>Pilih kategori</option>
                    <option>Pembayaran</option>
                    <option>Layanan</option>
                    <option>Teknis</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Deskripsi Masalah *</label>
                  <textarea 
                    rows={4}
                    placeholder="Jelaskan masalah yang Anda alami secara detail..."
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-primary transition-colors text-gray-600 resize-none"
                  ></textarea>
                </div>

                <div>
                   <label className="block text-sm font-bold text-gray-700 mb-2">Lampiran (Opsional)</label>
                   <div className="border border-dashed border-gray-300 rounded-xl p-4 flex items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-2 text-gray-500 font-medium">
                        <Upload size={18} /> Pilih file
                      </div>
                   </div>
                   <p className="text-xs text-gray-400 mt-2">Format: JPG, PNG, PDF (Max 5MB)</p>
                </div>

                <Button fullWidth icon={<MessageSquare size={18} />}>
                   Kirim Tiket
                </Button>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
               {tickets.map((t) => (
                 <Card key={t.id} className="p-6">
                    <div className="flex justify-between items-start mb-4">
                       <div>
                          <div className="flex items-center gap-2 mb-1">
                             <h3 className="font-bold text-gray-900">{t.title}</h3>
                             <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${t.statusColor}`}>{t.status}</span>
                          </div>
                          <div className="text-xs text-gray-400 flex items-center gap-2">
                             <span>ID: {t.id}</span> • <span>{t.category}</span> • <span>{t.date}</span>
                          </div>
                       </div>
                    </div>
                    
                    {/* Admin Response Area */}
                    <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex gap-3">
                       <div className={`mt-0.5 ${t.reply ? 'text-primary' : 'text-gray-400'}`}>
                          {t.reply ? <MessageSquare size={20} /> : <Clock size={20} />}
                       </div>
                       <div>
                          <p className="text-xs font-bold text-gray-700 mb-0.5">Admin Helpo</p>
                          <p className="text-sm text-gray-600">
                             {t.reply || "Menunggu respons admin..."}
                          </p>
                       </div>
                    </div>
                 </Card>
               ))}
            </div>
          )}

        </div>
      </Container>
    </DashboardLayout>
  );
};

export default HelpPage;