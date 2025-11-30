import DashboardLayout from '@/components/layout/DashboardLayout';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Search, Calendar, Shield, Eye, Star } from 'lucide-react';
import Footer from '@/components/layout/Footer';
import { Link } from 'react-router-dom';
import pembersihImg from '@/assets/PembersihRumah.jpg'

const DashboardHomePage = () => {
  return (
    <DashboardLayout>
      {/* Blue Hero Section */}
      <section className="bg-blue-800 pt-12 pb-20 rounded-b-[3rem] mb-12">
        <Container>
          <div className="flex flex-col lg:flex-row items-center gap-12 text-white">
            <div className="lg:w-1/2 space-y-6">
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                Temukan dan Jadwalkan Jasa Terpercaya dengan Mudah
              </h1>
              <p className="text-blue-100 text-lg">
                Platform terpercaya untuk menghubungkan Anda dengan berbagai penyedia jasa profesional — cepat, aman, dan terjangkau.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link to="/services" className="inline-block">
                  <Button className="bg-yellow-500 hover:bg-yellow-600 text-white border-none">
                    Cari Jasa Sekarang
                  </Button>
                </Link>
                <Button variant="outline" className="text-white border-white hover:bg-white/10">
                  Gabung sebagai penyedia jasa
                </Button>
              </div>
            </div>
            {/* Mockup Image Placeholder */}
            <div className="lg:w-1/2 relative">
               <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 shadow-2xl transform hover:rotate-0 transition-all duration-500">
                  <img 
                    src={pembersihImg} 
                    alt="Dashboard Preview" 
                    className="rounded-lg shadow-inner w-full"
                  />
               </div>
            </div>
          </div>
        </Container>
      </section>

      <Container>
        {/* Mengapa Memilih Kami */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Mengapa memilih kami?</h2>
          <p className="text-gray-500">Platform termudah untuk memesan layanan profesional.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {[
            { icon: <Search size={24} />, title: "Cari Jasa", desc: "Temukan berbagai jenis layanan di sekitar Anda." },
            { icon: <Calendar size={24} />, title: "Pesan Jadwal", desc: "Atur jadwal layanan kapan saja dengan mudah." },
            { icon: <Shield size={24} />, title: "Pembayaran Aman", desc: "Transaksi terjamin keamanannya dengan berbagai metode." },
            { icon: <Eye size={24} />, title: "Layanan Transparan", desc: "Lihat rating dan ulasan asli dari pengguna lain." }
          ].map((item, idx) => (
            <Card key={idx} className="p-6 text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                {item.icon}
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </Card>
          ))}
        </div>

        {/* Section Feature (Photo Left, Text Right) */}
        <div className="flex flex-col lg:flex-row items-center gap-12 mb-20">
          <div className="lg:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80" 
              alt="Discussion" 
              className="rounded-3xl shadow-xl"
            />
          </div>
          <div className="lg:w-1/2 space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Keuntungan Menggunakan Platform Kami</h2>
            <ul className="space-y-4">
              {['Penyedia jasa terverifikasi', 'Harga transparan tanpa biaya tersembunyi', 'Booking fleksibel sesuai kebutuhan'].map((feat, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-700">
                  <div className="w-6 h-6 bg-blue-100 text-primary rounded-full flex items-center justify-center text-xs">✓</div>
                  {feat}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Testimonial */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">Apa Kata Pengguna Kami?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((_, i) => (
              <Card key={i} className="p-6">
                 <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">U</div>
                    <div>
                       <h4 className="font-bold text-sm">User {i+1}</h4>
                       <div className="flex text-yellow-400 text-xs">
                         {[...Array(5)].map((_,j) => <Star key={j} size={12} fill="currentColor"/>)}
                       </div>
                    </div>
                 </div>
                 <p className="text-gray-500 text-sm">"Layanan yang luar biasa! Sangat membantu kebutuhan rumah tangga saya."</p>
              </Card>
            ))}
          </div>
        </div>
      </Container>
      
      <Footer /> 
    </DashboardLayout>
  );
};

export default DashboardHomePage;