import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const base = "font-medium rounded-lg transition-colors inline-flex items-center justify-center";
  const variants = {
    primary: "bg-[#6DA2E4] text-white hover:bg-[#5b8ecf]",
    secondary: "bg-[#EDF5FE] text-[#0D2238] hover:bg-[#dbe9fc]",
    accent: "bg-[#EC612F] text-white hover:bg-[#d95324]",
    outline: "border border-[#D0D7DE] text-[#0D2238] hover:bg-gray-50"
  };
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title }) => {
  return (
    <div className={`bg-white border border-[#D0D7DE] rounded-xl p-6 shadow-sm ${className}`}>
      {title && <h3 className="font-semibold text-lg text-[#0D2238] mb-3">{title}</h3>}
      {children}
    </div>
  );
};
