-- =============================================
-- 21. MULTI-LANGUAGE SUPPORT (STAGE 9)
-- =============================================

-- 1. Add localization columns to core content tables
ALTER TABLE public.blogs
  ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'en',
  ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.blogs(id) ON DELETE CASCADE;

ALTER TABLE public.services
  ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'en',
  ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.services(id) ON DELETE CASCADE;

ALTER TABLE public.pages
  ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'en',
  ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.pages(id) ON DELETE CASCADE;

ALTER TABLE public.service_city_content
  ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'en',
  ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.service_city_content(id) ON DELETE CASCADE;

-- 2. Create Translation Jobs Queue
CREATE TABLE IF NOT EXISTS public.translation_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_table TEXT NOT NULL,
  source_id UUID NOT NULL,
  target_language TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, processing, completed, failed
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.translation_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin read translation_jobs" ON public.translation_jobs FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admin update translation_jobs" ON public.translation_jobs FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
