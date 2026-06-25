-- Migration: 006_enterprise_platform.sql
-- Enterprise platform tables for Industries, Webhooks, Cron, Media, Notifications, SEO Audits, Search
-- Run this in Supabase SQL Editor

-- =============================================
-- 1. INDUSTRIES
-- =============================================
CREATE TABLE IF NOT EXISTS public.industries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  image_url TEXT,
  icon TEXT,
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT,
  og_image TEXT,
  faq JSONB,
  sections JSONB,
  published BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.industries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read published industries" ON public.industries FOR SELECT USING (published = true);
CREATE POLICY "Admin insert industries" ON public.industries FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admin update industries" ON public.industries FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin delete industries" ON public.industries FOR DELETE TO authenticated USING (public.is_admin());

-- =============================================
-- 2. SERVICE × INDUSTRY (many-to-many)
-- =============================================
CREATE TABLE IF NOT EXISTS public.service_industries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  industry_id UUID REFERENCES public.industries(id) ON DELETE CASCADE,
  custom_title TEXT,
  custom_description TEXT,
  custom_content TEXT,
  meta_title TEXT,
  meta_description TEXT,
  faq JSONB,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(service_id, industry_id)
);

ALTER TABLE public.service_industries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read published service_industries" ON public.service_industries FOR SELECT USING (published = true);
CREATE POLICY "Admin insert service_industries" ON public.service_industries FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admin update service_industries" ON public.service_industries FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin delete service_industries" ON public.service_industries FOR DELETE TO authenticated USING (public.is_admin());

-- =============================================
-- 3. INDUSTRY × CITY (programmatic SEO)
-- =============================================
CREATE TABLE IF NOT EXISTS public.industry_city_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  industry_id UUID REFERENCES public.industries(id) ON DELETE CASCADE,
  city_id UUID REFERENCES public.cities(id) ON DELETE CASCADE,
  meta_title TEXT,
  meta_description TEXT,
  hero_title TEXT,
  hero_content TEXT,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(industry_id, city_id)
);

ALTER TABLE public.industry_city_pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read published industry_city_pages" ON public.industry_city_pages FOR SELECT USING (published = true);
CREATE POLICY "Admin insert industry_city_pages" ON public.industry_city_pages FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admin update industry_city_pages" ON public.industry_city_pages FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin delete industry_city_pages" ON public.industry_city_pages FOR DELETE TO authenticated USING (public.is_admin());

-- =============================================
-- 4. WEBHOOKS
-- =============================================
CREATE TABLE IF NOT EXISTS public.webhooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  event_type TEXT NOT NULL,
  headers JSONB,
  active BOOLEAN DEFAULT true,
  last_triggered_at TIMESTAMPTZ,
  last_status INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.webhooks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin read webhooks" ON public.webhooks FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admin insert webhooks" ON public.webhooks FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admin update webhooks" ON public.webhooks FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin delete webhooks" ON public.webhooks FOR DELETE TO authenticated USING (public.is_admin());

