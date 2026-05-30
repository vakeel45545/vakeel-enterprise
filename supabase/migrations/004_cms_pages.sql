-- Migration: 004_cms_pages.sql
-- Universal CMS pages table — drives the dynamic page router app/[...slug]/page.tsx
-- This powers: About, Careers, Contact, Privacy, Legal, Landing pages — without hardcoded routes

CREATE TABLE IF NOT EXISTS public.pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT,
  og_image TEXT,
  canonical_url TEXT,
  -- Content
  content TEXT,
  sections JSONB,
  -- Page type for template selection
  page_type TEXT DEFAULT 'generic',  -- 'generic' | 'landing' | 'legal' | 'about' | 'contact'
  -- Status
  published BOOLEAN DEFAULT true,
  -- Schema
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- RLS
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read published pages" ON public.pages FOR SELECT USING (published = true);

-- Seed essential CMS pages
INSERT INTO public.pages (title, slug, meta_title, meta_description, page_type, published, sections)
SELECT * FROM (VALUES
  (
    'About Us',
    'about',
    'About Vakeel — AI-Powered Legal & Compliance OS',
    'Learn about Vakeel''s mission to democratize legal and compliance services for Indian businesses through AI.',
    'about',
    true,
    '[
      {"type": "hero", "title": "Building the Future of Legal Tech in India", "description": "Vakeel is on a mission to make legal compliance accessible, affordable, and automated for every Indian business."},
      {"type": "content", "html": "<p>Founded by a team of legal experts and technologists, Vakeel combines AI automation with deep domain expertise to serve 50,000+ businesses across India.</p>"},
      {"type": "cta", "title": "Ready to get started?", "description": "Join thousands of businesses who trust Vakeel.", "buttonText": "Get Started", "buttonUrl": "/contact"}
    ]'::jsonb
  ),
  (
    'Contact Us',
    'contact',
    'Contact Vakeel — Get Expert Legal Help',
    'Contact Vakeel for expert legal assistance with company registration, GST, trademarks and compliance.',
    'contact',
    true,
    '[
      {"type": "hero", "title": "Get in Touch", "description": "Our team of 2,000+ legal experts is ready to help you."}
    ]'::jsonb
  ),
  (
    'Careers',
    'careers',
    'Careers at Vakeel — Join the Legal-Tech Revolution',
    'Join Vakeel to build the future of legal tech in India. Open roles in engineering, legal, and design.',
    'generic',
    true,
    '[
      {"type": "hero", "title": "Join the Legal-Tech Revolution", "description": "We are hiring engineers, CA/CS, and designers to build the future of compliance in India."}
    ]'::jsonb
  ),
  (
    'Privacy Policy',
    'privacy',
    'Privacy Policy — Vakeel',
    'Read Vakeel''s privacy policy. We are committed to protecting your personal data.',
    'legal',
    true,
    '[
      {"type": "hero", "title": "Privacy Policy", "description": "Last updated: January 2025"},
      {"type": "content", "html": "<p>Your privacy is critically important to us. This Privacy Policy explains how Vakeel collects, uses, and protects your information.</p>"}
    ]'::jsonb
  ),
  (
    'Terms of Service',
    'terms',
    'Terms of Service — Vakeel',
    'Read Vakeel''s terms of service and user agreement.',
    'legal',
    true,
    '[
      {"type": "hero", "title": "Terms of Service", "description": "Last updated: January 2025"},
      {"type": "content", "html": "<p>By accessing or using Vakeel''s services, you agree to be bound by these Terms of Service.</p>"}
    ]'::jsonb
  ),
  (
    'Refund Policy',
    'refund',
    'Refund Policy — Vakeel',
    'Read Vakeel''s refund and cancellation policy.',
    'legal',
    true,
    '[
      {"type": "hero", "title": "Refund Policy", "description": "Last updated: January 2025"},
      {"type": "content", "html": "<p>Vakeel''s refund policy is designed to be fair and transparent for all customers.</p>"}
    ]'::jsonb
  )
) AS p(title, slug, meta_title, meta_description, page_type, published, sections)
WHERE NOT EXISTS (SELECT 1 FROM public.pages LIMIT 1);
