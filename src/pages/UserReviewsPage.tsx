import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Star, MessageSquare, Clock, Search, Filter } from 'lucide-react';
import { MOCK_WAITING_REVIEWS, MOCK_USER_REVIEWS } from '@/data/mockReviews';

type TabType = 'waiting' | 'history';

const UserReviewsPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('waiting');
  const [filterTime, setFilterTime] = useState('all');

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={`${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <Container>
        <div className="max-w-4xl mx-auto pb-20">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Ulasan Saya</h1>

          {/* TABS */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('waiting')}
              className={`pb-4 px-6 font-medium text-sm transition-all relative ${
                activeTab === 'waiting'
                  ? 'text-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Menunggu Diulas
              {MOCK_WAITING_REVIEWS.length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                  {MOCK_WAITING_REVIEWS.length}
                </span>
              )}
              {activeTab === 'waiting' && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`pb-4 px-6 font-medium text-sm transition-all relative ${
                activeTab === 'history'
                  ? 'text-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Daftar Ulasan
              {activeTab === 'history' && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></div>
              )}
            </button>
          </div>

          {/* FILTERS (Only for History) */}
          {activeTab === 'history' && (
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Cari ulasan berdasarkan nama layanan..." 
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div className="relative">
                <select 
                  value={filterTime}
                  onChange={(e) => setFilterTime(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-lg pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
                >
                  <option value="all">Semua Waktu</option>
                  <option value="last_7_days">7 Hari Terakhir</option>
                  <option value="last_30_days">30 Hari Terakhir</option>
                  <option value="last_3_months">3 Bulan Terakhir</option>
                </select>
                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>
          )}

          {/* CONTENT: WAITING */}
          {activeTab === 'waiting' && (
            <div className="space-y-4">
              {MOCK_WAITING_REVIEWS.map((item) => (
                <Card key={item.orderId} className="p-0 overflow-hidden flex flex-col md:flex-row">
                  <div className="w-full md:w-48 h-32 md:h-auto bg-gray-100">
                    <img src={item.serviceImage} alt={item.serviceName} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6 flex-1 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">{item.orderDate} • {item.orderId}</div>
                      <h3 className="font-bold text-gray-900 text-lg mb-1">{item.serviceName}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <span>Oleh {item.providerName}</span>
                      </div>
                      <div className="font-bold text-primary">Rp {item.price.toLocaleString('id-ID')}</div>
                    </div>
                    <Button>Tulis Ulasan</Button>
                  </div>
                </Card>
              ))}
              
              {MOCK_WAITING_REVIEWS.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  Tidak ada pesanan yang perlu diulas saat ini.
                </div>
              )}
            </div>
          )}

          {/* CONTENT: HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              {MOCK_USER_REVIEWS.map((review) => (
                <Card key={review.id} className="p-6">
                  <div className="flex gap-4 items-start mb-4">
                    <img 
                      src={review.serviceImage} 
                      alt={review.serviceName} 
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-bold text-gray-900">{review.serviceName}</h3>
                      <p className="text-sm text-gray-500 mb-1">Oleh {review.providerName}</p>
                      <p className="text-xs text-gray-400">{review.date}</p>
                    </div>
                  </div>

                  <div className="mb-3">
                    {renderStars(review.rating)}
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-4">
                    {review.comment}
                  </p>

                  {/* Provider Reply */}
                  {review.reply && (
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 ml-4 md:ml-8 relative">
                      <div className="absolute -left-2 top-6 w-4 h-4 bg-gray-50 border-l border-t border-gray-100 transform -rotate-45"></div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-sm text-gray-900">{review.providerName}</span>
                        <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Penjual</span>
                        <span className="text-xs text-gray-400">• {review.reply.date}</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {review.reply.comment}
                      </p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}

        </div>
      </Container>
    </DashboardLayout>
  );
};

export default UserReviewsPage;
