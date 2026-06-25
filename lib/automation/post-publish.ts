/**
 * Post-Publish Pipeline — runs after any blog is published (manual or automated).
 * 
 * Handles:
 * - Cache invalidation (revalidatePath)
 * - Webhook dispatch
 * - Search index is inherently up-to-date (search API queries DB live)
 */

import { revalidatePath } from 'next/cache';
import { dispatchWebhook } from '@/lib/webhooks/dispatcher';

interface PublishedBlogData {
  id: string;
  title: string;
  slug: string;
  category?: string | null;
  tags?: string[] | null;
}

/**
 * Run all post-publish tasks. Never throws — all errors are caught internally.
 */
export async function runPostPublishPipeline(blog: PublishedBlogData): Promise<void> {
  const tasks = [
    // 1. Cache invalidation
    async () => {
      try {
        revalidatePath('/blog');
        revalidatePath('/');
        revalidatePath(`/blog/${blog.slug}`);
        revalidatePath('/blogs-sitemap.xml');
        revalidatePath('/sitemap.xml');
      } catch {
        // revalidatePath can fail outside request context — safe to ignore
      }
    },

    // 2. Webhook dispatch
    async () => {
      try {
        dispatchWebhook('blog.published', {
          id: blog.id,
          title: blog.title,
          slug: blog.slug,
          category: blog.category,
          tags: blog.tags,
          published_at: new Date().toISOString(),
        });
      } catch {
        // Webhook dispatch is fire-and-forget, never block
      }
    },
  ];

  await Promise.allSettled(tasks.map(fn => fn()));
}

/**
 * Run post-creation tasks (for drafts that aren't published yet).
 */
export async function runPostCreationPipeline(blog: PublishedBlogData): Promise<void> {
  try {
    dispatchWebhook('blog.created', {
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      created_at: new Date().toISOString(),
    });
  } catch {
    // Never throw from post-creation pipeline
  }
}
