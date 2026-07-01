-- =============================================
-- 16. PROMOTION & CROSS-SELLING (STAGE 3)
-- =============================================

-- Add related_services (JSONB array of service IDs) and social_excerpt to all content tables
ALTER TABLE public.blogs
  ADD COLUMN IF NOT EXISTS related_services JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS social_excerpt TEXT;

ALTER TABLE public.services
  ADD COLUMN IF NOT EXISTS related_services JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS social_excerpt TEXT;

ALTER TABLE public.industries
  ADD COLUMN IF NOT EXISTS related_services JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS social_excerpt TEXT;

ALTER TABLE public.cities
  ADD COLUMN IF NOT EXISTS related_services JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS social_excerpt TEXT;

ALTER TABLE public.faqs
  ADD COLUMN IF NOT EXISTS related_services JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS social_excerpt TEXT;

ALTER TABLE public.pages
  ADD COLUMN IF NOT EXISTS related_services JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS social_excerpt TEXT;
