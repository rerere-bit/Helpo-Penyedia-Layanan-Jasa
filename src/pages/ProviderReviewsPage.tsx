import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Container } from '@/components/common/Container';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Star, MessageSquare, AlertCircle } from 'lucide-react';
import { MOCK_PROVIDER_REVIEWS } from '@/data/mockReviews';

const ProviderReviewsPage = () => {
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');

  // Calculate Stats
  const totalReviews = MOCK_PROVIDER_REVIEWS.length;
  const avgRating = (MOCK_PROVIDER_REVIEWS.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1);
  
  const filteredReviews = filterRating === 'all' 
    ? MOCK_PROVIDER_REVIEWS 
    : MOCK_PROVIDER_REVIEWS.filter(r => r.rating === filterRating);

  return (
    <DashboardLayout>
      <Container>
        <div className="max-w-5xl mx-auto pb-20">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Ulasan Pelanggan</h1>
            <Button variant="outline">Download Laporan</Button>
          </div>

          {/* STATS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 flex items-center gap-4 border-l-4 border-l-primary">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-primary">
                <Star size={24} fill="currentColor" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Rating Rata-rata</p>
                <h3 className="text-2xl font-bold text-gray-900">{avgRating} <span className="text-sm text-gray-400 font-normal">/ 5.0</span></h3>
              </div>
            </Card>
            
            <Card className="p-6 flex items-center gap-4 border-l-4 border-l-green-500">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                <MessageSquare size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Ulasan</p>
                <h3 className="text-2xl font-bold text-gray-900">{totalReviews}</h3>
              </div>
            </Card>

            <Card className="p-6 flex items-center gap-4 border-l-4 border-l-orange-500">
              <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                <AlertCircle size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Perlu Dibalas</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {MOCK_PROVIDER_REVIEWS.filter(r => !r.hasReplied).length}
                </h3>
              </div>
            </Card>
          </div>

          {/* FILTERS */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            <button 
              onClick={() => setFilterRating('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filterRating === 'all' ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              Semua Bintang
            </button>
            {[5, 4, 3, 2, 1].map(star => (
              <button
                key={star}
                onClick={() => setFilterRating(star)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center gap-1 transition-colors ${
                  filterRating === star ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Star size={14} fill="currentColor" className={filterRating === star ? 'text-white' : 'text-yellow-400'} />
                {star}
              </button>
            ))}
          </div>

          {/* REVIEWS LIST */}
          <div className="space-y-6">
            {filteredReviews.map((review) => (
              <Card key={review.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-4">
                    <img src={review.userAvatar} alt={review.userName} className="w-10 h-10 rounded-full bg-gray-200" />
                    <div>
                      <h4 className="font-bold text-gray-900">{review.userName}</h4>
                      <p className="text-xs text-gray-500">{review.serviceName} • {review.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} 
                      />
                    ))}
                  </div>
                </div>

                <p className="text-gray-700 mb-6 pl-14">
                  {review.comment}
                </p>

                <div className="pl-14">
                  {review.hasReplied ? (
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-sm text-primary">Balasan Anda</span>
                        <span className="text-xs text-gray-400">• {review.date}</span>
                      </div>
                      <p className="text-sm text-gray-600">{review.reply}</p>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <Button size="sm" variant="outline" className="gap-2">
                        <MessageSquare size={16} />
                        Balas
                      </Button>
                      <Button size="sm" variant="ghost" className="text-gray-500 hover:text-gray-700">
                        Laporkan
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}

            {filteredReviews.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500">Belum ada ulasan dengan rating ini.</p>
              </div>
            )}
          </div>

        </div>
      </Container>
    </DashboardLayout>
  );
};

export default ProviderReviewsPage;
