import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Container } from '@/components/common/Container';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { CreditCard, Wallet, Building, CheckCircle, ShieldCheck } from 'lucide-react';

const PaymentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  // MOCK DATA PEMESANAN
  const bookingSummary = {
    serviceName: "Bersih Rumah Premium",
    provider: "Helpo Clean",
    date: "28 Nov 2025",
    time: "10:00",
    price: 150000,
    adminFee: 5000,
    total: 155000
  };

  const handlePayment = () => {
    if (!selectedMethod) {
      alert("Silakan pilih metode pembayaran");
      return;
    }
    
    setIsProcessing(true);
    // Simulasi proses pembayaran (Waiting for payment gateway)
    setTimeout(() => {
      setIsProcessing(false);
      navigate('/payment/success');
    }, 2000);
  };

  const methods = [
    { id: 'gopay', name: 'GoPay', icon: <Wallet size={20} />, balance: 'Rp 500.000' },
    { id: 'bca', name: 'Transfer BCA', icon: <Building size={20} />, sub: 'Virtual Account' },
    { id: 'cc', name: 'Kartu Kredit', icon: <CreditCard size={20} />, sub: 'Visa/Mastercard' },
  ];

  return (
    <DashboardLayout>
      <Container>
        <div className="max-w-3xl mx-auto py-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Pembayaran</h1>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Kiri: Metode Pembayaran */}
            <div className="flex-1 space-y-6">
              <Card className="p-6">
                <h3 className="font-bold text-gray-800 mb-4">Pilih Metode Pembayaran</h3>
                <div className="space-y-3">
                  {methods.map((method) => (
                    <div 
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                        selectedMethod === method.id 
                          ? 'border-primary bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm text-gray-600">
                          {method.icon}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{method.name}</p>
                          {method.sub && <p className="text-xs text-gray-500">{method.sub}</p>}
                        </div>
                      </div>
                      {selectedMethod === method.id && <CheckCircle className="text-primary" size={20} />}
                    </div>
                  ))}
                </div>
              </Card>

              <div className="bg-green-50 p-4 rounded-xl flex items-start gap-3 border border-green-100">
                <ShieldCheck className="text-green-600 shrink-0" size={20} />
                <p className="text-sm text-green-700">
                  Pembayaran Anda aman dan terenkripsi. Dana akan diteruskan ke penyedia jasa setelah pekerjaan selesai.
                </p>
              </div>
            </div>

            {/* Kanan: Ringkasan */}
            <div className="md:w-80 space-y-6">
              <Card className="p-6 bg-gray-50 border-gray-100">
                <h3 className="font-bold text-gray-800 mb-4">Ringkasan Pesanan</h3>
                <div className="space-y-3 text-sm pb-4 border-b border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Layanan</span>
                    <span className="font-medium">{bookingSummary.serviceName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tanggal</span>
                    <span>{bookingSummary.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Waktu</span>
                    <span>{bookingSummary.time}</span>
                  </div>
                </div>
                
                <div className="space-y-2 py-4 border-b border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Harga Jasa</span>
                    <span>Rp {bookingSummary.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Biaya Layanan</span>
                    <span>Rp {bookingSummary.adminFee.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <span className="font-bold text-gray-900">Total Bayar</span>
                  <span className="font-bold text-xl text-primary">Rp {bookingSummary.total.toLocaleString()}</span>
                </div>
              </Card>

              <Button 
                fullWidth 
                size="lg" 
                onClick={handlePayment}
                disabled={!selectedMethod || isProcessing}
              >
                {isProcessing ? 'Memproses...' : 'Bayar Sekarang'}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </DashboardLayout>
  );
};

export default PaymentPage;