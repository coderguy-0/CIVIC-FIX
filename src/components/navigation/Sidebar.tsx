import React from 'react';
import {
  Home,
  FileText,
  Clock,
  Compass,
  HelpCircle,
  Settings,
  Plus,
  MapPin,
  Bookmark,
  Bell,
  User,
  Share2,
  ShieldCheck,
  LogOut
} from 'lucide-react';
import { Button } from '../ui/Button';

export interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout?: () => void;
  followUpsCount?: number;
  complaintsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  onLogout,
  followUpsCount = 0,
  complaintsCount = 0
}) => {
  const mainNavItems = [
    {
      id: 'dashboard',
      label: 'Home / Dashboard',
      icon: <Home className="w-4 h-4" />
    },
    {
      id: 'complaints',
      label: 'My Complaints',
      icon: <FileText className="w-4 h-4" />,
      badge: complaintsCount > 0 ? complaintsCount : undefined
    },
    {
      id: 'reminders',
      label: 'Reminders & Follow-ups',
      icon: <Clock className="w-4 h-4" />,
      badge: followUpsCount > 0 ? followUpsCount : undefined,
      badgeVariant: 'warning'
    },
    {
      id: 'map',
      label: 'Civic Map',
      icon: <MapPin className="w-4 h-4" />
    },
    {
      id: 'explore',
      label: 'Explore Issues',
      icon: <Compass className="w-4 h-4" />
    },
    {
      id: 'help',
      label: 'Help Directory',
      icon: <HelpCircle className="w-4 h-4" />
    },
    {
      id: 'my-reports',
      label: 'My Public Reports',
      icon: <Share2 className="w-4 h-4" />
    },
    {
      id: 'saved',
      label: 'Saved Items',
      icon: <Bookmark className="w-4 h-4" />
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <Bell className="w-4 h-4" />
    }
  ];

  const secondaryNavItems = [
    {
      id: 'profile',
      label: 'My Profile',
      icon: <User className="w-4 h-4" />
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-4 h-4" />
    }
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-[#dce5e1] p-4 shrink-0 justify-between min-h-[calc(100vh-4rem)]">
      <div className="space-y-4">
        {/* Prominent Global "Report an Issue" CTA */}
        <Button
          variant="primary"
          onClick={() => onNavigate('new-complaint')}
          className="w-full justify-center shadow-xs text-xs font-bold py-2.5 bg-[#087f5b] hover:bg-[#066b4d]"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Report an Issue</span>
        </Button>

        {/* Main Navigation */}
        <nav className="space-y-1" aria-label="Main Navigation">
          {mainNavItems.map(item => {
            const isActive =
              currentView === item.id ||
              (item.id === 'complaints' &&
                (currentView === 'complaint-detail' || currentView === 'new-complaint'));

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors text-left ${
                  isActive
                    ? 'bg-[#e7f7f1] text-[#087f5b]'
                    : 'text-[#17201d] hover:bg-[#f6f9f7] hover:text-[#087f5b]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={isActive ? 'text-[#087f5b]' : 'text-[#66736e]'}>
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full shrink-0 ${
                      item.badgeVariant === 'warning'
                        ? 'bg-[#fff0ee] text-[#c0392b]'
                        : 'bg-[#e7f7f1] text-[#087f5b]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="pt-2 border-t border-[#dce5e1]/60 space-y-1">
          {secondaryNavItems.map(item => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors text-left ${
                  isActive
                    ? 'bg-[#e7f7f1] text-[#087f5b]'
                    : 'text-[#66736e] hover:bg-[#f6f9f7] hover:text-[#17201d]'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom info & sign out */}
      <div className="pt-4 border-t border-[#dce5e1] space-y-2">
        <div className="bg-[#f6f9f7] p-2.5 rounded-xl border border-[#dce5e1]/60">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#087f5b] block">
            Private Action Vault
          </span>
          <p className="text-[11px] text-[#66736e] mt-0.5 leading-snug">
            Protected under DPDP safeguards.
          </p>
        </div>

        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-[#c0392b] hover:bg-[#fff0ee] transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        )}
      </div>
    </aside>
  );
};
