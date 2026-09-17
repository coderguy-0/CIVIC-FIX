import React from 'react';
import { ComplaintEvent } from '../../types';
import { SOURCE_LABELS_META } from '../../lib/constants';
import { Clock, Shield, User, FileText, CheckCircle2 } from 'lucide-react';

export interface ComplaintTimelineProps {
  events: ComplaintEvent[];
  className?: string;
}

export const ComplaintTimeline: React.FC<ComplaintTimelineProps> = ({ events, className = '' }) => {
  if (!events || events.length === 0) {
    return (
      <div className="py-8 text-center text-xs text-[#66736e]">
        No events logged in the timeline yet.
      </div>
    );
  }

  // Sort latest first
  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.occurred_at || b.created_at).getTime() - new Date(a.occurred_at || a.created_at).getTime()
  );

  const getEventTitle = (event: ComplaintEvent) => {
    switch (event.event_type) {
      case 'created':
        return 'Complaint recorded';
      case 'status_changed':
        return `Status updated to ${event.new_status?.replace('_', ' ')}`;
      case 'follow_up':
        return 'Follow-up recorded';
      case 'authority_response':
        return 'Official response received';
      case 'evidence_added':
        return 'Evidence document attached';
      case 'reopened':
        return 'Complaint reopened';
      case 'closed':
        return 'Complaint closed';
      case 'note_added':
      default:
        return 'Note recorded';
    }
  };

  const getSourceIcon = (sourceLabel: string) => {
    switch (sourceLabel) {
      case 'Official integration':
      case 'Official source linked':
        return <Shield className="w-3 h-3 text-[#087f5b]" />;
      case 'Document attached':
        return <FileText className="w-3 h-3 text-[#2563a6]" />;
      case 'Community confirmed':
        return <CheckCircle2 className="w-3 h-3 text-[#087f5b]" />;
      case 'User reported':
      default:
        return <User className="w-3 h-3 text-[#66736e]" />;
    }
  };

  return (
    <div className={`space-y-0 relative ${className}`}>
      {sortedEvents.map((event, idx) => {
        const dateObj = new Date(event.occurred_at || event.created_at);
        const formattedDate = dateObj.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
        const formattedTime = dateObj.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        });
        const isLast = idx === sortedEvents.length - 1;

        return (
          <div key={event.id || idx} className="relative flex items-start gap-4 pb-8 group">
            {/* Vertical line between events */}
            {!isLast && (
              <div
                className="absolute left-[7px] top-4 bottom-0 w-[2px] bg-[#dce5e1]"
                aria-hidden="true"
              />
            )}

            {/* Event Dot */}
            <div className="relative z-10 w-4 h-4 rounded-full border-2 border-white bg-[#087f5b] ring-4 ring-[#e7f7f1] shrink-0 mt-1" />

            {/* Event Content */}
            <div className="flex-1 space-y-1 bg-white p-4 rounded-[12px] border border-[#dce5e1]/70 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h4 className="text-sm font-bold text-[#17201d]">
                  {getEventTitle(event)}
                </h4>
                <div className="flex items-center gap-1.5 text-[11px] text-[#66736e]">
                  <Clock className="w-3 h-3 text-[#66736e]" />
                  <span>{formattedDate} · {formattedTime}</span>
                </div>
              </div>

              {event.note && (
                <p className="text-xs text-[#17201d]/90 leading-relaxed pt-1">
                  {event.note}
                </p>
              )}

              {/* Source label badge */}
              <div className="pt-2 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#66736e] bg-[#eef3f1] px-2 py-0.5 rounded-full border border-[#dce5e1]">
                  {getSourceIcon(event.source_label)}
                  <span>{event.source_label || 'User reported'}</span>
                </span>

                {event.old_status && event.new_status && (
                  <span className="text-[10px] text-[#66736e]">
                    ({event.old_status} → {event.new_status})
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
