// src/pages/ServiceDetailPage.tsx

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { Star, MapPin, CheckCircle, Clock, MessageSquare, Loader2, AlertCircle } from 'lucide-react';

// Import Komponen Modal Review
import { ReviewModal } from '@/components/sections/ReviewModel';
// Backend Logic & Types
import { MarketService } from '@/services/market.service';
import type { Service as BackendService, Review as BackendReview } from '@/types/market';

// Frontend Types
interface FrontendServiceDetail extends BackendService {
  provider: {
    name: string;
    avatar: string;
  };
}

interface FrontendReview extends BackendReview {
  displayName: string; // Nama user yg merivew
  displayDate: string; // Tanggal yg sudah diformat
}

const ServiceDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate(); 
  
  // State Data
  const [service, setService] = useState<FrontendServiceDetail | null>(null);
  const [reviews, setReviews] = useState<FrontendReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State Modal Review
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  // --- 1. Fetch Data saat ID berubah ---
  useEffect(() => {
    if (id) {
      fetchDetail(id);
    }
  }, [id]);

  const fetchDetail = async (serviceId: string) => {
    // Kita set loading false saja jika ini refresh setelah submit review, 
    // tapi agar UX lebih smooth, kita biarkan loading true hanya saat load awal.
    // Namun untuk simplisitas kode, kita set true dulu.
    if (!service) setLoading(true); 
    
    setError('');
    try {
      // A. Ambil Data Service
      const serviceData = await MarketService.getServiceById(serviceId);
      
      if (!serviceData) {
        setError("Layanan tidak ditemukan.");
        setLoading(false);
        return;
      }

      // Mapping Backend -> Frontend (Mock Provider Info)
      const mappedService: FrontendServiceDetail = {
        ...serviceData,
        provider: {
          name: "Mitra Helpo", // Nanti ambil dari User Collection
          avatar: "https://ui-avatars.com/api/?name=Mitra+Helpo&background=random",
        }
      };
      setService(mappedService);

      // B. Ambil Data Review
      const reviewsData = await MarketService.getReviewsByService(serviceId);
      
      // Mapping Review
      const mappedReviews = reviewsData.map(r => {
        // Handle konversi Timestamp Firebase ke Date String
        const dateObj = r.createdAt instanceof Date 
            ? r.createdAt 
            : (r.createdAt as any).toDate(); 

        return {
          ...r,
          displayName: "Pengguna Helpo", // Nanti ambil real name user
          displayDate: dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
        };
      });

      setReviews(mappedReviews);

    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan saat memuat data.");
    } finally {
      setLoading(false);
    }
  };

  const formatRupiah = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
  };

  // --- 2. Loading State ---
  if (loading && !service) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="animate-spin text-primary mb-4" size={40} />
          <p className="text-gray-500">Sedang memuat detail layanan...</p>
        </div>
      </DashboardLayout>
    );
  }

  // --- 3. Error State ---
  if (error || !service) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <AlertCircle className="text-red-500 mb-4" size={48} />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Oops!</h2>
          <p className="text-gray-500 mb-6">{error || "Layanan tidak ditemukan"}</p>
          <Button onClick={() => navigate('/services')}>Kembali ke List</Button>
        </div>
      </DashboardLayout>
    );
  }

  // --- 4. Main Content (Render Data Asli) ---
  return (
    <DashboardLayout>
      <div className="bg-gray-50 min-h-screen pb-24">
        
        {/* Hero Banner Image */}
        <div className="w-full h-[300px] relative">
          <img 
            src={service.thumbnailUrl || "https://placehold.co/1200x400?text=No+Image"} 
            alt={service.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        <Container>
          {/* Main Content Card */}
          <div className="relative -mt-20 bg-white rounded-t-3xl border-x border-t border-gray-100 shadow-sm p-6 md:p-8">
            
            {/* Header: Avatar & Title */}
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <img 
                src={service.provider.avatar} 
                alt="Provider" 
                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md -mt-10 md:mt-0 bg-white" 
              />
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">{service.title}</h1>
                  <span className="inline-block bg-blue-50 text-primary text-xs font-bold px-3 py-1 rounded-full w-fit">
                    {service.category}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star size={16} fill="currentColor" />
                    <span className="font-bold text-gray-900">{service.rating || 0}</span>
                    <span className="text-gray-400">({service.reviewCount || 0} ulasan)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={16} />
                    {service.location}
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-gray-100 my-6" />

            {/* Badges Static */}
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
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {service.description}
              </p>
            </div>

            {/* Harga */}
            <div className="mb-10">
              <p className="text-sm text-gray-500 mb-1">Harga Mulai Dari</p>
              <p className="text-2xl font-bold text-primary">{formatRupiah(service.price)}</p>
            </div>

            <hr className="border-gray-100 my-8" />

            {/* Ulasan Pelanggan */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg text-gray-900">
                  Ulasan Pelanggan ({reviews.length})
                </h3>
                {/* TOMBOL REVIEW (TESTING PURPOSE) */}
                <button 
                  onClick={() => setIsReviewOpen(true)}
                  className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-medium hover:bg-blue-100 transition-colors"
                >
                  + Tulis Review
                </button>
              </div>

              {reviews.length === 0 ? (
                <p className="text-gray-400 italic">Belum ada ulasan untuk layanan ini.</p>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="flex gap-4 border-b border-gray-50 last:border-0 pb-6 last:pb-0">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500 text-sm overflow-hidden">
                        {/* Avatar Placeholder */}
                         <img src={`https://ui-avatars.com/api/?name=${review.displayName}&background=random`} alt="av" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-gray-900 text-sm">{review.displayName}</h4>
                          <span className="text-xs text-gray-400">{review.displayDate}</span>
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
              )}
            </div>

          </div>
        </Container>

        {/* Sticky Bottom Action Bar */}
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 shadow-lg z-40">
          <Container>
            <div className="flex gap-4 items-center justify-between md:justify-end">
              <Button variant="outline" className="flex-1 md:flex-none border-gray-300 gap-2">
                <MessageSquare size={18} />
                Chat
              </Button>
              <Button 
                variant="primary" 
                className="flex-1 md:w-64" 
                onClick={() => navigate(`/booking/${service.id}`)}
              >
                Pesan Sekarang
              </Button>
            </div>
          </Container>
        </div>

        {/* MODAL REVIEW */}
        {isReviewOpen && service && (
          <ReviewModal 
            serviceId={service.id!} 
            providerId={service.providerId}
            onClose={() => setIsReviewOpen(false)}
            onSuccess={() => {
               // Refresh data setelah review masuk agar rating berubah realtime
               if(id) fetchDetail(id); 
            }}
          />
        )}

      </div>
    </DashboardLayout>
  );
};

export default ServiceDetailPage;