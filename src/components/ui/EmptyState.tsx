import React from 'react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = ''
}) => {
  return (
    <div
      className={`p-10 text-center rounded-[16px] border border-dashed border-[#dce5e1] bg-[#ffffff]/60 flex flex-col items-center justify-center space-y-3 ${className}`}
    >
      {icon && (
        <div className="w-12 h-12 rounded-full bg-[#eef3f1] flex items-center justify-center text-[#087f5b] mb-1">
          {icon}
        </div>
      )}
      <div className="max-w-sm space-y-1">
        <h3 className="text-sm font-bold text-[#17201d]">{title}</h3>
        <p className="text-xs text-[#66736e] leading-relaxed">{description}</p>
      </div>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
};
