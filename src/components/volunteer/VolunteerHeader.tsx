import React, { useState } from 'react';
import {
  Shield,
  Bell,
  CheckCircle2,
  Clock,
  LogOut,
  ChevronDown,
  Sparkles,
  AlertTriangle,
  UserCheck
} from 'lucide-react';
import { UserProfile, VolunteerTask } from '../../types';

export interface VolunteerHeaderProps {
  profile: UserProfile;
  tasks: VolunteerTask[];
  onNavigate: (view: string) => void;
  onLogout: () => void;
  onToggleVerificationStatus?: () => void;
}

export const VolunteerHeader: React.FC<VolunteerHeaderProps> = ({
  profile,
  tasks,
  onNavigate,
  onLogout,
  onToggleVerificationStatus
}) => {
  const [showBellDropdown, setShowBellDropdown] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);

  const pendingTasks = tasks.filter(t => t.status !== 'completed');
  const isVerified = profile.volunteer_profile?.verification_status === 'verified';

  return (
    <header className="sticky top-0 z-40 bg-[#ffffff]/95 backdrop-blur-xs border-b border-[#c8d9d2] h-16 flex items-center px-4 sm:px-6 lg:px-8">
      <div className="w-full flex items-center justify-between">
        {/* Brand & Portal Type */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2.5 text-left focus:outline-none focus:ring-2 focus:ring-[#087f5b] rounded-lg p-1"
          >
            <div className="w-8 h-8 rounded-xl bg-[#1864ab] text-white flex items-center justify-center font-black text-sm shadow-xs tracking-wider">
              CF
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg text-[#17201d] tracking-tight block leading-tight">
                  CivicFix
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#e7f5ff] text-[#1864ab] border border-[#a5d8ff]">
                  Volunteer Portal
                </span>
              </div>
              <span className="text-[10px] text-[#66736e] font-medium hidden sm:block leading-none">
                Community Verification & Ground Action
              </span>
            </div>
          </button>
        </div>

        {/* Right side controls: Verification badge, Simulation toggle, Notification bell, Volunteer Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Verification Status Pill */}
          <div className="hidden md:flex items-center gap-2">
            {isVerified ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#e7f7f1] text-[#087f5b] border border-[#a3e3cb]">
                <UserCheck className="w-3.5 h-3.5" />
                Verified Volunteer
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#fff7e6] text-[#a96f16] border border-[#ffe066]">
                <Clock className="w-3.5 h-3.5" />
                Pending Verification
              </span>
            )}

            {/* Quick Demo Simulator Toggle */}
            {onToggleVerificationStatus && (
              <button
                onClick={onToggleVerificationStatus}
                title="Toggle verification status for preview/testing"
                className="text-[10px] font-bold px-2 py-1 rounded-lg border border-[#c8d9d2] bg-[#f8faf9] hover:bg-[#eef3f1] text-[#2c3833] transition-colors flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-[#1864ab]" />
                <span>{isVerified ? 'Simulate Pending' : 'Simulate Verified'}</span>
              </button>
            )}
          </div>

          {/* Volunteer Tasks Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowBellDropdown(!showBellDropdown)}
              className="relative p-2 rounded-xl border border-[#dce5e1] bg-white hover:bg-[#eef3f1] text-[#17201d] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1864ab]"
              aria-label="Pending volunteer tasks"
            >
              <Bell className="w-4 h-4 text-[#66736e]" />
              {pendingTasks.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#1864ab] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {pendingTasks.length}
                </span>
              )}
            </button>

            {showBellDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-[#dce5e1] shadow-xl p-4 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-3 border-b border-[#dce5e1]">
                  <span className="text-xs font-bold text-[#17201d]">
                    Assigned Volunteer Tasks ({pendingTasks.length})
                  </span>
                  <button
                    onClick={() => {
                      setShowBellDropdown(false);
                      onNavigate('tasks');
                    }}
                    className="text-[11px] text-[#1864ab] hover:underline font-semibold"
                  >
                    View tasks
                  </button>
                </div>
                <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
                  {pendingTasks.length === 0 ? (
                    <p className="text-xs text-[#66736e] py-4 text-center">
                      No pending tasks assigned to you.
                    </p>
                  ) : (
                    pendingTasks.map(t => (
                      <div
                        key={t.id}
                        onClick={() => {
                          setShowBellDropdown(false);
                          onNavigate('tasks');
                        }}
                        className="p-2 rounded-xl bg-[#f8faf9] hover:bg-[#eef3f1] cursor-pointer text-left space-y-1 transition-colors"
                      >
                        <p className="text-xs font-bold text-[#17201d] line-clamp-1">{t.title}</p>
                        <p className="text-[10px] text-[#66736e] line-clamp-1">{t.location}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Volunteer Account Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowAccountDropdown(!showAccountDropdown)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-[#dce5e1] bg-white hover:bg-[#eef3f1] text-[#17201d] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1864ab]"
            >
              <div className="w-6 h-6 rounded-full bg-[#e7f5ff] text-[#1864ab] flex items-center justify-center text-xs font-bold shrink-0">
                {profile.display_name ? profile.display_name.charAt(0).toUpperCase() : 'V'}
              </div>
              <div className="text-left hidden sm:block">
                <span className="text-xs font-semibold block max-w-[110px] truncate leading-tight">
                  Volunteer: {profile.display_name || 'Volunteer'}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#66736e]" />
            </button>

            {showAccountDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-[#dce5e1] shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 space-y-1">
                <div className="px-3 py-2 border-b border-[#eef3f1]">
                  <p className="text-xs font-bold text-[#17201d] truncate">
                    {profile.display_name}
                  </p>
                  <p className="text-[10px] text-[#66736e] truncate">{profile.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-md text-[9px] font-bold bg-[#e7f5ff] text-[#1864ab]">
                    {isVerified ? 'Verified Community Volunteer' : 'Verification Under Review'}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setShowAccountDropdown(false);
                    onNavigate('profile');
                  }}
                  className="w-full px-3 py-2 text-left text-xs font-medium text-[#17201d] hover:bg-[#f8faf9] rounded-xl transition-colors"
                >
                  Volunteer Profile & Ward
                </button>

                <button
                  onClick={() => {
                    setShowAccountDropdown(false);
                    onNavigate('activity');
                  }}
                  className="w-full px-3 py-2 text-left text-xs font-medium text-[#17201d] hover:bg-[#f8faf9] rounded-xl transition-colors"
                >
                  My Field Audits & Activity
                </button>

                <div className="border-t border-[#eef3f1] pt-1">
                  <button
                    onClick={() => {
                      setShowAccountDropdown(false);
                      onLogout();
                    }}
                    className="w-full px-3 py-2 text-left text-xs font-bold text-[#c0392b] hover:bg-[#fff0ee] rounded-xl transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
