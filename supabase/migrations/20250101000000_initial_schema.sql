-- CarbonZ Initial Schema Migration
-- Sets up core tables, constraints, indexes, triggers, and Row Level Security (RLS)

-- 1. Helper function for updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Profiles Table (maps to Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('public', 'user', 'developer', 'reviewer', 'admin')),
  organization TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to check user role from auth context safely
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- 3. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  project_type TEXT NOT NULL CHECK (project_type IN (
    'reforestation', 'afforestation', 'renewable_energy', 
    'methane_capture', 'direct_air_capture', 'blue_carbon', 
    'soil_carbon', 'improved_forest_management', 'other'
  )),
  country TEXT NOT NULL,
  region TEXT NOT NULL,
  developer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  methodology TEXT NOT NULL,
  estimated_reduction NUMERIC CHECK (estimated_reduction >= 0),
  units TEXT NOT NULL DEFAULT 'tCO2e/year',
  verification_status TEXT NOT NULL DEFAULT 'draft' CHECK (verification_status IN (
    'draft', 'submitted', 'under_review', 'verified', 'changes_requested', 'rejected'
  )),
  publication_status TEXT NOT NULL DEFAULT 'draft' CHECK (publication_status IN (
    'draft', 'published', 'archived'
  )),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  submitted_at TIMESTAMPTZ,
  verified_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_code ON public.projects(project_code);
CREATE INDEX IF NOT EXISTS idx_projects_developer ON public.projects(developer_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(verification_status, publication_status);
CREATE INDEX IF NOT EXISTS idx_projects_type_country ON public.projects(project_type, country);

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4. Project Documents Table (Stores metadata; actual files in Supabase Storage bucket 'project-documents')
CREATE TABLE IF NOT EXISTS public.project_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  storage_path TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  content_type TEXT NOT NULL,
  file_size BIGINT NOT NULL CHECK (file_size > 0),
  evidence_category TEXT NOT NULL CHECK (evidence_category IN (
    'baseline_study', 'monitoring_report', 'pdd', 'audit_report', 
    'land_tenure', 'satellite_imagery', 'legal_ownership', 
    'financial_additionality', 'other'
  )),
  visibility TEXT NOT NULL DEFAULT 'restricted' CHECK (visibility IN ('private', 'restricted', 'public')),
  review_status TEXT NOT NULL DEFAULT 'pending' CHECK (review_status IN ('pending', 'accepted', 'flagged', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_documents_project_id ON public.project_documents(project_id);

-- 5. Verification Reviews Table
CREATE TABLE IF NOT EXISTS public.verification_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  decision TEXT NOT NULL CHECK (decision IN ('approved', 'changes_requested', 'rejected')),
  review_notes TEXT NOT NULL,
  requested_changes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_project_id ON public.verification_reviews(project_id);

-- 6. Trust Scores Table
CREATE TABLE IF NOT EXISTS public.trust_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  documentation_score NUMERIC(5,2) NOT NULL CHECK (documentation_score >= 0 AND documentation_score <= 100),
  verification_score NUMERIC(5,2) NOT NULL CHECK (verification_score >= 0 AND verification_score <= 100),
  evidence_score NUMERIC(5,2) NOT NULL CHECK (evidence_score >= 0 AND evidence_score <= 100),
  history_score NUMERIC(5,2) NOT NULL CHECK (history_score >= 0 AND history_score <= 100),
  transparency_score NUMERIC(5,2) NOT NULL CHECK (transparency_score >= 0 AND transparency_score <= 100),
  calculated_score NUMERIC(5,2) NOT NULL CHECK (calculated_score >= 0 AND calculated_score <= 100),
  formula_version TEXT NOT NULL DEFAULT 'v1.0',
  calculation_status TEXT NOT NULL DEFAULT 'valid' CHECK (calculation_status IN ('valid', 'stale', 'incomplete', 'error')),
  calculated_by TEXT NOT NULL DEFAULT 'system',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_trust_scores_project_id ON public.trust_scores(project_id);
CREATE INDEX IF NOT EXISTS idx_trust_scores_calculated ON public.trust_scores(calculated_score);

-- 7. Passport Events Table (Public Traceability Timeline)
CREATE TABLE IF NOT EXISTS public.passport_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'creation', 'submission', 'review_started', 'changes_requested', 
    'resubmission', 'verification', 'rejection', 'issuance', 'monitoring_update'
  )),
  public_description TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_passport_events_project ON public.passport_events(project_id, created_at ASC);

-- 8. Audit Logs Table (Immutable log of security/administrative actions)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);

