export type ComplaintCategory =
  | 'roads'
  | 'water'
  | 'sanitation'
  | 'street_lighting'
  | 'drainage'
  | 'electricity'
  | 'public_safety'
  | 'other';

export type ComplaintStatus =
  | 'draft'
  | 'prepared'
  | 'submitted'
  | 'acknowledged'
  | 'in_progress'
  | 'resolved'
  | 'reopened'
  | 'closed';

export type ComplaintEventType =
  | 'created'
  | 'status_changed'
  | 'follow_up'
  | 'field_audit'
  | 'authority_response'
  | 'evidence_added'
  | 'note_added'
  | 'reopened'
  | 'closed';

export type EventType =
  | 'created'
  | 'status_change'
  | 'note_added'
  | 'official_response'
  | 'reminder_set'
  | 'evidence_attached'
  | 'reopened'
  | 'closed'
  | ComplaintEventType;

export type SourceLabel =
  | 'User reported'
  | 'Document attached'
  | 'Community confirmed'
  | 'Official source linked'
  | 'Official integration'
  | string;

export interface Attachment {
  id: string;
  storage_path: string;
  original_name: string;
  mime_type: string;
  file_size_bytes: number;
  data_url?: string;
  created_at: string;
}

export interface ComplaintEvent {
  id: string;
  complaint_id: string;
  actor_id?: string;
  event_type: ComplaintEventType;
  old_status?: ComplaintStatus;
  new_status?: ComplaintStatus;
  note?: string;
  source_label: SourceLabel;
  occurred_at: string;
  created_at: string;
}

export interface Reminder {
  id: string;
  complaint_id: string;
  user_id?: string;
  remind_at: string;
  message: string;
  completed_at?: string | null;
  created_at: string;
}

export type IssueSeverity = 'low' | 'moderate' | 'high';

export type SubmissionChannel =
  | 'website'
  | 'app'
  | 'email'
  | 'phone'
  | 'in_person'
  | 'other';

export interface ComplaintNote {
  id: string;
  note: string;
  created_at: string;
}

export interface SavedItem {
  id: string;
  type: 'channel' | 'report' | 'resource';
  item_id: string;
  title: string;
  category?: string;
  subtitle?: string;
  url?: string;
  created_at: string;
}

export interface AppNotification {
  id: string;
  category: 'reminder' | 'complaint_update' | 'community' | 'system';
  title: string;
  message: string;
  complaint_id?: string;
  public_report_id?: string;
  read: boolean;
  created_at: string;
}

export interface Complaint {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  status: ComplaintStatus;
  severity?: IssueSeverity;
  authority_name?: string;
  official_reference?: string;
  official_portal_url?: string;
  submission_channel?: SubmissionChannel | string;
  authority_response?: string;
  state_code?: string;
  state_name?: string;
  district?: string;
  locality?: string;
  landmark?: string;
  latitude?: number | null;
  longitude?: number | null;
  next_follow_up_at?: string | null;
  submitted_at?: string | null;
  resolved_at?: string | null;
  created_at: string;
  updated_at: string;
  attachments: Attachment[];
  events: ComplaintEvent[];
  reminders: Reminder[];
  notes?: ComplaintNote[];
  is_public_summary_shared?: boolean;
  public_report_id?: string;
}

export type ModerationStatus = 'pending' | 'approved' | 'rejected' | 'hidden';

export interface PublicReport {
  id: string;
  complaint_id: string;
  user_id: string;
  public_title: string;
  public_description: string;
  category: ComplaintCategory;
  approximate_location: string;
  state_code?: string;
  district?: string;
  latitude?: number;
  longitude?: number;
  moderation_status: ModerationStatus;
  confirmations_count: number;
  user_confirmed?: boolean;
  created_at: string;
  updated_at: string;
  photo_url?: string;
}

export interface OfficialHelpChannel {
  id: string;
  authority_name: string;
  short_code: string;
  jurisdiction: string;
  state_code: string;
  state_name: string;
  categories: ComplaintCategory[];
  portal_url: string;
  helpline: string;
  whatsapp_grievance?: string;
  whatsapp?: string;
  level?: string;
  description?: string;
  sla_days?: number;
  filing_guide: string[];
  last_checked_date: string;
  verification_status: 'verified' | 'provisional';
  accepts_online_complaints: boolean;
  notes?: string;
}

