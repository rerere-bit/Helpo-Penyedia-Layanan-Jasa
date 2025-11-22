import { ShieldCheck, Clock, Star, Users } from 'lucide-react';
import { Container } from '@/components/common/Container';
import { Badge } from '@/components/common/Badge';
import { Card } from '@/components/common/Card';

const features = [
  {
    icon: <ShieldCheck className="w-10 h-10 text-primary" />,
    title: "Terpercaya & Terverifikasi",
    desc: "Semua penyedia jasa telah melalui proses verifikasi ketat untuk keamanan dan kenyamanan Anda."
  },
  {
    icon: <Clock className="w-10 h-10 text-primary" />,
    title: "Layanan Cepat",
    desc: "Dapatkan respon dalam hitungan menit dan atur jadwal layanan sesuai kebutuhan waktu Anda."
  },
  {
    icon: <Star className="w-10 h-10 text-primary" />,
    title: "Kualitas Terjamin",
    desc: "Sistem rating dan ulasan transparan dari pengguna nyata untuk membantu Anda memilih yang terbaik."
  },
  {
    icon: <Users className="w-10 h-10 text-primary" />,
    title: "Ribuan Profesional",
    desc: "Akses ke jaringan luas penyedia jasa profesional di berbagai bidang keahlian."
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <Container>
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="primary" className="mb-4">Keunggulan Kami</Badge>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Kenapa Memilih Helpo?</h2>
          <p className="text-gray-500">Kami memberikan pengalaman terbaik dalam mencari dan menyediakan layanan profesional.</p>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, index) => (
            <Card key={index} hoverEffect className="p-6">
              <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {item.desc}
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default FeaturesSection;