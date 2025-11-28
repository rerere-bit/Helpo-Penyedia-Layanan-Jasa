import DashboardLayout from '@/components/layout/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { Star, MapPin, CheckCircle, Clock, MessageSquare } from 'lucide-react';

const ServiceDetailPage = () => {
    const navigate = useNavigate(); 
  // MOCK DATA (Sesuai Screenshot)
  const detail = {
    title: "Bersih Rumah Premium",
    category: "Pembersihan",
    provider: {
      name: "Helpo Clean",
      avatar: "https://images.unsplash.com/photo-1581578731117-104f2a8d23e9?auto=format&fit=crop&w=100&q=80",
    },
    rating: 4.9,
    reviewsCount: 127,
    location: "Jakarta",
    description: "Profesional berpengalaman lebih dari 5 tahun dalam bidang pembersihan. Memberikan pelayanan terbaik dengan hasil yang memuaskan. Dilengkapi dengan peralatan modern dan tim yang terlatih. Garansi kepuasan 100%.",
    price: 150000,
    bannerUrl: "https://images.unsplash.com/photo-1581578731117-104f2a8d23e9?auto=format&fit=crop&w=1200&q=80",
    reviews: [
      { name: "Andi Wijaya", rating: 5, date: "2 hari yang lalu", comment: "Sangat profesional dan tepat waktu. Highly recommended!", avatar: "A" },
      { name: "Siti Rahma", rating: 5, date: "1 minggu yang lalu", comment: "Pelayanan sangat memuaskan, hasilnya bagus sekali.", avatar: "S" },
      { name: "Budi Santoso", rating: 4, date: "2 minggu yang lalu", comment: "Bagus, namun agak terlambat datang. Overall good!", avatar: "B" },
    ]
  };

  const formatRupiah = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
  };

  return (
    <DashboardLayout>
      <div className="bg-gray-50 min-h-screen pb-24"> {/* pb-24 agar konten tidak tertutup tombol bawah */}
        
        {/* 1. Hero Banner Image */}
        <div className="w-full h-[300px] relative">
          <img 
            src={detail.bannerUrl} 
            alt="Service Banner" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20"></div> {/* Overlay gelap sedikit agar kontras */}
        </div>

        <Container>
          {/* 2. Main Content Card (Floating Up) */}
          <div className="relative -mt-20 bg-white rounded-t-3xl border-x border-t border-gray-100 shadow-sm p-6 md:p-8">
            
            {/* Header: Avatar & Title */}
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <img 
                src={detail.provider.avatar} 
                alt="Provider" 
                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md -mt-10 md:mt-0 bg-white" 
              />
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">{detail.title}</h1>
                  <span className="inline-block bg-blue-50 text-primary text-xs font-bold px-3 py-1 rounded-full w-fit">
                    {detail.category}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star size={16} fill="currentColor" />
                    <span className="font-bold text-gray-900">{detail.rating}</span>
                    <span className="text-gray-400">({detail.reviewsCount} ulasan)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={16} />
                    {detail.location}
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-gray-100 my-6" />

            {/* Badges */}
            <div className="flex gap-8 mb-8">
              <div className="flex items-center gap-2 text-gray-700 font-medium">
                <CheckCircle size={20} className="text-primary" />
                Terverifikasi
              </div>
              <div className="flex items-center gap-2 text-gray-700 font-medium">
                <Clock size={20} className="text-primary" />
                Respon Cepat
              </div>
            </div>

            {/* Deskripsi */}
            <div className="mb-8">
              <h3 className="font-bold text-lg text-gray-900 mb-3">Deskripsi</h3>
              <p className="text-gray-600 leading-relaxed">
                {detail.description}
              </p>
            </div>

            {/* Harga */}
            <div className="mb-10">
              <p className="text-sm text-gray-500 mb-1">Harga Mulai Dari</p>
              <p className="text-2xl font-bold text-primary">{formatRupiah(detail.price)}</p>
            </div>

            <hr className="border-gray-100 my-8" />

            {/* Ulasan Pelanggan */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg text-gray-900">Ulasan Pelanggan</h3>
                <button className="text-primary text-sm font-semibold hover:underline">Lihat Semua</button>
              </div>

              <div className="space-y-6">
                {detail.reviews.map((review, idx) => (
                  <div key={idx} className="flex gap-4 border-b border-gray-50 last:border-0 pb-6 last:pb-0">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500 text-sm">
                      {review.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-gray-900 text-sm">{review.name}</h4>
                        <span className="text-xs text-gray-400">{review.date}</span>
                      </div>
                      <div className="flex text-yellow-400 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-gray-300"} />
                        ))}
                      </div>
                      <p className="text-sm text-gray-600">{review.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </Container>

        {/* 3. Sticky Bottom Action Bar */}
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 shadow-lg z-40">
          <Container>
            <div className="flex gap-4 items-center justify-between md:justify-end">
              <Button variant="outline" className="flex-1 md:flex-none border-gray-300 gap-2">
                <MessageSquare size={18} />
                Chat
              </Button>
              <Button variant="primary" className="flex-1 md:w-64" onClick={() => navigate('/booking/1')}>
                Pesan Sekarang
              </Button>
            </div>
          </Container>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default ServiceDetailPage;