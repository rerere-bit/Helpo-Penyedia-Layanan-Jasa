import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { ArrowRight } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="bg-blue-600 py-20">
      <Container>
        <div className="text-center text-white max-w-3xl mx-auto space-y-6">
          <span className="font-medium text-blue-100 tracking-wide uppercase text-sm">
            Siap Memulai?
          </span>
          
          <h2 className="text-3xl md:text-5xl font-bold leading-tight">
            Bergabunglah dengan ribuan pengguna yang telah mempercayai Helpo
          </h2>
          
          <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto">
            Solusi satu atap untuk kebutuhan layanan rumah dan bisnis Anda. Aman, Cepat, dan Terpercaya.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button variant="white" size="lg" icon={<ArrowRight size={20} />}>
              Daftar Sebagai Pelanggan
            </Button>
            <Button 
              className="bg-transparent border-2 border-white text-white hover:bg-white/10" 
              size="lg"
            >
              Daftar Sebagai Penyedia Jasa
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default CTASection;