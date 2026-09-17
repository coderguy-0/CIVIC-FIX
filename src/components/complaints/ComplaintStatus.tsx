import React from 'react';
import { ComplaintStatus as StatusType } from '../../types';

export interface ComplaintStatusProps {
  status: StatusType;
  className?: string;
  size?: 'sm' | 'md';
}

export const ComplaintStatus: React.FC<ComplaintStatusProps> = ({
  status,
  className = '',
  size = 'md'
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'submitted':
        return {
          symbol: '●',
          label: 'Submitted',
          classes: 'bg-[#edf5ff] text-[#2563a6] border-[#2563a6]/20'
        };
      case 'acknowledged':
        return {
          symbol: '●',
          label: 'Acknowledged',
          classes: 'bg-[#fff7e6] text-[#a96f16] border-[#a96f16]/20'
        };
      case 'in_progress':
        return {
          symbol: '●',
          label: 'In progress',
          classes: 'bg-[#e7f7f1] text-[#087f5b] border-[#087f5b]/20'
        };
      case 'resolved':
        return {
          symbol: '✓',
          label: 'Resolved',
          classes: 'bg-[#e7f7f1] text-[#087f5b] border-[#087f5b]/30'
        };
      case 'reopened':
        return {
          symbol: '↻',
          label: 'Reopened',
          classes: 'bg-[#fff0ee] text-[#c0392b] border-[#c0392b]/20'
        };
      case 'prepared':
        return {
          symbol: '●',
          label: 'Prepared',
          classes: 'bg-[#eef3f1] text-[#66736e] border-[#dce5e1]'
        };
      case 'closed':
        return {
          symbol: '—',
          label: 'Closed',
          classes: 'bg-[#eef3f1] text-[#66736e] border-[#dce5e1]'
        };
      case 'draft':
      default:
        return {
          symbol: '○',
          label: 'Draft',
          classes: 'bg-[#eef3f1] text-[#66736e] border-[#dce5e1]'
        };
    }
  };

  const config = getStatusConfig();
  const sizeClasses = size === 'sm' ? 'text-[11px] px-2 py-0.5 gap-1' : 'text-xs px-2.5 py-1 gap-1.5';

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border leading-none ${sizeClasses} ${config.classes} ${className}`}
    >
      <span className="font-bold text-[10px] select-none" aria-hidden="true">
        {config.symbol}
      </span>
      <span>{config.label}</span>
    </span>
  );
};
