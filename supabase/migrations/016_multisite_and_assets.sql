-- =============================================
-- 22. MULTI-SITE CMS & ASSET MANAGER (STAGE 10)
-- =============================================

-- 1. Create Sites Master Table
CREATE TABLE IF NOT EXISTS public.sites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  domain TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read sites" ON public.sites FOR SELECT USING (true);
CREATE POLICY "Admin update sites" ON public.sites FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Insert default main site
INSERT INTO public.sites (domain, name) VALUES ('vaakil.com', 'Vakeel Main') ON CONFLICT DO NOTHING;

-- 2. Add Multi-tenant routing to Core Tables
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS site_id UUID REFERENCES public.sites(id);
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS site_id UUID REFERENCES public.sites(id);
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS site_id UUID REFERENCES public.sites(id);
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS site_id UUID REFERENCES public.sites(id);
ALTER TABLE public.service_city_content ADD COLUMN IF NOT EXISTS site_id UUID REFERENCES public.sites(id);

-- 3. Upgrade Media Library
ALTER TABLE public.media_library
  ADD COLUMN IF NOT EXISTS asset_type TEXT DEFAULT 'image', -- image, video, document, brand_asset
  ADD COLUMN IF NOT EXISTS description TEXT;
