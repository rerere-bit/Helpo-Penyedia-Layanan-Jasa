import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { Star, MapPin, CheckCircle, Clock, MessageSquare, Loader2, ArrowLeft } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getServiceReviews } from '@/services/review.service';
import type { Service, Review } from '@/types';

const ServiceDetailPage = () => {
  const { id } = useParams(); // Ambil ID dari URL
  const navigate = useNavigate();
  
  const [service, setService] = useState<Service | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Data Jasa & Review
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        // 1. Ambil Detail Jasa
        const docRef = doc(db, "services", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setService({ id: docSnap.id, ...docSnap.data() } as Service);
          
          // 2. Ambil Review Jasa tersebut
          const reviewsData = await getServiceReviews(id);
          setReviews(reviewsData);
        } else {
          console.log("No such service!");
        }
      } catch (error) {
        console.error("Error loading service:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const formatRupiah = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!service) {
    return <div className="text-center py-20">Jasa tidak ditemukan</div>;
  }

  return (
    <DashboardLayout>
      <div className="bg-gray-50 min-h-screen pb-24">
        
        {/* Hero Banner Image */}
        <div className="w-full h-[300px] relative">
          <img 
            src={service.thumbnailUrl || "https://placehold.co/1200x400?text=No+Image"} 
            alt="Service Banner" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20"></div>
          <button 
            onClick={() => navigate(-1)} 
            className="absolute top-6 left-6 bg-white/90 p-2 rounded-full hover:bg-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
        </div>

        <Container>
          {/* Main Content Card */}
          <div className="relative -mt-20 bg-white rounded-t-3xl border-x border-t border-gray-100 shadow-sm p-6 md:p-8">
            
            {/* Header: Title */}
            <div className="mb-6">
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
                {/* Lokasi kita hardcode dulu karena belum ada di data service, atau ambil dari relasi provider nanti */}
                <div className="flex items-center gap-1">
                  <MapPin size={16} />
                  Indonesia
                </div>
              </div>
            </div>

            <hr className="border-gray-100 my-6" />

            {/* Badges Statis */}
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
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                {service.description}
              </p>
            </div>

            {/* Harga */}
            <div className="mb-10">
              <p className="text-sm text-gray-500 mb-1">Harga Mulai Dari</p>
              <p className="text-2xl font-bold text-primary">{formatRupiah(service.price)}</p>
            </div>

            <hr className="border-gray-100 my-8" />

            {/* Ulasan Pelanggan (Real Data) */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg text-gray-900">Ulasan Pelanggan ({reviews.length})</h3>
              </div>

              <div className="space-y-6">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review.id} className="flex gap-4 border-b border-gray-50 last:border-0 pb-6 last:pb-0">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500 text-sm overflow-hidden">
                        {review.userAvatar ? (
                          <img src={review.userAvatar} alt="user" className="w-full h-full object-cover" />
                        ) : (
                          review.userName?.charAt(0).toUpperCase() || 'U'
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-gray-900 text-sm">{review.userName || 'Pengguna'}</h4>
                          <span className="text-xs text-gray-400">{review.createdAt}</span>
                        </div>
                        <div className="flex text-yellow-400 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-gray-300"} />
                          ))}
                        </div>
                        <p className="text-sm text-gray-600">{review.comment}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm italic">Belum ada ulasan untuk jasa ini.</p>
                )}
              </div>
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
              <Button variant="primary" className="flex-1 md:w-64" onClick={() => navigate(`/booking/${service.id}`)}>
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