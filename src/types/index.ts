// src/types/index.ts

export interface Service {
  id: string;
  title: string;
  category: string;
  price: number;
  rating: number;
  reviewCount: number;
  description: string;
  thumbnailUrl: string;
  provider: {
    name: string;
    location: string;
    avatarUrl?: string;
    isVerified: boolean;
  };
}

export interface FilterState {
  keyword: string;
  category: string;
  location: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
}