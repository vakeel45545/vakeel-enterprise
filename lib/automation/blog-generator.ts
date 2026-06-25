/**
 * Automated Blog Generator — Enterprise Content Pipeline
 * 
 * Generates a complete blog post autonomously:
 * Topic → Content → SEO → Images → Slug → Tags → ReadingTime → DB Insert → Webhooks
 * 
 * Reuses existing modules:
 * - lib/ai/gemini.ts (Gemini text generation)
 * - lib/media/searchImages.ts (image search)
 * - lib/media/uploader.ts (storage + media library)
 * - lib/webhooks/dispatcher.ts (webhook events)
 * 
 * Never duplicates existing logic. Never crashes.
 */

import { generateText, parseJsonResponse } from '@/lib/ai/gemini';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { acquireFeaturedImage, acquireInlineImages } from './image-pipeline';
import { runPostPublishPipeline, runPostCreationPipeline } from './post-publish';

// ─── Types ──────────────────────────────────────────────

export interface BlogGenerationConfig {
  keywords?: string[];
  publishImmediately?: boolean;
  category?: string;
  authorId?: string;
}

export interface BlogGenerationResult {
  success: boolean;
  blogId?: string;
  title?: string;
  slug?: string;
  imageSource?: string;
  retries?: number;
  durationMs?: number;
  error?: string;
}

interface GeneratedMeta {
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  tags: string[];
  category: string;
}

interface GeneratedSEO {
  metaTitle: string;
  metaDescription: string;
  tags: string[];
  ogDescription: string;
}

// ─── Retry Helper ───────────────────────────────────────

async function withRetry<T>(
  fn: () => Promise<T>,
  label: string,
  maxAttempts: number = 3,
  delays: number[] = [2000, 5000, 10000]
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err: unknown) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt < maxAttempts) {
        const delay = delays[attempt - 1] || 10000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error(`${label} failed after ${maxAttempts} attempts`);
}

// ─── Topic Generation ───────────────────────────────────

const FALLBACK_TOPICS = [
  'GST Registration Guide for Indian Startups in 2025',
  'How to Register a Private Limited Company in India',
  'Trademark Registration Process and Benefits in India',
  'MSME Registration: Complete Guide for Small Businesses',
  'Income Tax Filing: Essential Tips for Salaried Professionals',
  'Legal Compliance Checklist for New Businesses in India',
  'Understanding Corporate Law: Key Provisions for Indian Companies',
  'Intellectual Property Protection Strategies for Startups',
  'FSSAI License: Requirements and Application Process',
  'Employment Laws Every Indian Employer Must Know',
  'Shop and Establishment Act: State-wise Compliance Guide',
  'Digital Signature Certificate: Types and Applications',
  'Import Export Code (IEC): Registration and Benefits',
  'Partnership Firm vs LLP: Which is Better for Your Business',
  'Annual Compliance Requirements for Private Limited Companies',
];

async function generateTopic(
  supabase: ReturnType<typeof createServiceRoleClient>,
  config: BlogGenerationConfig
): Promise<string> {
  // 1. Use admin-configured keywords if available
  if (config.keywords && config.keywords.length > 0) {
    const keyword = config.keywords[Math.floor(Math.random() * config.keywords.length)];
    
    // Check if a blog with a similar title already exists
    const { data: existing } = await supabase
      .from('blogs')
      .select('id')
      .ilike('title', `%${keyword}%`)
      .limit(1);

    if (!existing || existing.length === 0) {
      return keyword;
    }
    // If the keyword was already used, generate a variation via AI
  }

  // 2. AI-generated topic with deduplication
  try {
    const { data: existingBlogs } = await supabase
      .from('blogs')
      .select('title')
      .order('created_at', { ascending: false })
      .limit(20);

    const existingTitles = (existingBlogs || []).map(b => b.title).join('\n');

    const prompt = `You are an Indian legal content strategist. Generate ONE unique blog topic for Vakeel, an AI-powered legal platform.

The topic must be specific, SEO-friendly, and relevant to Indian law, compliance, tax, or business registration.

EXISTING blog titles (DO NOT repeat these topics):
${existingTitles || 'None yet'}

Return ONLY valid JSON: { "topic": "Your Blog Topic Here" }`;

    const raw = await generateText(prompt, { responseMimeType: 'application/json' });
    const parsed = parseJsonResponse<{ topic: string }>(raw);
    if (parsed.topic) return parsed.topic;
  } catch {
    // Fall through to fallback
  }

  // 3. Fallback to predefined topics (with dedup check)
  const { data: allBlogs } = await supabase
    .from('blogs')
    .select('title');

  const usedTitles = new Set((allBlogs || []).map(b => b.title?.toLowerCase()));
  const unusedTopic = FALLBACK_TOPICS.find(t => !usedTitles.has(t.toLowerCase()));

  return unusedTopic || `Legal Compliance Update: ${new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}`;
}

