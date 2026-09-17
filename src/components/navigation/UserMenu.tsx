import React from 'react';
import { User, Settings, ShieldCheck, Download, Trash2, LogOut, ChevronDown } from 'lucide-react';
import { Dropdown, DropdownItem } from '../ui/Dropdown';
import { UserProfile } from '../../types';

export interface UserMenuProps {
  profile: UserProfile;
  onNavigate: (view: string) => void;
  onResetApp?: () => void;
  onLogout?: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({ profile, onNavigate, onResetApp, onLogout }) => {
  const items: DropdownItem[] = [
    {
      label: (
        <div className="py-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-[#e7f7f1] text-[#087f5b]">
              Citizen
            </span>
            <p className="font-semibold text-xs text-[#17201d] truncate">
              {profile.display_name || 'Citizen'}
            </p>
          </div>
          <p className="text-[10px] text-[#66736e] truncate mt-0.5">{profile.email || 'Private local session'}</p>
        </div>
      ),
      onClick: () => onNavigate('profile')
    },
    {
      label: 'My Profile',
      icon: <User className="w-3.5 h-3.5" />,
      onClick: () => onNavigate('profile')
    },
    {
      label: 'Settings & Privacy',
      icon: <Settings className="w-3.5 h-3.5" />,
      onClick: () => onNavigate('settings')
    },
    {
      label: 'Moderation Queue',
      icon: <ShieldCheck className="w-3.5 h-3.5" />,
      onClick: () => onNavigate('admin')
    },
    {
      label: 'Export Data (DPDP)',
      icon: <Download className="w-3.5 h-3.5" />,
      onClick: () => onNavigate('settings')
    },
    ...(onLogout
      ? [
          {
            label: 'Logout',
            icon: <LogOut className="w-3.5 h-3.5" />,
            destructive: true,
            onClick: () => onLogout()
          }
        ]
      : []),
    ...(onResetApp
      ? [
          {
            label: 'Erase All Data',
            icon: <Trash2 className="w-3.5 h-3.5" />,
            destructive: true,
            onClick: () => {
              if (window.confirm('Delete all your tracked complaints and reminders?')) {
                onResetApp();
              }
            }
          }
        ]
      : [])
  ];

  return (
    <Dropdown
      trigger={
        <button
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-[#dce5e1] bg-white hover:bg-[#eef3f1] text-[#17201d] transition-colors focus:outline-none focus:ring-2 focus:ring-[#087f5b]"
          aria-label="Account menu"
        >
          <div className="w-6 h-6 rounded-full bg-[#e7f7f1] text-[#087f5b] flex items-center justify-center text-xs font-bold shrink-0">
            {profile.display_name ? profile.display_name.charAt(0).toUpperCase() : 'C'}
          </div>
          <span className="text-xs font-semibold hidden sm:inline-block max-w-[120px] truncate">
            Citizen: {profile.display_name ? profile.display_name.split(' ')[0] : 'Citizen'}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-[#66736e]" />
        </button>
      }
      items={items}
      align="right"
    />
  );
};
