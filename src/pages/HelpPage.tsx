import { useState, useEffect } from 'react';
import { Upload, MessageSquare, Clock, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Container } from '@/components/common/Container';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input'; // Pastikan Input component ada

// Backend Logic
import { useAuth } from '@/context/AuthContext';
import { createTicket, getUserTickets } from '@/services/ticket.service';
import type { Ticket } from '@/types';

const HelpPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'new' | 'history'>('new');
  
  // State Data
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // State Form
  const [formData, setFormData] = useState({
    category: 'Layanan',
    subject: '',
    description: ''
  });

  // 1. Fetch Data Tiket
  useEffect(() => {
    if (activeTab === 'history' && user) {
      loadTickets();
    }
  }, [activeTab, user]);

  const loadTickets = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getUserTickets(user.uid);
      setTickets(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Submit Tiket
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setSubmitting(true);
    try {
      await createTicket(
        user.uid,
        formData.category,
        formData.subject, // Kita pakai subject sebagai rangkuman/judul
        formData.description
      );
      
      alert("Tiket berhasil dikirim! Tim kami akan segera merespons.");
      
      // Reset Form & Pindah Tab
      setFormData({ category: 'Layanan', subject: '', description: '' });
      setActiveTab('history');
      
    } catch (e) {
      alert("Gagal mengirim tiket. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  // Helper Warna Status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-yellow-100 text-yellow-700'; // Menunggu
      case 'in_progress': return 'bg-blue-100 text-blue-700'; // Diproses
      case 'closed': return 'bg-green-100 text-green-700'; // Selesai
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open': return 'Menunggu Respon';
      case 'in_progress': return 'Sedang Diproses';
      case 'closed': return 'Selesai';
      default: return status;
    }
  };

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
              className={`flex-1 py-3 text-sm font-bold rounded-full transition-all ${activeTab === 'new' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Buat Tiket Baru
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-3 text-sm font-bold rounded-full transition-all ${activeTab === 'history' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Riwayat Tiket
            </button>
          </div>

          {/* Konten Tab: BUAT TIKET */}
          {activeTab === 'new' ? (
            <Card className="p-8">
              <h3 className="font-bold text-gray-900 mb-6 border-b pb-4">Formulir Pengaduan</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Kategori Masalah *</label>
                  <select 
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-primary transition-colors text-gray-600"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="Layanan">Layanan / Jasa</option>
                    <option value="Pembayaran">Pembayaran & Refund</option>
                    <option value="Akun">Akun & Keamanan</option>
                    <option value="Teknis">Masalah Teknis Aplikasi</option>
                  </select>
                </div>

                <Input 
                  label="Judul Masalah *" 
                  placeholder="Contoh: Pembayaran gagal tapi saldo terpotong"
                  value={formData.subject}
                  onChange={e => setFormData({...formData, subject: e.target.value})}
                  required
                />

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Deskripsi Detail *</label>
                  <textarea 
                    rows={5}
                    placeholder="Jelaskan kronologi masalah yang Anda alami..."
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-primary transition-colors text-gray-600 resize-none"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    required
                  ></textarea>
                </div>

                <Button fullWidth disabled={submitting} icon={submitting ? <Loader2 className="animate-spin"/> : <MessageSquare size={18} />}>
                   {submitting ? 'Mengirim...' : 'Kirim Tiket'}
                </Button>
              </form>
            </Card>
          ) : (
            /* Konten Tab: RIWAYAT */
            <div className="space-y-4">
               {loading ? (
                 <div className="text-center py-10"><Loader2 className="animate-spin mx-auto text-primary" /></div>
               ) : tickets.length > 0 ? (
                 tickets.map((t) => (
                   <Card key={t.id} className="p-6">
                      <div className="flex justify-between items-start mb-4">
                         <div>
                            <div className="flex items-center gap-2 mb-1">
                               <h3 className="font-bold text-gray-900 text-lg">{t.subject}</h3>
                               <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${getStatusColor(t.status)}`}>
                                 {getStatusLabel(t.status)}
                               </span>
                            </div>
                            <div className="text-xs text-gray-400 flex items-center gap-2 mt-1">
                               <span>ID: {t.id.slice(0,8)}</span> • <span>{t.category}</span> • <span>{t.createdAt}</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                              "{t.description}"
                            </p>
                         </div>
                      </div>
                      
                      {/* Admin Response Area */}
                      <div className={`p-4 rounded-xl border flex gap-3 mt-4 ${t.adminReply ? 'bg-blue-50 border-blue-100' : 'bg-gray-50 border-gray-100'}`}>
                         <div className={`mt-0.5 ${t.adminReply ? 'text-primary' : 'text-gray-400'}`}>
                            {t.adminReply ? <CheckCircle size={20} /> : <Clock size={20} />}
                         </div>
                         <div>
                            <p className="text-xs font-bold text-gray-700 mb-0.5">
                              {t.adminReply ? 'Balasan Admin Helpo' : 'Status Terkini'}
                            </p>
                            <p className="text-sm text-gray-600">
                               {t.adminReply || "Tiket Anda sedang dalam antrean tinjauan tim support kami. Mohon menunggu 1x24 jam."}
                            </p>
                         </div>
                      </div>
                   </Card>
                 ))
               ) : (
                 <div className="text-center py-20 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                   <AlertCircle size={32} className="mx-auto mb-2 opacity-50"/>
                   <p>Belum ada riwayat tiket bantuan.</p>
                 </div>
               )}
            </div>
          )}

        </div>
      </Container>
    </DashboardLayout>
  );
};

export default HelpPage;