-- 9. Saved Projects Table (User Bookmarks)
CREATE TABLE IF NOT EXISTS public.saved_projects (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, project_id)
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trust_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.passport_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_projects ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- PROFILES POLICIES
-- ----------------------------------------------------------------------------
-- Public read access to basic profile info (display name, org)
CREATE POLICY "Public profiles are readable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

-- Users can update only their own profile, but CANNOT change their own role!
CREATE POLICY "Users can update their own non-privileged profile data"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND 
    role = (SELECT role FROM public.profiles WHERE id = auth.uid())
  );

-- Admins can update any profile (including roles)
CREATE POLICY "Admins have full access to profiles"
  ON public.profiles FOR ALL
  TO authenticated
  USING (public.get_current_user_role() = 'admin');

-- ----------------------------------------------------------------------------
-- PROJECTS POLICIES
-- ----------------------------------------------------------------------------
-- Public can view published projects
CREATE POLICY "Public can view published projects"
  ON public.projects FOR SELECT
  USING (publication_status = 'published');

-- Developers can view their own projects in any status
CREATE POLICY "Developers can view their own projects"
  ON public.projects FOR SELECT
  TO authenticated
  USING (developer_id = auth.uid());

-- Reviewers and Admins can view all non-archived projects
CREATE POLICY "Reviewers and Admins can view all projects"
  ON public.projects FOR SELECT
  TO authenticated
  USING (public.get_current_user_role() IN ('reviewer', 'admin'));

-- Developers can create new projects (initially draft)
CREATE POLICY "Developers can create projects"
  ON public.projects FOR INSERT
  TO authenticated
  WITH CHECK (
    developer_id = auth.uid() AND
    verification_status = 'draft' AND
    publication_status = 'draft'
  );

-- Developers can update their own projects only when in draft or changes_requested status
CREATE POLICY "Developers can update draft or changes_requested projects"
  ON public.projects FOR UPDATE
  TO authenticated
  USING (
    developer_id = auth.uid() AND
    verification_status IN ('draft', 'changes_requested')
  )
  WITH CHECK (
    developer_id = auth.uid() AND
    verification_status IN ('draft', 'submitted', 'changes_requested')
  );

-- Reviewers can update verification_status when assigned/allowed
CREATE POLICY "Reviewers can update project review status"
  ON public.projects FOR UPDATE
  TO authenticated
  USING (public.get_current_user_role() = 'reviewer')
  WITH CHECK (public.get_current_user_role() = 'reviewer');

-- Admins can update any project field
CREATE POLICY "Admins have full update access to projects"
  ON public.projects FOR ALL
  TO authenticated
  USING (public.get_current_user_role() = 'admin');

-- ----------------------------------------------------------------------------
-- PROJECT DOCUMENTS POLICIES
-- ----------------------------------------------------------------------------
-- Public can view metadata of explicitly public documents for published projects
CREATE POLICY "Public can view public document metadata"
  ON public.project_documents FOR SELECT
  USING (
    visibility = 'public' AND
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = project_documents.project_id 
      AND projects.publication_status = 'published'
    )
  );

-- Developers can view all documents on their own projects
CREATE POLICY "Developers can view their project documents"
  ON public.project_documents FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = project_documents.project_id 
      AND projects.developer_id = auth.uid()
    )
  );

-- Reviewers and Admins can view all documents
CREATE POLICY "Reviewers and Admins can view all project documents"
  ON public.project_documents FOR SELECT
  TO authenticated
  USING (public.get_current_user_role() IN ('reviewer', 'admin'));

