import React, { useState } from 'react';
import { Lock, Copy, Check, ExternalLink } from 'lucide-react';
import { Button } from '../ui/Button';

export interface ReferenceNumberProps {
  referenceNumber?: string;
  portalUrl?: string;
  authorityName?: string;
  onEdit?: () => void;
}

export const ReferenceNumber: React.FC<ReferenceNumberProps> = ({
  referenceNumber,
  portalUrl,
  authorityName,
  onEdit
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!referenceNumber) return;
    navigator.clipboard.writeText(referenceNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!referenceNumber) {
    return (
      <div className="bg-[#ffffff] border border-dashed border-[#dce5e1] rounded-[16px] p-5 space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#66736e]">
          <Lock className="w-3.5 h-3.5" />
          <span>Official Reference Number</span>
        </div>
        <p className="text-xs text-[#66736e]">
          No official tracking ID saved yet. Once you submit this to {authorityName || 'the department'}, add the reference code here.
        </p>
        {onEdit && (
          <Button variant="secondary" size="sm" onClick={onEdit}>
            + Add official reference
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-[#ffffff] border border-[#dce5e1] rounded-[16px] p-5 space-y-4 shadow-2xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#087f5b]">
          <Lock className="w-3.5 h-3.5" />
          <span>Private information</span>
        </div>
        <span className="text-[11px] text-[#66736e]">Visible only to you</span>
      </div>

      <div>
        <p className="text-xs text-[#66736e]">Official reference number</p>
        <p className="text-lg font-mono font-bold text-[#17201d] tracking-wider mt-0.5 select-all">
          {referenceNumber}
        </p>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-[#dce5e1]/60">
        <span className="text-[11px] text-[#66736e]">
          🔒 Never shown on public explore
        </span>

        <div className="flex items-center gap-2">
          {portalUrl && (
            <a
              href={portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-[#66736e] hover:text-[#17201d] hover:bg-[#eef3f1] rounded-lg transition-colors"
              title="Open official portal"
              aria-label="Open official portal in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleCopy}
            aria-label="Copy complaint reference number"
            className="text-xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#087f5b]" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
