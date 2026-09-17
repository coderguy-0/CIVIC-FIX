import React from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  MapPin,
  ClipboardList,
  CheckCircle2,
  Activity,
  User,
  LogOut,
  ShieldCheck
} from 'lucide-react';

export interface VolunteerSidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  openTasksCount?: number;
  assignedIssuesCount?: number;
}

export const VolunteerSidebar: React.FC<VolunteerSidebarProps> = ({
  currentView,
  onNavigate,
  onLogout,
  openTasksCount = 0,
  assignedIssuesCount = 0
}) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />
    },
    {
      id: 'assigned',
      label: 'Assigned Issues',
      icon: <CheckSquare className="w-4 h-4" />,
      badge: assignedIssuesCount > 0 ? assignedIssuesCount : undefined
    },
    {
      id: 'nearby',
      label: 'Nearby Issues',
      icon: <MapPin className="w-4 h-4" />
    },
    {
      id: 'tasks',
      label: 'Follow-Up Tasks',
      icon: <ClipboardList className="w-4 h-4" />,
      badge: openTasksCount > 0 ? openTasksCount : undefined,
      badgeVariant: 'highlight'
    },
    {
      id: 'verification',
      label: 'Verification Queue',
      icon: <CheckCircle2 className="w-4 h-4" />
    },
    {
      id: 'activity',
      label: 'Audit Activity',
      icon: <Activity className="w-4 h-4" />
    },
    {
      id: 'profile',
      label: 'Volunteer Profile',
      icon: <User className="w-4 h-4" />
    }
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-[#c8d9d2] p-4 shrink-0 justify-between min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        <div className="px-2 py-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#66736e]">
            Volunteer Tools
          </span>
        </div>

        <nav className="space-y-1" aria-label="Volunteer Navigation">
          {navItems.map(item => {
            const isActive =
              currentView === item.id ||
              (item.id === 'assigned' && currentView === 'issue-detail');

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                  isActive
                    ? 'bg-[#e7f5ff] text-[#1864ab] border border-[#a5d8ff]'
                    : 'text-[#2c3833] hover:bg-[#f0f6f3] hover:text-[#1864ab]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-[#1864ab]' : 'text-[#66736e]'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      item.badgeVariant === 'highlight'
                        ? 'bg-[#1864ab] text-white'
                        : 'bg-[#e7f5ff] text-[#1864ab]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout & Quick Info */}
      <div className="pt-4 border-t border-[#dce5e1] space-y-3">
        <div className="p-3 bg-[#f8faf9] rounded-xl border border-[#dce5e1] text-[11px] text-[#4a5853] space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-[#1864ab]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Community Ground Verification</span>
          </div>
          <p className="text-[10px] text-[#66736e]">
            All field actions record verifiable public accountability events.
          </p>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#c0392b] hover:bg-[#fff0ee] transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
