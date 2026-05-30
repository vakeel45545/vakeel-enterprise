-- Migration: 003_services_cms.sql
-- Extends services table with rich CMS fields for dynamic page building

ALTER TABLE public.services
  ADD COLUMN IF NOT EXISTS hero_description TEXT,
  ADD COLUMN IF NOT EXISTS keywords TEXT,
  ADD COLUMN IF NOT EXISTS faq JSONB,
  ADD COLUMN IF NOT EXISTS cta_title TEXT,
  ADD COLUMN IF NOT EXISTS cta_description TEXT,
  ADD COLUMN IF NOT EXISTS cta_button_text TEXT,
  ADD COLUMN IF NOT EXISTS cta_button_url TEXT,
  ADD COLUMN IF NOT EXISTS benefits JSONB,
  ADD COLUMN IF NOT EXISTS process_steps JSONB,
  ADD COLUMN IF NOT EXISTS sections JSONB,
  ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS category TEXT;

-- Example of sections JSONB structure stored per service:
-- [
--   { "type": "hero", "title": "...", "description": "..." },
--   { "type": "benefits", "items": [{ "title": "...", "description": "...", "icon": "Zap" }] },
--   { "type": "process", "steps": [{ "title": "...", "description": "..." }] },
--   { "type": "faq", "items": [{ "q": "...", "a": "..." }] },
--   { "type": "cta", "title": "...", "description": "...", "buttonText": "...", "buttonUrl": "..." }
-- ]

-- Example of faq JSONB:
-- [{ "q": "What is GST?", "a": "GST stands for..." }]

-- Example of benefits JSONB:
-- [{ "title": "Fast Turnaround", "description": "...", "icon": "Zap" }]

-- Example of process_steps JSONB:
-- [{ "step": 1, "title": "Submit Documents", "description": "..." }]
