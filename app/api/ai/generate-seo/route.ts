import { NextRequest, NextResponse } from 'next/server';
import { generateText, parseJsonResponse } from '@/lib/ai/gemini';

export async function POST(req: NextRequest) {
  try {
    const { title, content } = await req.json();

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Strip HTML tags for a cleaner content summary to send to the model
    const plainText = content
      ? content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 2000)
      : '';

    const prompt = `You are an SEO expert specializing in Indian legal and compliance content.

Based on this blog post, generate optimal SEO metadata:

Title: "${title}"
Content Summary: "${plainText}"

Return a JSON object with EXACTLY this structure:
{
  "metaTitle": "SEO title under 60 characters, includes primary keyword",
  "metaDescription": "Compelling meta description under 160 characters with CTA",
  "tags": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", "keyword6"],
  "ogDescription": "Open Graph description under 200 characters"
}

Requirements:
- metaTitle must be unique from the blog title but still keyword-rich
- metaDescription must encourage clicks with a clear value proposition
- tags must be specific, searchable keywords (mix of short and long-tail)
- Focus on Indian legal/compliance search queries
- Output ONLY valid JSON, no markdown fences`;

    const raw = await generateText(prompt);
    const data = parseJsonResponse<{
      metaTitle: string;
      metaDescription: string;
      tags: string[];
      ogDescription: string;
    }>(raw);

    return NextResponse.json(data);
  } catch (err) {
    console.error('[AI] generate-seo error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to generate SEO' },
      { status: 500 }
    );
  }
}
