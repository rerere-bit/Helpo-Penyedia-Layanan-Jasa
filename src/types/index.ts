// src/types/index.ts

export interface Service {
  id: string;
  title: string;
  slug: string;
  category: string;
  price: number;
  priceUnit: string;
  rating: number;
  reviewCount: number;
  description: string;
  thumbnailUrl: string;
  provider: {
    name: string;
    avatarUrl: string;
    location: string;
    isVerified: boolean;
  };
}