/**
 * Universal Content Generator — Enterprise Content Pipeline
 * 
 * Generates polymorphic content autonomously:
 * Topic + Content Type → Prompt Router → Content → SEO → Images → DB Insert → Webhooks
 */

import { generateText, parseJsonResponse } from '@/lib/ai/gemini';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { acquireFeaturedImage, acquireInlineImages } from './image-pipeline';
import { runPostPublishPipeline, runPostCreationPipeline } from './post-publish';

// ─── Types ──────────────────────────────────────────────

export interface UniversalGenerationConfig {
  keywords?: string[];
  publishImmediately?: boolean;
  category?: string;
  authorId?: string;
  contentType?: string; // 'blog', 'service', 'industry', 'city', 'faq', 'page', 'service_city'
  serviceId?: string;
  cityId?: string;
  siteId?: string;
  existingId?: string;
  existingContent?: string;
}

export interface UniversalGenerationResult {
  success: boolean;
  contentId?: string;
  title?: string;
  slug?: string;
  imageSource?: string;
  relatedServiceIds?: string[];
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

async function generateTopic(
  supabase: ReturnType<typeof createServiceRoleClient>,
  config: UniversalGenerationConfig
): Promise<string> {
  if (config.keywords && config.keywords.length > 0) {
    return config.keywords[Math.floor(Math.random() * config.keywords.length)];
  }

  const prompt = `You are a content strategist for Vakeel, an Indian legal platform. 
Generate ONE unique topic for a ${config.contentType || 'blog'}.
Return ONLY valid JSON: { "topic": "Topic Name" }`;

  try {
    const raw = await generateText(prompt, { responseMimeType: 'application/json' });
    const parsed = parseJsonResponse<{ topic: string }>(raw);
    if (parsed.topic) return parsed.topic;
  } catch {}

  return `Legal Compliance: ${new Date().toLocaleDateString()}`;
}

// ─── Content Generation ─────────────────────────────────

function getPromptForType(contentType: string, topic: string, title: string, config?: { keywords?: string[], existingContent?: string }): string {
  const baseRules = `Output ONLY the HTML content — no JSON, no markdown fences, no explanation, no preamble.
Use these HTML tags only: <h2>, <h3>, <p>, <ul>, <li>, <ol>, <strong>, <em>, <blockquote>
Do NOT include <html>, <body>, <head> tags.
Do NOT include <img> tags.`;

  switch (contentType) {
    case 'service':
      return `Write a high-converting Service Landing Page for:
Title: "${title}"
Topic: "${topic}"

${baseRules}
Structure:
1. Compelling Hero Introduction (What it is, who it is for)
2. 3-4 Key Benefits (Use <ul>)
3. Step-by-Step Registration/Compliance Process (Use <ol>)
4. Pricing & Plans Overview (Use <h3> and <ul>)
5. Required Documents
6. Strong Call to Action paragraph`;

    case 'faq':
      return `Write a comprehensive FAQ page for:
Title: "${title}"
Topic: "${topic}"

${baseRules}
Structure:
Write 8-10 Frequently Asked Questions.
Use <h2> for the main category (if any).
Use <h3> for each Question.
Use <p> for the Answer directly below it.
Keep answers concise, legally accurate for India, and helpful.`;

    case 'city':
      return `Write a Local SEO City Page for:
Title: "${title}"
Topic: "${topic}"

${baseRules}
Focus heavily on local context. Mention the city, local jurisdiction, and relevant state laws if applicable.
Structure:
1. Introduction to the service in this specific city.
2. Why businesses in this city need this.
3. Local process or specific state compliance.
4. FAQs specific to the region.`;

    case 'industry':
      return `Write an Industry-specific compliance guide for:
Title: "${title}"
Topic: "${topic}"

${baseRules}
Focus entirely on the regulatory framework for this specific sector.
Structure:
1. Industry Overview & Regulatory Landscape
2. Key Licenses & Registrations Required
3. Ongoing Annual Compliances
4. Penalties for Non-compliance`;

    case 'service_city':
      return `You are a Local SEO specialist and Legal Expert.
Write a hyper-local service page for: "${title}".
Topic Context: "${topic}"

${baseRules}
Structure:
1. Localized Hero Section (mentioning the specific region/city)
2. Why choose us for this service in this specific city?
3. Local regulations or ROC details for this region (if applicable)
4. Step-by-step process
5. Required local documents`;

    case 'blog':
    default:
      if (config?.existingContent) {
        return `You are an SEO Content Refresher.
Update and refresh the following decaying content for: "${title}".
Keywords to optimize for: ${(config?.keywords || []).join(', ')}

${baseRules}
Existing Content:
${config?.existingContent.substring(0, 3000)}...

Instructions:
1. Maintain the core structure but inject fresh statistics (assume current year is 2026).
2. Improve keyword density and readability.
3. Output the fully refreshed HTML.`;
      }
      return `Write an informative, SEO-optimized blog post for:
Title: "${title}"
Topic: "${topic}"

${baseRules}
Structure:
1. Introduction (2-3 paragraphs)
2. 4-6 main sections with <h2> headings and <h3> sub-sections
3. Step-by-step process with <ol>
4. Required documents or key points with <ul>
5. Conclusion (1-2 paragraphs)`;
  }
}

async function generateContent(topic: string, contentType: string, config?: { keywords?: string[], existingContent?: string }): Promise<{ meta: GeneratedMeta; content: string }> {
  // Step 1: Metadata
  const metaPrompt = `You are an expert Indian legal content strategist.
Generate metadata for a ${contentType} about: "${topic}"

Respond with a JSON object:
- title: SEO-friendly title
- slug: URL slug (lowercase, hyphens only)
- metaTitle: SEO meta title under 60 chars
- metaDescription: SEO meta description under 160 chars
- tags: array of 5 keywords
- category: one of Legal, Tax, GST, Compliance, Startup, Trademark`;

  const metaRaw = await generateText(metaPrompt, { responseMimeType: 'application/json' });
  const meta = parseJsonResponse<GeneratedMeta>(metaRaw);

  // Step 2: HTML Content
  const contentPrompt = getPromptForType(contentType, topic, meta.title, {
    keywords: config?.keywords,
    existingContent: config?.existingContent
  });
  const content = await generateText(contentPrompt);

  return { meta, content };
}

// ─── SEO Enhancement ────────────────────────────────────

async function generateSEO(title: string, content: string): Promise<GeneratedSEO> {
  const plainText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 2000);

