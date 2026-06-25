-- Migration: 007_automation.sql
-- Enterprise Blog Automation Enhancements
-- Run this in Supabase SQL Editor

-- =============================================
-- 1. CRON LOGS ENHANCEMENTS
-- =============================================
ALTER TABLE public.cron_logs
  ADD COLUMN IF NOT EXISTS duration_ms INTEGER,
  ADD COLUMN IF NOT EXISTS retries INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS blog_id UUID,
  ADD COLUMN IF NOT EXISTS image_source TEXT,
  ADD COLUMN IF NOT EXISTS error_message TEXT;

-- =============================================
-- 2. MEDIA LIBRARY ENHANCEMENTS
-- =============================================
ALTER TABLE public.media_library
  ADD COLUMN IF NOT EXISTS image_prompt TEXT,
  ADD COLUMN IF NOT EXISTS credits TEXT,
  ADD COLUMN IF NOT EXISTS license_url TEXT;

-- =============================================
-- 3. VERIFICATION QUERY
-- =============================================
-- Verify the new columns were added correctly
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name IN ('cron_logs', 'media_library') 
  AND column_name IN ('duration_ms', 'retries', 'blog_id', 'image_source', 'error_message', 'image_prompt', 'credits', 'license_url')
ORDER BY table_name, column_name;
