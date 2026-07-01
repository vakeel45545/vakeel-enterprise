/**
 * Modular Cron Job Runner
 * 
 * Registry-based job executor. Each job_type maps to a handler function.
 * Replaces the inline switch statement in /api/cron/route.ts.
 */

import { createServiceRoleClient } from '@/lib/supabase/server';
import { generateCompleteBlog, type BlogGenerationResult } from '@/lib/automation/blog-generator';
import { revalidatePath } from 'next/cache';
import { processCampaignBatch } from '../automation/campaign-runner';

// ─── Types ──────────────────────────────────────────────

export interface CronJob {
  id: string;
  name: string;
  schedule: string;
  job_type: string;
  config: Record<string, unknown> | null;
  active: boolean;
  last_run_at: string | null;
  last_status: string | null;
}

export interface CronExecutionResult {
  success: boolean;
  result?: Record<string, unknown>;
  error?: string;
  durationMs?: number;
  retries?: number;
  blogId?: string;
  imageSource?: string;
}

// ─── Job Handlers ───────────────────────────────────────

type JobHandler = (
  job: CronJob,
  supabase: ReturnType<typeof createServiceRoleClient>
) => Promise<CronExecutionResult>;

/**
 * Generate a complete blog post using the automation pipeline.
 */
const handleGenerateBlog: JobHandler = async (job) => {
  const config = job.config || {};
  const result: BlogGenerationResult = await generateCompleteBlog({
    keywords: Array.isArray(config.keywords) ? config.keywords as string[] : undefined,
    publishImmediately: config.publish_immediately === true,
    category: typeof config.category === 'string' ? config.category : undefined,
    authorId: typeof config.author_id === 'string' ? config.author_id : undefined,
  });

  if (result.success) {
    return {
      success: true,
      result: {
        message: 'Blog auto-generated successfully',
        blogId: result.blogId,
        title: result.title,
        slug: result.slug,
        imageSource: result.imageSource,
      },
      durationMs: result.durationMs,
      retries: result.retries,
      blogId: result.blogId,
      imageSource: result.imageSource,
    };
  }

  return {
    success: false,
    error: result.error || 'Blog generation failed',
    durationMs: result.durationMs,
  };
};

/**
 * Publish blogs whose scheduled_at time has passed.
 */
const handlePublishScheduled: JobHandler = async (_job, supabase) => {
  const { data, error } = await supabase
    .from('blogs')
    .update({
      published: true,
      status: 'published',
      published_at: new Date().toISOString(),
      scheduled_at: null,
    })
    .eq('status', 'scheduled')
    .lte('scheduled_at', new Date().toISOString())
    .select('id, title, slug');

  if (error) {
    return { success: false, error: error.message };
  }

  // Revalidate cache for each published blog
  const published = data || [];
  for (const blog of published) {
    try {
      revalidatePath(`/blog/${blog.slug}`);
    } catch {
      // Ignore revalidation errors
    }
  }

  if (published.length > 0) {
    try {
      revalidatePath('/blog');
      revalidatePath('/blogs-sitemap.xml');
    } catch {
      // Ignore
    }
  }

  return {
    success: true,
    result: {
      published_count: published.length,
      blogs: published,
    },
  };
};

/**
 * Refresh sitemap by revalidating sitemap paths.
 */
const handleRefreshSitemap: JobHandler = async () => {
  try {
    revalidatePath('/sitemap.xml');
    revalidatePath('/blogs-sitemap.xml');
    revalidatePath('/services-sitemap.xml');
    revalidatePath('/pages-sitemap.xml');
    revalidatePath('/categories-sitemap.xml');
  } catch {
    // Ignore revalidation errors
  }

  return {
    success: true,
    result: { message: 'Sitemap paths revalidated' },
  };
};

/**
 * SEO audit placeholder.
 */
