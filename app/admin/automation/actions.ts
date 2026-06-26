'use server';

import { verifyAdminAndGetClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

const CRON_SECRET = process.env.CRON_SECRET || 'vakeel-dev-cron-secret-2026';
const APP_URL = process.env.APP_URL || 'http://localhost:3000';

/**
 * Trigger a full blog generation asynchronously via the worker endpoint.
 */
export async function triggerBlogGeneration(): Promise<{ success: boolean; error?: string }> {
  const supabase = await verifyAdminAndGetClient(); // Auth check

  try {
    // Find the generate_blog job
    const { data: job } = await supabase
      .from('cron_jobs')
      .select('id')
      .eq('job_type', 'generate_blog')
      .limit(1)
      .maybeSingle();

    if (!job) {
      return { success: false, error: 'Generate Blog cron job not found in registry.' };
    }

    // Dispatch the worker asynchronously
    const res = await fetch(`${APP_URL}/api/cron/worker`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CRON_SECRET}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ job_id: job.id }),
    });

    if (!res.ok) {
      const text = await res.text();
      return { success: false, error: text };
    }

    revalidatePath('/admin/automation');
    revalidatePath('/admin/blogs');
    revalidatePath('/admin/cron');
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'Trigger failed' };
  }
}

/**
 * Trigger a specific cron job by ID.
 */
export async function triggerJobById(jobId: string): Promise<{ success: boolean; error?: string }> {
  await verifyAdminAndGetClient(); // Auth check

  try {
    const res = await fetch(`${APP_URL}/api/cron`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CRON_SECRET}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ job_id: jobId }),
    });

    if (!res.ok) {
      const text = await res.text();
      return { success: false, error: text };
    }

    revalidatePath('/admin/automation');
    revalidatePath('/admin/blogs');
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'Trigger failed' };
  }
}

/**
 * Toggle a cron job active/inactive.
 */
export async function toggleCronJob(jobId: string, active: boolean): Promise<{ success: boolean }> {
  const supabase = await verifyAdminAndGetClient();

  const { error } = await supabase
    .from('cron_jobs')
    .update({ active })
    .eq('id', jobId);

  if (error) return { success: false };

  revalidatePath('/admin/automation');
  revalidatePath('/admin/cron');
  return { success: true };
}

/**
 * Refresh sitemaps manually.
 */
export async function refreshSitemaps(): Promise<{ success: boolean }> {
  await verifyAdminAndGetClient();

  try {
    revalidatePath('/sitemap.xml');
    revalidatePath('/blogs-sitemap.xml');
    revalidatePath('/services-sitemap.xml');
    revalidatePath('/pages-sitemap.xml');
    revalidatePath('/categories-sitemap.xml');
    revalidatePath('/admin/automation');
  } catch {
    // Ignore
  }

  return { success: true };
}

/**
 * Invalidate all caches.
 */
export async function refreshAllCaches(): Promise<{ success: boolean }> {
  await verifyAdminAndGetClient();

  try {
    revalidatePath('/');
    revalidatePath('/blog');
    revalidatePath('/services');
    revalidatePath('/industries');
    revalidatePath('/admin/automation');
  } catch {
    // Ignore
  }

  return { success: true };
}
