-- =============================================
-- 15. UNIVERSAL CONTENT ENGINE (STAGE 2)
-- =============================================

-- 1. Add content_type to campaigns
ALTER TABLE public.campaigns
  ADD COLUMN IF NOT EXISTS content_type TEXT DEFAULT 'blog';

-- 2. Add polymorphic foreign keys to campaign_topics
-- The content_type column allows the engine to know what prompt to run.
-- The target table IDs allow the admin UI to link to the correct edit page.
ALTER TABLE public.campaign_topics
  ADD COLUMN IF NOT EXISTS content_type TEXT DEFAULT 'blog',
  ADD COLUMN IF NOT EXISTS service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS industry_id UUID REFERENCES public.industries(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS city_id UUID REFERENCES public.cities(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS faq_id UUID REFERENCES public.faqs(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS page_id UUID REFERENCES public.pages(id) ON DELETE SET NULL;

-- 3. Add back-references in the target tables to allow filtering by campaign (similar to blogs)
ALTER TABLE public.services
  ADD COLUMN IF NOT EXISTS campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS campaign_topic_id UUID;

ALTER TABLE public.industries
  ADD COLUMN IF NOT EXISTS campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS campaign_topic_id UUID;

ALTER TABLE public.cities
  ADD COLUMN IF NOT EXISTS campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS campaign_topic_id UUID;

ALTER TABLE public.faqs
  ADD COLUMN IF NOT EXISTS campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS campaign_topic_id UUID;

ALTER TABLE public.pages
  ADD COLUMN IF NOT EXISTS campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS campaign_topic_id UUID;
