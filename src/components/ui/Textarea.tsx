import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, hint, error, id, className = '', ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-[#17201d]">
            {label} {props.required && <span className="text-[#c0392b]">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={inputId}
          className={`w-full bg-[#ffffff] border text-sm text-[#17201d] placeholder:text-[#66736e]/60 rounded-xl px-3.5 py-2.5 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#087f5b] disabled:bg-[#eef3f1] disabled:cursor-not-allowed leading-relaxed ${
            error
              ? 'border-[#c0392b] focus:ring-[#c0392b]'
              : 'border-[#dce5e1] hover:border-[#66736e]/50'
          } ${className}`}
          rows={props.rows || 3}
          {...props}
        />

        {error ? (
          <p className="text-xs text-[#c0392b] font-medium mt-1">{error}</p>
        ) : hint ? (
          <p className="text-[11px] text-[#66736e] mt-0.5">{hint}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
