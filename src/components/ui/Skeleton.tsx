import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className = '',
  style,
  ...props
}) => {
  const variantClasses = {
    text: 'rounded-md h-3.5 w-full',
    rectangular: 'rounded-[12px]',
    circular: 'rounded-full'
  };

  const dynamicStyles: React.CSSProperties = {
    width: width !== undefined ? width : undefined,
    height: height !== undefined ? height : undefined,
    ...style
  };

  return (
    <div
      className={`animate-pulse bg-[#dce5e1]/70 ${variantClasses[variant]} ${className}`}
      style={dynamicStyles}
      {...props}
    />
  );
};
