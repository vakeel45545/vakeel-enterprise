-- Migration: 018_editorial_status.sql
-- Add status columns for Editorial Workflow

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'editorial_status') THEN
        CREATE TYPE editorial_status AS ENUM (
            'draft',
            'generated',
            'editor_review',
            'seo_review',
            'legal_review',
            'approved',
            'scheduled',
            'published'
        );
    END IF;
END $$;

ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS status editorial_status DEFAULT 'draft';
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS status editorial_status DEFAULT 'draft';
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS status editorial_status DEFAULT 'draft';

-- Migrate existing boolean flags
UPDATE public.blogs SET status = 'published' WHERE published = true;
UPDATE public.services SET status = 'published' WHERE published = true;
UPDATE public.pages SET status = 'published' WHERE published = true;
