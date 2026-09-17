import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'neutral' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5'
  };

  const variantClasses = {
    primary: 'bg-[#e7f7f1] text-[#087f5b] border border-[#087f5b]/20 font-semibold',
    neutral: 'bg-[#eef3f1] text-[#66736e] border border-[#dce5e1] font-medium',
    warning: 'bg-[#fff7e6] text-[#a96f16] border border-[#a96f16]/20 font-semibold',
    danger: 'bg-[#fff0ee] text-[#c0392b] border border-[#c0392b]/20 font-semibold',
    info: 'bg-[#edf5ff] text-[#2563a6] border border-[#2563a6]/20 font-semibold'
  };

  return (
    <span
      className={`inline-flex items-center rounded-full leading-none whitespace-nowrap select-none ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