// ─── Content Generation ─────────────────────────────────

async function generateBlogContent(topic: string): Promise<{ meta: GeneratedMeta; content: string }> {
  // Step 1: Generate metadata as JSON
  const metaPrompt = `You are an expert Indian legal content strategist for Vakeel.

Generate blog metadata for the topic: "${topic}"

Respond with a JSON object with these exact keys:
- title: SEO-friendly blog title
- slug: URL slug (lowercase, hyphens only, no special chars)
- metaTitle: SEO meta title under 60 characters
- metaDescription: SEO meta description under 160 characters
- tags: array of 5-8 keyword strings
- category: one of Legal, Tax, GST, Compliance, Startup, Trademark`;

  const metaRaw = await generateText(metaPrompt, { responseMimeType: 'application/json' });
  const meta = parseJsonResponse<GeneratedMeta>(metaRaw);

  // Step 2: Generate the full HTML content
  const contentPrompt = `You are an expert Indian legal content writer for Vakeel, an AI-powered legal platform.

Write a complete, SEO-optimized blog post in HTML for:
Title: "${meta.title}"
Topic: "${topic}"

Output ONLY the HTML content — no JSON, no markdown fences, no explanation, no preamble.
Use these HTML tags only: <h2>, <h3>, <p>, <ul>, <li>, <ol>, <strong>, <em>, <blockquote>
Do NOT include <html>, <body>, <head> tags.
Do NOT include <img> tags — images will be inserted separately.

Structure:
1. Introduction (2-3 paragraphs)
2. 4-6 main sections with <h2> headings and <h3> sub-sections
3. Step-by-step process with <ol>
4. Required documents or key points with <ul>
5. FAQ section with 6 questions (use <h3> for question, <p> for answer)
6. Conclusion (1-2 paragraphs)

Target: Indian audience, 1500-2000 words, professional but accessible tone.`;

  const content = await generateText(contentPrompt);

  return { meta, content };
}

// ─── SEO Enhancement ────────────────────────────────────

async function generateSEO(title: string, content: string): Promise<GeneratedSEO> {
  const plainText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 2000);

  const prompt = `You are an SEO expert specializing in Indian legal and compliance content.

Based on this blog post, generate optimal SEO metadata:

Title: "${title}"
Content Summary: "${plainText}"

Return a JSON object with EXACTLY this structure:
{
  "metaTitle": "SEO title under 60 characters, includes primary keyword",
  "metaDescription": "Compelling meta description under 160 characters with CTA",
  "tags": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", "keyword6", "keyword7", "keyword8"],
  "ogDescription": "Open Graph description under 200 characters"
}

Focus on Indian legal/compliance search queries. Output ONLY valid JSON.`;

  const raw = await generateText(prompt, { responseMimeType: 'application/json' });
  return parseJsonResponse<GeneratedSEO>(raw);
}

// ─── Slug Uniqueness ────────────────────────────────────

async function ensureUniqueSlug(
  supabase: ReturnType<typeof createServiceRoleClient>,
  baseSlug: string
): Promise<string> {
  let slug = baseSlug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/(^-|-$)/g, '');
  let suffix = 1;

  while (true) {
    const candidate = suffix === 1 ? slug : `${slug}-${suffix}`;
    const { data } = await supabase
      .from('blogs')
      .select('id')
      .eq('slug', candidate)
      .limit(1);

    if (!data || data.length === 0) {
      return candidate;
    }
    suffix++;
    if (suffix > 100) {
      return `${slug}-${Date.now()}`;
    }
  }
}

// ─── Reading Time ───────────────────────────────────────

