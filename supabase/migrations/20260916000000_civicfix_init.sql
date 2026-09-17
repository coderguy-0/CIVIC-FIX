-- ==============================================================================
-- CivicFix Backend v1.0 - Complete Supabase PostgreSQL Schema & RLS Policies
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Custom Types & Enums
DO $$ BEGIN
  CREATE TYPE complaint_category AS ENUM (
    'roads',
    'water',
    'sanitation',
    'street_lighting',
    'drainage',
    'electricity',
    'public_safety',
    'other'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE complaint_status AS ENUM (
    'draft',
    'prepared',
    'submitted',
    'acknowledged',
    'in_progress',
    'resolved',
    'reopened',
    'closed',
    'rejected'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE event_type AS ENUM (
    'status_changed',
    'follow_up',
    'authority_response',
    'evidence_added',
    'note_added',
    'reopened',
    'closed'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE moderation_status AS ENUM (
    'pending',
    'approved',
    'rejected',
    'hidden'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM (
    'user',
    'moderator',
    'admin'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. Profiles Table (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT 'Citizen',
  email TEXT,
  preferred_language VARCHAR(5) DEFAULT 'en',
  role user_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. User Roles Table (For fine-grained RBAC & audits)
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'user',
  granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  granted_by UUID REFERENCES auth.users(id),
  UNIQUE(user_id, role)
);

-- 5. Complaints Table (Private Citizen Records)
CREATE TABLE IF NOT EXISTS public.complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(160) NOT NULL,
  description TEXT,
  category complaint_category NOT NULL,
  status complaint_status NOT NULL DEFAULT 'draft',
  
  -- Official Submission Information (Private)
  authority_name VARCHAR(200),
  official_reference VARCHAR(200),
  official_portal_url VARCHAR(500),
  submitted_at TIMESTAMPTZ,
  
  -- Geographic Location
  state_code VARCHAR(10) DEFAULT 'DL',
  state_name VARCHAR(100),
  district VARCHAR(120),
  locality VARCHAR(200),
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  
  -- Follow-up Scheduling
  next_follow_up_at TIMESTAMPTZ,
  is_public_summary_shared BOOLEAN NOT NULL DEFAULT FALSE,
  
  -- Lifecycle Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ
);

-- 6. Complaint Events Table (Audit Timeline)
CREATE TABLE IF NOT EXISTS public.complaint_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type event_type NOT NULL,
  old_status complaint_status,
  new_status complaint_status,
  note TEXT,
  source_label VARCHAR(100) DEFAULT 'User reported',
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Reminders Table
CREATE TABLE IF NOT EXISTS public.reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  remind_at TIMESTAMPTZ NOT NULL,
  message VARCHAR(500) NOT NULL,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Public Reports Table (Sanitized Community Summaries)
CREATE TABLE IF NOT EXISTS public.public_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID UNIQUE REFERENCES public.complaints(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  public_title VARCHAR(160) NOT NULL,
  public_description TEXT NOT NULL,
  category complaint_category NOT NULL,
  approximate_location VARCHAR(200) NOT NULL,
  state_code VARCHAR(10),
  district VARCHAR(120),
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  moderation_status moderation_status NOT NULL DEFAULT 'pending',
  moderation_notes TEXT,
  confirmations_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Community Confirmations Table
CREATE TABLE IF NOT EXISTS public.public_report_confirmations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_report_id UUID NOT NULL REFERENCES public.public_reports(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(public_report_id, user_id)
);

-- 10. Moderation Actions Table (Admin Audit Log)
CREATE TABLE IF NOT EXISTS public.moderation_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  moderator_id UUID NOT NULL REFERENCES auth.users(id),
  public_report_id UUID NOT NULL REFERENCES public.public_reports(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Complaint Attachments Metadata Table (Private Storage)
CREATE TABLE IF NOT EXISTS public.complaint_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_complaints_user_id ON public.complaints(user_id);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON public.complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_category ON public.complaints(category);
CREATE INDEX IF NOT EXISTS idx_complaints_next_follow_up ON public.complaints(next_follow_up_at);
CREATE INDEX IF NOT EXISTS idx_complaint_events_complaint_id ON public.complaint_events(complaint_id);
CREATE INDEX IF NOT EXISTS idx_reminders_user_complaint ON public.reminders(user_id, complaint_id);
CREATE INDEX IF NOT EXISTS idx_reminders_remind_at ON public.reminders(remind_at);
CREATE INDEX IF NOT EXISTS idx_public_reports_mod_status ON public.public_reports(moderation_status);
CREATE INDEX IF NOT EXISTS idx_public_reports_created ON public.public_reports(created_at DESC);

-- ==============================================================================
-- HELPER FUNCTIONS FOR SECURITY CHECKS
-- ==============================================================================

-- Check if user is a moderator or admin
CREATE OR REPLACE FUNCTION public.is_moderator(check_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = check_user_id AND role IN ('moderator', 'admin')
  ) OR EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = check_user_id AND role IN ('moderator', 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-update updated_at timestamps
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_complaints_updated_at
BEFORE UPDATE ON public.complaints
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_public_reports_updated_at
BEFORE UPDATE ON public.public_reports
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Auto-increment confirmation counter
CREATE OR REPLACE FUNCTION public.handle_confirmation_change()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.public_reports
    SET confirmations_count = confirmations_count + 1
    WHERE id = NEW.public_report_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.public_reports
    SET confirmations_count = GREATEST(0, confirmations_count - 1)
    WHERE id = OLD.public_report_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_confirmations_counter
AFTER INSERT OR DELETE ON public.public_report_confirmations
FOR EACH ROW EXECUTE FUNCTION public.handle_confirmation_change();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS across all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaint_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.public_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.public_report_confirmations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaint_attachments ENABLE ROW LEVEL SECURITY;

-- 1. Profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 2. User Roles
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id OR public.is_moderator(auth.uid()));

-- 3. Complaints (Strict Private Ownership)
CREATE POLICY "Users can view own complaints"
  ON public.complaints FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own complaints"
  ON public.complaints FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own complaints"
  ON public.complaints FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own complaints"
  ON public.complaints FOR DELETE
  USING (auth.uid() = user_id);

-- 4. Complaint Events (Audit Timeline)
CREATE POLICY "Users can view events for own complaints"
  ON public.complaint_events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create events for own complaints"
  ON public.complaint_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 5. Reminders
CREATE POLICY "Users can view own reminders"
  ON public.reminders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reminders"
  ON public.reminders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reminders"
  ON public.reminders FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reminders"
  ON public.reminders FOR DELETE
  USING (auth.uid() = user_id);

-- 6. Public Reports
-- Approved reports are readable by anyone (authenticated or public).
-- Pending reports are readable ONLY by their author OR an authorized moderator.
CREATE POLICY "Anyone can view approved public reports"
  ON public.public_reports FOR SELECT
  USING (
    moderation_status = 'approved'
    OR auth.uid() = user_id
    OR public.is_moderator(auth.uid())
  );

CREATE POLICY "Users can create public reports for own complaints"
  ON public.public_reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Moderators can update public reports"
  ON public.public_reports FOR UPDATE
  USING (public.is_moderator(auth.uid()) OR auth.uid() = user_id);

-- 7. Community Confirmations
CREATE POLICY "Anyone can view confirmations"
  ON public.public_report_confirmations FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can confirm"
  ON public.public_report_confirmations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their confirmation"
  ON public.public_report_confirmations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 8. Moderation Actions (Audit Trail)
CREATE POLICY "Moderators can view audit logs"
  ON public.moderation_actions FOR SELECT
  USING (public.is_moderator(auth.uid()));

CREATE POLICY "Moderators can insert audit logs"
  ON public.moderation_actions FOR INSERT
  WITH CHECK (public.is_moderator(auth.uid()) AND auth.uid() = moderator_id);

-- 9. Complaint Attachments (Private)
CREATE POLICY "Users can access own attachments"
  ON public.complaint_attachments FOR ALL
  USING (auth.uid() = user_id);

-- ==============================================================================
-- STORAGE BUCKET POLICIES (complaint-attachments)
-- ==============================================================================
-- Note: Create private bucket in Supabase storage:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('complaint-attachments', 'complaint-attachments', false);

-- CREATE POLICY "Users upload to own folder"
-- ON storage.objects FOR INSERT TO authenticated
-- WITH CHECK (bucket_id = 'complaint-attachments' AND (storage.foldername(name))[1] = auth.uid()::text);

-- CREATE POLICY "Users read own attachments"
-- ON storage.objects FOR SELECT TO authenticated
-- USING (bucket_id = 'complaint-attachments' AND (storage.foldername(name))[1] = auth.uid()::text);
