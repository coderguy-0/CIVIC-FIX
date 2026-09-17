import React, { useState, useEffect } from 'react';
import { AppNotification } from '../types';
import {
  getStoredNotifications,
  markNotificationRead,
  markAllNotificationsRead
} from '../lib/storage';
import { Button } from './ui/Button';
import {
  Bell,
  CheckCircle2,
  Clock,
  MessageSquare,
  Shield,
  Check,
  ArrowRight
} from 'lucide-react';

export interface NotificationsViewProps {
  onNavigate: (view: string, complaintId?: string) => void;
  language?: 'en' | 'hi';
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  onNavigate,
  language = 'en'
}) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'reminder' | 'complaint_update' | 'community' | 'system'>('all');

  const refreshNotifs = () => {
    setNotifications(getStoredNotifications());
  };

  useEffect(() => {
    refreshNotifs();
  }, []);

  const handleMarkAllRead = () => {
    markAllNotificationsRead();
    refreshNotifs();
  };

  const handleItemClick = (n: AppNotification) => {
    if (!n.read) {
      markNotificationRead(n.id);
      refreshNotifs();
    }
    if (n.complaint_id) {
      onNavigate('complaint-detail', n.complaint_id);
    } else if (n.public_report_id) {
      onNavigate('explore');
    }
  };

  const filtered = notifications.filter(n => {
    if (activeTab === 'all') return true;
    return n.category === activeTab;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (category: string) => {
    switch (category) {
      case 'reminder':
        return <Clock className="w-4 h-4 text-[#a96f16]" />;
      case 'complaint_update':
        return <CheckCircle2 className="w-4 h-4 text-[#087f5b]" />;
      case 'community':
        return <MessageSquare className="w-4 h-4 text-[#2563eb]" />;
      case 'system':
        return <Shield className="w-4 h-4 text-[#66736e]" />;
      default:
        return <Bell className="w-4 h-4 text-[#66736e]" />;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17201d] tracking-tight">
              Notifications
            </h1>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#087f5b] text-white">
                {unreadCount} new
              </span>
            )}
          </div>
          <p className="text-sm text-[#66736e] mt-1">
            Activity updates, follow-up alerts, and community confirmations.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleMarkAllRead}
            className="text-xs self-start sm:self-auto"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Mark all as read</span>
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#dce5e1] pb-2 overflow-x-auto">
        {[
          { id: 'all', label: 'All' },
          { id: 'reminder', label: 'Reminders' },
          { id: 'complaint_update', label: 'Complaint Updates' },
          { id: 'community', label: 'Community' },
          { id: 'system', label: 'System' }
        ].map(tab => {
          const count = tab.id === 'all'
            ? notifications.length
            : notifications.filter(n => n.category === tab.id).length;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-[#087f5b] text-white'
                  : 'text-[#66736e] hover:bg-[#eef3f1] hover:text-[#17201d]'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-[#eef3f1] text-[#66736e]'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Notifications List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-[16px] border border-[#dce5e1] p-8 text-center space-y-2 shadow-2xs">
          <Bell className="w-8 h-8 mx-auto text-[#66736e]/40" />
          <h3 className="text-sm font-bold text-[#17201d]">No notifications here</h3>
          <p className="text-xs text-[#66736e]">
            Follow-up reminders and complaint status alerts will appear in this feed.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-[16px] border border-[#dce5e1] divide-y divide-[#dce5e1]/60 shadow-2xs overflow-hidden">
          {filtered.map(notif => (
            <div
              key={notif.id}
              onClick={() => handleItemClick(notif)}
              className={`p-4 sm:p-5 flex items-start gap-4 cursor-pointer transition-colors ${
                !notif.read ? 'bg-[#f6f9f7]' : 'hover:bg-[#fafbfb]'
              }`}
            >
              <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                !notif.read ? 'bg-white border border-[#dce5e1]' : 'bg-[#eef3f1]'
              }`}>
                {getIcon(notif.category)}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className={`text-sm ${!notif.read ? 'font-extrabold text-[#17201d]' : 'font-semibold text-[#17201d]/80'}`}>
                    {notif.title}
                  </h4>
                  <span className="text-[11px] text-[#66736e] whitespace-nowrap">
                    {new Date(notif.created_at).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <p className="text-xs text-[#66736e] leading-relaxed">
                  {notif.message}
                </p>
                {(notif.complaint_id || notif.public_report_id) && (
                  <div className="pt-1">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#087f5b] hover:underline">
                      <span>View details</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                )}
              </div>

              {!notif.read && (
                <span className="w-2.5 h-2.5 rounded-full bg-[#087f5b] shrink-0 mt-2" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