function calculateReadingTime(html: string): number {
  const plainText = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = plainText.split(' ').filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

// ─── Insert Inline Images ───────────────────────────────

function insertInlineImages(html: string, images: Array<{ url: string; alt: string }>): string {
  if (images.length === 0) return html;

  // Find all <h2> positions to insert images between sections
  const h2Regex = /<\/h2>\s*<p>/g;
  const matches: number[] = [];
  let match: RegExpExecArray | null;

  while ((match = h2Regex.exec(html)) !== null) {
    matches.push(match.index + match[0].length);
  }

  if (matches.length === 0) return html;

  // Distribute images evenly among sections
  let result = html;
  let offset = 0;

  const insertionPoints = matches.filter((_, i) => {
    // Insert after 2nd, 4th h2 sections (skip first — too close to top)
    return i > 0 && i % 2 === 0;
  }).slice(0, images.length);

  for (let i = 0; i < Math.min(insertionPoints.length, images.length); i++) {
    const img = images[i];
    const imgTag = `<img src="${img.url}" alt="${img.alt}" style="width:100%;border-radius:8px;margin:16px 0" />`;
    const pos = insertionPoints[i] + offset;
    result = result.slice(0, pos) + imgTag + result.slice(pos);
    offset += imgTag.length;
  }

  return result;
}

// ─── Main Pipeline ──────────────────────────────────────

/**
 * Generate a complete blog post autonomously.
 * 
 * Pipeline: Topic → Content → SEO → Images → Slug → Tags → ReadingTime → DB Insert → Webhooks
 * 
 * Never throws — returns a result object with success/error status.
 */
export async function generateCompleteBlog(
  config: BlogGenerationConfig = {}
): Promise<BlogGenerationResult> {
  const startTime = Date.now();
  let retries = 0;

  try {
    const supabase = createServiceRoleClient();

    // ── Step 1: Generate Topic ──
    const topic = await generateTopic(supabase, config);

    // ── Step 2: Generate Blog Content (with retry) ──
    let meta: GeneratedMeta;
    let content: string;

    try {
      const result = await withRetry(
        () => generateBlogContent(topic),
        'Blog generation',
        3,
        [2000, 5000, 10000]
      );
      meta = result.meta;
      content = result.content;
    } catch (err) {
      return {
        success: false,
        durationMs: Date.now() - startTime,
        error: `Blog content generation failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
      };
    }

    // ── Step 3: Generate SEO (with retry, non-blocking) ──
    let seo: GeneratedSEO | null = null;
    try {
      seo = await withRetry(
        () => generateSEO(meta.title, content),
        'SEO generation',
        2,
        [2000, 5000]
      );
    } catch {
      // SEO failure is non-fatal — use metadata from blog generation
    }

    // ── Step 4: Acquire Featured Image ──
    let featuredImage = await acquireFeaturedImage(topic);

    // ── Step 5: Acquire Inline Images ──
    // Extract h2 texts for subtopics
    const h2Regex = /<h2[^>]*>(.*?)<\/h2>/gi;
    const subtopics: string[] = [];
    let h2Match: RegExpExecArray | null;
    while ((h2Match = h2Regex.exec(content)) !== null) {
      subtopics.push(h2Match[1].replace(/<[^>]*>/g, '').trim());
    }

    let inlineImages: Array<{ url: string; alt: string }> = [];
    try {
      const acquired = await acquireInlineImages(topic, subtopics, 2);
      inlineImages = acquired.map(img => ({ url: img.url, alt: img.alt }));
    } catch {
      // Inline images are non-critical
    }

    // Insert inline images into content
    const contentWithImages = insertInlineImages(content, inlineImages);

    // ── Step 6: Unique Slug ──
    const uniqueSlug = await ensureUniqueSlug(supabase, meta.slug);

    // ── Step 7: Category & Tags ──
    const category = config.category || meta.category || 'Legal';
    const tags = seo?.tags || meta.tags || [];

    // ── Step 8: Reading Time ──
    const readingTime = calculateReadingTime(contentWithImages);

    // ── Step 9: DB Insert ──
    const publishNow = config.publishImmediately ?? false;
    const now = new Date().toISOString();

    const blogData = {
      title: meta.title,
      slug: uniqueSlug,
      content: contentWithImages,
      category,
      tags,
      thumbnail: featuredImage.url,
      og_image: featuredImage.url,
      featured_image_id: featuredImage.mediaId,
      og_image_id: featuredImage.mediaId,
      meta_title: seo?.metaTitle || meta.metaTitle,
      meta_description: seo?.metaDescription || meta.metaDescription,
      reading_time: readingTime,
      author_id: config.authorId || null,
      published: publishNow,
      status: publishNow ? 'published' : 'draft',
      published_at: publishNow ? now : null,
      created_at: now,
      updated_at: now,
    };

    const { data: inserted, error: insertErr } = await supabase
      .from('blogs')
      .insert([blogData])
      .select('id')
      .single();

    if (insertErr) {
      return {
        success: false,
        title: meta.title,
        slug: uniqueSlug,
        durationMs: Date.now() - startTime,
        error: `DB insert failed: ${insertErr.message}`,
      };
    }

    // ── Step 10: Post-publish pipeline ──
    const blogInfo = {
      id: inserted.id,
      title: meta.title,
      slug: uniqueSlug,
      category,
      tags,
    };

    if (publishNow) {
      await runPostPublishPipeline(blogInfo);
    } else {
      await runPostCreationPipeline(blogInfo);
    }

    return {
      success: true,
      blogId: inserted.id,
      title: meta.title,
      slug: uniqueSlug,
      imageSource: featuredImage.source,
      retries,
      durationMs: Date.now() - startTime,
    };
  } catch (err: unknown) {
    return {
      success: false,
      durationMs: Date.now() - startTime,
      error: err instanceof Error ? err.message : 'Unknown pipeline error',
    };
  }
}
