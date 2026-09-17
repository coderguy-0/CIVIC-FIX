import React from 'react';
import { Complaint } from '../../types';
import { ComplaintStatus } from './ComplaintStatus';
import { CATEGORIES_META } from '../../lib/constants';
import { Clock, MapPin, ArrowRight, Lock } from 'lucide-react';

export interface ComplaintCardProps {
  complaint: Complaint;
  onView: (id: string) => void;
  className?: string;
}

export const ComplaintCard: React.FC<ComplaintCardProps> = ({
  complaint,
  onView,
  className = ''
}) => {
  const catMeta = CATEGORIES_META[complaint.category] || CATEGORIES_META.other;

  // Next follow-up info
  const activeReminder = complaint.reminders?.find(r => !r.completed_at);
  const nextDateStr = activeReminder?.remind_at || complaint.next_follow_up_at;
  const isOverdue = nextDateStr && new Date(nextDateStr) < new Date();

  return (
    <div
      onClick={() => onView(complaint.id)}
      className={`bg-white border border-[#dce5e1] hover:border-[#66736e]/40 rounded-[16px] p-5 shadow-2xs hover:shadow-xs transition-all duration-150 cursor-pointer flex flex-col justify-between space-y-4 group ${className}`}
    >
      <div className="space-y-3">
        {/* Category Header */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#66736e]">
            {catMeta.labelEn}
          </span>

          <ComplaintStatus status={complaint.status} size="sm" />
        </div>

        {/* Title and Locality */}
        <div>
          <h3 className="text-base font-bold text-[#17201d] group-hover:text-[#087f5b] transition-colors line-clamp-1 leading-snug">
            {complaint.title}
          </h3>
          <p className="text-xs text-[#66736e] flex items-center gap-1.5 mt-1">
            <MapPin className="w-3.5 h-3.5 text-[#66736e]/70 shrink-0" />
            <span className="truncate">
              {complaint.locality || complaint.district || complaint.state_name || 'Neighborhood'}
            </span>
          </p>
        </div>

        {/* Official Reference (masked if present) */}
        {complaint.official_reference && (
          <div className="inline-flex items-center gap-1 text-[11px] font-mono text-[#66736e] bg-[#eef3f1] px-2 py-0.5 rounded-md">
            <Lock className="w-3 h-3 text-[#087f5b]" />
            <span>Ref: {complaint.official_reference}</span>
          </div>
        )}
      </div>

      {/* Follow-up info & action footer */}
      <div className="pt-3 border-t border-[#dce5e1]/60 flex items-center justify-between gap-2 text-xs">
        {nextDateStr ? (
          <div
            className={`flex items-center gap-1.5 font-medium ${
              isOverdue ? 'text-[#c0392b]' : 'text-[#a96f16]'
            }`}
          >
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span>
              {isOverdue ? 'Follow-up overdue' : `Follow-up ${new Date(nextDateStr).toLocaleDateString()}`}
            </span>
          </div>
        ) : (
          <span className="text-[11px] text-[#66736e]">
            {complaint.events?.length || 1} update{(complaint.events?.length || 1) > 1 ? 's' : ''}
          </span>
        )}

        <span className="inline-flex items-center gap-1 font-semibold text-[#087f5b] group-hover:translate-x-0.5 transition-transform text-xs">
          <span>View complaint</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
};
