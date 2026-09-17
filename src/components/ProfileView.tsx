import React from 'react';
import { UserProfile, Complaint } from '../types';
import { Button } from './ui/Button';
import { exportAllUserData } from '../lib/storage';
import {
  User,
  Shield,
  FileText,
  CheckCircle2,
  Clock,
  Download,
  Settings as SettingsIcon,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Sparkles
} from 'lucide-react';

export interface ProfileViewProps {
  profile: UserProfile;
  complaints: Complaint[];
  onNavigate: (view: string, complaintId?: string) => void;
  language?: 'en' | 'hi';
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  complaints,
  onNavigate,
  language = 'en'
}) => {
  const activeCount = complaints.filter(c => c.status !== 'resolved' && c.status !== 'closed').length;
  const resolvedCount = complaints.filter(c => c.status === 'resolved').length;
  const followUpDueCount = complaints.filter(c => {
    if (!c.next_follow_up_at) return false;
    return new Date(c.next_follow_up_at).getTime() <= Date.now() + 24 * 60 * 60 * 1000;
  }).length;

  const handleExport = () => {
    const dataStr = exportAllUserData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `civicfix-profile-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Profile Header Card */}
      <div className="bg-white border border-[#dce5e1] rounded-[20px] p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#087f5b] text-white flex items-center justify-center font-bold text-2xl shadow-sm">
              {profile.display_name.charAt(0).toUpperCase()}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#17201d]">
                  {profile.display_name}
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#e7f7f1] text-[#087f5b] border border-[#a3e3cb]">
                  Verified Citizen
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-[#66736e]">
                {profile.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{profile.email}</span>
                  </span>
                )}
                {profile.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{profile.phone}</span>
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{profile.city || 'Delhi'}, {profile.state || 'India'}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onNavigate('settings')}
              className="text-xs"
            >
              <SettingsIcon className="w-3.5 h-3.5" />
              <span>Settings</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Activity Summary Stats */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#66736e] mb-3">
          Civic Activity Summary
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white border border-[#dce5e1] rounded-[16px] p-4 shadow-2xs">
            <span className="text-[11px] font-semibold text-[#66736e] block">Total Complaints</span>
            <span className="text-2xl font-extrabold text-[#17201d] mt-1 block">
              {complaints.length}
            </span>
          </div>

          <div className="bg-white border border-[#dce5e1] rounded-[16px] p-4 shadow-2xs">
            <span className="text-[11px] font-semibold text-[#66736e] block">Active Cases</span>
            <span className="text-2xl font-extrabold text-[#087f5b] mt-1 block">
              {activeCount}
            </span>
          </div>

          <div className="bg-white border border-[#dce5e1] rounded-[16px] p-4 shadow-2xs">
            <span className="text-[11px] font-semibold text-[#66736e] block">Follow-ups Due</span>
            <span className="text-2xl font-extrabold text-[#c0392b] mt-1 block">
              {followUpDueCount}
            </span>
          </div>

          <div className="bg-white border border-[#dce5e1] rounded-[16px] p-4 shadow-2xs">
            <span className="text-[11px] font-semibold text-[#66736e] block">Resolved</span>
            <span className="text-2xl font-extrabold text-[#2563eb] mt-1 block">
              {resolvedCount}
            </span>
          </div>
        </div>
      </div>

      {/* Account & Privacy Credentials */}
      <div className="bg-white border border-[#dce5e1] rounded-[16px] p-5 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-[#17201d]">
          Account & Privacy Safeguards
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-[#f6f9f7] rounded-xl border border-[#dce5e1]/60 space-y-1">
            <span className="text-[#66736e] font-semibold block">Citizen Identifier</span>
            <span className="font-mono text-[#17201d] font-bold text-xs">{profile.id}</span>
          </div>

          <div className="p-3 bg-[#f6f9f7] rounded-xl border border-[#dce5e1]/60 space-y-1">
            <span className="text-[#66736e] font-semibold block">Member Since</span>
            <span className="text-[#17201d] font-bold text-xs">
              {new Date(profile.created_at).toLocaleDateString([], { month: 'long', year: 'numeric' })}
            </span>
          </div>

          <div className="p-3 bg-[#f6f9f7] rounded-xl border border-[#dce5e1]/60 space-y-1">
            <span className="text-[#66736e] font-semibold block">Preferred Language</span>
            <span className="text-[#17201d] font-bold text-xs">
              {profile.preferred_language === 'hi' ? 'हिन्दी (Hindi)' : 'English'}
            </span>
          </div>

          <div className="p-3 bg-[#f6f9f7] rounded-xl border border-[#dce5e1]/60 space-y-1">
            <span className="text-[#66736e] font-semibold block">Privacy Framework</span>
            <span className="text-[#087f5b] font-bold text-xs">
              India DPDP Act (Local Browser Vault)
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-[#dce5e1] flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-[#66736e]">
            Export all records or manage notification settings.
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleExport}
              className="text-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export My Data (JSON)</span>
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onNavigate('settings')}
              className="text-xs"
            >
              <span>Manage Settings</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
