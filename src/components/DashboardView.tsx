import React, { useState, useEffect, useMemo } from 'react';
import { Complaint, UserProfile, Reminder } from '../types';
import { Button } from './ui/Button';
import { Skeleton } from './ui/Skeleton';
import { ComplaintStatus } from './complaints/ComplaintStatus';
import { FollowUpModal } from './complaints/FollowUpModal';
import { CATEGORIES_META } from '../lib/constants';
import {
  Plus,
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  AlertTriangle,
  MapPin,
  Calendar,
  Compass,
  Building2,
  Share2,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  Shield,
  Layers
} from 'lucide-react';

export interface DashboardViewProps {
  complaints: Complaint[];
  onNavigate: (view: string, complaintId?: string) => void;
  onAddFollowUp: (complaintId: string, data: any) => void;
  profile?: UserProfile;
  language?: 'en' | 'hi';
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  complaints,
  onNavigate,
  onAddFollowUp,
  profile,
  language = 'en'
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [followUpComplaint, setFollowUpComplaint] = useState<Complaint | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 150);
    return () => clearTimeout(timer);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = profile?.display_name || 'Citizen';
    if (hour < 12) return `Good morning, ${name}`;
    if (hour < 18) return `Good afternoon, ${name}`;
    return `Good evening, ${name}`;
  };

  // 1. Stats calculation (4 cards)
  const openCount = complaints.filter(
    c => c.status !== 'resolved' && c.status !== 'closed'
  ).length;

  const inProgressCount = complaints.filter(c => c.status === 'in_progress').length;

  const resolvedCount = complaints.filter(
    c => c.status === 'resolved' || c.status === 'closed'
  ).length;

  // Follow-up due count: complaints with reminders due or follow up dates within 48h
  const now = Date.now();
  const followUpDueComplaints = useMemo(() => {
    return complaints.filter(c => {
      if (c.status === 'resolved' || c.status === 'closed') return false;
      const hasUnresolvedReminder = c.reminders?.some(r => {
        if (r.completed_at) return false;
        const due = new Date(r.remind_at).getTime();
        return due <= now + 48 * 60 * 60 * 1000;
      });
      const followUpDateDue = c.next_follow_up_at && new Date(c.next_follow_up_at).getTime() <= now + 48 * 60 * 60 * 1000;
      return hasUnresolvedReminder || followUpDateDue;
    });
  }, [complaints, now]);

  const followUpDueCount = followUpDueComplaints.length;

  // 2. Attention items (Issues needing action or without update)
  const attentionItems = useMemo(() => {
    const items: {
      id: string;
      complaint: Complaint;
      reason: string;
      urgency: 'high' | 'medium';
      badge: string;
    }[] = [];

    complaints.forEach(c => {
      if (c.status === 'resolved' || c.status === 'closed') return;

      // Check overdue or due today
      const overdueReminder = c.reminders?.find(r => !r.completed_at && new Date(r.remind_at).getTime() <= now);
      if (overdueReminder) {
        items.push({
          id: `att-due-${c.id}`,
          complaint: c,
          reason: `Follow-up due: "${overdueReminder.message}"`,
          urgency: 'high',
          badge: 'Follow-up due today'
        });
        return;
      }

      // Check reminder due tomorrow
      const tomorrowReminder = c.reminders?.find(r => !r.completed_at && new Date(r.remind_at).getTime() <= now + 24 * 60 * 60 * 1000);
      if (tomorrowReminder) {
        items.push({
          id: `att-tom-${c.id}`,
          complaint: c,
          reason: `Reminder scheduled: "${tomorrowReminder.message}"`,
          urgency: 'medium',
          badge: 'Reminder tomorrow'
        });
        return;
      }

      // Check no update recorded for 7+ days
      const lastUpdate = new Date(c.updated_at || c.created_at).getTime();
      const daysSinceUpdate = Math.floor((now - lastUpdate) / (24 * 60 * 60 * 1000));
      if (daysSinceUpdate >= 7) {
        items.push({
          id: `att-idle-${c.id}`,
          complaint: c,
          reason: `No update recorded for ${daysSinceUpdate} days. Review authority status.`,
          urgency: 'medium',
          badge: `No update for ${daysSinceUpdate} days`
        });
      }
    });

    return items;
  }, [complaints, now]);

  // 3. Collate recent timeline activity across user's complaints
  const recentActivities = useMemo(() => {
    const acts: {
      id: string;
      complaint: Complaint;
      date: string;
      relativeLabel: string;
      title: string;
      note: string;
    }[] = [];

    complaints.forEach(c => {
      (c.events || []).forEach(ev => {
        const evTime = new Date(ev.occurred_at || ev.created_at).getTime();
        const diffHours = Math.floor((now - evTime) / (60 * 60 * 1000));
        let relativeLabel = 'Earlier';
        if (diffHours < 24) relativeLabel = 'Today';
        else if (diffHours < 48) relativeLabel = 'Yesterday';
        else {
          relativeLabel = new Date(evTime).toLocaleDateString([], { day: 'numeric', month: 'short' });
        }

        acts.push({
          id: ev.id,
          complaint: c,
          date: ev.occurred_at || ev.created_at,
          relativeLabel,
          title: ev.note || `Complaint updated (${ev.new_status || ev.event_type})`,
          note: c.title
        });
      });
    });

    return acts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
  }, [complaints, now]);

  // 4. Upcoming reminders list
  const upcomingReminders = useMemo(() => {
    const list: { complaint: Complaint; reminder: Reminder }[] = [];
    complaints.forEach(c => {
      (c.reminders || []).forEach(r => {
        if (!r.completed_at) {
          list.push({ complaint: c, reminder: r });
        }
      });
    });
    return list.sort((a, b) => new Date(a.reminder.remind_at).getTime() - new Date(b.reminder.remind_at).getTime()).slice(0, 4);
  }, [complaints]);

  // 5. Active complaints list
  const activeComplaints = useMemo(() => {
    return complaints.filter(c => c.status !== 'resolved' && c.status !== 'closed').slice(0, 4);
  }, [complaints]);

  if (isLoading) {
    return (
      <div className="p-6 sm:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in">
        <div className="space-y-2">
          <Skeleton variant="text" width={220} height={28} />
          <Skeleton variant="text" width={300} height={18} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Skeleton variant="rectangular" height={90} />
          <Skeleton variant="rectangular" height={90} />
          <Skeleton variant="rectangular" height={90} />
          <Skeleton variant="rectangular" height={90} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17201d] tracking-tight">
            {getGreeting()}
          </h1>
          <p className="text-sm text-[#66736e] mt-1">
            Your civic activity at a glance. Keep your civic issues moving forward.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            onClick={() => onNavigate('complaints')}
            size="sm"
            className="text-xs"
          >
            <span>View My Complaints</span>
          </Button>

          <Button
            variant="primary"
            onClick={() => onNavigate('new-complaint')}
            size="sm"
            className="shadow-xs text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Report a Problem</span>
          </Button>
        </div>
      </div>

      {/* 2. Four Statistics Cards (Section 4) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div
          onClick={() => onNavigate('complaints')}
          className="bg-white border border-[#dce5e1] hover:border-[#66736e]/40 rounded-[16px] p-4 sm:p-5 shadow-2xs cursor-pointer transition-all group"
        >
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#66736e] block">
            Open
          </span>
          <span className="text-2xl sm:text-3xl font-black text-[#17201d] mt-1 block group-hover:text-[#087f5b]">
            {openCount}
          </span>
          <span className="text-[11px] text-[#66736e] mt-0.5 block">
            Active complaints
          </span>
        </div>

        <div
          onClick={() => onNavigate('reminders')}
          className="bg-white border border-[#dce5e1] hover:border-[#c0392b]/40 rounded-[16px] p-4 sm:p-5 shadow-2xs cursor-pointer transition-all group"
        >
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#c0392b] block">
            Follow-up Due
          </span>
          <span className="text-2xl sm:text-3xl font-black text-[#c0392b] mt-1 block">
            {followUpDueCount}
          </span>
          <span className="text-[11px] text-[#66736e] mt-0.5 block">
            Requires action
          </span>
        </div>

        <div
          onClick={() => onNavigate('complaints')}
          className="bg-white border border-[#dce5e1] hover:border-[#a96f16]/40 rounded-[16px] p-4 sm:p-5 shadow-2xs cursor-pointer transition-all group"
        >
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#a96f16] block">
            In Progress
          </span>
          <span className="text-2xl sm:text-3xl font-black text-[#a96f16] mt-1 block">
            {inProgressCount}
          </span>
          <span className="text-[11px] text-[#66736e] mt-0.5 block">
            Inspection underway
          </span>
        </div>

        <div
          onClick={() => onNavigate('complaints')}
          className="bg-white border border-[#dce5e1] hover:border-[#087f5b]/40 rounded-[16px] p-4 sm:p-5 shadow-2xs cursor-pointer transition-all group"
        >
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#087f5b] block">
            Resolved
          </span>
          <span className="text-2xl sm:text-3xl font-black text-[#087f5b] mt-1 block">
            {resolvedCount}
          </span>
          <span className="text-[11px] text-[#66736e] mt-0.5 block">
            Successfully closed
          </span>
        </div>
      </div>

      {/* 3. WHAT NEEDS YOUR ATTENTION? (Section 5) - Most prominent! */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#c0392b]" />
            <h2 className="text-base font-bold text-[#17201d]">
              What needs your attention?
            </h2>
          </div>
          <span className="text-xs font-semibold text-[#66736e]">
            {attentionItems.length} item{attentionItems.length !== 1 ? 's' : ''}
          </span>
        </div>

        {attentionItems.length === 0 ? (
          <div className="bg-white rounded-[16px] border border-[#dce5e1] p-6 text-center text-xs text-[#66736e] space-y-1 shadow-2xs">
            <p className="font-bold text-[#17201d]">All your civic issues are up to date.</p>
            <p>No complaints have pending follow-up reminders due today.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {attentionItems.map(item => (
              <div
                key={item.id}
                className="bg-white border-2 border-[#c0392b]/20 hover:border-[#c0392b]/40 rounded-[16px] p-4 sm:p-5 shadow-2xs flex flex-col justify-between gap-3 transition-colors"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-[#fff0ee] text-[#c0392b] border border-[#f5c6cb]">
                      {item.badge}
                    </span>
                    <span className="text-[11px] text-[#66736e]">
                      {item.complaint.locality || item.complaint.district}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-[#17201d] leading-snug">
                    {item.complaint.title}
                  </h3>

                  <p className="text-xs text-[#66736e]">
                    {item.reason}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#dce5e1]/60 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#66736e]">
                    Ref: {item.complaint.official_reference || 'Private record'}
                  </span>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setFollowUpComplaint(item.complaint)}
                      className="text-xs py-1"
                    >
                      <span>Review / Follow-up</span>
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onNavigate('complaint-detail', item.complaint.id)}
                      className="text-xs py-1"
                    >
                      <span>Open</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. QUICK ACTIONS (Section 6) */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-[#17201d]">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div
            onClick={() => onNavigate('new-complaint')}
            className="bg-white border border-[#dce5e1] hover:border-[#087f5b] rounded-[16px] p-4.5 shadow-2xs cursor-pointer transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#e7f7f1] text-[#087f5b] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Plus className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#17201d] group-hover:text-[#087f5b]">
              Report an Issue
            </h3>
            <p className="text-xs text-[#66736e] mt-1 leading-relaxed">
              Create a progressive 7-step complaint record with evidence.
            </p>
          </div>

          <div
            onClick={() => onNavigate('reminders')}
            className="bg-white border border-[#dce5e1] hover:border-[#087f5b] rounded-[16px] p-4.5 shadow-2xs cursor-pointer transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#fef3c7] text-[#a96f16] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#17201d] group-hover:text-[#087f5b]">
              Add Follow-up
            </h3>
            <p className="text-xs text-[#66736e] mt-1 leading-relaxed">
              Update case notes, authority responses, or reminders.
            </p>
          </div>

          <div
            onClick={() => onNavigate('explore')}
            className="bg-white border border-[#dce5e1] hover:border-[#087f5b] rounded-[16px] p-4.5 shadow-2xs cursor-pointer transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#dbeafe] text-[#2563eb] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#17201d] group-hover:text-[#087f5b]">
              Explore Issues
            </h3>
            <p className="text-xs text-[#66736e] mt-1 leading-relaxed">
              Browse moderated community reports and corroborate.
            </p>
          </div>

          <div
            onClick={() => onNavigate('help')}
            className="bg-white border border-[#dce5e1] hover:border-[#087f5b] rounded-[16px] p-4.5 shadow-2xs cursor-pointer transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#ede9fe] text-[#7c3aed] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#17201d] group-hover:text-[#087f5b]">
              Find Official Help
            </h3>
            <p className="text-xs text-[#66736e] mt-1 leading-relaxed">
              Search verified portals and official municipal helplines.
            </p>
          </div>
        </div>
      </div>

      {/* Two Column Grid: My Active Complaints (Section 8) + Activity / Reminders (Sections 7, 9) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active Complaints (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#17201d] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#087f5b]" />
              <span>My Active Complaints</span>
            </h2>
            <button
              onClick={() => onNavigate('complaints')}
              className="text-xs font-semibold text-[#087f5b] hover:underline"
            >
              View all ({complaints.length})
            </button>
          </div>

          {activeComplaints.length === 0 ? (
            <div className="bg-white rounded-[16px] border border-[#dce5e1] p-6 text-center space-y-2 shadow-2xs">
              <p className="text-xs font-bold text-[#17201d]">No active complaints right now</p>
              <p className="text-xs text-[#66736e]">Track your first municipal grievance in your private dashboard.</p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => onNavigate('new-complaint')}
                className="text-xs mt-2"
              >
                + Report a Problem
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {activeComplaints.map(c => {
                const cat = CATEGORIES_META[c.category] || CATEGORIES_META.other;
                return (
                  <div
                    key={c.id}
                    onClick={() => onNavigate('complaint-detail', c.id)}
                    className="bg-white border border-[#dce5e1] hover:border-[#66736e]/50 rounded-[16px] p-4 shadow-2xs cursor-pointer transition-colors space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-bold text-[#66736e]">
                            {cat.labelEn}
                          </span>
                          <span className="text-xs text-[#66736e]">• {c.locality || c.district}</span>
                        </div>
                        <h4 className="text-sm font-bold text-[#17201d] truncate">
                          {c.title}
                        </h4>
                      </div>
                      <ComplaintStatus status={c.status} size="sm" />
                    </div>

                    <div className="pt-2 border-t border-[#dce5e1]/60 flex items-center justify-between text-xs text-[#66736e]">
                      <span>
                        Follow-up:{' '}
                        {c.next_follow_up_at
                          ? new Date(c.next_follow_up_at).toLocaleDateString([], {
                              day: 'numeric',
                              month: 'short'
                            })
                          : 'None set'}
                      </span>
                      <span className="font-semibold text-[#087f5b] flex items-center gap-1">
                        <span>Open Workspace</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Activity & Reminders (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Recent Activity (Section 7) */}
          <div className="bg-white border border-[#dce5e1] rounded-[16px] p-4.5 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#66736e]">
              My Recent Activity
            </h3>

            {recentActivities.length === 0 ? (
              <p className="text-xs text-[#66736e] py-3 text-center">No recent activity yet.</p>
            ) : (
              <div className="space-y-3">
                {recentActivities.map(act => (
                  <div key={act.id} className="flex items-start gap-3 text-xs">
                    <span className="text-[10px] font-bold text-[#66736e] bg-[#f6f9f7] px-2 py-0.5 rounded-md shrink-0 w-16 text-center">
                      {act.relativeLabel}
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-[#17201d] leading-snug truncate">
                        {act.title}
                      </p>
                      <p className="text-[11px] text-[#66736e] truncate">
                        {act.note}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Reminders (Section 9) */}
          <div className="bg-white border border-[#dce5e1] rounded-[16px] p-4.5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#66736e]">
                Upcoming Reminders
              </h3>
              <button
                onClick={() => onNavigate('reminders')}
                className="text-xs font-bold text-[#087f5b] hover:underline"
              >
                View all
              </button>
            </div>

            {upcomingReminders.length === 0 ? (
              <p className="text-xs text-[#66736e] py-2 text-center">No upcoming reminders.</p>
            ) : (
              <div className="space-y-2.5">
                {upcomingReminders.map(({ complaint, reminder }) => (
                  <div
                    key={reminder.id}
                    className="p-2.5 rounded-xl bg-[#f6f9f7] border border-[#dce5e1]/60 flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-[#a96f16] block">
                        {new Date(reminder.remind_at).toLocaleDateString([], {
                          day: 'numeric',
                          month: 'short'
                        })}
                      </span>
                      <p className="font-bold text-[#17201d] truncate">
                        {complaint.title}
                      </p>
                      <p className="text-[11px] text-[#66736e] truncate">
                        {reminder.message}
                      </p>
                    </div>

                    <button
                      onClick={() => onNavigate('complaint-detail', complaint.id)}
                      className="text-xs font-bold text-[#087f5b] shrink-0 hover:underline"
                    >
                      Open
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 5. LOCAL COMMUNITY SNAPSHOT (Section 10) */}
          <div className="bg-linear-to-br from-[#f6f9f7] to-[#e7f7f1]/50 border border-[#dce5e1] rounded-[16px] p-4.5 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#087f5b] flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" />
                <span>Local Community Snapshot</span>
              </span>
              <span className="text-[10px] text-[#66736e]">Delhi / South Zone</span>
            </div>

            <p className="text-xs font-semibold text-[#17201d]">
              Near your area: 5 road issues · 3 sanitation reports · 2 streetlight reports
            </p>

            <button
              onClick={() => onNavigate('map')}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#087f5b] hover:underline"
            >
              <span>Explore on Civic Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Follow-up modal */}
      {followUpComplaint && (
        <FollowUpModal
          isOpen={!!followUpComplaint}
          onClose={() => setFollowUpComplaint(null)}
          complaint={followUpComplaint}
          onSaveFollowUp={(id, data) => {
            onAddFollowUp(id, data);
            setFollowUpComplaint(null);
          }}
        />
      )}
    </div>
  );
};
