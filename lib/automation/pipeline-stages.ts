export interface PipelineStage {
  key: string;
  label: string;
  critical: boolean;
  retryable: boolean;
}

export const PIPELINE_STAGES: PipelineStage[] = [
  { key: 'topic',           label: 'Topic Parsing',         critical: true,  retryable: false },
  { key: 'outline',         label: 'Outline Generation',    critical: true,  retryable: true  },
  { key: 'research',        label: 'KB Research',           critical: false, retryable: true  },
  { key: 'content',         label: 'Content Generation',    critical: true,  retryable: true  },
  { key: 'seo',             label: 'SEO Optimization',      critical: false, retryable: true  },
  { key: 'faq',             label: 'FAQ Generation',        critical: false, retryable: true  },
  { key: 'hero_image',      label: 'Hero Image',            critical: false, retryable: true  },
  { key: 'inline_images',   label: 'Inline Images',         critical: false, retryable: false },
  { key: 'cloudinary',      label: 'Cloudinary Upload',     critical: false, retryable: true  },
  { key: 'internal_links',  label: 'Internal Linking',      critical: false, retryable: false },
  { key: 'promo_blocks',    label: 'Promotional Blocks',    critical: false, retryable: false },
  { key: 'quality_check',   label: 'Quality Scoring',       critical: false, retryable: false },
  { key: 'schema',          label: 'Schema Generation',     critical: false, retryable: false },
  { key: 'db_insert',       label: 'Database Insert',       critical: true,  retryable: true  },
];

export async function logStageEvent(
  campaignId: string, 
  topicId: string, 
  stageKey: string, 
  status: 'started' | 'success' | 'failed' | 'skipped',
  options?: {
    durationMs?: number,
    aiProvider?: string,
    error?: string,
    metadata?: any
  }
) {
  try {
    const { createServiceRoleClient } = await import('@/lib/supabase/server');
    const supabase = createServiceRoleClient();
    
    await supabase.from('campaign_logs').insert([{
      campaign_id: campaignId,
      topic_id: topicId,
      stage: stageKey,
      status,
      duration_ms: options?.durationMs || null,
      ai_provider: options?.aiProvider || null,
      error_message: options?.error || null,
      metadata: options?.metadata || null
    }]);

    // Also update current_stage on topic
    if (status === 'started') {
      await supabase.from('campaign_topics').update({ current_stage: stageKey }).eq('id', topicId);
    } else if (status === 'success') {
      // Append to stages_completed
      // In a real implementation this would fetch existing array or use a stored procedure
    }
  } catch (err) {
    console.error('Failed to log stage event', err);
  }
}
