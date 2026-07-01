-- =============================================
-- 10. CAMPAIGNS (STAGE 1: Enterprise Automation)
-- =============================================
CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  priority TEXT DEFAULT 'medium',           -- critical, high, medium, low
  status TEXT DEFAULT 'draft',              -- draft, active, paused, completed
  schedule TEXT,                            -- resolved cron expression
  schedule_preset TEXT,                     -- user-friendly key
  topics_per_run INTEGER DEFAULT 1,
  publish_immediately BOOLEAN DEFAULT false,
  auto_approve BOOLEAN DEFAULT false,       -- skip approval workflow
  author_id UUID,                           -- auth.users FK would normally go here
  template_id UUID,
  config JSONB,

  -- Counters
  total_topics INTEGER DEFAULT 0,
  completed_topics INTEGER DEFAULT 0,
  failed_topics INTEGER DEFAULT 0,
  published_topics INTEGER DEFAULT 0,
  review_topics INTEGER DEFAULT 0,

  -- Timing
  last_run_at TIMESTAMPTZ,
  next_run_at TIMESTAMPTZ,
  avg_topic_duration_ms INTEGER,
  estimated_completion_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin read campaigns" ON public.campaigns FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admin insert campaigns" ON public.campaigns FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admin update campaigns" ON public.campaigns FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin delete campaigns" ON public.campaigns FOR DELETE TO authenticated USING (public.is_admin());

-- =============================================
-- 11. CAMPAIGN TOPICS
-- =============================================
CREATE TABLE IF NOT EXISTS public.campaign_topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  status TEXT DEFAULT 'pending',            
  blog_id UUID REFERENCES public.blogs(id) ON DELETE SET NULL,

  -- Pipeline tracking
  current_stage TEXT,                       
  stages_completed JSONB DEFAULT '[]',      
  quality_score INTEGER,                    
  seo_score INTEGER,

  -- Retry
  error_message TEXT,
  retries INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 4,
  next_retry_at TIMESTAMPTZ,               
  last_error_at TIMESTAMPTZ,

  -- Metadata
  processing_started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  sort_order INTEGER DEFAULT 0
);

ALTER TABLE public.campaign_topics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin read campaign_topics" ON public.campaign_topics FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admin insert campaign_topics" ON public.campaign_topics FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admin update campaign_topics" ON public.campaign_topics FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin delete campaign_topics" ON public.campaign_topics FOR DELETE TO authenticated USING (public.is_admin());

-- =============================================
-- 12. CAMPAIGN LOGS
-- =============================================
CREATE TABLE IF NOT EXISTS public.campaign_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES public.campaign_topics(id) ON DELETE CASCADE,
  stage TEXT NOT NULL,
  status TEXT NOT NULL,
  duration_ms INTEGER,
  ai_provider TEXT,
  input_tokens INTEGER,
  output_tokens INTEGER,
  metadata JSONB,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.campaign_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin read campaign_logs" ON public.campaign_logs FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admin insert campaign_logs" ON public.campaign_logs FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admin update campaign_logs" ON public.campaign_logs FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin delete campaign_logs" ON public.campaign_logs FOR DELETE TO authenticated USING (public.is_admin());

-- =============================================
-- 13. AI USAGE LOGS
-- =============================================
CREATE TABLE IF NOT EXISTS public.ai_usage_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider TEXT NOT NULL,
  model TEXT,
  purpose TEXT,
  input_tokens INTEGER,
  output_tokens INTEGER,
  duration_ms INTEGER,
  status TEXT,
  error_message TEXT,
  source_type TEXT,
  source_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin read ai_usage_logs" ON public.ai_usage_logs FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admin insert ai_usage_logs" ON public.ai_usage_logs FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admin update ai_usage_logs" ON public.ai_usage_logs FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin delete ai_usage_logs" ON public.ai_usage_logs FOR DELETE TO authenticated USING (public.is_admin());

-- =============================================
-- 14. ALTER EXISTING TABLES
-- =============================================
ALTER TABLE public.blogs
  ADD COLUMN IF NOT EXISTS campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS campaign_topic_id UUID,
  ADD COLUMN IF NOT EXISTS quality_score INTEGER,
  ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'auto_approved';

ALTER TABLE public.cron_logs
  ADD COLUMN IF NOT EXISTS ai_provider TEXT,
  ADD COLUMN IF NOT EXISTS input_tokens INTEGER,
  ADD COLUMN IF NOT EXISTS output_tokens INTEGER;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON public.campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_priority ON public.campaigns(priority, status);
CREATE INDEX IF NOT EXISTS idx_campaign_topics_status ON public.campaign_topics(campaign_id, status);
CREATE INDEX IF NOT EXISTS idx_campaign_topics_retry ON public.campaign_topics(next_retry_at) WHERE status = 'failed';
CREATE INDEX IF NOT EXISTS idx_campaign_logs_campaign ON public.campaign_logs(campaign_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_provider ON public.ai_usage_logs(provider, created_at);
CREATE INDEX IF NOT EXISTS idx_blogs_campaign ON public.blogs(campaign_id);
