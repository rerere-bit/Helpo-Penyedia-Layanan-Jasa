import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'white'; 
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ReactNode; // Opsional: untuk icon panah dll
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  className = '',
  ...props
}) => {
  // 1. Base Styles (Layout dasar)
  const baseStyles = "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  // 2. Variants (Warna)
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-600 shadow-lg shadow-blue-500/30 border border-transparent",
    outline: "bg-transparent border-2 border-gray-200 text-gray-700 hover:border-blue-600 hover:text-blue-600 focus:ring-gray-200",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-50 hover:text-blue-600 focus:ring-gray-200",
    white: "bg-white text-blue-600 hover:bg-gray-50 shadow-md border border-transparent"
  };

  // 3. Sizes (Ukuran)
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-2.5 text-base", // Ukuran standar Navbar
    lg: "px-8 py-4 text-lg",      // Ukuran CTA Hero
  };

  // 4. Width Control
  const width = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${width} ${className}`}
      {...props}
    >
      {children}
      {icon && <span className="ml-2">{icon}</span>}
    </button>
  );
};