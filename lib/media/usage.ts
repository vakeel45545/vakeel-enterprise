/**
 * Media Usage Tracking Service
 * 
 * Tracks which entities (blogs, services, industries, pages, campaigns)
 * reference which media assets, and through which field.
 * 
 * This enables:
 *   - "Used in 12 Blogs, 5 Services" display before deletion
 *   - Orphan detection (assets with 0 usage records)
 *   - Impact analysis when replacing/deleting an asset
 */

import { createServiceRoleClient } from '@/lib/supabase/server';

export interface MediaUsageRecord {
  mediaId: string;
  entityType: string;   // 'blogs', 'services', 'industries', 'pages', 'campaigns'
  entityId: string;
  fieldName: string;    // 'thumbnail', 'hero_image', 'inline_content', 'og_image', 'icon'
}

/**
 * Record that a media asset is being used by an entity.
 * Upserts to avoid duplicates.
 */
export async function trackUsage(usage: MediaUsageRecord): Promise<void> {
  const supabase = createServiceRoleClient();

  const { error } = await supabase
    .from('media_usage')
    .upsert({
      media_id: usage.mediaId,
      entity_type: usage.entityType,
      entity_id: usage.entityId,
      field_name: usage.fieldName,
    }, {
      onConflict: 'media_id,entity_type,entity_id,field_name'
    });

  if (error) {
    console.error('[MediaUsage] Failed to track usage:', error.message);
  }
}

/**
 * Remove usage tracking when an entity no longer uses an asset.
 */
export async function removeUsage(entityType: string, entityId: string, fieldName?: string): Promise<void> {
  const supabase = createServiceRoleClient();

  let query = supabase
    .from('media_usage')
    .delete()
    .eq('entity_type', entityType)
    .eq('entity_id', entityId);

  if (fieldName) {
    query = query.eq('field_name', fieldName);
  }

  const { error } = await query;
  if (error) {
    console.error('[MediaUsage] Failed to remove usage:', error.message);
  }
}

/**
 * Get all usage records for a specific media asset.
 * Returns grouped data: { blogs: 12, services: 5, pages: 2 }
 */
export async function getUsageSummary(mediaId: string): Promise<Record<string, number>> {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from('media_usage')
    .select('entity_type')
    .eq('media_id', mediaId);

  if (error || !data) return {};

  const summary: Record<string, number> = {};
  for (const record of data) {
    summary[record.entity_type] = (summary[record.entity_type] || 0) + 1;
  }
  return summary;
}

/**
 * Scan content HTML for media library URLs and auto-track them.
 * Used after saving blog/page content to automatically detect inline images.
 */
export async function scanAndTrackInlineImages(
  htmlContent: string,
  entityType: string,
  entityId: string
): Promise<number> {
  const supabase = createServiceRoleClient();
  
  // Extract all image URLs from HTML content
  const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
  const urls: string[] = [];
  let match;
  while ((match = imgRegex.exec(htmlContent)) !== null) {
    urls.push(match[1]);
  }

  if (urls.length === 0) return 0;

  // Find matching media_library records
  let tracked = 0;
  for (const url of urls) {
    const { data: mediaRecord } = await supabase
      .from('media_library')
      .select('id')
      .or(`url.eq.${url},secure_url.eq.${url},delivery_url.eq.${url}`)
      .limit(1)
      .maybeSingle();

    if (mediaRecord) {
      await trackUsage({
        mediaId: mediaRecord.id,
        entityType,
        entityId,
        fieldName: 'inline_content',
      });
      tracked++;
    }
  }

  return tracked;
}

/**
 * Track a direct field reference (e.g., blog.thumbnail = media.url).
 * Looks up the media_library record by URL and creates a usage entry.
 */
export async function trackFieldReference(
  url: string,
  entityType: string,
  entityId: string,
  fieldName: string
): Promise<void> {
  if (!url) return;

  const supabase = createServiceRoleClient();
  
  const { data: mediaRecord } = await supabase
    .from('media_library')
    .select('id')
    .or(`url.eq.${url},secure_url.eq.${url},delivery_url.eq.${url}`)
    .limit(1)
    .maybeSingle();

  if (mediaRecord) {
    await trackUsage({
      mediaId: mediaRecord.id,
      entityType,
      entityId,
      fieldName,
    });
  }
}
