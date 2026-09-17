import {
  Complaint,
  ComplaintEvent,
  ComplaintStatus,
  ModerationAction,
  PublicReport,
  Reminder,
  UserProfile,
  UserRole,
  VolunteerProfile,
  VolunteerTask,
  SavedItem,
  AppNotification,
  ComplaintNote
} from '../types';
import { INITIAL_COMPLAINTS, INITIAL_PUBLIC_REPORTS } from '../data/mockInitialData';
import { INITIAL_VOLUNTEER_TASKS } from '../data/mockVolunteerData';

const COMPLAINTS_KEY = 'civicfix_complaints_v1';
const PUBLIC_REPORTS_KEY = 'civicfix_public_reports_v1';
const USER_PROFILE_KEY = 'civicfix_profile_v1';
const MODERATION_ACTIONS_KEY = 'civicfix_moderation_v1';
const CONFIRMED_REPORTS_KEY = 'civicfix_user_confirmations_v1';
const AUTH_SESSION_KEY = 'civicfix_session_v1';
const ACCOUNTS_KEY = 'civicfix_accounts_v1';
const VOLUNTEER_TASKS_KEY = 'civicfix_volunteer_tasks_v1';
const SAVED_ITEMS_KEY = 'civicfix_saved_items_v1';
const NOTIFICATIONS_KEY = 'civicfix_notifications_v1';

export interface StoredAccount {
  id: string;
  email: string;
  passwordHash: string; // Plain/hash for simulated auth
  profile: UserProfile;
}

export interface AuthSession {
  user: UserProfile;
  token: string;
  expires_at: string;
}

const DEFAULT_ACCOUNTS: StoredAccount[] = [
  {
    id: 'user-001',
    email: 'citizen@example.in',
    passwordHash: 'password123',
    profile: {
      id: 'user-001',
      display_name: 'Aarav Sharma',
      email: 'citizen@example.in',
      phone: '+91 98765 43210',
      city: 'Bengaluru',
      state: 'Karnataka',
      role: 'user',
      preferred_language: 'en',
      created_at: '2026-09-01T10:00:00.000Z'
    }
  },
  {
    id: 'vol-001',
    email: 'volunteer@civicfix.in',
    passwordHash: 'password123',
    profile: {
      id: 'vol-001',
      display_name: 'Priya Patel',
      email: 'volunteer@civicfix.in',
      phone: '+91 98765 11223',
      city: 'Bengaluru',
      state: 'Karnataka',
      role: 'volunteer',
      preferred_language: 'en',
      created_at: '2026-09-05T08:30:00.000Z',
      volunteer_profile: {
        user_id: 'vol-001',
        verification_status: 'pending',
        locality: 'Indiranagar & Koramangala',
        organization: 'Bengaluru Civic Action Group',
        motivation: 'Committed to verifying citizen complaints and partnering with municipal ward engineers for swift resolutions.',
        availability: 'Weekends & weekday evenings (10 hrs/week)',
        languages: ['English', 'Kannada', 'Hindi'],
        interests: ['Roads', 'Water', 'Sanitation', 'Street Lighting', 'Drainage'],
        created_at: '2026-09-05T08:30:00.000Z',
        updated_at: '2026-09-16T10:00:00.000Z'
      }
    }
  },
  {
    id: 'mod-001',
    email: 'moderator@civicfix.in',
    passwordHash: 'password123',
    profile: {
      id: 'mod-001',
      display_name: 'Suresh Kumar',
      email: 'moderator@civicfix.in',
      phone: '+91 98765 99887',
      city: 'Bengaluru',
      state: 'Karnataka',
      role: 'moderator',
      preferred_language: 'en',
      created_at: '2026-08-15T12:00:00.000Z'
    }
  }
];

export function getStoredAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Could not read accounts from storage', e);
  }
  saveAccounts(DEFAULT_ACCOUNTS);
  return DEFAULT_ACCOUNTS;
}

