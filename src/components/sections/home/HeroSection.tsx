import { CheckCircle, ArrowRight } from 'lucide-react';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import baristaImg from '@/assets/Barista.jpeg'

const HeroSection = () => {
  return (
    <section className="relative bg-white py-16 lg:py-24 overflow-hidden">
      <Container>
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Kiri: Konten Teks */}
          <div className="w-full lg:w-1/2 space-y-8 text-center lg:text-left">
            
            {/* Menggunakan component Badge */}
            <Badge variant="warning" className="px-4 py-2 text-sm">
               🏆 Platform Jasa Terpercaya #1 di Indonesia
            </Badge>

            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-[1.1]">
              Temukan Penyedia Jasa <span className="text-primary">Profesional</span> dengan Mudah
            </h1>

            <p className="text-lg text-gray-500 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Helpo menghubungkan Anda dengan ribuan profesional terverifikasi untuk berbagai kebutuhan layanan rumah dan bisnis Anda.
            </p>

            {/* Menggunakan component Button */}
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Button size="lg" icon={<ArrowRight size={20} />}>
                Mulai Sekarang
              </Button>
              <Button variant="outline" size="lg">
                Jadi Penyedia Jasa
              </Button>
            </div>

            {/* Trust Signals */}
            <div className="flex items-center justify-center lg:justify-start gap-6 text-sm font-medium text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="text-green-500" size={20} />
                <span>Gratis Tanpa Biaya</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="text-green-500" size={20} />
                <span>Verifikasi Ketat</span>
              </div>
            </div>
          </div>

          {/* Kanan: Gambar (Sama seperti sebelumnya) */}
          <div className="w-full lg:w-1/2 relative">
            <div className="absolute -top-10 -right-10 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-50 animate-pulse"></div>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img 
                 src={baristaImg} 
                 alt="Professional Service Provider" 
                 className="w-full h-auto object-cover"
              />
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
};

export default HeroSection;