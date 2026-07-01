-- =============================================
-- 19. MARKETING CALENDAR (STAGE 6)
-- =============================================

-- Ensure all major content tables support scheduling
ALTER TABLE public.services
  ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMPTZ;

ALTER TABLE public.cities
  ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMPTZ;

ALTER TABLE public.industries
  ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMPTZ;

ALTER TABLE public.faqs
  ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMPTZ;

ALTER TABLE public.pages
  ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMPTZ;

ALTER TABLE public.campaigns
  ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMPTZ;

ALTER TABLE public.service_city_content
  ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMPTZ;
