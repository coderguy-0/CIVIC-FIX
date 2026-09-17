import React, { useEffect, useState, useCallback } from 'react';
import {
  createComplaint,
  deleteComplaint,
  getComplaintById,
  getModerationAudits,
  getStoredComplaints,
  getStoredProfile,
  getStoredPublicReports,
  moderatePublicReport,
  addComplaintEvent,
  addReminder,
  toggleCommunityConfirmation,
  toggleReminderCompleted,
  updateComplaint,
  getCurrentSession,
  saveSession,
  clearSession,
  getStoredVolunteerTasks,
  saveStoredVolunteerTasks,
  updateVolunteerTaskChecklist,
  saveStoredProfile
} from './lib/storage';
import {
  Complaint,
  ComplaintEvent,
  ComplaintStatus,
  ModerationAction,
  PublicReport,
  UserProfile,
  UserRole,
  VolunteerTask
} from './types';
import { Header } from './components/navigation/Header';
import { Sidebar } from './components/navigation/Sidebar';
import { MobileNav } from './components/navigation/MobileNav';

import { DashboardView } from './components/DashboardView';
import { ComplaintsListView } from './components/ComplaintsListView';
import { ComplaintDetailView } from './components/ComplaintDetailView';
import { ComplaintForm } from './components/complaints/ComplaintForm';
import { FollowUpsView } from './components/FollowUpsView';
import { RemindersView } from './components/RemindersView';
import { CivicMapView } from './components/CivicMapView';
import { ExploreView } from './components/ExploreView';
import { HelpDirectoryView } from './components/HelpDirectoryView';
import { MyPublicReportsView } from './components/MyPublicReportsView';
import { SavedView } from './components/SavedView';
import { NotificationsView } from './components/NotificationsView';
import { ProfileView } from './components/ProfileView';
import { AdminModerationView } from './components/AdminModerationView';
import { SettingsView } from './components/SettingsView';
import { GlobalSearchModal } from './components/navigation/GlobalSearchModal';

import { AuthPage } from './components/auth/AuthPage';
import { VolunteerPortalLayout } from './components/volunteer/VolunteerPortalLayout';
import { ShieldAlert, Users, Sparkles, ArrowRight } from 'lucide-react';