  const prompt = `Based on this content, generate SEO metadata:
Title: "${title}"
Content: "${plainText}"

Return JSON:
{
  "metaTitle": "SEO title under 60 chars",
  "metaDescription": "Meta description under 160 chars",
  "tags": ["keyword1", "keyword2", "keyword3"],
  "ogDescription": "Open Graph description"
}`;

  const raw = await generateText(prompt, { responseMimeType: 'application/json' });
  return parseJsonResponse<GeneratedSEO>(raw);
}

// ─── Cross-Selling & Promotion ────────────────────────────

async function generateCrossSelling(
  topic: string, 
  contentType: string, 
  supabase: ReturnType<typeof createServiceRoleClient>
): Promise<{ promoHtml: string; relatedIds: string[] }> {
  // We don't cross-sell services inside other services (too recursive) or pages
  if (contentType === 'service' || contentType === 'page') {
    return { promoHtml: '', relatedIds: [] };
  }

  // 1. Fetch active services to cross-sell
  const { data: services } = await supabase
    .from('services')
    .select('id, title, slug')
    .eq('published', true)
    .limit(30);

  if (!services || services.length === 0) return { promoHtml: '', relatedIds: [] };

  const servicesListStr = services.map(s => `- ${s.title} (ID: ${s.id}, slug: ${s.slug})`).join('\n');

  // 2. Ask AI to pick relevant services and write a Promo HTML block
  const prompt = `You are a growth marketer for Vakeel.
We just wrote an article about: "${topic}".

Here is our catalog of services:
${servicesListStr}

Task 1: Pick the 1-3 most highly relevant services from the catalog that someone reading about "${topic}" would buy.
Task 2: Write a visually distinct, conversion-focused promotional HTML block (using Tailwind classes like bg-violet-50, border, p-6, rounded-xl) that pitches these services. The links must be exactly: <a href="/services/THE_SLUG">.

Return ONLY a valid JSON object matching this schema:
{
  "relatedIds": ["uuid1", "uuid2"],
  "promoHtml": "<div class='bg-violet-50 p-6...'>...</div>"
}`;

  try {
    const raw = await generateText(prompt, { responseMimeType: 'application/json' });
    const parsed = parseJsonResponse<{ relatedIds: string[]; promoHtml: string }>(raw);
    
    // Filter to ensure IDs actually exist
    const validIds = (parsed.relatedIds || []).filter(id => services.some(s => s.id === id));
    
    return {
      promoHtml: parsed.promoHtml || '',
      relatedIds: validIds
    };
  } catch {
    return { promoHtml: '', relatedIds: [] };
  }
}

// ─── Utility ────────────────────────────────────────────

async function ensureUniqueSlug(supabase: any, table: string, baseSlug: string): Promise<string> {
  let slug = baseSlug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/(^-|-$)/g, '');
  let suffix = 1;

  while (true) {
    const candidate = suffix === 1 ? slug : `${slug}-${suffix}`;
    const { data } = await supabase.from(table).select('id').eq('slug', candidate).limit(1);
    if (!data || data.length === 0) return candidate;
    suffix++;
    if (suffix > 100) return `${slug}-${Date.now()}`;
  }
}

