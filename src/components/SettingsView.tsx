import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Checkbox } from './ui/Checkbox';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/Card';
import { exportAllUserData, eraseAllUserData, saveProfile } from '../lib/storage';
import {
  User,
  Shield,
  Bell,
  Lock,
  Download,
  Trash2,
  Check,
  AlertTriangle,
  LogOut
} from 'lucide-react';

export interface SettingsViewProps {
  profile: UserProfile;
  onUpdateProfile: (p: UserProfile) => void;
  language: 'en' | 'hi';
  onToggleLanguage: (l: 'en' | 'hi') => void;
  onResetApp: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  profile,
  onUpdateProfile,
  language,
  onToggleLanguage,
  onResetApp
}) => {
  const [displayName, setDisplayName] = useState(profile.display_name);
  const [email, setEmail] = useState(profile.email || '');
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...profile,
      display_name: displayName.trim() || 'Citizen',
      email: email.trim() || undefined,
      preferred_language: language
    };
    saveProfile(updated);
    onUpdateProfile(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleExportData = () => {
    const dataStr = exportAllUserData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `civicfix-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        'Are you sure you want to delete your CivicFix account? This will permanently erase all your complaints, timeline events, and reminders from this browser.'
      )
    ) {
      eraseAllUserData();
      onResetApp();
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17201d] tracking-tight">
          Settings
        </h1>
        <p className="text-sm text-[#66736e] mt-0.5">
          Manage your citizen account, privacy preferences, and notifications.
        </p>
      </div>

      <div className="space-y-6">
        {/* Section 1: Account */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#087f5b]" />
              <span>Account</span>
            </CardTitle>
            <CardDescription>
              Your local profile identification for complaint follow-ups.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSaveAccount} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Display name"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder="Citizen name"
                  required
                />
                <Input
                  label="Notification email (optional)"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="citizen@example.in"
                  hint="Never shared or made public."
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#17201d]">Language:</span>
                  <button
                    type="button"
                    onClick={() => onToggleLanguage(language === 'en' ? 'hi' : 'en')}
                    className="px-2.5 py-1 text-xs font-bold rounded-lg border border-[#dce5e1] bg-[#f6f9f7] hover:bg-[#eef3f1]"
                  >
                    {language === 'en' ? 'Switch to हिन्दी' : 'Switch to English'}
                  </button>
                </div>

                <Button type="submit" variant="primary" size="sm">
                  {saveSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Saved</span>
                    </>
                  ) : (
                    <span>Save changes</span>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Section 2: Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#087f5b]" />
              <span>Notifications</span>
            </CardTitle>
            <CardDescription>
              Control when CivicFix notifies you about inspection due dates and SLA targets.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Checkbox
              checked={remindersEnabled}
              onChange={e => setRemindersEnabled(e.target.checked)}
              label="Follow-up reminders"
              description="Show in-app alerts on your top header when municipal SLAs or follow-up dates arrive."
            />

            <Checkbox
              checked={emailNotifs}
              onChange={e => setEmailNotifs(e.target.checked)}
              label="Email notifications"
              description="Receive email summaries for upcoming follow-up reminders (requires email above)."
              disabled={!email}
            />
          </CardContent>
        </Card>

        {/* Section 3: Privacy & Data Portability */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#087f5b]" />
              <span>Privacy & Data Portability</span>
            </CardTitle>
            <CardDescription>
              India DPDP Act compliance: complete data export and transparent privacy safeguards.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#f6f9f7] rounded-[12px] border border-[#dce5e1]">
              <div className="space-y-0.5">
                <span className="font-bold text-[#17201d] block">Export all personal records</span>
                <span className="text-[#66736e]">
                  Download an open JSON file of all your complaints, timeline events, and reminders.
                </span>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleExportData}
                className="shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Data</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Security & Destructive Zone */}
        <Card className="border-[#c0392b]/30">
          <CardHeader className="bg-[#fff0ee]/40 rounded-t-[16px]">
            <CardTitle className="flex items-center gap-2 text-[#c0392b]">
              <AlertTriangle className="w-4 h-4" />
              <span>Delete Account & Data</span>
            </CardTitle>
            <CardDescription className="text-[#c0392b]/80">
              Permanently delete all your local tracking records and reset your session.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            <p className="text-xs text-[#66736e]">
              Deleting your account immediately purges all complaints, private reference tokens, and follow-up notes from your browser storage. This cannot be undone.
            </p>

            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteAccount}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete account & all data</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
