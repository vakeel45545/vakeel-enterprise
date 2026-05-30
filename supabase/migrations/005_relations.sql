-- Migration: 005_relations.sql
-- Content relation system — enables related blogs, related services, related FAQs

CREATE TABLE IF NOT EXISTS public.content_relations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_type TEXT NOT NULL,   -- 'blog' | 'service' | 'page'
  source_id UUID NOT NULL,
  target_type TEXT NOT NULL,   -- 'blog' | 'service' | 'faq' | 'city'
  target_id UUID NOT NULL,
  relation_type TEXT DEFAULT 'related',  -- 'related' | 'linked' | 'featured'
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  UNIQUE(source_type, source_id, target_type, target_id)
);

-- Add category field to blogs for better filtering
ALTER TABLE public.blogs
  ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS reading_time INTEGER,
  ADD COLUMN IF NOT EXISTS og_image TEXT;

-- RLS
ALTER TABLE public.content_relations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access for content_relations" ON public.content_relations FOR SELECT USING (true);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_content_relations_source ON public.content_relations(source_type, source_id);
CREATE INDEX IF NOT EXISTS idx_content_relations_target ON public.content_relations(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_blogs_category ON public.blogs(category);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON public.blogs(published);
CREATE INDEX IF NOT EXISTS idx_services_category ON public.services(category);
CREATE INDEX IF NOT EXISTS idx_services_published ON public.services(published);
CREATE INDEX IF NOT EXISTS idx_pages_slug ON public.pages(slug);
CREATE INDEX IF NOT EXISTS idx_navigation_order ON public.navigation("order");