export interface ModerationAction {
  id: string;
  moderator_id: string;
  public_report_id: string;
  action: 'approve' | 'reject' | 'hide' | 'restore';
  reason?: string;
  created_at: string;
}

export type UserRole = 'user' | 'volunteer' | 'moderator' | 'admin';

export type VolunteerVerificationStatus = 'pending' | 'verified' | 'rejected' | 'suspended';
export type VolunteerLevel = 'volunteer' | 'verified_volunteer' | 'community_lead' | 'moderator';
export type VolunteerAccountStatus = 'active' | 'paused' | 'suspended';

export type VolunteerContributionType =
  | 'PUBLIC_REPORT'
  | 'VERIFICATION'
  | 'FOLLOW_UP'
  | 'DUPLICATE_FLAG'
  | 'EVIDENCE'
  | 'SOURCE_SUGGESTION'
  | 'ISSUE_UPDATE'
  | 'CONTENT_FLAG'
  | 'DIRECTORY_CHECK';

export type VolunteerContributionStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'accepted'
  | 'needs_revision'
  | 'rejected';

export type VolunteerObservationOutcome =
  | 'confirmed'
  | 'not_observed'
  | 'changed'
  | 'resolved_looking'
  | 'cannot_verify';

export type VolunteerSourceLabel =
  | 'Volunteer Observation'
  | 'Community Confirmation'
  | 'Public Source'
  | 'Official Source Linked'
  | 'User Report';

export type VolunteerTaskWorkflowStatus =
  | 'assigned'
  | 'accepted'
  | 'in_progress'
  | 'evidence_added'
  | 'submitted'
  | 'reviewed'
  | 'completed';

export interface VolunteerContribution {
  id: string;
  volunteer_id: string;
  volunteer_name: string;
  public_report_id?: string;
  contribution_type: VolunteerContributionType;
  title: string;
  observation_note: string;
  observation_outcome?: VolunteerObservationOutcome;
  source_label: VolunteerSourceLabel;
  approximate_location: string;
  photo_url?: string;
  review_status: VolunteerContributionStatus;
  created_at: string;
  moderator_notes?: string;
}

export interface VolunteerCampaign {
  id: string;
  title: string;
  category: ComplaintCategory;
  goal: string;
  area: string;
  total_reports: number;
  verified_reports: number;
  pending_reports: number;
  user_tasks_completed: number;
  user_tasks_total: number;
  status: 'active' | 'completed' | 'upcoming';
  badge: string;
}

export interface DuplicateCandidate {
  id: string;
  report_a_id: string;
  report_a_title: string;
  report_a_area: string;
  report_a_category: ComplaintCategory;
  report_a_date: string;
  report_b_id: string;
  report_b_title: string;
  report_b_area: string;
  report_b_category: ComplaintCategory;
  report_b_date: string;
  similarity_score: number;
  similarity_factors: string[];
  status: 'pending' | 'duplicate' | 'different' | 'need_info';
  cluster_id?: string;
}

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  duration_min: number;
  category: string;
  key_rules: string[];
  completed: boolean;
}

export interface VolunteerNotification {
  id: string;
  type: 'assignment' | 'community' | 'campaign' | 'review' | 'training';
  title: string;
  message: string;
  created_at: string;
  read: boolean;
  action_view?: string;
}

export interface VolunteerProfile {
  user_id: string;
  verification_status: VolunteerVerificationStatus;
  level?: VolunteerLevel;
  account_status?: VolunteerAccountStatus;
  onboarded?: boolean;
  guidelines_accepted_at?: string;
  locality?: string;
  organization?: string;
  motivation?: string;
  availability?: string;
  preferred_areas?: string[];
  preferred_categories?: ComplaintCategory[];
  completed_training_ids?: string[];
  languages?: string[];
  interests?: string[];
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  display_name: string;
  email: string;
  phone?: string;
  city?: string;
  state?: string;
  role: UserRole;
  preferred_language: 'en' | 'hi';
  created_at: string;
  volunteer_profile?: VolunteerProfile;
}

export interface VolunteerTask {
  id: string;
  complaint_id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  location: string;
  status: 'pending' | 'in_progress' | 'completed';
  workflow_status?: VolunteerTaskWorkflowStatus;
  priority?: 'normal' | 'high' | 'urgent';
  assigned_to?: string;
  due_date?: string;
  checklist: {
    id: string;
    label: string;
    completed: boolean;
  }[];
  created_at: string;
}
