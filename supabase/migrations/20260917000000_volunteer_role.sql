-- Extend CivicFix roles and volunteer profiles for dual-portal auth.

DO $$ BEGIN
  ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'volunteer';
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.volunteer_profiles (
  user_id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  verification_status text NOT NULL DEFAULT 'pending'
    CHECK (verification_status IN ('pending', 'verified', 'rejected', 'suspended')),
  locality text,
  organization text,
  motivation text,
  availability text,
  languages text[],
  interests text[],
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.volunteer_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Volunteers can view own volunteer profile"
  ON public.volunteer_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Volunteers can update own volunteer profile"
  ON public.volunteer_profiles FOR UPDATE
  USING (auth.uid() = user_id);

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS city text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS state text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_demo boolean NOT NULL DEFAULT false;
