-- Migration: 007_enterprise_blog_studio.sql
-- Adds fields for Enterprise Blog Studio and Media Library enhancements

-- 1. Modify media_library table
ALTER TABLE public.media_library
  ADD COLUMN IF NOT EXISTS image_prompt TEXT,
  ADD COLUMN IF NOT EXISTS credits TEXT,
  ADD COLUMN IF NOT EXISTS license_url TEXT;

-- 2. Modify blogs table
ALTER TABLE public.blogs
  ADD COLUMN IF NOT EXISTS featured_image_id UUID REFERENCES public.media_library(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS og_image_id UUID REFERENCES public.media_library(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;

-- Note: 'status', 'scheduled_at', and 'seo_score' were already added in migration 006.
-- Update 'status' check constraint if needed (by default it was just a TEXT column in 006).
-- Since migration 006 added status as TEXT DEFAULT 'draft', we don't strictly need a CHECK constraint, 
-- but you can add one if desired:
-- ALTER TABLE public.blogs ADD CONSTRAINT blogs_status_check CHECK (status IN ('draft', 'review', 'scheduled', 'published', 'archived'));

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_blogs_featured_image ON public.blogs(featured_image_id);
CREATE INDEX IF NOT EXISTS idx_blogs_og_image ON public.blogs(og_image_id);