const handleSeoAudit: JobHandler = async (_job, supabase) => {
  // 1. Fetch published pages
  const { data: blogs } = await supabase.from('blogs').select('id, slug, title, meta_title, meta_description').eq('published', true);
  const { data: industries } = await supabase.from('industries').select('id, slug, name, meta_title, meta_description').eq('published', true);
  
  if (!blogs && !industries) {
    return { success: true, result: { message: 'No published pages found to audit.' } };
  }

  let issuesFound = 0;
  const auditsToInsert: any[] = [];

  const auditPage = (url: string, pageType: string, metaTitle: string | null, metaDesc: string | null) => {
    let score = 100;
    const issues: string[] = [];

    if (!metaTitle) {
      score -= 30;
      issues.push('Missing Meta Title');
    } else if (metaTitle.length < 30 || metaTitle.length > 60) {
      score -= 10;
      issues.push('Meta Title length is not optimal (should be 30-60 chars)');
    }

    if (!metaDesc) {
      score -= 30;
      issues.push('Missing Meta Description');
    } else if (metaDesc.length < 120 || metaDesc.length > 160) {
      score -= 10;
      issues.push('Meta Description length is not optimal (should be 120-160 chars)');
    }

    if (issues.length > 0) {
      issuesFound += issues.length;
    }

    auditsToInsert.push({
      page_url: url,
      page_type: pageType,
      score,
      issues,
    });
  };

  (blogs || []).forEach(b => {
    auditPage(`/blog/${b.slug}`, 'blog', b.meta_title || b.title, b.meta_description);
  });

  (industries || []).forEach(i => {
    auditPage(`/industries/${i.slug}`, 'industry', i.meta_title || i.name, i.meta_description);
  });

  if (auditsToInsert.length === 0) {
    return { success: true, result: { message: 'No pages to insert for audit.' } };
  }

  // Clear previous audits to keep the table fresh
  await supabase.from('seo_audits').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  
  const { error: insertError } = await supabase.from('seo_audits').insert(auditsToInsert);

  if (insertError) {
    return { success: false, error: `Failed to insert SEO audits: ${insertError.message}` };
  }

  return {
    success: true,
    result: { message: `SEO audit completed. Audited ${auditsToInsert.length} pages, found ${issuesFound} issues.` },
  };
};

/**
 * Cleanup orphaned media (placeholder for future implementation).
 */
const handleCleanupMedia: JobHandler = async (_job, supabase) => {
  // 1. Fetch all media in the library
  const { data: media } = await supabase.from('media_library').select('id, url, filename');
  
  if (!media || media.length === 0) {
    return { success: true, result: { message: 'No media found to cleanup.' } };
  }

  // 2. Fetch all references
  const { data: blogs } = await supabase.from('blogs').select('thumbnail, content');
  const { data: industries } = await supabase.from('industries').select('image_url, icon, og_image');
  const { data: services } = await supabase.from('services').select('icon, og_image');

  // Build a set of all used URLs
  const usedUrls = new Set<string>();

  const extractUrls = (content: string | null) => {
    if (!content) return;
    const urlRegex = /https?:\/\/[^\s"'<>]+/g;
    const matches = content.match(urlRegex) || [];
    matches.forEach(m => usedUrls.add(m));
  };

  (blogs || []).forEach(b => {
    if (b.thumbnail) usedUrls.add(b.thumbnail);
    extractUrls(b.content);
  });

  (industries || []).forEach(i => {
    if (i.image_url) usedUrls.add(i.image_url);
    if (i.icon) usedUrls.add(i.icon);
    if (i.og_image) usedUrls.add(i.og_image);
  });

  (services || []).forEach(s => {
    if (s.icon) usedUrls.add(s.icon);
    if (s.og_image) usedUrls.add(s.og_image);
  });

  // 3. Find orphaned media
  const orphaned = media.filter(m => !usedUrls.has(m.url));

  if (orphaned.length === 0) {
    return { success: true, result: { message: 'No orphaned media found.' } };
  }

  // 4. Soft-delete orphaned assets via MediaService (provider-agnostic)
  const { mediaService } = await import('@/lib/media/media-service');
  let deletedCount = 0;

  for (const orphan of orphaned) {
    const success = await mediaService.softDelete(orphan.id);
    if (success) deletedCount++;
  }

  return {
    success: true,
    result: { message: `Soft-deleted ${deletedCount} orphaned media files (out of ${orphaned.length} found).` },
  };
};

// ─── Job Registry ───────────────────────────────────────

const JOB_REGISTRY: Record<string, JobHandler> = {
  generate_blog: handleGenerateBlog,
  auto_generate_blog: handleGenerateBlog, // Alias for backwards compatibility
  publish_scheduled: handlePublishScheduled,
  publish_scheduled_blogs: handlePublishScheduled, // Alias
  refresh_sitemap: handleRefreshSitemap,
  generate_sitemap: handleRefreshSitemap, // Alias
  seo_audit: handleSeoAudit,
  cleanup_media: handleCleanupMedia,
  run_campaign: async (job, supabase) => {
    const campaignId = job.config?.campaign_id as string;
    if (!campaignId) {
      // Find highest priority active campaign if none specified
      const { data } = await supabase
        .from('campaigns')
        .select('id, topics_per_run')
        .eq('status', 'active')
        .order('priority', { ascending: true }) // assuming priority is a number or enum we can sort
        .limit(1)
        .single();
        
      if (data) {
        const result = await processCampaignBatch(data.id, Number(data.topics_per_run) || 1);
        return { success: true, result: { ...result } as Record<string, unknown> };
      }
      return { success: true, result: { message: 'No active campaigns found' } };
    }
    const result = await processCampaignBatch(campaignId, Number(job.config?.topics_per_run) || 1);
    return { success: true, result: { ...result } as Record<string, unknown> };
  }
};

// ─── Runner ─────────────────────────────────────────────

/**
 * Execute a single cron job by looking up its handler in the registry.
 */
export async function executeJob(
  job: CronJob,
  supabase: ReturnType<typeof createServiceRoleClient>
): Promise<CronExecutionResult> {
  const handler = JOB_REGISTRY[job.job_type];

  if (!handler) {
    return {
      success: false,
      error: `Unknown job type: ${job.job_type}`,
    };
  }

  try {
    return await handler(job, supabase);
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Execution error',
    };
  }
}

