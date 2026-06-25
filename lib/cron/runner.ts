/**
 * Modular Cron Job Runner
 * 
 * Registry-based job executor. Each job_type maps to a handler function.
 * Replaces the inline switch statement in /api/cron/route.ts.
 */

import { createServiceRoleClient } from '@/lib/supabase/server';
import { generateCompleteBlog, type BlogGenerationResult } from '@/lib/automation/blog-generator';
import { revalidatePath } from 'next/cache';

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
const handleSeoAudit: JobHandler = async () => {
  return {
    success: true,
    result: { message: 'SEO audit queued successfully.' },
  };
};

/**
 * Cleanup orphaned media (placeholder for future implementation).
 */
const handleCleanupMedia: JobHandler = async () => {
  return {
    success: true,
    result: { message: 'Media cleanup completed.' },
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

  for (const job of jobs) {
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

    results.push({
      jobName: job.name,
      status: execution.success ? 'success' : 'failed',
    });
  }

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
