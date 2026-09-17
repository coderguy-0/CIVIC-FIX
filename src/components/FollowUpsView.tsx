import React, { useState } from 'react';
import { Complaint, Reminder } from '../types';
import { Button } from './ui/Button';
import { EmptyState } from './ui/EmptyState';
import { FollowUpCard } from './complaints/FollowUpCard';
import { FollowUpModal } from './complaints/FollowUpModal';
import { Clock, AlertTriangle, CalendarCheck } from 'lucide-react';

export interface FollowUpsViewProps {
  complaints: Complaint[];
  onNavigate: (view: string, complaintId?: string) => void;
  onAddFollowUp: (complaintId: string, data: any) => void;
  language?: 'en' | 'hi';
}

export type FollowUpFilter = 'all' | 'today' | 'upcoming' | 'overdue';

export const FollowUpsView: React.FC<FollowUpsViewProps> = ({
  complaints,
  onNavigate,
  onAddFollowUp,
  language = 'en'
}) => {
  const [filterTab, setFilterTab] = useState<FollowUpFilter>('all');
  const [activeModalComplaint, setActiveModalComplaint] = useState<Complaint | null>(null);

  // Collect complaints that have follow-ups
  const allFollowUpItems: { complaint: Complaint; remindAt: string; isPast: boolean; isToday: boolean }[] = [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  complaints.forEach(c => {
    if (c.status === 'resolved' || c.status === 'closed') return;

    const uncompletedReminder = c.reminders?.find(r => !r.completed_at);
    const dateStr = uncompletedReminder?.remind_at || c.next_follow_up_at;

    if (dateStr) {
      const targetDate = new Date(dateStr);
      const isPast = targetDate < today;
      const isToday = targetDate >= today && targetDate < tomorrow;

      allFollowUpItems.push({
        complaint: c,
        remindAt: dateStr,
        isPast,
        isToday
      });
    }
  });

  // Sort earliest date first
  allFollowUpItems.sort(
    (a, b) => new Date(a.remindAt).getTime() - new Date(b.remindAt).getTime()
  );

  const overdueItems = allFollowUpItems.filter(item => item.isPast);
  const todayItems = allFollowUpItems.filter(item => item.isToday);
  const upcomingItems = allFollowUpItems.filter(item => !item.isPast && !item.isToday);

  const displayedItems = allFollowUpItems.filter(item => {
    if (filterTab === 'today') return item.isToday;
    if (filterTab === 'overdue') return item.isPast;
    if (filterTab === 'upcoming') return !item.isPast && !item.isToday;
    return true;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17201d] tracking-tight">
          Follow-ups
        </h1>
        <p className="text-sm text-[#66736e] mt-0.5">
          Timely follow-through on recorded civic complaints.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#dce5e1] pb-3 text-xs">
        {[
          { id: 'all', label: 'All', count: allFollowUpItems.length },
          { id: 'today', label: 'Today', count: todayItems.length },
          { id: 'upcoming', label: 'Upcoming', count: upcomingItems.length },
          { id: 'overdue', label: 'Overdue', count: overdueItems.length }
        ].map(tab => {
          const isSelected = filterTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id as FollowUpFilter)}
              className={`px-3.5 py-1.5 rounded-xl font-semibold transition-colors flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-[#17201d] text-white'
                  : 'bg-white border border-[#dce5e1] text-[#66736e] hover:bg-[#eef3f1]'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-[#eef3f1] text-[#66736e]'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* List / Sections */}
      {displayedItems.length === 0 ? (
        <EmptyState
          icon={<CalendarCheck className="w-6 h-6" />}
          title="You're all caught up."
          description={
            filterTab === 'all'
              ? 'No follow-ups need your attention right now.'
              : `No follow-ups in the "${filterTab}" filter.`
          }
          action={
            <Button variant="secondary" size="sm" onClick={() => onNavigate('complaints')}>
              View all complaints
            </Button>
          }
        />
      ) : (
        <div className="space-y-6">
          {/* Overdue Section */}
          {(filterTab === 'all' || filterTab === 'overdue') && overdueItems.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#c0392b] flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Overdue Follow-ups ({overdueItems.length})</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {overdueItems.map(({ complaint }) => (
                  <FollowUpCard
                    key={complaint.id}
                    complaint={complaint}
                    onRecordFollowUp={c => setActiveModalComplaint(c)}
                    onViewComplaint={id => onNavigate('complaint-detail', id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Today Section */}
          {(filterTab === 'all' || filterTab === 'today') && todayItems.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#a96f16] flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>Due Today ({todayItems.length})</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {todayItems.map(({ complaint }) => (
                  <FollowUpCard
                    key={complaint.id}
                    complaint={complaint}
                    onRecordFollowUp={c => setActiveModalComplaint(c)}
                    onViewComplaint={id => onNavigate('complaint-detail', id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Section */}
          {(filterTab === 'all' || filterTab === 'upcoming') && upcomingItems.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#087f5b] flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>Upcoming Follow-ups ({upcomingItems.length})</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingItems.map(({ complaint }) => (
                  <FollowUpCard
                    key={complaint.id}
                    complaint={complaint}
                    onRecordFollowUp={c => setActiveModalComplaint(c)}
                    onViewComplaint={id => onNavigate('complaint-detail', id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Follow-up modal */}
      {activeModalComplaint && (
        <FollowUpModal
          isOpen={!!activeModalComplaint}
          onClose={() => setActiveModalComplaint(null)}
          complaint={activeModalComplaint}
          onSaveFollowUp={(id, data) => {
            onAddFollowUp(id, data);
            setActiveModalComplaint(null);
          }}
        />
      )}
    </div>
  );
};
