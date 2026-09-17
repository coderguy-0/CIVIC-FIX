import React, { useState } from 'react';
import {
  AlertCircle,
  Bell,
  BookOpen,
  CheckCircle2,
  Globe2,
  Home,
  LayoutDashboard,
  Menu,
  PlusCircle,
  Search,
  ShieldCheck,
  X
} from 'lucide-react';
import { Complaint } from '../types';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, complaintId?: string) => void;
  complaints: Complaint[];
  language: 'en' | 'hi';
  onToggleLanguage: (lang: 'en' | 'hi') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  complaints,
  language,
  onToggleLanguage
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showRemindersDropdown, setShowRemindersDropdown] = useState(false);

  // Compute pending reminders
  const dueReminders = complaints.flatMap(c =>
    c.reminders
      .filter(r => !r.completed_at)
      .map(r => ({
        ...r,
        complaintTitle: c.title,
        complaintId: c.id
      }))
  );

  const activeComplaintsCount = complaints.filter(c => c.status !== 'resolved' && c.status !== 'closed').length;

  const handleNav = (view: string) => {
    onNavigate(view);
    setMobileMenuOpen(false);
    setShowRemindersDropdown(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              id="civicfix-logo-btn"
              onClick={() => handleNav('home')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xl shadow-sm group-hover:bg-emerald-800 transition-colors">
                <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                  CivicFix
                  <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 tracking-wider">
                    India
                  </span>
                </span>
                <p className="text-[11px] text-slate-500 font-medium leading-none">
                  {language === 'hi' ? 'नागरिक समस्या निवारण मंच' : 'Spot. Report. Track the Fix.'}
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button
              id="nav-home"
              onClick={() => handleNav('home')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                currentView === 'home'
                  ? 'bg-emerald-50 text-emerald-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Home className="w-4 h-4" />
              {language === 'hi' ? 'होम' : 'Home'}
            </button>

            <button
              id="nav-dashboard"
              onClick={() => handleNav('dashboard')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 relative ${
                currentView === 'dashboard' || currentView === 'complaint-detail'
                  ? 'bg-emerald-50 text-emerald-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              {language === 'hi' ? 'मेरी शिकायतें' : 'My Tracker'}
              {activeComplaintsCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-xs font-semibold bg-emerald-700 text-white">
                  {activeComplaintsCount}
                </span>
              )}
            </button>

            <button
              id="nav-explore"
              onClick={() => handleNav('explore')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                currentView === 'explore'
                  ? 'bg-emerald-50 text-emerald-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Search className="w-4 h-4" />
              {language === 'hi' ? 'समुदायिक मुद्दे' : 'Explore Issues'}
            </button>

            <button
              id="nav-help"
              onClick={() => handleNav('help')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                currentView === 'help'
                  ? 'bg-emerald-50 text-emerald-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              {language === 'hi' ? 'सरकारी डायरेक्टरी' : 'Help Directory'}
            </button>

            <button
              id="nav-admin"
              onClick={() => handleNav('admin')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                currentView === 'admin'
                  ? 'bg-emerald-50 text-emerald-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              {language === 'hi' ? 'मॉडरेशन' : 'Admin'}
            </button>
          </nav>

          {/* Right Action Icons & Primary CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switch */}
            <button
              id="lang-toggle-btn"
              onClick={() => onToggleLanguage(language === 'en' ? 'hi' : 'en')}
              className="p-2 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1"
              title="Change Language"
            >
              <Globe2 className="w-4 h-4 text-emerald-700" />
              <span>{language === 'en' ? 'हिन्दी' : 'EN'}</span>
            </button>

            {/* In-app Reminders Alert */}
            <div className="relative">
              <button
                id="reminder-bell-btn"
                onClick={() => setShowRemindersDropdown(!showRemindersDropdown)}
                className="relative p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
                title="Follow-up Reminders"
              >
                <Bell className="w-4 h-4" />
                {dueReminders.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                    {dueReminders.length}
                  </span>
                )}
              </button>

              {/* Reminders Dropdown */}
              {showRemindersDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      {language === 'hi' ? 'आगामी फॉलो-अप' : 'Upcoming Follow-ups'} ({dueReminders.length})
                    </span>
                    <button
                      onClick={() => handleNav('dashboard')}
                      className="text-xs text-emerald-700 hover:underline font-medium"
                    >
                      {language === 'hi' ? 'सब देखें' : 'View All'}
                    </button>
                  </div>
                  <div className="mt-2 max-h-64 overflow-y-auto divide-y divide-slate-100 text-sm">
                    {dueReminders.length === 0 ? (
                      <p className="py-4 text-center text-xs text-slate-400">
                        {language === 'hi' ? 'कोई लंबित रिमाइंडर नहीं है।' : 'No pending follow-ups right now.'}
                      </p>
                    ) : (
                      dueReminders.map(rem => (
                        <div
                          key={rem.id}
                          className="py-2.5 cursor-pointer hover:bg-slate-50 px-1 rounded transition-colors"
                          onClick={() => {
                            onNavigate('complaint-detail', rem.complaintId);
                            setShowRemindersDropdown(false);
                          }}
                        >
                          <div className="flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs font-medium text-slate-900 leading-tight">
                                {rem.message}
                              </p>
                              <p className="text-[11px] text-slate-500 mt-1">
                                Re: {rem.complaintTitle.substring(0, 30)}...
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Primary Report CTA */}
            <button
              id="nav-quick-report-btn"
              onClick={() => handleNav('new-complaint')}
              className="bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 shadow-sm transition-all hover:shadow"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">
                {language === 'hi' ? 'शिकायत दर्ज करें' : 'Track New Issue'}
              </span>
              <span className="sm:hidden">{language === 'hi' ? 'दर्ज करें' : 'Track'}</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 py-3 space-y-1">
            <button
              onClick={() => handleNav('home')}
              className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-2"
            >
              <Home className="w-4 h-4 text-emerald-700" />
              {language === 'hi' ? 'होम' : 'Home'}
            </button>
            <button
              onClick={() => handleNav('dashboard')}
              className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100 flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4 text-emerald-700" />
                {language === 'hi' ? 'मेरी शिकायतें' : 'My Complaints & Tracker'}
              </span>
              {activeComplaintsCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-700 text-white">
                  {activeComplaintsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => handleNav('new-complaint')}
              className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-emerald-700" />
              {language === 'hi' ? 'नई शिकायत दर्ज करें' : 'Record New Complaint'}
            </button>
            <button
              onClick={() => handleNav('explore')}
              className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-2"
            >
              <Search className="w-4 h-4 text-emerald-700" />
              {language === 'hi' ? 'समुदायिक मुद्दे (मैप)' : 'Explore Community Map'}
            </button>
            <button
              onClick={() => handleNav('help')}
              className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-emerald-700" />
              {language === 'hi' ? 'सरकारी डायरेक्टरी' : 'Official Help Directory'}
            </button>
            <button
              onClick={() => handleNav('admin')}
              className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              {language === 'hi' ? 'एडमिन मॉडरेशन' : 'Admin Moderation'}
            </button>
            <button
              onClick={() => handleNav('settings')}
              className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              {language === 'hi' ? 'गोपनीयता व डेटा सेटिंग' : 'Privacy & Data Controls'}
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
