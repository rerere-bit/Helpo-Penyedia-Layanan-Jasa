import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { resetPassword } from '@/services/auth.service';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      await resetPassword(email);
      setStatus('success');
    } catch (err: any) {
      setStatus('error');
      // Handle error firebase umum
      if (err.message.includes('user-not-found')) {
        setErrorMessage('Email tidak terdaftar di sistem kami.');
      } else if (err.message.includes('invalid-email')) {
        setErrorMessage('Format email tidak valid.');
      } else {
        setErrorMessage('Terjadi kesalahan. Silakan coba lagi nanti.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-center min-h-[calc(100vh-140px)] bg-gray-50/50 py-12">
        <Card className="w-full max-w-md p-8 shadow-xl border-0">
          
          <Link to="/login" className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary mb-6 transition-colors">
            <ArrowLeft size={16} /> Kembali ke Login
          </Link>

          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-primary mx-auto mb-4">
              <Mail size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Lupa Password?</h1>
            <p className="text-gray-500 text-sm mt-2">
              Masukkan email Anda, kami akan mengirimkan link untuk mereset password Anda.
            </p>
          </div>

          {status === 'success' ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center animate-in fade-in zoom-in duration-300">
              <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
              <h3 className="font-bold text-green-800 mb-1">Email Terkirim!</h3>
              <p className="text-sm text-green-700 mb-4">
                Silakan cek kotak masuk (atau spam) email <strong>{email}</strong> untuk instruksi selanjutnya.
              </p>
              <Button onClick={() => setStatus('idle')} variant="outline" size="sm">
                Kirim Ulang
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {status === 'error' && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  <p>{errorMessage}</p>
                </div>
              )}

              <Input
                label="Email Terdaftar"
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="py-3"
              />

              <Button 
                type="submit" 
                fullWidth 
                disabled={isLoading || !email}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin" size={18} /> Mengirim...
                  </span>
                ) : 'Kirim Link Reset'}
              </Button>
            </form>
          )}

        </Card>
      </div>
    </MainLayout>
  );
};

export default ForgotPasswordPage;