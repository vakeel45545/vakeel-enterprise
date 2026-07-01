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
import { generateText } from '@/lib/ai/gemini';
import { createServiceRoleClient } from '@/lib/supabase/server';

interface PublishedBlogData {
  id: string;
  title: string;
  slug: string;
  category?: string | null;
  tags?: string[] | null;
  content_type?: string;
  table_name?: string;
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

    // 2. Webhook dispatch (Standard)
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
      } catch {}
    },

    // 3. Social Marketing Automation (AI Caption + Webhook)
    async () => {
      try {
        const supabase = createServiceRoleClient();
        const tableName = blog.table_name || 'blogs';
        const contentType = blog.content_type || 'blog';
        
        // Ensure we actually have content to summarize
        const { data } = await supabase.from(tableName).select('content, thumbnail').eq('id', blog.id).single();
        if (!data) return;

        // Generate Social Caption
        const prompt = `You are a social media manager for Vakeel (an Indian Legal & Compliance platform).
Write an engaging, professional LinkedIn/Twitter post for our new ${contentType}: "${blog.title}".

Context:
${(data.content || '').substring(0, 1500).replace(/<[^>]*>?/gm, ' ')}

Rules:
1. Maximum 280 characters if possible, but prioritize engagement.
2. Use 2-3 relevant emojis.
3. Include 3-4 hashtags at the bottom (e.g. #StartupIndia #Compliance).
4. End with a call to action asking them to read the full guide.
Do not include quotation marks around the output.`;

        const caption = await generateText(prompt);

        // Store caption for future reuse (e.g., in a social media manager UI)
        await supabase.from(tableName).update({ social_excerpt: caption }).eq('id', blog.id);

        // Dispatch to Zapier / Make / N8N
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vakeel.com';
        const pathPrefix = contentType === 'blog' ? '/blog/' : contentType === 'service' ? '/services/' : '/';
        const url = `${baseUrl}${pathPrefix}${blog.slug}`;

        dispatchWebhook('social.distribute', {
          id: blog.id,
          content_type: contentType,
          title: blog.title,
          url,
          caption,
          image: data.thumbnail,
          published_at: new Date().toISOString(),
        });
      } catch {
        // AI failure or Webhook failure shouldn't crash the pipeline
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
