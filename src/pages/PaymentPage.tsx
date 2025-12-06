import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Container } from '@/components/common/Container';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { CreditCard, Wallet, Building, CheckCircle, ShieldCheck, Loader2, ArrowLeft } from 'lucide-react';

// Backend Imports
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { processPayment } from '@/services/payment.service';
import { useAuth } from '@/context/AuthContext';
import type { Order } from '@/types';

const PaymentPage = () => {
  const { id } = useParams(); // Order ID
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  // 1. Fetch Order Data Real
  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, "orders", id);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setOrder({ id: snap.id, ...snap.data() } as Order);
        } else {
          alert("Pesanan tidak ditemukan");
          navigate('/history');
        }
      } catch (e) {
        console.error("Error fetching order:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, navigate]);

  const handlePayment = async () => {
    if (!selectedMethod) return alert("Silakan pilih metode pembayaran");
    if (!order || !user) return;
    
    setIsProcessing(true);
    try {
      // Panggil Service Backend
      await processPayment(order.id, user.uid, order.totalPrice, selectedMethod);
      
      // Redirect ke Sukses
      navigate('/payment/success', { state: { orderId: order.id } }); // Kirim ID ke page sukses
    } catch (error) {
      alert("Pembayaran gagal, silakan coba lagi.");
      setIsProcessing(false);
    }
  };

  const methods = [
    { id: 'GoPay', name: 'GoPay', icon: <Wallet size={20} />, sub: 'Saldo cukup' },
    { id: 'BCA', name: 'Transfer BCA', icon: <Building size={20} />, sub: 'Virtual Account' },
    { id: 'Visa', name: 'Kartu Kredit', icon: <CreditCard size={20} />, sub: 'Visa/Mastercard' },
  ];

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;
  if (!order) return null;

  return (
    <DashboardLayout>
      <Container>
        <div className="max-w-3xl mx-auto py-10 pb-24">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-primary mb-6">
            <ArrowLeft size={20} /> Kembali
          </button>

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
                  Pembayaran Anda aman. Helpo menjamin uang kembali jika layanan tidak sesuai.
                </p>
              </div>
            </div>

            {/* Kanan: Ringkasan */}
            <div className="md:w-80 space-y-6">
              <Card className="p-6 bg-gray-50 border-gray-100 sticky top-28">
                <h3 className="font-bold text-gray-800 mb-4">Ringkasan Pesanan</h3>
                <div className="space-y-3 text-sm pb-4 border-b border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Layanan</span>
                    <span className="font-medium text-right line-clamp-1 w-32">{order.serviceSnapshot.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tanggal</span>
                    <span>{order.bookingDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Waktu</span>
                    <span>{order.bookingTime}</span>
                  </div>
                </div>
                
                <div className="space-y-2 py-4 border-b border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Harga Jasa</span>
                    <span>Rp {order.totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Biaya Layanan</span>
                    <span>Rp 0</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <span className="font-bold text-gray-900">Total Bayar</span>
                  <span className="font-bold text-xl text-primary">Rp {order.totalPrice.toLocaleString()}</span>
                </div>

                <Button 
                  fullWidth 
                  size="lg" 
                  className="mt-6 shadow-xl shadow-blue-200"
                  onClick={handlePayment}
                  disabled={!selectedMethod || isProcessing}
                >
                  {isProcessing ? 'Memproses...' : 'Bayar Sekarang'}
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </Container>
    </DashboardLayout>
  );
};

export default PaymentPage;