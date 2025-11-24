import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '',
  hoverEffect = false
}) => {
  const hoverStyles = hoverEffect 
    ? "hover:-translate-y-1 hover:shadow-xl hover:border-blue-100 transition-all duration-300" 
    : "";

  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-6 ${hoverStyles} ${className}`}>
      {children}
    </div>
  );
};