-- =============================================
-- 5. WEBHOOK LOGS
-- =============================================
CREATE TABLE IF NOT EXISTS public.webhook_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  webhook_id UUID REFERENCES public.webhooks(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  payload JSONB,
  response_status INTEGER,
  response_body TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.webhook_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin read webhook_logs" ON public.webhook_logs FOR SELECT TO authenticated USING (public.is_admin());

-- =============================================
-- 6. CRON JOBS
-- =============================================
CREATE TABLE IF NOT EXISTS public.cron_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  schedule TEXT NOT NULL,
  job_type TEXT NOT NULL,
  config JSONB,
  active BOOLEAN DEFAULT true,
  last_run_at TIMESTAMPTZ,
  last_status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.cron_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin read cron_jobs" ON public.cron_jobs FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admin insert cron_jobs" ON public.cron_jobs FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admin update cron_jobs" ON public.cron_jobs FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin delete cron_jobs" ON public.cron_jobs FOR DELETE TO authenticated USING (public.is_admin());

-- =============================================
-- 7. CRON LOGS
-- =============================================
CREATE TABLE IF NOT EXISTS public.cron_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cron_job_id UUID REFERENCES public.cron_jobs(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  result JSONB,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

ALTER TABLE public.cron_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin read cron_logs" ON public.cron_logs FOR SELECT TO authenticated USING (public.is_admin());

-- =============================================
-- 8. SEO AUDITS
-- =============================================
CREATE TABLE IF NOT EXISTS public.seo_audits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_url TEXT NOT NULL,
  page_type TEXT,
  score INTEGER,
  issues JSONB,
  lighthouse_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.seo_audits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin read seo_audits" ON public.seo_audits FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admin insert seo_audits" ON public.seo_audits FOR INSERT TO authenticated WITH CHECK (public.is_admin());

-- =============================================
-- 9. MEDIA LIBRARY
-- =============================================
CREATE TABLE IF NOT EXISTS public.media_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename TEXT NOT NULL,
  url TEXT NOT NULL,
  source TEXT DEFAULT 'upload',
  alt_text TEXT,
  mime_type TEXT,
  size_bytes INTEGER,
  width INTEGER,
  height INTEGER,
  tags TEXT[],
  uploaded_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin read media_library" ON public.media_library FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admin insert media_library" ON public.media_library FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admin update media_library" ON public.media_library FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin delete media_library" ON public.media_library FOR DELETE TO authenticated USING (public.is_admin());

-- =============================================
-- 10. NOTIFICATIONS
-- =============================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL,
  event TEXT NOT NULL,
  recipient TEXT NOT NULL,
  subject TEXT,
  body TEXT,
  status TEXT DEFAULT 'pending',
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin read notifications" ON public.notifications FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admin insert notifications" ON public.notifications FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admin update notifications" ON public.notifications FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- =============================================
-- 11. PROGRAMMATIC SEO JOBS
-- =============================================
CREATE TABLE IF NOT EXISTS public.programmatic_seo_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  config JSONB,
  result JSONB,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

ALTER TABLE public.programmatic_seo_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin read programmatic_seo_jobs" ON public.programmatic_seo_jobs FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admin insert programmatic_seo_jobs" ON public.programmatic_seo_jobs FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admin update programmatic_seo_jobs" ON public.programmatic_seo_jobs FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- =============================================
-- 12. ALTER EXISTING TABLES
-- =============================================

-- Services: Add timeline, pricing_data, industry_relevance, documents_required
ALTER TABLE public.services
  ADD COLUMN IF NOT EXISTS documents_required JSONB,
  ADD COLUMN IF NOT EXISTS timeline TEXT,
  ADD COLUMN IF NOT EXISTS pricing_data JSONB,
  ADD COLUMN IF NOT EXISTS industry_relevance JSONB;

-- Blogs: Add status, scheduled_at, seo_score
ALTER TABLE public.blogs
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS seo_score INTEGER;

-- Site Settings: Add analytics + webhook config
ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS ga_measurement_id TEXT,
  ADD COLUMN IF NOT EXISTS search_console_verified BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS webhook_config JSONB,
  ADD COLUMN IF NOT EXISTS notification_config JSONB;

-- =============================================
-- 13. INDEXES
-- =============================================
CREATE INDEX IF NOT EXISTS idx_industries_slug ON public.industries(slug);
CREATE INDEX IF NOT EXISTS idx_industries_published ON public.industries(published);
CREATE INDEX IF NOT EXISTS idx_service_industries_service ON public.service_industries(service_id);
CREATE INDEX IF NOT EXISTS idx_service_industries_industry ON public.service_industries(industry_id);
CREATE INDEX IF NOT EXISTS idx_industry_city_pages_lookup ON public.industry_city_pages(industry_id, city_id);
CREATE INDEX IF NOT EXISTS idx_webhooks_event ON public.webhooks(event_type, active);
CREATE INDEX IF NOT EXISTS idx_media_library_source ON public.media_library(source);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON public.notifications(status);
CREATE INDEX IF NOT EXISTS idx_seo_audits_url ON public.seo_audits(page_url);
CREATE INDEX IF NOT EXISTS idx_blogs_status ON public.blogs(status);
