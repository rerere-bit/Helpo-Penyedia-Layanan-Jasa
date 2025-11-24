import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'warning' | 'success' | 'neutral';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'primary',
  className = '' 
}) => {
  const variants = {
    primary: "bg-blue-50 text-blue-700 border-blue-100", // Biru muda
    warning: "bg-orange-50 text-orange-700 border-orange-100", // Kuning (Hero)
    success: "bg-green-50 text-green-700 border-green-100", // Hijau
    neutral: "bg-gray-100 text-gray-600 border-gray-200", // Abu-abu
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};