import React from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

export interface ToastProps {
  type?: 'success' | 'error' | 'info';
  message: string;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ type = 'success', message, onClose }) => {
  const iconMap = {
    success: <CheckCircle2 className="w-4 h-4 text-[#087f5b]" />,
    error: <AlertCircle className="w-4 h-4 text-[#c0392b]" />,
    info: <Info className="w-4 h-4 text-[#2563a6]" />
  };

  const bgMap = {
    success: 'bg-[#e7f7f1] border-[#087f5b]/30 text-[#087f5b]',
    error: 'bg-[#fff0ee] border-[#c0392b]/30 text-[#c0392b]',
    info: 'bg-[#edf5ff] border-[#2563a6]/30 text-[#2563a6]'
  };

  return (
    <div
      className={`fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-[12px] border shadow-lg text-xs font-semibold ${bgMap[type]} animate-in slide-in-from-bottom-5`}
      role="status"
      aria-live="polite"
    >
      {iconMap[type]}
      <span className="text-[#17201d]">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-[#66736e] hover:text-[#17201d] p-0.5 rounded"
        aria-label="Dismiss toast"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
