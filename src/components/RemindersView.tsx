import React, { useState } from 'react';
import { Complaint, Reminder } from '../types';
import { Button } from './ui/Button';
import { Dialog } from './ui/Dialog';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { CATEGORIES_META } from '../lib/constants';
import {
  Clock,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Plus,
  ArrowRight,
  ChevronRight,
  Bell
} from 'lucide-react';

export interface RemindersViewProps {
  complaints: Complaint[];
  onNavigate: (view: string, complaintId?: string) => void;
  onAddReminder: (complaintId: string, remindAt: string, message: string) => void;
  onToggleReminder: (complaintId: string, reminderId: string) => void;
  language?: 'en' | 'hi';
}

export const RemindersView: React.FC<RemindersViewProps> = ({
  complaints,
  onNavigate,
  onAddReminder,
  onToggleReminder,
  language = 'en'
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedComplaintId, setSelectedComplaintId] = useState(complaints[0]?.id || '');
  const [reminderDate, setReminderDate] = useState(
    new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [reminderTime, setReminderTime] = useState('10:00');
  const [reminderMessage, setReminderMessage] = useState('Check grievance status on official portal');

  // Collate all reminders from complaints
  const allReminders: { complaint: Complaint; reminder: Reminder }[] = [];
  complaints.forEach(c => {
    (c.reminders || []).forEach(r => {
      allReminders.push({ complaint: c, reminder: r });
    });
  });

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const endOfToday = startOfToday + 24 * 60 * 60 * 1000;

  // Due Today: not completed and due today or overdue
  const dueToday = allReminders.filter(({ reminder }) => {
    if (reminder.completed_at) return false;
    const rTime = new Date(reminder.remind_at).getTime();
    return rTime < endOfToday;
  });

  // Upcoming: not completed and due after today
  const upcoming = allReminders.filter(({ reminder }) => {
    if (reminder.completed_at) return false;
    const rTime = new Date(reminder.remind_at).getTime();
    return rTime >= endOfToday;
  }).sort((a, b) => new Date(a.reminder.remind_at).getTime() - new Date(b.reminder.remind_at).getTime());

  // Completed: completed_at is set
  const completed = allReminders.filter(({ reminder }) => !!reminder.completed_at)
    .sort((a, b) => new Date(b.reminder.completed_at!).getTime() - new Date(a.reminder.completed_at!).getTime());

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaintId) return;
    const fullDate = `${reminderDate}T${reminderTime}:00`;
    onAddReminder(selectedComplaintId, fullDate, reminderMessage.trim());
    setIsModalOpen(false);
    setReminderMessage('Check grievance status on official portal');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17201d] tracking-tight">
            Reminders
          </h1>
          <p className="text-sm text-[#66736e] mt-1">
            Personal follow-up schedules and municipal inquiry deadlines.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsModalOpen(true)}
          className="shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Set Reminder</span>
        </Button>
      </div>

      {/* Section 1: Due Today */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-[#c0392b]" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#17201d]">
            Due Today ({dueToday.length})
          </h2>
        </div>

        {dueToday.length === 0 ? (
          <div className="bg-white rounded-[16px] border border-[#dce5e1] p-5 text-center text-xs text-[#66736e]">
            No reminders due today. You are up to date!
          </div>
        ) : (
          <div className="space-y-3">
            {dueToday.map(({ complaint, reminder }) => {
              const cat = CATEGORIES_META[complaint.category] || CATEGORIES_META.other;
              return (
                <div
                  key={reminder.id}
                  className="bg-white border-2 border-[#c0392b]/30 rounded-[16px] p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#c0392b] bg-[#fde8e8] px-2 py-0.5 rounded-md">
                        Action Required
                      </span>
                      <span className="text-xs text-[#66736e]">{cat.labelEn}</span>
                    </div>
                    <h3 className="text-base font-bold text-[#17201d]">
                      {complaint.title}
                    </h3>
                    <p className="text-xs text-[#17201d]/80 font-medium">
                      "{reminder.message}"
                    </p>
                    <p className="text-[11px] text-[#66736e]">
                      Scheduled for: {new Date(reminder.remind_at).toLocaleDateString([], {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#dce5e1]">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onToggleReminder(complaint.id, reminder.id)}
                      className="text-xs text-[#087f5b]"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Complete</span>
                    </Button>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onNavigate('complaint-detail', complaint.id)}
                      className="text-xs"
                    >
                      <span>Open Complaint</span>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Section 2: Upcoming */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#a96f16]" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#17201d]">
            Upcoming ({upcoming.length})
          </h2>
        </div>

        {upcoming.length === 0 ? (
          <div className="bg-white rounded-[16px] border border-[#dce5e1] p-5 text-center text-xs text-[#66736e]">
            No upcoming reminders scheduled.
          </div>
        ) : (
          <div className="bg-white rounded-[16px] border border-[#dce5e1] divide-y divide-[#dce5e1]/60 shadow-2xs overflow-hidden">
            {upcoming.map(({ complaint, reminder }) => (
              <div
                key={reminder.id}
                className="p-4 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#f6f9f7] transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#a96f16]">
                      {new Date(reminder.remind_at).toLocaleDateString([], {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short'
                      })}
                    </span>
                    <span className="text-xs text-[#66736e]">• {complaint.locality || complaint.district}</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#17201d]">
                    {complaint.title}
                  </h4>
                  <p className="text-xs text-[#66736e]">
                    "{reminder.message}"
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onToggleReminder(complaint.id, reminder.id)}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-[#dce5e1] hover:bg-[#eef3f1] text-[#66736e]"
                  >
                    Mark Done
                  </button>
                  <button
                    onClick={() => onNavigate('complaint-detail', complaint.id)}
                    className="text-xs font-bold text-[#087f5b] hover:underline flex items-center gap-1"
                  >
                    <span>View</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 3: Completed */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#087f5b]" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#17201d]">
            Completed ({completed.length})
          </h2>
        </div>

        {completed.length === 0 ? (
          <div className="bg-white rounded-[16px] border border-[#dce5e1] p-5 text-center text-xs text-[#66736e]">
            No completed reminders yet.
          </div>
        ) : (
          <div className="bg-white rounded-[16px] border border-[#dce5e1] divide-y divide-[#dce5e1]/60 shadow-2xs overflow-hidden opacity-85">
            {completed.map(({ complaint, reminder }) => (
              <div
                key={reminder.id}
                className="p-4 sm:px-5 flex items-center justify-between gap-4"
              >
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-[#17201d] line-through text-[#66736e]">
                    {complaint.title}
                  </h4>
                  <p className="text-[11px] text-[#66736e]">
                    {reminder.message}
                  </p>
                  <span className="text-[10px] text-[#087f5b]">
                    Completed {reminder.completed_at ? new Date(reminder.completed_at).toLocaleDateString([], { day: 'numeric', month: 'short' }) : 'recently'}
                  </span>
                </div>

                <button
                  onClick={() => onToggleReminder(complaint.id, reminder.id)}
                  className="text-[11px] font-semibold text-[#66736e] hover:text-[#17201d] underline"
                >
                  Undo
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Set Reminder Modal */}
      <Dialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Set Follow-up Reminder"
        description="Schedule an automated alert to review municipal progress."
      >
        <form onSubmit={handleCreateReminder} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#17201d] mb-1">
              Select Complaint
            </label>
            <select
              value={selectedComplaintId}
              onChange={e => setSelectedComplaintId(e.target.value)}
              className="w-full text-xs rounded-xl border border-[#dce5e1] p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#087f5b]"
              required
            >
              {complaints.map(c => (
                <option key={c.id} value={c.id}>
                  {c.title} ({c.status})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Date"
              type="date"
              value={reminderDate}
              onChange={e => setReminderDate(e.target.value)}
              required
            />
            <Input
              label="Time"
              type="time"
              value={reminderTime}
              onChange={e => setReminderTime(e.target.value)}
              required
            />
          </div>

          <Input
            label="Reminder Note"
            value={reminderMessage}
            onChange={e => setReminderMessage(e.target.value)}
            placeholder="e.g. Check if inspection team visited site"
            required
          />

          <div className="pt-3 border-t border-[#dce5e1] flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Set Reminder
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};
