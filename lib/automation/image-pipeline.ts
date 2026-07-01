/**
 * Image Pipeline — Multi-source image acquisition for automated blog generation.
 * 
 * Priority: Unsplash → Pexels → AI Generation → Placeholder
 * 
 * Reuses existing modules:
 * - lib/media/searchImages.ts (Unsplash/Pexels/AI search)
 * - lib/media/uploader.ts (Storage + Media Library)
 * 
 * This module adds server-side orchestration for cron/automation contexts.
 */

import { mediaService } from '@/lib/media/media-service';
import { searchImages } from '@/lib/media/searchImages';
import { uploadToMediaLibrary } from '@/lib/media/uploader';

export interface AcquiredImage {
  url: string;
  mediaId: string | null;
  source: 'unsplash' | 'pexels' | 'ai_generated' | 'placeholder';
  alt: string;
  cloudinaryUrl?: string;
  cloudinaryPublicId?: string;
}

/**
 * Acquire a single featured image for a blog topic.
 * Downloads remote images and stores them in Supabase Storage + media_library.
 * Never throws — always returns at least a placeholder.
 */
export async function acquireFeaturedImage(topic: string): Promise<AcquiredImage> {
  try {
    // 1. Search Universal Asset Manager first
    const existingAssets = await mediaService.search(topic, { limit: 1 });
    if (existingAssets && existingAssets.length > 0) {
      const asset = existingAssets[0];
      return {
        url: asset.secureUrl || asset.url,
        mediaId: asset.id,
        source: (asset.source as AcquiredImage['source']) || 'ai_generated',
        alt: asset.altText || topic,
        cloudinaryUrl: asset.secureUrl,
        cloudinaryPublicId: asset.publicId
      };
    }

    // 2. Fallback to external search (Unsplash/Pexels/AI)
    const images = await searchImages(topic);

    if (images && images.length > 0) {
      const selected = images[0];

      // If it's already in our library (AI-generated via searchImages), use directly
      if (selected.source === 'ai_generated' || selected.isLibrary) {
        return {
          url: selected.imageUrl || selected.url,
          mediaId: selected.id || null,
          source: (selected.source as AcquiredImage['source']) || 'ai_generated',
          alt: selected.alt || topic,
        };
      }
      // Remote image (Unsplash/Pexels) — download and store via MediaService pipeline
      // This ensures: SHA256 dedup → CloudinaryProvider upload → DB insert → AI metadata
      try {
        const media = await uploadToMediaLibrary({
          url: selected.downloadUrl || selected.imageUrl || selected.url,
          source: selected.source || 'unsplash',
          alt_text: selected.alt || topic,
          credits: selected.author || undefined,
        });

        return {
          url: media.url,
          mediaId: media.id,
          source: (selected.source as AcquiredImage['source']) || 'unsplash',
          alt: selected.alt || topic,
        };
      } catch (uploadErr) {
        // Upload failed — use the remote URL directly
        return {
          url: selected.imageUrl || selected.url,
          mediaId: null,
          source: (selected.source as AcquiredImage['source']) || 'unsplash',
          alt: selected.alt || topic,
        };
      }
    }
  } catch (err) {
    // searchImages itself failed — fall through to placeholder
  }

  // Ultimate fallback: placeholder
  const encoded = encodeURIComponent(topic.slice(0, 50));
  return {
    url: `https://images.unsplash.com/1600x900/?${encoded},legal,india&auto=format&fit=crop`,
    mediaId: null,
    source: 'placeholder',
    alt: topic,
  };
}

/**
 * Acquire multiple inline images for blog content.
 * Returns 2-3 images related to different aspects of the topic.
 */
export async function acquireInlineImages(
  topic: string,
  subtopics: string[],
  count: number = 2
): Promise<AcquiredImage[]> {
  const results: AcquiredImage[] = [];
  const queries = subtopics.length > 0
    ? subtopics.slice(0, count)
    : [`${topic} business`, `${topic} India legal`].slice(0, count);

  for (const query of queries) {
    try {
      const image = await acquireFeaturedImage(query);
      // Only include if it's not a placeholder
      if (image.source !== 'placeholder') {
        results.push(image);
      }
    } catch {
      // Skip this image, continue with others
    }
  }

  return results;
}
