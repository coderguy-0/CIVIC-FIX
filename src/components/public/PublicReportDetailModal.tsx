import React from 'react';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { PublicReport } from '../../types';
import { CATEGORIES_META } from '../../lib/constants';
import { ThumbsUp, MapPin, Shield, Clock, AlertCircle } from 'lucide-react';

export interface PublicReportDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: PublicReport | null;
  onConfirmIssue: (reportId: string) => void;
}

export const PublicReportDetailModal: React.FC<PublicReportDetailModalProps> = ({
  isOpen,
  onClose,
  report,
  onConfirmIssue
}) => {
  if (!report) return null;

  const catMeta = CATEGORIES_META[report.category] || CATEGORIES_META.other;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={report.public_title}
      maxWidth="md"
    >
      <div className="space-y-4 text-xs">
        {/* Category & Locality */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#dce5e1] pb-3">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#66736e] tracking-wider">
              {catMeta.labelEn}
            </span>
            <p className="text-xs font-semibold text-[#17201d] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#66736e]" />
              <span>{report.approximate_location}</span>
            </p>
          </div>

          <span className="text-[11px] font-semibold text-[#087f5b] bg-[#e7f7f1] px-2.5 py-1 rounded-full border border-[#087f5b]/20">
            Moderated public summary
          </span>
        </div>

        {/* Reported Issue Description */}
        <div className="space-y-1.5">
          <h4 className="font-bold text-[#17201d] text-xs">Reported issue</h4>
          <p className="text-[#17201d]/90 leading-relaxed bg-[#f6f9f7] p-3 rounded-[12px] border border-[#dce5e1]">
            {report.public_description}
          </p>
        </div>

        {/* Community Activity */}
        <div className="p-3.5 rounded-[12px] bg-white border border-[#dce5e1] flex items-center justify-between">
          <div className="space-y-0.5">
            <h4 className="font-bold text-[#17201d]">Community activity</h4>
            <p className="text-[11px] text-[#66736e]">
              {report.confirmations_count} neighbor confirmation
              {report.confirmations_count !== 1 ? 's' : ''}
            </p>
          </div>

          <Button
            variant={report.user_confirmed ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => onConfirmIssue(report.id)}
            className="text-xs"
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>{report.user_confirmed ? 'Confirmed by you' : 'Confirm this issue'}</span>
          </Button>
        </div>

        {/* Information status */}
        <div className="space-y-1 text-[#66736e] pt-1">
          <div className="flex items-center justify-between">
            <span>Information status:</span>
            <span className="font-semibold text-[#17201d]">Community-submitted · CivicFix moderated</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Last updated:</span>
            <span className="font-semibold text-[#17201d]">
              {new Date(report.updated_at || report.created_at).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </span>
          </div>
        </div>

        {/* Visible independent platform disclaimer */}
        <div className="p-3 rounded-[12px] bg-[#fff7e6] border border-[#a96f16]/30 flex items-start gap-2 text-[11px] text-[#a96f16]">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <p className="leading-normal">
            <strong>Disclaimer:</strong> CivicFix is an independent platform. This page does not represent an official government determination or confirmed agency resolution.
          </p>
        </div>

        <div className="pt-3 border-t border-[#dce5e1] flex justify-end">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
