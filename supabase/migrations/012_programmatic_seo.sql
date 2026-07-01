-- =============================================
-- 18. PROGRAMMATIC SEO & CITY PAGES (STAGE 4)
-- =============================================

-- 1. Upgrade cities table to support full CMS hub pages
ALTER TABLE public.cities
  ADD COLUMN IF NOT EXISTS content TEXT,
  ADD COLUMN IF NOT EXISTS meta_title TEXT,
  ADD COLUMN IF NOT EXISTS meta_description TEXT,
  ADD COLUMN IF NOT EXISTS thumbnail TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS category TEXT,
  ADD COLUMN IF NOT EXISTS tags JSONB;

-- 2. Upgrade service_city_content table to support full CMS intersection pages
CREATE TABLE IF NOT EXISTS public.service_city_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  city_id UUID REFERENCES public.cities(id) ON DELETE CASCADE,
  custom_title TEXT,
  custom_description TEXT,
  local_intro TEXT,
  local_faqs JSONB,
  search_volume INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(service_id, city_id)
);

ALTER TABLE public.service_city_content
  ADD COLUMN IF NOT EXISTS content TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS thumbnail TEXT,
  ADD COLUMN IF NOT EXISTS meta_title TEXT,
  ADD COLUMN IF NOT EXISTS meta_description TEXT,
  ADD COLUMN IF NOT EXISTS related_services JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS social_excerpt TEXT;
