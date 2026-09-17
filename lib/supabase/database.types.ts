export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

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
  | 'closed'
  | 'rejected';

export type EventType =
  | 'status_changed'
  | 'follow_up'
  | 'authority_response'
  | 'evidence_added'
  | 'note_added'
  | 'reopened'
  | 'closed';

export type ModerationStatus = 'pending' | 'approved' | 'rejected' | 'hidden';

export type UserRole = 'user' | 'volunteer' | 'moderator' | 'admin';

export type VolunteerVerificationStatus = 'pending' | 'verified' | 'rejected' | 'suspended';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string;
          email: string | null;
          phone: string | null;
          city: string | null;
          state: string | null;
          preferred_language: string;
          role: UserRole;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string;
          email?: string | null;
          phone?: string | null;
          city?: string | null;
          state?: string | null;
          preferred_language?: string;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string;
          email?: string | null;
          phone?: string | null;
          city?: string | null;
          state?: string | null;
          preferred_language?: string;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      volunteer_profiles: {
        Row: {
          user_id: string;
          verification_status: VolunteerVerificationStatus;
          locality: string | null;
          organization: string | null;
          motivation: string | null;
          availability: string | null;
          languages: string[] | null;
          interests: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          verification_status?: VolunteerVerificationStatus;
          locality?: string | null;
          organization?: string | null;
          motivation?: string | null;
          availability?: string | null;
          languages?: string[] | null;
          interests?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          verification_status?: VolunteerVerificationStatus;
          locality?: string | null;
          organization?: string | null;
          motivation?: string | null;
          availability?: string | null;
          languages?: string[] | null;
          interests?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          id: string;
          user_id: string;
          role: UserRole;
          granted_at: string;
          granted_by: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          role?: UserRole;
          granted_at?: string;
          granted_by?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          role?: UserRole;
          granted_at?: string;
          granted_by?: string | null;
        };
        Relationships: [];
      };
      complaints: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          category: ComplaintCategory;
          status: ComplaintStatus;
          authority_name: string | null;
          official_reference: string | null;
          official_portal_url: string | null;
          submitted_at: string | null;
          state_code: string | null;
          state_name: string | null;
          district: string | null;
          locality: string | null;
          latitude: number | null;
          longitude: number | null;
          next_follow_up_at: string | null;
          is_public_summary_shared: boolean;
          created_at: string;
          updated_at: string;
          resolved_at: string | null;
          closed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          category: ComplaintCategory;
          status?: ComplaintStatus;
          authority_name?: string | null;
          official_reference?: string | null;
          official_portal_url?: string | null;
          submitted_at?: string | null;
          state_code?: string | null;
          state_name?: string | null;
          district?: string | null;
          locality?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          next_follow_up_at?: string | null;
          is_public_summary_shared?: boolean;
          created_at?: string;
          updated_at?: string;
          resolved_at?: string | null;
          closed_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          category?: ComplaintCategory;
          status?: ComplaintStatus;
          authority_name?: string | null;
          official_reference?: string | null;
          official_portal_url?: string | null;
          submitted_at?: string | null;
          state_code?: string | null;
          state_name?: string | null;
          district?: string | null;
          locality?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          next_follow_up_at?: string | null;
          is_public_summary_shared?: boolean;
          created_at?: string;
          updated_at?: string;
          resolved_at?: string | null;
          closed_at?: string | null;
        };
        Relationships: [];
      };
      complaint_events: {
        Row: {
          id: string;
          complaint_id: string;
          user_id: string;
          event_type: EventType;
          old_status: ComplaintStatus | null;
          new_status: ComplaintStatus | null;
          note: string | null;
          source_label: string | null;
          occurred_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          complaint_id: string;
          user_id: string;
          event_type: EventType;
          old_status?: ComplaintStatus | null;
          new_status?: ComplaintStatus | null;
          note?: string | null;
          source_label?: string | null;
          occurred_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          complaint_id?: string;
          user_id?: string;
          event_type?: EventType;
          old_status?: ComplaintStatus | null;
          new_status?: ComplaintStatus | null;
          note?: string | null;
          source_label?: string | null;
          occurred_at?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      reminders: {
        Row: {
          id: string;
          complaint_id: string;
          user_id: string;
          remind_at: string;
          message: string;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          complaint_id: string;
          user_id: string;
          remind_at: string;
          message: string;
          completed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          complaint_id?: string;
          user_id?: string;
          remind_at?: string;
          message?: string;
          completed_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      public_reports: {
        Row: {
          id: string;
          complaint_id: string | null;
          user_id: string;
          public_title: string;
          public_description: string;
          category: ComplaintCategory;
          approximate_location: string;
          state_code: string | null;
          district: string | null;
          latitude: number | null;
          longitude: number | null;
          moderation_status: ModerationStatus;
          moderation_notes: string | null;
          confirmations_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          complaint_id?: string | null;
          user_id: string;
          public_title: string;
          public_description: string;
          category: ComplaintCategory;
          approximate_location: string;
          state_code?: string | null;
          district?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          moderation_status?: ModerationStatus;
          moderation_notes?: string | null;
          confirmations_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          complaint_id?: string | null;
          user_id?: string;
          public_title?: string;
          public_description?: string;
          category?: ComplaintCategory;
          approximate_location?: string;
          state_code?: string | null;
          district?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          moderation_status?: ModerationStatus;
          moderation_notes?: string | null;
          confirmations_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      public_report_confirmations: {
        Row: {
          id: string;
          public_report_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          public_report_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          public_report_id?: string;
          user_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      moderation_actions: {
        Row: {
          id: string;
          moderator_id: string;
          public_report_id: string;
          action: string;
          reason: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          moderator_id: string;
          public_report_id: string;
          action: string;
          reason?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          moderator_id?: string;
          public_report_id?: string;
          action?: string;
          reason?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      complaint_attachments: {
        Row: {
          id: string;
          complaint_id: string;
          user_id: string;
          file_path: string;
          file_name: string;
          file_size: number;
          mime_type: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          complaint_id: string;
          user_id: string;
          file_path: string;
          file_name: string;
          file_size: number;
          mime_type: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          complaint_id?: string;
          user_id?: string;
          file_path?: string;
          file_name?: string;
          file_size?: number;
          mime_type?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_moderator: {
        Args: { check_user_id: string };
        Returns: boolean;
      };
    };
    Enums: {
      complaint_category: ComplaintCategory;
      complaint_status: ComplaintStatus;
      event_type: EventType;
      moderation_status: ModerationStatus;
      user_role: UserRole;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
