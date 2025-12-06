// src/components/sections/ReviewModal.tsx

import { useState } from 'react';
import { Star, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { MarketService } from '@/services/market.service';

interface ReviewModalProps {
  serviceId: string;
  providerId: string; // Diperlukan untuk data review
  onClose: () => void;
  onSuccess: () => void;
}

export const ReviewModal = ({ serviceId, providerId, onClose, onSuccess }: ReviewModalProps) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Mohon berikan bintang rating.");
      return;
    }

    setIsSubmitting(true);
    try {
      await MarketService.addReview({
        serviceId,
        providerId,
        // Mock data order & customer (karena belum ada modul Order/Auth real)
        orderId: "order_dummy_" + Date.now(), 
        customerId: "user_test_123", 
        rating,
        comment
      });
      
      alert("Ulasan berhasil dikirim!");
      onSuccess(); // Refresh data di halaman induk
      onClose();
    } catch (error) {
      console.error(error);
      alert("Gagal mengirim ulasan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">Tulis Ulasan</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Star Rating Input */}
          <div className="flex flex-col items-center mb-6">
            <p className="text-sm text-gray-500 mb-2">Bagaimana pengalaman Anda?</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star 
                    size={32} 
                    className={`${
                      star <= (hoverRating || rating) 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-gray-300'
                    } transition-colors`} 
                  />
                </button>
              ))}
            </div>
            <p className="text-sm font-medium text-primary mt-2">
              {rating > 0 ? `${rating} dari 5 Bintang` : 'Pilih Bintang'}
            </p>
          </div>

          {/* Comment */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Komentar</label>
            <textarea
              required
              rows={4}
              placeholder="Ceritakan kepuasan Anda terhadap layanan ini..."
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full justify-center" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : null}
            Kirim Ulasan
          </Button>
        </form>

      </div>
    </div>
  );
};