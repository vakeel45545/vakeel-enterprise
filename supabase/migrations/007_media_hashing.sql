-- Migration: 007_media_hashing.sql
-- Add file_hash to media_library to prevent duplicate uploads

ALTER TABLE public.media_library
  ADD COLUMN IF NOT EXISTS file_hash TEXT;

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_media_library_hash ON public.media_library(file_hash);

-- Notice: We do not add a UNIQUE constraint to file_hash because older records will have a NULL hash, 
-- and occasionally users may want to intentionally upload a duplicate if they deleted the old one but the hash remained. 
-- However, our application logic in uploader.ts will treat it as unique for optimization.
