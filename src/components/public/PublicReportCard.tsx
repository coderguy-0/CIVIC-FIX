import React from 'react';
import { PublicReport } from '../../types';
import { CATEGORIES_META } from '../../lib/constants';
import { ThumbsUp, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';

export interface PublicReportCardProps {
  report: PublicReport;
  onView: (report: PublicReport) => void;
  onConfirm?: (reportId: string) => void;
  className?: string;
}

export const PublicReportCard: React.FC<PublicReportCardProps> = ({
  report,
  onView,
  onConfirm,
  className = ''
}) => {
  const catMeta = CATEGORIES_META[report.category] || CATEGORIES_META.other;

  return (
    <div
      onClick={() => onView(report)}
      className={`bg-white border border-[#dce5e1] hover:border-[#66736e]/40 rounded-[16px] p-5 shadow-2xs hover:shadow-xs transition-all duration-150 cursor-pointer flex flex-col justify-between space-y-4 group ${className}`}
    >
      <div className="space-y-3">
        {/* Category Header */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#66736e]">
            {catMeta.labelEn}
          </span>

          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#087f5b] bg-[#e7f7f1] px-2 py-0.5 rounded-full">
            <ShieldCheck className="w-3 h-3" />
            <span>Moderated</span>
          </span>
        </div>

        {/* Title and Locality */}
        <div>
          <h3 className="text-base font-bold text-[#17201d] group-hover:text-[#087f5b] transition-colors line-clamp-1 leading-snug">
            {report.public_title}
          </h3>
          <p className="text-xs text-[#66736e] flex items-center gap-1.5 mt-1">
            <MapPin className="w-3.5 h-3.5 text-[#66736e]/70 shrink-0" />
            <span className="truncate">{report.approximate_location}</span>
          </p>
        </div>

        <p className="text-xs text-[#17201d]/80 line-clamp-2 leading-relaxed">
          {report.public_description}
        </p>
      </div>

      {/* Community confirmations and Action */}
      <div className="pt-3 border-t border-[#dce5e1]/60 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-xs text-[#66736e]">
          <ThumbsUp className="w-3.5 h-3.5 text-[#087f5b]" />
          <span className="font-semibold text-[#17201d]">
            {report.confirmations_count}
          </span>
          <span>confirmations</span>
        </div>

        <span className="inline-flex items-center gap-1 font-semibold text-[#087f5b] group-hover:translate-x-0.5 transition-transform text-xs">
          <span>View issue</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
};