function calculateReadingTime(html: string): number {
  const wordCount = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

function getTableName(contentType: string): string {
  const map: Record<string, string> = {
    blog: 'blogs',
    service: 'services',
    industry: 'industries',
    city: 'cities',
    faq: 'faqs',
    page: 'pages',
    service_city: 'service_city_content',
  };
  return map[contentType] || 'blogs';
}

// ─── Main Pipeline ──────────────────────────────────────

export async function generateCompleteContent(
  config: UniversalGenerationConfig = {}
): Promise<UniversalGenerationResult> {
  const startTime = Date.now();
  const contentType = config.contentType || 'blog';
  const table = getTableName(contentType);

  try {
    const supabase = createServiceRoleClient();

    // 1. Topic
    const topic = await generateTopic(supabase, config);

    // 2. Generate Content
    const { meta, content } = await withRetry(
      () => generateContent(topic, contentType, {
        keywords: config.keywords,
        existingContent: config.existingContent
      }),
      'Content generation', 3
    );

    // 3. SEO
    let seo: GeneratedSEO | null = null;
    try { seo = await withRetry(() => generateSEO(meta.title, content), 'SEO generation', 2); } catch {}

    // 4. Images
    let featuredImage = await acquireFeaturedImage(topic);
    
    let contentWithImages = content;
    // We can skip inline images for FAQs or simple pages
    if (['blog', 'service', 'industry', 'city'].includes(contentType)) {
      try {
        const acquired = await acquireInlineImages(topic, [], 2);
        // Simple top-level injection logic for demo
        contentWithImages = acquired.length > 0 
          ? `<img src="${acquired[0].url}" alt="${acquired[0].alt}" style="width:100%;border-radius:8px;margin-bottom:24px" />` + content
          : content;
      } catch {}
    }

    // 4. Cross-Selling (Promo Block)
    let crossSell = { promoHtml: '', relatedIds: [] as string[] };
    try { crossSell = await withRetry(() => generateCrossSelling(topic, contentType, supabase), 'Cross-Selling', 2); } catch {}

    const finalContent = contentWithImages + (crossSell.promoHtml ? `\n\n${crossSell.promoHtml}` : '');

    // 5. Slug Handling
    let uniqueSlug = '';
    if (table !== 'service_city_content') {
      uniqueSlug = await ensureUniqueSlug(supabase, table, meta.slug);
    }
    
    const category = config.category || meta.category || 'General';
    const publishNow = config.publishImmediately ?? false;
    const now = new Date().toISOString();

    const insertData: any = {
      content: finalContent,
      thumbnail: featuredImage.url,
      status: publishNow ? 'published' : 'generated',
      created_at: config.existingId ? undefined : now,
      updated_at: now,
      needs_update: false,
      freshness_score: 100,
      site_id: config.siteId
    };

    // Columns that don't exist on service_city_content
    if (table === 'service_city_content') {
      insertData.service_id = config.serviceId;
      insertData.city_id = config.cityId;
      insertData.custom_title = meta.title;
      insertData.meta_title = seo?.metaTitle || meta.metaTitle;
      insertData.meta_description = seo?.metaDescription || meta.metaDescription;
      insertData.related_services = crossSell.relatedIds;
    } else {
      insertData.title = meta.title;
      insertData.slug = uniqueSlug;
      insertData.category = category;
      insertData.tags = seo?.tags || meta.tags || [];
      insertData.meta_title = seo?.metaTitle || meta.metaTitle;
      insertData.meta_description = seo?.metaDescription || meta.metaDescription;
      insertData.related_services = crossSell.relatedIds;
    }

    let finalId = '';
    if (config.existingId) {
      const { error: updateError } = await supabase
        .from(table)
        .update(insertData)
        .eq('id', config.existingId);
      
      if (updateError) {
        throw new Error(`DB update failed for ${table}: ${updateError.message}`);
      }
      finalId = config.existingId;
    } else {
      const { data: inserted, error: insertError } = await supabase
        .from(table)
        .insert([insertData])
        .select('id')
        .single();

      if (insertError) {
        throw new Error(`DB insert failed for ${table}: ${insertError.message}`);
      }
      finalId = inserted.id;
    }

    return {
      success: true,
      contentId: finalId,
      title: meta.title,
      slug: uniqueSlug,
      imageSource: featuredImage.source,
      relatedServiceIds: crossSell.relatedIds,
      durationMs: Date.now() - startTime,
    };
  } catch (err: unknown) {
    return {
      success: false,
      durationMs: Date.now() - startTime,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}