-- Developers can insert documents to their own draft/changes_requested projects
CREATE POLICY "Developers can upload documents to own projects"
  ON public.project_documents FOR INSERT
  TO authenticated
  WITH CHECK (
    uploaded_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = project_documents.project_id 
      AND projects.developer_id = auth.uid()
      AND projects.verification_status IN ('draft', 'changes_requested')
    )
  );

-- ----------------------------------------------------------------------------
-- VERIFICATION REVIEWS POLICIES
-- ----------------------------------------------------------------------------
-- Developers can view review decisions on their own projects
CREATE POLICY "Developers can view reviews on their own projects"
  ON public.verification_reviews FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = verification_reviews.project_id 
      AND projects.developer_id = auth.uid()
    )
  );

-- Reviewers and Admins can view all reviews
CREATE POLICY "Reviewers and Admins can view all reviews"
  ON public.verification_reviews FOR SELECT
  TO authenticated
  USING (public.get_current_user_role() IN ('reviewer', 'admin'));

-- Reviewers and Admins can create reviews
CREATE POLICY "Reviewers and Admins can insert reviews"
  ON public.verification_reviews FOR INSERT
  TO authenticated
  WITH CHECK (
    reviewer_id = auth.uid() AND
    public.get_current_user_role() IN ('reviewer', 'admin')
  );

-- ----------------------------------------------------------------------------
-- TRUST SCORES POLICIES
-- ----------------------------------------------------------------------------
-- Public can view trust scores for published projects
CREATE POLICY "Public can view scores for published projects"
  ON public.trust_scores FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = trust_scores.project_id 
      AND projects.publication_status = 'published'
    )
  );

-- Developers can view scores for their own projects
CREATE POLICY "Developers can view scores for own projects"
  ON public.trust_scores FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = trust_scores.project_id 
      AND projects.developer_id = auth.uid()
    )
  );

-- Reviewers and Admins can view all trust scores
CREATE POLICY "Reviewers and Admins can view all trust scores"
  ON public.trust_scores FOR SELECT
  TO authenticated
  USING (public.get_current_user_role() IN ('reviewer', 'admin'));

-- Only Admins and Server-Side Service Role can insert/update trust scores
CREATE POLICY "Admins can manage trust scores"
  ON public.trust_scores FOR ALL
  TO authenticated
  USING (public.get_current_user_role() = 'admin');

-- ----------------------------------------------------------------------------
-- PASSPORT EVENTS POLICIES
-- ----------------------------------------------------------------------------
-- Public can view passport events for published projects
CREATE POLICY "Public can view passport events for published projects"
  ON public.passport_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = passport_events.project_id 
      AND projects.publication_status = 'published'
    )
  );

-- Developers, Reviewers, Admins can view all events for relevant projects
CREATE POLICY "Authorized roles can view project passport events"
  ON public.passport_events FOR SELECT
  TO authenticated
  USING (
    public.get_current_user_role() IN ('reviewer', 'admin') OR
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = passport_events.project_id 
      AND projects.developer_id = auth.uid()
    )
  );

-- Only Reviewers and Admins can insert passport events directly
CREATE POLICY "Reviewers and Admins can insert passport events"
  ON public.passport_events FOR INSERT
  TO authenticated
  WITH CHECK (public.get_current_user_role() IN ('reviewer', 'admin'));

-- ----------------------------------------------------------------------------
-- AUDIT LOGS POLICIES
-- ----------------------------------------------------------------------------
-- Only Admins can view audit logs
CREATE POLICY "Only admins can view audit logs"
  ON public.audit_logs FOR SELECT
  TO authenticated
  USING (public.get_current_user_role() = 'admin');

-- Authenticated users can insert audit logs for their own actions (never update or delete)
CREATE POLICY "Authenticated users can append audit logs"
  ON public.audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (actor_id = auth.uid());

-- ----------------------------------------------------------------------------
-- SAVED PROJECTS POLICIES
-- ----------------------------------------------------------------------------
-- Users can manage only their own saved projects
CREATE POLICY "Users can manage their own saved projects"
  ON public.saved_projects FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Trigger to automatically create a profile record when a user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, role, organization, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
    NEW.raw_user_meta_data->>'organization',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
