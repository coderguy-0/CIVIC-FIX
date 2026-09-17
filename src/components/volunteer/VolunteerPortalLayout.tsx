import React, { useState } from 'react';
import { VolunteerHeader } from './VolunteerHeader';
import { VolunteerSidebar } from './VolunteerSidebar';
import { VolunteerMobileNav } from './VolunteerMobileNav';
import { VolunteerDashboardView } from './VolunteerDashboardView';
import { VolunteerTasksView } from './VolunteerTasksView';
import { VolunteerActivityView } from './VolunteerActivityView';
import { VolunteerProfileView } from './VolunteerProfileView';
import { Complaint, ComplaintStatus, UserProfile, VolunteerTask } from '../../types';

export interface VolunteerPortalLayoutProps {
  profile: UserProfile;
  complaints: Complaint[];
  tasks: VolunteerTask[];
  onLogout: () => void;
  onToggleVerificationStatus: () => void;
  onAddVerificationEvent: (complaintId: string, notes: string, status?: ComplaintStatus) => void;
  onToggleChecklist: (taskId: string, checklistId: string) => void;
  currentSubView?: string;
  onNavigateSubView?: (view: string) => void;
}

export const VolunteerPortalLayout: React.FC<VolunteerPortalLayoutProps> = ({
  profile,
  complaints,
  tasks,
  onLogout,
  onToggleVerificationStatus,
  onAddVerificationEvent,
  onToggleChecklist,
  currentSubView = 'dashboard',
  onNavigateSubView
}) => {
  const [internalView, setInternalView] = useState<string>(currentSubView);

  const activeView = onNavigateSubView ? currentSubView : internalView;

  const handleNavigate = (view: string) => {
    if (view === 'logout') {
      onLogout();
      return;
    }
    if (onNavigateSubView) {
      onNavigateSubView(view);
    } else {
      setInternalView(view);
    }
  };

  const openTasksCount = tasks.filter(t => t.status !== 'completed').length;

  return (
    <div className="min-h-screen bg-[#f7faf8] flex flex-col font-sans text-[#17201d]">
      {/* Top Volunteer Header */}
      <VolunteerHeader
        profile={profile}
        tasks={tasks}
        onNavigate={handleNavigate}
        onLogout={onLogout}
        onToggleVerificationStatus={onToggleVerificationStatus}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-row w-full">
        {/* Desktop Volunteer Sidebar */}
        <VolunteerSidebar
          currentView={activeView}
          onNavigate={handleNavigate}
          onLogout={onLogout}
          openTasksCount={openTasksCount}
          assignedIssuesCount={complaints.length}
        />

        {/* Content Region */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-24 lg:pb-12">
          {(activeView === 'dashboard' || activeView === 'assigned' || activeView === 'nearby' || activeView === 'verification') && (
            <VolunteerDashboardView
              profile={profile}
              complaints={complaints}
              tasks={tasks}
              onToggleVerificationStatus={onToggleVerificationStatus}
              onAddVerificationEvent={onAddVerificationEvent}
              onToggleChecklist={onToggleChecklist}
              onNavigate={handleNavigate}
            />
          )}

          {activeView === 'tasks' && (
            <VolunteerTasksView
              tasks={tasks}
              onToggleChecklist={onToggleChecklist}
              onNavigate={handleNavigate}
            />
          )}

          {activeView === 'activity' && (
            <VolunteerActivityView
              profile={profile}
              complaints={complaints}
              tasks={tasks}
            />
          )}

          {activeView === 'profile' && (
            <VolunteerProfileView
              profile={profile}
              onToggleVerificationStatus={onToggleVerificationStatus}
              onLogout={onLogout}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <VolunteerMobileNav
        currentView={activeView}
        onNavigate={handleNavigate}
        openTasksCount={openTasksCount}
      />
    </div>
  );
};
