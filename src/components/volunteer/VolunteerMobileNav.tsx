import React from 'react';
import { LayoutDashboard, CheckSquare, ClipboardList, Activity, User } from 'lucide-react';

export interface VolunteerMobileNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
  openTasksCount?: number;
}

export const VolunteerMobileNav: React.FC<VolunteerMobileNavProps> = ({
  currentView,
  onNavigate,
  openTasksCount = 0
}) => {
  const items = [
    { id: 'dashboard', label: 'Home', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'assigned', label: 'Issues', icon: <CheckSquare className="w-5 h-5" /> },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: <ClipboardList className="w-5 h-5" />,
      badge: openTasksCount > 0 ? openTasksCount : undefined
    },
    { id: 'activity', label: 'Activity', icon: <Activity className="w-5 h-5" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> }
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#dce5e1] px-2 py-1 shadow-lg">
      <div className="flex items-center justify-around">
        {items.map(item => {
          const isActive =
            currentView === item.id ||
            (item.id === 'assigned' && currentView === 'issue-detail');

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl relative transition-colors ${
                isActive ? 'text-[#1864ab] font-bold' : 'text-[#66736e]'
              }`}
            >
              <div className="relative">
                {item.icon}
                {item.badge !== undefined && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 bg-[#1864ab] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
