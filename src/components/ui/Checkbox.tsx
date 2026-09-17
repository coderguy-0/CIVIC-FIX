import React from 'react';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode;
  description?: React.ReactNode;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, id, className = '', ...props }, ref) => {
    const checkId = id || (typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="flex items-start gap-3 select-none">
        <input
          ref={ref}
          type="checkbox"
          id={checkId}
          className={`mt-1 h-4 w-4 rounded-md border-[#dce5e1] text-[#087f5b] focus:ring-[#087f5b] cursor-pointer transition-colors ${className}`}
          {...props}
        />
        <label htmlFor={checkId} className="cursor-pointer text-sm">
          <span className="font-medium text-[#17201d] block leading-tight">{label}</span>
          {description && (
            <span className="text-xs text-[#66736e] block mt-0.5 leading-normal">
              {description}
            </span>
          )}
        </label>
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
