import React from 'react';
import { AlertTriangle, Clock, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { Complaint, Reminder } from '../../types';

export interface FollowUpCardProps {
  complaint: Complaint;
  reminder?: Reminder;
  onRecordFollowUp: (complaint: Complaint) => void;
  onViewComplaint: (id: string) => void;
  className?: string;
}

export const FollowUpCard: React.FC<FollowUpCardProps> = ({
  complaint,
  reminder,
  onRecordFollowUp,
  onViewComplaint,
  className = ''
}) => {
  const remindAt = reminder?.remind_at || complaint.next_follow_up_at;
  const isPast = remindAt ? new Date(remindAt) < new Date() : false;

  const getDueLabel = () => {
    if (!remindAt) return 'Follow-up needed';
    const targetDate = new Date(remindAt);
    const today = new Date();
    const diffDays = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return `⚠ Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) > 1 ? 's' : ''}`;
    if (diffDays === 0) return '⚠ Follow-up due today';
    if (diffDays === 1) return '⚠ Follow-up due tomorrow';
    return `Follow-up due ${targetDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`;
  };

  return (
    <div
      className={`rounded-[16px] border p-5 transition-all shadow-2xs space-y-3.5 ${
        isPast
          ? 'bg-[#fff0ee]/50 border-[#c0392b]/30'
          : 'bg-[#fff7e6]/50 border-[#a96f16]/30'
      } ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className={`text-xs font-bold inline-flex items-center gap-1.5 ${
            isPast ? 'text-[#c0392b]' : 'text-[#a96f16]'
          }`}
        >
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{getDueLabel()}</span>
        </span>

        {complaint.authority_name && (
          <span className="text-[11px] text-[#66736e] font-medium truncate max-w-[150px]">
            {complaint.authority_name}
          </span>
        )}
      </div>

      <div>
        <h4
          onClick={() => onViewComplaint(complaint.id)}
          className="text-base font-bold text-[#17201d] hover:text-[#087f5b] cursor-pointer line-clamp-1"
        >
          {complaint.title}
        </h4>
        <p className="text-xs text-[#66736e] flex items-center gap-1.5 mt-0.5">
          <MapPin className="w-3.5 h-3.5 text-[#66736e]/70 shrink-0" />
          <span>{complaint.locality || complaint.district || 'Locality'}</span>
        </p>
      </div>

      {reminder?.message && (
        <p className="text-xs text-[#17201d]/80 bg-white/80 p-2.5 rounded-lg border border-[#dce5e1]/60 leading-snug">
          "{reminder.message}"
        </p>
      )}

      <div className="pt-1 flex items-center justify-between gap-3">
        <button
          onClick={() => onViewComplaint(complaint.id)}
          className="text-xs text-[#66736e] hover:text-[#17201d] font-semibold flex items-center gap-1"
        >
          <span>View complaint</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <Button
          variant="primary"
          size="sm"
          onClick={() => onRecordFollowUp(complaint)}
          className="text-xs"
        >
          Record follow-up
        </Button>
      </div>
    </div>
  );
};
