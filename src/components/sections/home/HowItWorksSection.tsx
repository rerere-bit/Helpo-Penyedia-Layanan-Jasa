import { Search, Briefcase, CalendarCheck, MessageSquare } from 'lucide-react';
import { Container } from '@/components/common/Container';
import { Badge } from '@/components/common/Badge';

const steps = [
  {
    icon: <Search size={28} />,
    step: "Langkah 1",
    title: "Cari Layanan",
    desc: "Telusuri berbagai kategori jasa yang Anda butuhkan dengan mudah."
  },
  {
    icon: <Briefcase size={28} />,
    step: "Langkah 2",
    title: "Pilih Penyedia",
    desc: "Bandingkan rating, ulasan, dan harga dari berbagai penyedia terpercaya."
  },
  {
    icon: <CalendarCheck size={28} />,
    step: "Langkah 3",
    title: "Pesan & Bayar",
    desc: "Jadwalkan layanan dan lakukan pembayaran dengan aman lewat platform."
  },
  {
    icon: <MessageSquare size={28} />,
    step: "Langkah 4",
    title: "Nikmati Hasilnya",
    desc: "Dapatkan layanan berkualitas dan berikan ulasan pengalaman Anda."
  }
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <Container>
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="primary" className="mb-4 px-4 py-1">
            Cara Kerja
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Mudah & Cepat dalam 4 Langkah
          </h2>
          <p className="text-gray-500 text-lg">
            Proses sederhana untuk mendapatkan layanan profesional yang Anda butuhkan tanpa ribet.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          
          {/* Garis Penghubung (Hanya muncul di Desktop) */}
          <div className="hidden md:block absolute top-10 left-0 w-full h-0.5 bg-blue-100 -z-10 transform -translate-y-1/2 mx-auto max-w-[90%] right-0"></div>

          {steps.map((item, index) => (
            <div key={index} className="flex flex-col items-center group cursor-default">
              
              {/* Icon Circle */}
              <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-200 mb-6 border-4 border-white transition-transform duration-300 group-hover:scale-110">
                {item.icon}
              </div>

              {/* Step Label */}
              <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full mb-3">
                {item.step}
              </span>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed px-2">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default HowItWorksSection;