export default function App() {
  // Routing State
  // Paths: '/', '/auth/login', '/auth/signup', '/auth/forgot-password', '/auth/reset-password', '/app/user', '/app/volunteer'
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname;
      return p && p !== '' ? p : '/';
    }
    return '/';
  });

  // Active subview inside the portals
  const [userSubView, setUserSubView] = useState<string>('dashboard');
  const [volunteerSubView, setVolunteerSubView] = useState<string>('dashboard');
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);

  // Authentication State
  const [session, setSession] = useState<{ user: UserProfile; role: UserRole } | null>(() => {
    return getCurrentSession();
  });

  // App Data
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [publicReports, setPublicReports] = useState<PublicReport[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>(getStoredProfile());
  const [volunteerTasks, setVolunteerTasks] = useState<VolunteerTask[]>([]);
  const [moderationAudits, setModerationAudits] = useState<ModerationAction[]>([]);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Security flash message for cross-portal unauthorized redirects
  const [securityNotice, setSecurityNotice] = useState<string | null>(null);

  // Global search keyboard shortcut (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Synchronize browser URL
  const navigateToPath = useCallback((path: string, searchParams?: string) => {
    const fullUrl = searchParams ? `${path}?${searchParams}` : path;
    if (typeof window !== 'undefined' && window.location.pathname !== path) {
      window.history.pushState({}, '', fullUrl);
    }
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Listen to browser forward/back buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Load initial data
  useEffect(() => {
    const loadedComplaints = getStoredComplaints();
    const loadedPublicReports = getStoredPublicReports();
    const loadedProfile = getStoredProfile();
    const loadedTasks = getStoredVolunteerTasks();
    const loadedAudits = getModerationAudits();

    setComplaints(loadedComplaints);
    setPublicReports(loadedPublicReports);
    setUserProfile(loadedProfile);
    setVolunteerTasks(loadedTasks);
    setModerationAudits(loadedAudits);
    if (loadedProfile.preferred_language) {
      setLanguage(loadedProfile.preferred_language);
    }
  }, []);

  // Enforce Route Protection & Role Redirection
  useEffect(() => {
    // 1. If not authenticated, ensure visitor is on '/' or '/auth/*'
    if (!session) {
      if (currentPath.startsWith('/app/')) {
        navigateToPath('/auth/login');
      }
      return;
    }

    // 2. If visitor is on '/' or '/auth/*', redirect to their authorized portal
    if (currentPath === '/' || currentPath.startsWith('/auth')) {
      if (session.role === 'volunteer') {
        navigateToPath('/app/volunteer');
      } else {
        navigateToPath('/app/user');
      }
      return;
    }

    // 3. Strict Role-based access control:
    // If a standard Citizen tries to access '/app/volunteer'
    if (session.role === 'user' && currentPath.startsWith('/app/volunteer')) {
      setSecurityNotice('Access restricted: Citizens cannot access the Volunteer Portal.');
      navigateToPath('/app/user');
      const timer = setTimeout(() => setSecurityNotice(null), 6000);
      return () => clearTimeout(timer);
    }

    // If a Volunteer tries to access '/app/user'
    if (session.role === 'volunteer' && currentPath.startsWith('/app/user')) {
      setSecurityNotice('Access restricted: Volunteers must use the dedicated Volunteer Portal.');
      navigateToPath('/app/volunteer');
      const timer = setTimeout(() => setSecurityNotice(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [session, currentPath, navigateToPath]);

  // Auth Handlers
  const handleAuthSuccess = (profile: UserProfile, role: UserRole) => {
    saveSession(profile, role);
    setSession({ user: profile, role });
    setUserProfile(profile);
    setSecurityNotice(null);

    if (role === 'volunteer') {
      navigateToPath('/app/volunteer');
    } else {
      navigateToPath('/app/user');
    }
  };

  const handleLogout = () => {
    clearSession();
    setSession(null);
    navigateToPath('/auth/login');
  };

  // Citizen Portal Navigation
  const handleCitizenNavigate = (view: string, complaintId?: string) => {
    setUserSubView(view);
    if (complaintId) {
      setSelectedComplaintId(complaintId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Volunteer Portal Navigation
  const handleVolunteerNavigate = (view: string) => {
    setVolunteerSubView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle Volunteer Verification Status
  const handleToggleVolunteerVerification = () => {
    const currentStatus = userProfile.volunteer_profile?.verification_status;
    const newStatus = currentStatus === 'verified' ? 'pending' : 'verified';

    const updatedProfile: UserProfile = {
      ...userProfile,
      volunteer_profile: {
        ...(userProfile.volunteer_profile || {
          user_id: userProfile.id,
          verification_status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }),
        verification_status: newStatus,
        updated_at: new Date().toISOString()
      }
    };

    saveStoredProfile(updatedProfile);
    setUserProfile(updatedProfile);
    if (session) {
      saveSession(updatedProfile, session.role);
      setSession({ ...session, user: updatedProfile });
    }
  };

  // Volunteer Task Checklist Toggle
  const handleToggleVolunteerChecklist = (taskId: string, checklistId: string) => {
    const updated = updateVolunteerTaskChecklist(taskId, checklistId);
    setVolunteerTasks([...updated]);
  };

  // Volunteer Add Ground Verification / Follow-up Event
  const handleAddVolunteerVerificationEvent = (
    complaintId: string,
    notes: string,
    status?: ComplaintStatus
  ) => {
    addComplaintEvent(complaintId, {
      event_type: 'field_audit',
      note: `[Volunteer Ground Audit]: ${notes}`,
      source_label: `${userProfile.display_name} (Community Volunteer)`,
      occurred_at: new Date().toISOString()
    });

    if (status) {
      updateComplaint(complaintId, { status });
    }

    setComplaints(getStoredComplaints());
  };

  // Citizen Complaint Operations
  const handleCreateComplaint = (data: any): Complaint => {
    const newComplaint = createComplaint(data);
    const updatedComplaints = getStoredComplaints();
    setComplaints(updatedComplaints);
    setPublicReports(getStoredPublicReports());
    setSelectedComplaintId(newComplaint.id);
    setUserSubView('complaint-detail');
    return newComplaint;
  };

  const handleUpdateComplaint = (id: string, updates: Partial<Complaint>) => {
    updateComplaint(id, updates);
    setComplaints(getStoredComplaints());
  };

  const handleDeleteComplaint = (id: string) => {
    deleteComplaint(id);
    setComplaints(getStoredComplaints());
    setPublicReports(getStoredPublicReports());
    if (selectedComplaintId === id) {
      setSelectedComplaintId(null);
      setUserSubView('complaints');
    }
  };

  const handleAddEvent = (
    complaintId: string,
    eventData: Omit<ComplaintEvent, 'id' | 'complaint_id' | 'created_at'>
  ) => {
    addComplaintEvent(complaintId, eventData);
    setComplaints(getStoredComplaints());
  };

  const handleAddReminder = (complaintId: string, remindAt: string, message: string) => {
    addReminder(complaintId, remindAt, message);
    setComplaints(getStoredComplaints());
  };

  const handleToggleReminder = (complaintId: string, reminderId: string) => {
    toggleReminderCompleted(complaintId, reminderId);
    setComplaints(getStoredComplaints());
  };

  const handleToggleConfirmation = (reportId: string) => {
    toggleCommunityConfirmation(reportId);
    setPublicReports(getStoredPublicReports());
  };

  const handleModerate = (
    reportId: string,
    action: 'approve' | 'reject' | 'hide' | 'restore',
    reason?: string
  ) => {
    moderatePublicReport(reportId, action, reason);
    setPublicReports(getStoredPublicReports());
    setModerationAudits(getModerationAudits());
  };

  const handleResetApp = () => {
    setComplaints(getStoredComplaints());
    setPublicReports(getStoredPublicReports());
    setUserProfile(getStoredProfile());
    setModerationAudits([]);
    setUserSubView('dashboard');
  };

  // ============================================================================
  // VIEW RENDER 1: FIRST SCREEN AUTHENTICATION PAGE
  // ============================================================================
  // If not logged in, OR if the path is `/` or `/auth/*`, render the AuthPage.
  const isAuthRoute = !session || currentPath === '/' || currentPath.startsWith('/auth');

  if (isAuthRoute) {
    let initialMode: 'login' | 'signup' | 'forgot' | 'reset' = 'login';
    if (currentPath === '/auth/signup') initialMode = 'signup';
    else if (currentPath === '/auth/forgot-password') initialMode = 'forgot';
    else if (currentPath === '/auth/reset-password') initialMode = 'reset';

    return (
      <AuthPage
        initialMode={initialMode}
        onAuthSuccess={handleAuthSuccess}
        onNavigatePath={navigateToPath}
      />
    );
  }

  // ============================================================================
  // VIEW RENDER 2: VOLUNTEER WEBSITE EXPERIENCE (/app/volunteer/*)
  // ============================================================================
  if (session && session.role === 'volunteer') {
    return (
      <div className="relative">
        {/* Security / Cross-Portal Notice */}
        {securityNotice && (
          <div className="bg-[#fff0ee] border-b border-[#f5c6cb] px-4 py-2 text-xs font-semibold text-[#c0392b] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              <span>{securityNotice}</span>
            </div>
            <button
              onClick={() => setSecurityNotice(null)}
              className="text-xs font-bold text-[#c0392b] hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        <VolunteerPortalLayout
          profile={userProfile}
          complaints={complaints}
          tasks={volunteerTasks}
          onLogout={handleLogout}
          onToggleVerificationStatus={handleToggleVolunteerVerification}
          onAddVerificationEvent={handleAddVolunteerVerificationEvent}
          onToggleChecklist={handleToggleVolunteerChecklist}
          currentSubView={volunteerSubView}
          onNavigateSubView={handleVolunteerNavigate}
        />
      </div>
    );
  }

  // ============================================================================
  // VIEW RENDER 3: CITIZEN / USER WEBSITE EXPERIENCE (/app/user/*)
  // ============================================================================
  const selectedComplaint = complaints.find(c => c.id === selectedComplaintId);

  const followUpsCount = complaints.filter(
    c =>
      c.status !== 'resolved' &&
      c.status !== 'closed' &&
      (c.next_follow_up_at || (c.reminders && c.reminders.some(r => !r.completed_at)))
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f9f7] text-[#17201d] font-sans antialiased selection:bg-[#087f5b]/20 selection:text-[#087f5b]">
      {/* Security / Cross-Portal Notice */}
      {securityNotice && (
        <div className="bg-[#fff0ee] border-b border-[#f5c6cb] px-4 py-2 text-xs font-semibold text-[#c0392b] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            <span>{securityNotice}</span>
          </div>
          <button
            onClick={() => setSecurityNotice(null)}
            className="text-xs font-bold text-[#c0392b] hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Top Header with Notification Bell, Language Toggle & User Menu */}
      <Header
        profile={userProfile}
        complaints={complaints}
        currentView={userSubView}
        onNavigate={handleCitizenNavigate}
        onToggleReminder={handleToggleReminder}
        language={language}
        onToggleLanguage={setLanguage}
        onResetApp={handleResetApp}
        onLogout={handleLogout}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Container: Sidebar + Page Content */}
      <div className="flex-1 flex w-full max-w-7xl mx-auto">
        <Sidebar
          currentView={userSubView}
          onNavigate={handleCitizenNavigate}
          onLogout={handleLogout}
          followUpsCount={followUpsCount}
          complaintsCount={complaints.length}
        />

        <main className="flex-1 pb-24 lg:pb-8 min-w-0 overflow-y-auto">
          {/* Dashboard View (Home) */}
          {(userSubView === 'dashboard' || userSubView === 'home') && (
            <DashboardView
              complaints={complaints}
              onNavigate={handleCitizenNavigate}
              onAddFollowUp={(id, data) => {
                handleAddEvent(id, {
                  event_type: 'follow_up',
                  note: data.note,
                  source_label: data.sourceLabel,
                  occurred_at: new Date().toISOString()
                });
                if (data.newStatus) {
                  handleUpdateComplaint(id, { status: data.newStatus });
                }
              }}
              profile={userProfile}
              language={language}
            />
          )}

          {/* Complaints List View */}
          {userSubView === 'complaints' && (
            <ComplaintsListView
              complaints={complaints}
              onNavigate={handleCitizenNavigate}
              language={language}
            />
          )}

          {/* New Complaint 7-Step Wizard */}
          {userSubView === 'new-complaint' && (
            <div className="p-4 sm:p-6 lg:p-8">
              <ComplaintForm
                onCancel={() => handleCitizenNavigate('complaints')}
                onSubmit={handleCreateComplaint}
                language={language}
              />
            </div>
          )}

          {/* Complaint Detail View */}
          {userSubView === 'complaint-detail' && selectedComplaint && (
            <ComplaintDetailView
              complaint={selectedComplaint}
              onNavigate={handleCitizenNavigate}
              onAddEvent={handleAddEvent}
              onAddReminder={handleAddReminder}
              onToggleReminder={handleToggleReminder}
              onUpdateComplaint={handleUpdateComplaint}
              onDeleteComplaint={handleDeleteComplaint}
              language={language}
            />
          )}

          {/* Fallback if complaint detail is requested without selection */}
          {userSubView === 'complaint-detail' && !selectedComplaint && (
            <div className="p-8 text-center space-y-3">
              <p className="text-sm text-[#66736e]">Complaint not found.</p>
              <button
                onClick={() => handleCitizenNavigate('complaints')}
                className="text-xs font-semibold text-[#087f5b] underline"
              >
                Back to complaints
              </button>
            </div>
          )}

          {/* Reminders & Follow-up Center View */}
          {(userSubView === 'reminders' || userSubView === 'follow-ups') && (
            <RemindersView
              complaints={complaints}
              onNavigate={handleCitizenNavigate}
              onToggleReminder={handleToggleReminder}
              language={language}
            />
          )}

          {/* Civic Map View */}
          {userSubView === 'map' && (
            <CivicMapView
              publicReports={publicReports}
              onNavigate={handleCitizenNavigate}
              onToggleConfirmation={handleToggleConfirmation}
            />
          )}

          {/* Explore Community Issues View */}
          {userSubView === 'explore' && (
            <ExploreView
              publicReports={publicReports}
              onToggleConfirmation={handleToggleConfirmation}
              onNavigate={handleCitizenNavigate}
              language={language}
            />
          )}

          {/* Help Directory View */}
          {userSubView === 'help' && (
            <HelpDirectoryView
              onNavigate={handleCitizenNavigate}
              language={language}
            />
          )}

          {/* My Public Reports View */}
          {userSubView === 'my-reports' && (
            <MyPublicReportsView
              complaints={complaints}
              publicReports={publicReports}
              onNavigate={handleCitizenNavigate}
            />
          )}

          {/* Saved Items View */}
          {userSubView === 'saved' && (
            <SavedView
              onNavigate={handleCitizenNavigate}
            />
          )}

          {/* Notifications View */}
          {userSubView === 'notifications' && (
            <NotificationsView
              onNavigate={handleCitizenNavigate}
            />
          )}

          {/* My Profile View */}
          {userSubView === 'profile' && (
            <ProfileView
              profile={userProfile}
              onUpdateProfile={setUserProfile}
              onNavigate={handleCitizenNavigate}
            />
          )}

          {/* Admin Moderation Queue View */}
          {userSubView === 'admin' && (
            <AdminModerationView
              publicReports={publicReports}
              moderationAudits={moderationAudits}
              onModerate={handleModerate}
              language={language}
            />
          )}

          {/* Settings View */}
          {userSubView === 'settings' && (
            <SettingsView
              profile={userProfile}
              onUpdateProfile={setUserProfile}
              language={language}
              onToggleLanguage={setLanguage}
              onResetApp={handleResetApp}
            />
          )}
        </main>
      </div>

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        complaints={complaints}
        publicReports={publicReports}
        onNavigate={handleCitizenNavigate}
      />

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav
        currentView={userSubView}
        onNavigate={handleCitizenNavigate}
        followUpsCount={followUpsCount}
      />
    </div>
  );
}
