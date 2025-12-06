import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, List } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  // Kita bisa ambil detail order dari state jika mau lebih detail, 
  // tapi untuk simpel, kita pakai pesan generik dulu.

  return (
    <DashboardLayout>
      <Container>
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center max-w-lg mx-auto">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6 animate-bounce">
            <CheckCircle size={48} />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pembayaran Berhasil!</h1>
          <p className="text-gray-500 mb-8">
            Terima kasih! Pesanan Anda telah dikonfirmasi dan diteruskan ke penyedia jasa.
          </p>

          <div className="bg-gray-50 p-6 rounded-2xl w-full mb-8 border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Langkah Selanjutnya</h3>
            <div className="space-y-4 text-left">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0">1</div>
                <p className="text-sm text-gray-600">Penyedia jasa akan mengonfirmasi jadwal Anda.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0">2</div>
                <p className="text-sm text-gray-600">Anda dapat memantau status pesanan di menu Riwayat.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Button 
              fullWidth 
              variant="outline" 
              onClick={() => navigate('/history')}
              icon={<List size={18} />}
            >
              Lihat Riwayat
            </Button>
            <Button 
              fullWidth 
              onClick={() => navigate('/services')}
              icon={<ArrowRight size={18} />}
            >
              Cari Jasa Lain
            </Button>
          </div>
        </div>
      </Container>
    </DashboardLayout>
  );
};

export default PaymentSuccessPage;