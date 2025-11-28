import React from 'react';
import { Star, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // 1. Import hook navigasi
import type { Service } from '@/types';
import { Button } from '@/components/common/Button';

interface ServiceCardProps {
  data: Service;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ data }) => {
  const navigate = useNavigate(); // 2. Inisialisasi hook

  const formatRupiah = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div 
      onClick={() => navigate(`/service/${data.id}`)}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full cursor-pointer"
    >

      {/* Image & Badge */}
      <div className="relative h-48" >
        <img 
          src={data.thumbnailUrl} 
          alt={data.title} 
          className="w-full h-full object-cover"
        />
        {/* Badge Terpopuler (Hardcoded for demo match UI) */}
        <span className="absolute top-3 right-3 bg-yellow-400 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm">
          Terpopuler
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col grow">
        {/* Category */}
        <p className="text-xs text-gray-500 mb-1">{data.category}</p>
        
        {/* Title */}
        <h3 className="font-bold text-gray-900 text-base mb-2 line-clamp-1">
          {data.title}
        </h3>

        {/* Location & Rating */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <MapPin size={14} className="text-gray-400" />
            {data.provider.location}
          </div>
          <div className="flex items-center gap-1">
            <Star size={14} className="text-yellow-400 fill-current" />
            <span className="font-bold text-gray-700">{data.rating}</span>
            <span className="text-gray-400">({data.reviewCount})</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-400 leading-relaxed mb-4 line-clamp-2">
          {data.description}
        </p>

        {/* Footer: Price & Button */}
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-dashed border-gray-100">
          <span className="text-primary font-bold text-base">
            {formatRupiah(data.price)}
          </span>
          {/* Karena button ada di dalam div yang bisa diklik, klik pada button juga akan memicu navigasi */}
          <Button size="sm" className="px-6 h-9 rounded-lg text-xs font-semibold">
            Pesan Jasa
          </Button>
        </div>
      </div>
    </div>
  );
};