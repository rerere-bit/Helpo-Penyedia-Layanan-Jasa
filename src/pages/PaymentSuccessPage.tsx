import { useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, ArrowRight } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <Container>
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center max-w-lg mx-auto">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6 animate-bounce">
            <CheckCircle size={40} />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pembayaran Berhasil!</h1>
          <p className="text-gray-500 mb-8">
            Pesanan Anda telah dikonfirmasi. Penyedia jasa akan segera menghubungi Anda.
          </p>

          <div className="bg-gray-50 p-6 rounded-2xl w-full mb-8 border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Detail Jadwal</h3>
            <div className="flex items-center justify-center gap-2 text-xl font-bold text-gray-900">
              <Calendar className="text-primary" />
              28 Nov 2025 • 10:00
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Button 
              fullWidth 
              variant="outline" 
              onClick={() => navigate('/history')}
            >
              Lihat Riwayat Pesanan
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