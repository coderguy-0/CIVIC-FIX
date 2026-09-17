import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCircle2, Clock, Plus, ShieldCheck, Search } from 'lucide-react';
import { UserProfile, Reminder, Complaint } from '../../types';
import { UserMenu } from './UserMenu';
import { Button } from '../ui/Button';

export interface HeaderProps {
  profile: UserProfile;
  complaints: Complaint[];
  currentView: string;
  onNavigate: (view: string, complaintId?: string) => void;
  onToggleReminder?: (complaintId: string, reminderId: string) => void;
  language: 'en' | 'hi';
  onToggleLanguage: (lang: 'en' | 'hi') => void;
  onResetApp?: () => void;
  onLogout?: () => void;
  onOpenSearch?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  complaints,
  currentView,
  onNavigate,
  onToggleReminder,
  language,
  onToggleLanguage,
  onResetApp,
  onLogout,
  onOpenSearch
}) => {
  const [showBellDropdown, setShowBellDropdown] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  // Extract all pending reminders
  const activeReminders: { complaint: Complaint; reminder: Reminder }[] = [];
  complaints.forEach(c => {
    (c.reminders || []).forEach(r => {
      if (!r.completed_at) {
        activeReminders.push({ complaint: c, reminder: r });
      }
    });
  });

  // Sort by remind_at date
  activeReminders.sort(
    (a, b) => new Date(a.reminder.remind_at).getTime() - new Date(b.reminder.remind_at).getTime()
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setShowBellDropdown(false);
      }
    };
    if (showBellDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showBellDropdown]);

  return (
    <header className="sticky top-0 z-40 bg-[#ffffff]/95 backdrop-blur-xs border-b border-[#dce5e1] h-16 flex items-center px-4 sm:px-6 lg:px-8">
      <div className="w-full flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2.5 text-left focus:outline-none focus:ring-2 focus:ring-[#087f5b] rounded-lg p-1"
          >
            <div className="w-8 h-8 rounded-xl bg-[#087f5b] text-white flex items-center justify-center font-black text-sm shadow-xs tracking-wider">
              CF
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg text-[#17201d] tracking-tight block leading-tight">
                  CivicFix
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#e7f7f1] text-[#087f5b] border border-[#a3e3cb]">
                  Citizen Portal
                </span>
              </div>
              <span className="text-[10px] text-[#66736e] font-medium hidden sm:block leading-none">
                Spot · Report · Track
              </span>
            </div>
          </button>
        </div>

        {/* Center/Right actions: Search + Report + Bell + Language toggle + User menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Global Search Button */}
          {onOpenSearch && (
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border border-[#dce5e1] bg-[#f6f9f7] hover:bg-[#eef3f1] text-xs text-[#66736e] transition-colors"
              title="Search (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-[#087f5b]" />
              <span className="hidden md:inline">Search civic data...</span>
              <kbd className="hidden lg:inline text-[9px] bg-white px-1.5 py-0.5 rounded border border-[#dce5e1] font-mono">
                ⌘K
              </kbd>
            </button>
          )}

          {/* Quick Report Button */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => onNavigate('new-complaint')}
            className="hidden sm:inline-flex text-xs py-1.5 px-3 bg-[#087f5b] hover:bg-[#066b4d]"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            <span>Report</span>
          </Button>

          {/* Quick Language Toggle */}
          <button
            onClick={() => onToggleLanguage(language === 'en' ? 'hi' : 'en')}
            className="text-[11px] font-bold px-2 py-1 rounded-lg border border-[#dce5e1] bg-white hover:bg-[#eef3f1] text-[#17201d] transition-colors"
            title="Switch language"
          >
            {language === 'en' ? 'हिन्दी' : 'EN'}
          </button>

          {/* Follow-up Reminder Bell */}
          <div className="relative" ref={bellRef}>
            <button
              onClick={() => setShowBellDropdown(!showBellDropdown)}
              className="relative p-2 rounded-xl border border-[#dce5e1] bg-white hover:bg-[#eef3f1] text-[#17201d] transition-colors focus:outline-none focus:ring-2 focus:ring-[#087f5b]"
              aria-label="Follow-up notifications"
            >
              <Bell className="w-4 h-4 text-[#66736e]" />
              {activeReminders.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#c0392b] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {activeReminders.length}
                </span>
              )}
            </button>

            {showBellDropdown && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-[16px] border border-[#dce5e1] shadow-xl p-4 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-3 border-b border-[#dce5e1]">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#087f5b]" />
                    <span className="text-xs font-bold text-[#17201d]">
                      Pending Follow-up Reminders ({activeReminders.length})
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setShowBellDropdown(false);
                      onNavigate('follow-ups');
                    }}
                    className="text-[11px] text-[#087f5b] hover:underline font-semibold"
                  >
                    View all
                  </button>
                </div>

                <div className="mt-3 max-h-72 overflow-y-auto divide-y divide-[#dce5e1]/60 space-y-2">
                  {activeReminders.length === 0 ? (
                    <div className="py-6 text-center text-xs text-[#66736e]">
                      You're all caught up. No follow-up reminders due.
                    </div>
                  ) : (
                    activeReminders.map(({ complaint, reminder }) => {
                      const isPast = new Date(reminder.remind_at) < new Date();
                      return (
                        <div key={reminder.id} className="pt-2 pb-1 space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <span
                              onClick={() => {
                                setShowBellDropdown(false);
                                onNavigate('complaint-detail', complaint.id);
                              }}
                              className="text-xs font-bold text-[#17201d] hover:text-[#087f5b] cursor-pointer line-clamp-1"
                            >
                              {complaint.title}
                            </span>
                            <span
                              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 ${
                                isPast
                                  ? 'bg-[#fff0ee] text-[#c0392b]'
                                  : 'bg-[#fff7e6] text-[#a96f16]'
                              }`}
                            >
                              {isPast ? 'Overdue' : 'Upcoming'}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#66736e] leading-snug">
                            {reminder.message}
                          </p>
                          <div className="flex items-center justify-between text-[10px] text-[#66736e] pt-1">
                            <span>Due: {new Date(reminder.remind_at).toLocaleDateString()}</span>
                            {onToggleReminder && (
                              <button
                                onClick={() => onToggleReminder(complaint.id, reminder.id)}
                                className="text-[#087f5b] hover:underline font-semibold flex items-center gap-1"
                              >
                                <CheckCircle2 className="w-3 h-3" /> Mark done
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Account Menu */}
          <UserMenu
            profile={profile}
            onNavigate={onNavigate}
            onResetApp={onResetApp}
            onLogout={onLogout}
          />
        </div>
      </div>
    </header>
  );
};
