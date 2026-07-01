-- =============================================
-- 17. EDITORIAL WORKFLOW & RBAC (STAGE 5)
-- =============================================

-- 1. Role-Based Access Control
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL, -- normally references auth.users(id)
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'content_manager', 'seo_manager', 'editor', 'reviewer', 'writer', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 2. Content Versioning (Audit Trail)
CREATE TABLE IF NOT EXISTS public.content_revisions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  table_name TEXT NOT NULL, -- e.g., 'blogs', 'services'
  record_id UUID NOT NULL,
  author_id UUID,
  snapshot JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Note: We are doing Application-Level RBAC as discussed.
-- The Next.js application will enforce role checks and handle the multi-stage status enum:
-- ('draft', 'generated', 'editor_review', 'seo_review', 'legal_review', 'approved', 'scheduled', 'published')
