-- =============================================
-- 23. ENTERPRISE MEDIA PLATFORM (STAGE 11)
-- =============================================

-- 1. Upgrade media_library table
ALTER TABLE public.media_library
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'ready', -- uploading, processing, ready, archived, deleted
  ADD COLUMN IF NOT EXISTS version_number INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS parent_asset_id UUID REFERENCES public.media_library(id),
  ADD COLUMN IF NOT EXISTS replaced_by UUID REFERENCES public.media_library(id),
  ADD COLUMN IF NOT EXISTS is_latest BOOLEAN DEFAULT true,
  
  ADD COLUMN IF NOT EXISTS cloudinary_public_id TEXT,
  ADD COLUMN IF NOT EXISTS cloudinary_version TEXT,
  ADD COLUMN IF NOT EXISTS secure_url TEXT,
  ADD COLUMN IF NOT EXISTS delivery_url TEXT,
  ADD COLUMN IF NOT EXISTS folder TEXT DEFAULT 'vaakil/uploads',
  ADD COLUMN IF NOT EXISTS provider TEXT DEFAULT 'cloudinary',
  ADD COLUMN IF NOT EXISTS resource_type TEXT DEFAULT 'image', -- image, video, document, audio, archive
  
  ADD COLUMN IF NOT EXISTS etag TEXT,
  ADD COLUMN IF NOT EXISTS original_filename TEXT,
  
  ADD COLUMN IF NOT EXISTS caption TEXT,
  ADD COLUMN IF NOT EXISTS title TEXT,
  ADD COLUMN IF NOT EXISTS photographer TEXT,
  ADD COLUMN IF NOT EXISTS photographer_url TEXT,
  ADD COLUMN IF NOT EXISTS ai_prompt TEXT,
  ADD COLUMN IF NOT EXISTS keywords JSONB,
  ADD COLUMN IF NOT EXISTS dominant_color TEXT,
  
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS deleted_by UUID,
  
  ADD COLUMN IF NOT EXISTS license_type TEXT,
  ADD COLUMN IF NOT EXISTS attribution_required BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS attribution_text TEXT,
  ADD COLUMN IF NOT EXISTS source_url TEXT,
  ADD COLUMN IF NOT EXISTS downloaded_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS origin TEXT DEFAULT 'manual_upload';

-- Ensure file_hash exists from earlier iteration
ALTER TABLE public.media_library ADD COLUMN IF NOT EXISTS file_hash TEXT;

-- 2. Create Media Usage (Relationships)
CREATE TABLE IF NOT EXISTS public.media_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  media_id UUID NOT NULL REFERENCES public.media_library(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL, -- e.g. 'blogs', 'services', 'campaigns'
  entity_id UUID NOT NULL,
  field_name TEXT NOT NULL, -- e.g. 'thumbnail', 'hero_image'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(media_id, entity_type, entity_id, field_name)
);
ALTER TABLE public.media_usage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin read media_usage" ON public.media_usage FOR SELECT TO authenticated USING (public.is_admin());

-- 3. Create Media Activity (Audit)
CREATE TABLE IF NOT EXISTS public.media_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  asset_id UUID NOT NULL REFERENCES public.media_library(id) ON DELETE CASCADE,
  user_id UUID,
  action TEXT NOT NULL, -- uploaded, edited, renamed, deleted, restored
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.media_activity ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin read media_activity" ON public.media_activity FOR SELECT TO authenticated USING (public.is_admin());

-- 4. Create Media Collections
CREATE TABLE IF NOT EXISTS public.media_collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.media_collections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin read media_collections" ON public.media_collections FOR SELECT TO authenticated USING (public.is_admin());

CREATE TABLE IF NOT EXISTS public.media_collection_items (
  collection_id UUID NOT NULL REFERENCES public.media_collections(id) ON DELETE CASCADE,
  media_id UUID NOT NULL REFERENCES public.media_library(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (collection_id, media_id)
);
ALTER TABLE public.media_collection_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin read media_collection_items" ON public.media_collection_items FOR SELECT TO authenticated USING (public.is_admin());