/**
 * Run all active cron jobs, logging results.
 */
export async function runAllActiveJobs(): Promise<Array<{ jobName: string; status: string }>> {
  const supabase = createServiceRoleClient();

  const { data: jobs, error } = await supabase
    .from('cron_jobs')
    .select('*')
    .eq('active', true);

  if (error || !jobs || jobs.length === 0) {
    return [];
  }

  const results: Array<{ jobName: string; status: string }> = [];
  const APP_URL = process.env.APP_URL || 'http://localhost:3000';
  const CRON_SECRET = process.env.CRON_SECRET || 'vakeel-dev-cron-secret-2026';

  const dispatchPromises = jobs.map(async (job) => {
    try {
      const res = await fetch(`${APP_URL}/api/cron/worker`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CRON_SECRET}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ job_id: job.id }),
      });
      
      results.push({
        jobName: job.name as string,
        status: res.ok ? 'dispatched' : 'dispatch_failed',
      });
    } catch (err) {
      results.push({
        jobName: job.name as string,
        status: 'dispatch_failed',
      });
    }
  });

  await Promise.allSettled(dispatchPromises);

  return results;
}

/**
 * Run a single job by ID.
 */
export async function runJobById(jobId: string): Promise<CronExecutionResult> {
  const supabase = createServiceRoleClient();

  const { data: job, error } = await supabase
    .from('cron_jobs')
    .select('*')
    .eq('id', jobId)
    .single();

  if (error || !job) {
    return { success: false, error: 'Job not found' };
  }

  const startedAt = new Date().toISOString();
  const startMs = Date.now();

  const execution = await executeJob(job as CronJob, supabase);

  const completedAt = new Date().toISOString();
  const durationMs = Date.now() - startMs;

  // Log the run
  await supabase.from('cron_logs').insert([{
    cron_job_id: job.id,
    status: execution.success ? 'success' : 'failed',
    result: execution.result || { error: execution.error },
    started_at: startedAt,
    completed_at: completedAt,
    duration_ms: durationMs,
    retries: execution.retries || 0,
    blog_id: execution.blogId || null,
    image_source: execution.imageSource || null,
    error_message: execution.error || null,
  }]);

  // Update job metadata
  await supabase.from('cron_jobs').update({
    last_run_at: completedAt,
    last_status: execution.success ? 'success' : 'failed',
  }).eq('id', job.id);

  return execution;
}