export function saveAccounts(accounts: StoredAccount[]): void {
  try {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch (e) {
    console.error('Error saving accounts', e);
  }
}

// ----------------------------------------------------------------------------
// SESSION MANAGEMENT
// ----------------------------------------------------------------------------
export function getStoredSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(AUTH_SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as AuthSession;
    if (new Date(session.expires_at).getTime() <= Date.now()) {
      clearSession();
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function saveSession(
  sessionOrProfile: AuthSession | UserProfile,
  role?: UserRole
): void {
  try {
    let session: AuthSession;
    if ('expires_at' in sessionOrProfile) {
      session = sessionOrProfile;
    } else {
      const user = { ...sessionOrProfile, role: role || sessionOrProfile.role || 'user' };
      session = {
        user,
        token: `token_${user.id}_${Date.now()}`,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      };
    }
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
    saveProfile(session.user);
  } catch (e) {
    console.error('Error saving auth session', e);
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(AUTH_SESSION_KEY);
  } catch (e) {
    console.error('Error clearing auth session', e);
  }
}

export function authenticate(email: string, password: string): { success: boolean; session?: AuthSession; error?: string } {
  const accounts = getStoredAccounts();
  const normalizedEmail = email.trim().toLowerCase();
  const account = accounts.find(a => a.email.toLowerCase() === normalizedEmail);

  if (!account) {
    return { success: false, error: 'Incorrect email or password.' };
  }

  if (account.passwordHash !== password) {
    return { success: false, error: 'Incorrect email or password.' };
  }

  // Create valid 30-day session
  const session: AuthSession = {
    user: account.profile,
    token: `token_${account.id}_${Date.now()}`,
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  };

  saveSession(session);
  return { success: true, session };
}

export function registerAccount(data: {
  fullName: string;
  email: string;
  password: string;
  role: 'user' | 'volunteer';
  phone?: string;
  city?: string;
  state?: string;
  locality?: string;
  motivation?: string;
  organization?: string;
  interests?: string[];
  languages?: string[];
  availability?: string;
}): { success: boolean; session?: AuthSession; error?: string } {
  const accounts = getStoredAccounts();
  const normalizedEmail = data.email.trim().toLowerCase();

  if (accounts.some(a => a.email.toLowerCase() === normalizedEmail)) {
    return { success: false, error: 'An account with this email address already exists.' };
  }

  const newId = `${data.role === 'volunteer' ? 'vol' : 'user'}_${Date.now()}`;
  let volunteerProfile: VolunteerProfile | undefined;

  if (data.role === 'volunteer') {
    volunteerProfile = {
      user_id: newId,
      verification_status: 'pending',
      locality: data.locality || '',
      motivation: data.motivation || '',
      organization: data.organization || '',
      interests: data.interests || ['General Civic Issues'],
      languages: data.languages || ['English'],
      availability: data.availability || 'Flexible',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  const newProfile: UserProfile = {
    id: newId,
    display_name: data.fullName.trim(),
    email: normalizedEmail,
    phone: data.phone?.trim() || undefined,
    city: data.city?.trim() || 'Bengaluru',
    state: data.state?.trim() || 'Karnataka',
    role: data.role,
    preferred_language: 'en',
    created_at: new Date().toISOString(),
    volunteer_profile: volunteerProfile
  };

  const newAccount: StoredAccount = {
    id: newId,
    email: normalizedEmail,
    passwordHash: data.password,
    profile: newProfile
  };

  const updatedAccounts = [...accounts, newAccount];
  saveAccounts(updatedAccounts);

  const session: AuthSession = {
    user: newProfile,
    token: `token_${newId}_${Date.now()}`,
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  };

  saveSession(session);
  return { success: true, session };
}

// ----------------------------------------------------------------------------
// VOLUNTEER TASKS
// ----------------------------------------------------------------------------
export function getStoredVolunteerTasks(): VolunteerTask[] {
  try {
    const raw = localStorage.getItem(VOLUNTEER_TASKS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Could not read volunteer tasks from storage', e);
  }
  saveVolunteerTasks(INITIAL_VOLUNTEER_TASKS);
  return INITIAL_VOLUNTEER_TASKS;
}

export function saveVolunteerTasks(tasks: VolunteerTask[]): void {
  try {
    localStorage.setItem(VOLUNTEER_TASKS_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.error('Error saving volunteer tasks', e);
  }
}

export function updateVolunteerTaskChecklist(
  taskId: string,
  checklistId: string
): VolunteerTask[] {
  const tasks = getStoredVolunteerTasks();
  const task = tasks.find(t => t.id === taskId);
  if (task) {
    task.checklist = task.checklist.map(c =>
      c.id === checklistId ? { ...c, completed: !c.completed } : c
    );
    const allDone = task.checklist.every(c => c.completed);
    task.status = allDone ? 'completed' : 'in_progress';
    saveVolunteerTasks(tasks);
  }
  return tasks;
}

export const getCurrentSession = getStoredSession;
export const saveStoredProfile = saveProfile;
export const saveStoredVolunteerTasks = saveVolunteerTasks;

export function updateVolunteerTask(
  taskId: string,
  updates: Partial<VolunteerTask>
): VolunteerTask | null {
  const tasks = getStoredVolunteerTasks();
  const index = tasks.findIndex(t => t.id === taskId);
  if (index === -1) return null;

  const updated = { ...tasks[index], ...updates };
  tasks[index] = updated;
  saveVolunteerTasks(tasks);
  return updated;
}

export function addVolunteerVerificationEvent(
  complaintId: string,
  volunteerName: string,
  notes: string,
  newStatus?: ComplaintStatus
): ComplaintEvent | null {
  const eventData: Omit<ComplaintEvent, 'id' | 'complaint_id' | 'created_at'> = {
    event_type: 'follow_up',
    old_status: 'in_progress',
    new_status: newStatus || 'in_progress',
    note: `[Volunteer Verification by ${volunteerName}]: ${notes}`,
    source_label: 'Community confirmed',
    occurred_at: new Date().toISOString()
  };

  return addComplaintEvent(complaintId, eventData);
}

// ----------------------------------------------------------------------------
// USER PROFILE
// ----------------------------------------------------------------------------
export function getStoredProfile(): UserProfile {
  const session = getStoredSession();
  if (session && session.user) {
    return session.user;
  }
  try {
    const raw = localStorage.getItem(USER_PROFILE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Could not read user profile from storage', e);
  }
  const defaultProfile: UserProfile = DEFAULT_ACCOUNTS[0].profile;
  saveProfile(defaultProfile);
  return defaultProfile;
}

export function saveProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
    // Update session if user IDs match
    const session = getStoredSession();
    if (session && session.user.id === profile.id) {
      session.user = profile;
      localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
    }
  } catch (e) {
    console.error('Error saving user profile', e);
  }
}

export function getStoredComplaints(): Complaint[] {
  try {
    const raw = localStorage.getItem(COMPLAINTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Could not read complaints from storage', e);
  }
  saveComplaints(INITIAL_COMPLAINTS);
  return INITIAL_COMPLAINTS;
}

export function saveComplaints(complaints: Complaint[]): void {
  try {
    localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(complaints));
  } catch (e) {
    console.error('Error saving complaints', e);
  }
}

export function getComplaintById(id: string): Complaint | undefined {
  const all = getStoredComplaints();
  return all.find(c => c.id === id);
}

export function createComplaint(
  complaintData: Omit<Complaint, 'id' | 'created_at' | 'updated_at' | 'events' | 'reminders' | 'attachments'> & {
    initial_event_note?: string;
    reminder_days?: number;
    photo_file?: { name: string; type: string; size: number; data_url: string };
  }
): Complaint {
  const all = getStoredComplaints();
  const id = 'cf-comp-' + Math.random().toString(36).substring(2, 9);
  const now = new Date().toISOString();

  const attachments = complaintData.photo_file
    ? [
        {
          id: 'att-' + Math.random().toString(36).substring(2, 7),
          storage_path: 'local/' + complaintData.photo_file.name,
          original_name: complaintData.photo_file.name,
          mime_type: complaintData.photo_file.type,
          file_size_bytes: complaintData.photo_file.size,
          data_url: complaintData.photo_file.data_url,
          created_at: now
        }
      ]
    : [];

  const initialEvent: ComplaintEvent = {
    id: 'ev-' + Math.random().toString(36).substring(2, 8),
    complaint_id: id,
    event_type: 'created',
    note: complaintData.initial_event_note || 'Issue registered in CivicFix personal tracker.',
    source_label: 'User reported',
    occurred_at: now,
    created_at: now
  };

  const reminders: Reminder[] = [];
  let nextFollowUp: string | null = null;
  if (complaintData.reminder_days && complaintData.reminder_days > 0) {
    const remindDate = new Date(Date.now() + complaintData.reminder_days * 24 * 60 * 60 * 1000).toISOString();
    nextFollowUp = remindDate;
    reminders.push({
      id: 'rem-' + Math.random().toString(36).substring(2, 8),
      complaint_id: id,
      remind_at: remindDate,
      message: `Follow up on complaint "${complaintData.title.substring(0, 40)}" with ${complaintData.authority_name || 'authority'}.`,
      completed_at: null,
      created_at: now
    });
  }

  let publicReportId: string | undefined = undefined;
  if (complaintData.is_public_summary_shared) {
    const pubId = 'pub-rep-' + Math.random().toString(36).substring(2, 8);
    publicReportId = pubId;
    const newPublicReport: PublicReport = {
      id: pubId,
      complaint_id: id,
      user_id: complaintData.user_id,
      public_title: complaintData.title,
      public_description: complaintData.description || 'Community issue reported via CivicFix.',
      category: complaintData.category,
      approximate_location: complaintData.locality
        ? `${complaintData.locality}, ${complaintData.district || ''} (${complaintData.state_name || 'India'})`
        : 'Approximate neighborhood',
      state_code: complaintData.state_code,
      district: complaintData.district,
      latitude: complaintData.latitude ?? undefined,
      longitude: complaintData.longitude ?? undefined,
      moderation_status: 'pending', // Follows blueprint: requires moderation before appearing in Explore
      confirmations_count: 1,
      user_confirmed: true,
      created_at: now,
      updated_at: now,
      photo_url: attachments[0]?.data_url
    };
    savePublicReports([newPublicReport, ...getStoredPublicReports()]);
  }

  const newComplaint: Complaint = {
    id,
    user_id: complaintData.user_id,
    title: complaintData.title,
    description: complaintData.description,
    category: complaintData.category,
    status: complaintData.status,
    authority_name: complaintData.authority_name,
    official_reference: complaintData.official_reference,
    official_portal_url: complaintData.official_portal_url,
    state_code: complaintData.state_code,
    state_name: complaintData.state_name,
    district: complaintData.district,
    locality: complaintData.locality,
    latitude: complaintData.latitude,
    longitude: complaintData.longitude,
    next_follow_up_at: nextFollowUp,
    submitted_at: complaintData.submitted_at || (complaintData.status !== 'draft' ? now : null),
    resolved_at: complaintData.status === 'resolved' ? now : null,
    created_at: now,
    updated_at: now,
    attachments,
    events: [initialEvent],
    reminders,
    is_public_summary_shared: complaintData.is_public_summary_shared,
    public_report_id: publicReportId
  };

  const updatedList = [newComplaint, ...all];
  saveComplaints(updatedList);
  return newComplaint;
}

export function updateComplaint(id: string, updates: Partial<Complaint>): Complaint | undefined {
  const all = getStoredComplaints();
  const idx = all.findIndex(c => c.id === id);
  if (idx === -1) return undefined;

  const now = new Date().toISOString();
  const existing = all[idx];
  const updated: Complaint = {
    ...existing,
    ...updates,
    updated_at: now
  };

  all[idx] = updated;
  saveComplaints(all);
  return updated;
}

export function deleteComplaint(id: string): boolean {
  const all = getStoredComplaints();
  const filtered = all.filter(c => c.id !== id);
  if (filtered.length === all.length) return false;
  saveComplaints(filtered);

  // Also remove corresponding public report if any
  const pubs = getStoredPublicReports();
  const filteredPubs = pubs.filter(p => p.complaint_id !== id);
  savePublicReports(filteredPubs);

  return true;
}

export function addComplaintEvent(
  complaintId: string,
  eventData: Omit<ComplaintEvent, 'id' | 'complaint_id' | 'created_at'>
): ComplaintEvent | undefined {
  const all = getStoredComplaints();
  const complaint = all.find(c => c.id === complaintId);
  if (!complaint) return undefined;

  const now = new Date().toISOString();
  const newEvent: ComplaintEvent = {
    ...eventData,
    id: 'ev-' + Math.random().toString(36).substring(2, 8),
    complaint_id: complaintId,
    created_at: now
  };

  const updatedEvents = [...complaint.events, newEvent];
  const updates: Partial<Complaint> = {
    events: updatedEvents,
    updated_at: now
  };

  if (eventData.new_status) {
    updates.status = eventData.new_status;
    if (eventData.new_status === 'resolved') {
      updates.resolved_at = now;
      updates.next_follow_up_at = null;
    } else if (eventData.new_status === 'reopened') {
      updates.resolved_at = null;
    }
  }

  updateComplaint(complaintId, updates);
  return newEvent;
}

export function addReminder(
  complaintId: string,
  remindAt: string,
  message: string
): Reminder | undefined {
  const all = getStoredComplaints();
  const complaint = all.find(c => c.id === complaintId);
  if (!complaint) return undefined;

  const newReminder: Reminder = {
    id: 'rem-' + Math.random().toString(36).substring(2, 8),
    complaint_id: complaintId,
    remind_at: remindAt,
    message,
    completed_at: null,
    created_at: new Date().toISOString()
  };

  const updatedReminders = [...complaint.reminders, newReminder];
  updateComplaint(complaintId, {
    reminders: updatedReminders,
    next_follow_up_at: remindAt
  });

  return newReminder;
}

export function toggleReminderCompleted(complaintId: string, reminderId: string): boolean {
  const all = getStoredComplaints();
  const complaint = all.find(c => c.id === complaintId);
  if (!complaint) return false;

  const updatedReminders = complaint.reminders.map(r => {
    if (r.id === reminderId) {
      return {
        ...r,
        completed_at: r.completed_at ? null : new Date().toISOString()
      };
    }
    return r;
  });

  const nextActive = updatedReminders.find(r => !r.completed_at);

  updateComplaint(complaintId, {
    reminders: updatedReminders,
    next_follow_up_at: nextActive ? nextActive.remind_at : null
  });

  return true;
}

// Public reports storage & moderation
export function getStoredPublicReports(): PublicReport[] {
  try {
    const raw = localStorage.getItem(PUBLIC_REPORTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Could not read public reports from storage', e);
  }
  savePublicReports(INITIAL_PUBLIC_REPORTS);
  return INITIAL_PUBLIC_REPORTS;
}

export function savePublicReports(reports: PublicReport[]): void {
  try {
    localStorage.setItem(PUBLIC_REPORTS_KEY, JSON.stringify(reports));
  } catch (e) {
    console.error('Error saving public reports', e);
  }
}

export function toggleCommunityConfirmation(reportId: string): { confirmed: boolean; count: number } {
  const all = getStoredPublicReports();
  const idx = all.findIndex(r => r.id === reportId);
  if (idx === -1) return { confirmed: false, count: 0 };

  const report = all[idx];
  let confirmedIds: string[] = [];
  try {
    const raw = localStorage.getItem(CONFIRMED_REPORTS_KEY);
    if (raw) confirmedIds = JSON.parse(raw);
  } catch {}

  const isCurrentlyConfirmed = confirmedIds.includes(reportId);
  let newConfirmedIds: string[];
  let newCount: number;

  if (isCurrentlyConfirmed) {
    newConfirmedIds = confirmedIds.filter(id => id !== reportId);
    newCount = Math.max(0, report.confirmations_count - 1);
  } else {
    newConfirmedIds = [...confirmedIds, reportId];
    newCount = report.confirmations_count + 1;
  }

  localStorage.setItem(CONFIRMED_REPORTS_KEY, JSON.stringify(newConfirmedIds));
  all[idx] = {
    ...report,
    confirmations_count: newCount,
    user_confirmed: !isCurrentlyConfirmed,
    updated_at: new Date().toISOString()
  };
  savePublicReports(all);

  return { confirmed: !isCurrentlyConfirmed, count: newCount };
}

export function moderatePublicReport(
  reportId: string,
  action: 'approve' | 'reject' | 'hide' | 'restore',
  reason?: string
): boolean {
  const all = getStoredPublicReports();
  const idx = all.findIndex(r => r.id === reportId);
  if (idx === -1) return false;

  const statusMap = {
    approve: 'approved',
    reject: 'rejected',
    hide: 'hidden',
    restore: 'approved'
  } as const;

  all[idx] = {
    ...all[idx],
    moderation_status: statusMap[action],
    updated_at: new Date().toISOString()
  };
  savePublicReports(all);

  // Save audit action
  try {
    const auditRaw = localStorage.getItem(MODERATION_ACTIONS_KEY);
    const audits: ModerationAction[] = auditRaw ? JSON.parse(auditRaw) : [];
    const newAudit: ModerationAction = {
      id: 'mod-' + Math.random().toString(36).substring(2, 7),
      moderator_id: 'moderator-admin',
      public_report_id: reportId,
      action,
      reason: reason || `Manual moderation action: ${action}`,
      created_at: new Date().toISOString()
    };
    localStorage.setItem(MODERATION_ACTIONS_KEY, JSON.stringify([newAudit, ...audits]));
  } catch {}

  return true;
}

export function getModerationAudits(): ModerationAction[] {
  try {
    const raw = localStorage.getItem(MODERATION_ACTIONS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

// Data Export & Erase (DPDP Act compliance)
export function exportAllUserData(): string {
  const complaints = getStoredComplaints();
  const profile = getStoredProfile();
  const exportPayload = {
    platform: 'CivicFix',
    export_generated_at: new Date().toISOString(),
    profile,
    complaints_count: complaints.length,
    complaints: complaints.map(c => ({
      id: c.id,
      title: c.title,
      description: c.description,
      category: c.category,
      status: c.status,
      authority_name: c.authority_name,
      official_reference: c.official_reference,
      official_portal_url: c.official_portal_url,
      locality: c.locality,
      district: c.district,
      state_name: c.state_name,
      submitted_at: c.submitted_at,
      resolved_at: c.resolved_at,
      events: c.events,
      reminders: c.reminders
    }))
  };
  return JSON.stringify(exportPayload, null, 2);
}

export function eraseAllUserData(): void {
  localStorage.removeItem(COMPLAINTS_KEY);
  localStorage.removeItem(PUBLIC_REPORTS_KEY);
  localStorage.removeItem(USER_PROFILE_KEY);
  localStorage.removeItem(MODERATION_ACTIONS_KEY);
  localStorage.removeItem(CONFIRMED_REPORTS_KEY);
  localStorage.removeItem(SAVED_ITEMS_KEY);
  localStorage.removeItem(NOTIFICATIONS_KEY);
}

// ---------------------------------------------------------------------------
// SAVED ITEMS (Official channels, public reports, resources)
// ---------------------------------------------------------------------------
const DEFAULT_SAVED_ITEMS: SavedItem[] = [
  {
    id: 'save-1',
    type: 'channel',
    item_id: 'mcd-311',
    title: 'MCD 311 Citizen Services Portal',
    category: 'Civic Grievance',
    subtitle: 'Municipal Corporation of Delhi - Street Lighting, Sanitation, Roads',
    url: 'https://mcdonline.nic.in',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'save-2',
    type: 'channel',
    item_id: 'bbmp-sahaaya',
    title: 'BBMP Sahaaya 2.0 Grievance Redressal',
    category: 'Civic Grievance',
    subtitle: 'Bruhat Bengaluru Mahanagara Palike official portal',
    url: 'https://bbmpgov.in',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'save-3',
    type: 'report',
    item_id: 'pub-rep-001',
    title: 'Hazardous deep pothole on Ring Road near Lajpat Nagar Flyover',
    category: 'Roads',
    subtitle: 'South Delhi - 14 community confirmations',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'save-4',
    type: 'resource',
    item_id: 'rti-civic-guide',
    title: 'Citizen Right to Service & CPGRAMS Escalation SOP',
    category: 'Civic Guide',
    subtitle: 'Step-by-step guide to appealing delayed civic complaints to municipal commissioners',
    url: 'https://cpgrams.gov.in',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export function getStoredSavedItems(): SavedItem[] {
  try {
    const raw = localStorage.getItem(SAVED_ITEMS_KEY);
    if (!raw) {
      localStorage.setItem(SAVED_ITEMS_KEY, JSON.stringify(DEFAULT_SAVED_ITEMS));
      return DEFAULT_SAVED_ITEMS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_SAVED_ITEMS;
  }
}

export function saveStoredSavedItems(items: SavedItem[]): void {
  try {
    localStorage.setItem(SAVED_ITEMS_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save saved items', e);
  }
}

export function toggleSavedItem(item: SavedItem): boolean {
  const current = getStoredSavedItems();
  const index = current.findIndex(i => i.item_id === item.item_id && i.type === item.type);
  if (index >= 0) {
    current.splice(index, 1);
    saveStoredSavedItems(current);
    return false; // un-saved
  } else {
    current.unshift(item);
    saveStoredSavedItems(current);
    return true; // saved
  }
}

export function isItemSaved(itemId: string, type?: string): boolean {
  const current = getStoredSavedItems();
  return current.some(i => i.item_id === itemId && (!type || i.type === type));
}

// ---------------------------------------------------------------------------
// NOTIFICATIONS (Reminders, Complaint updates, Community, System)
// ---------------------------------------------------------------------------
const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    category: 'reminder',
    title: 'Follow-up due today',
    message: 'Inspection follow-up due for Streetlight not working complaint.',
    complaint_id: 'cf-comp-001',
    read: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'notif-2',
    category: 'complaint_update',
    title: 'Complaint status updated',
    message: 'Road pothole repair ticket acknowledged by Municipal Corporation.',
    complaint_id: 'cf-comp-001',
    read: false,
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'notif-3',
    category: 'community',
    title: 'Community issue confirmed',
    message: 'A neighbor confirmed the Indiranagar garbage overflow report.',
    public_report_id: 'pub-rep-002',
    read: true,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'notif-4',
    category: 'system',
    title: 'Privacy & Data Export',
    message: 'Your personal complaint records are stored in private browser storage under DPDP compliance.',
    read: true,
    created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
  }
];

export function getStoredNotifications(): AppNotification[] {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY);
    if (!raw) {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(DEFAULT_NOTIFICATIONS));
      return DEFAULT_NOTIFICATIONS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_NOTIFICATIONS;
  }
}

export function saveStoredNotifications(notifs: AppNotification[]): void {
  try {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifs));
  } catch (e) {
    console.error('Failed to save notifications', e);
  }
}

export function markNotificationRead(id: string): void {
  const notifs = getStoredNotifications();
  const updated = notifs.map(n => n.id === id ? { ...n, read: true } : n);
  saveStoredNotifications(updated);
}

export function markAllNotificationsRead(): void {
  const notifs = getStoredNotifications();
  const updated = notifs.map(n => ({ ...n, read: true }));
  saveStoredNotifications(updated);
}

export function addNotification(notif: Omit<AppNotification, 'id' | 'created_at' | 'read'>): void {
  const notifs = getStoredNotifications();
  const newNotif: AppNotification = {
    ...notif,
    id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    read: false,
    created_at: new Date().toISOString()
  };
  saveStoredNotifications([newNotif, ...notifs]);
}

// ---------------------------------------------------------------------------
// COMPLAINT NOTES & EVIDENCE HELPERS
// ---------------------------------------------------------------------------
export function addComplaintNote(complaintId: string, noteText: string): ComplaintNote {
  const complaints = getStoredComplaints();
  const comp = complaints.find(c => c.id === complaintId);
  const newNote: ComplaintNote = {
    id: `note-${Date.now()}`,
    note: noteText.trim(),
    created_at: new Date().toISOString()
  };
  if (comp) {
    if (!comp.notes) comp.notes = [];
    comp.notes.unshift(newNote);
    saveComplaints(complaints);
  }
  return newNote;
}

export function addComplaintAttachment(complaintId: string, attachment: any): void {
  const complaints = getStoredComplaints();
  const comp = complaints.find(c => c.id === complaintId);
  if (comp) {
    comp.attachments.push(attachment);
    saveComplaints(complaints);
  }
}
