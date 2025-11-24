import { Home, Wind, Zap, PaintRoller, Wrench, Sprout, ArrowRight } from 'lucide-react';
import { Container } from '@/components/common/Container';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';

const services = [
  { icon: <Home size={32} />, name: "Pembersihan Rumah", count: "500+ Penyedia" },
  { icon: <Wind size={32} />, name: "Perbaikan AC", count: "300+ Penyedia" },
  { icon: <Zap size={32} />, name: "Tukang Listrik", count: "400+ Penyedia" },
  { icon: <PaintRoller size={32} />, name: "Cat & Renovasi", count: "250+ Penyedia" },
  { icon: <Wrench size={32} />, name: "Tukang Pipa", count: "350+ Penyedia" },
  { icon: <Sprout size={32} />, name: "Jasa Taman", count: "200+ Penyedia" },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-20 bg-white">
      <Container>
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="primary" className="mb-4">Kategori Populer</Badge>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Layanan yang Tersedia</h2>
          <p className="text-gray-500">Berbagai kategori layanan profesional siap membantu kebutuhan Anda.</p>
        </div>

        {/* Grid Layanan */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          {services.map((item, index) => (
            <div 
              key={index} 
              className="group bg-white border border-gray-100 rounded-xl p-6 flex flex-col items-center text-center hover:border-primary hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="text-gray-400 group-hover:text-primary transition-colors mb-4">
                {item.icon}
              </div>
              <h3 className="font-bold text-gray-800 text-sm md:text-base mb-1">{item.name}</h3>
              <p className="text-xs text-gray-400">{item.count}</p>
            </div>
          ))}
        </div>

        {/* Tombol Lihat Semua */}
        <div className="text-center">
          <Button variant="ghost" className="gap-2">
            Lihat Semua Kategori <ArrowRight size={16} />
          </Button>
        </div>
      </Container>
    </section>
  );
};

export default ServicesSection;