-- Migration: 002_footer_cms.sql
-- Creates footer_sections and footer_links tables
-- Extends site_settings with footer content fields

-- Footer Sections (columns in footer)
CREATE TABLE IF NOT EXISTS public.footer_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  "order" INTEGER DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- Footer Links (links within each section)
CREATE TABLE IF NOT EXISTS public.footer_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id UUID REFERENCES public.footer_sections(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  "order" INTEGER DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  icon TEXT,
  open_new_tab BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- Extend site_settings for footer content
ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS footer_tagline TEXT,
  ADD COLUMN IF NOT EXISTS footer_cta_title TEXT,
  ADD COLUMN IF NOT EXISTS footer_cta_description TEXT,
  ADD COLUMN IF NOT EXISTS footer_cta_button_text TEXT,
  ADD COLUMN IF NOT EXISTS footer_cta_button_url TEXT,
  ADD COLUMN IF NOT EXISTS footer_badges JSONB,
  ADD COLUMN IF NOT EXISTS copyright_text TEXT;

-- RLS policies
ALTER TABLE public.footer_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.footer_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for footer_sections" ON public.footer_sections FOR SELECT USING (true);
CREATE POLICY "Public read access for footer_links" ON public.footer_links FOR SELECT USING (true);

-- Seed default footer sections and links
INSERT INTO public.footer_sections (title, "order", visible)
SELECT * FROM (VALUES
  ('Services', 1, true),
  ('Company', 2, true),
  ('Legal', 3, true)
) AS s(title, "order", visible)
WHERE NOT EXISTS (SELECT 1 FROM public.footer_sections LIMIT 1);

-- Seed footer links (only if sections were just created)
DO $$
DECLARE
  services_id UUID;
  company_id UUID;
  legal_id UUID;
BEGIN
  SELECT id INTO services_id FROM public.footer_sections WHERE title = 'Services' LIMIT 1;
  SELECT id INTO company_id FROM public.footer_sections WHERE title = 'Company' LIMIT 1;
  SELECT id INTO legal_id FROM public.footer_sections WHERE title = 'Legal' LIMIT 1;

  IF services_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.footer_links WHERE section_id = services_id LIMIT 1) THEN
    INSERT INTO public.footer_links (section_id, title, url, "order") VALUES
      (services_id, 'Private Limited Company', '/services/private-limited-company', 1),
      (services_id, 'LLP Registration', '/services/llp-registration', 2),
      (services_id, 'GST Registration', '/services/gst-registration', 3),
      (services_id, 'Trademark Registration', '/services/trademark-registration', 4),
      (services_id, 'ITR Filing', '/services/itr-filing', 5),
      (services_id, 'ROC Filing', '/services/roc-filing', 6);
  END IF;

  IF company_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.footer_links WHERE section_id = company_id LIMIT 1) THEN
    INSERT INTO public.footer_links (section_id, title, url, "order") VALUES
      (company_id, 'About Us', '/about', 1),
      (company_id, 'Careers', '/careers', 2),
      (company_id, 'Contact', '/contact', 3),
      (company_id, 'Blog', '/blog', 4);
  END IF;

  IF legal_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.footer_links WHERE section_id = legal_id LIMIT 1) THEN
    INSERT INTO public.footer_links (section_id, title, url, "order") VALUES
      (legal_id, 'Terms of Service', '/terms', 1),
      (legal_id, 'Privacy Policy', '/privacy', 2),
      (legal_id, 'Refund Policy', '/refund', 3);
  END IF;
END $$;
