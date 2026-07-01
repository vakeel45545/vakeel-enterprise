-- =============================================
-- 20. SEARCH CONSOLE & CONTENT DECAY (STAGE 8)
-- =============================================

-- 1. Create GSC Metrics Table
CREATE TABLE IF NOT EXISTS public.gsc_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_url TEXT NOT NULL,
  clicks INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  ctr NUMERIC DEFAULT 0,
  position NUMERIC DEFAULT 0,
  snapshot_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(page_url, snapshot_date)
);

ALTER TABLE public.gsc_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin read gsc_metrics" ON public.gsc_metrics FOR SELECT TO authenticated USING (public.is_admin());

-- 2. Add freshness metrics to core content tables
ALTER TABLE public.blogs
  ADD COLUMN IF NOT EXISTS freshness_score INTEGER DEFAULT 100,
  ADD COLUMN IF NOT EXISTS needs_update BOOLEAN DEFAULT FALSE;

ALTER TABLE public.services
  ADD COLUMN IF NOT EXISTS freshness_score INTEGER DEFAULT 100,
  ADD COLUMN IF NOT EXISTS needs_update BOOLEAN DEFAULT FALSE;

ALTER TABLE public.pages
  ADD COLUMN IF NOT EXISTS freshness_score INTEGER DEFAULT 100,
  ADD COLUMN IF NOT EXISTS needs_update BOOLEAN DEFAULT FALSE;

ALTER TABLE public.service_city_content
  ADD COLUMN IF NOT EXISTS freshness_score INTEGER DEFAULT 100,
  ADD COLUMN IF NOT EXISTS needs_update BOOLEAN DEFAULT FALSE;
