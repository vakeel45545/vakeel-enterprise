import { NextRequest, NextResponse } from 'next/server';
import { generateText, parseJsonResponse } from '@/lib/ai/gemini';

export async function POST(req: NextRequest) {
  try {
    const { topic, template } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const templateInstruction = template
      ? `Use the "${template}" content template style for Indian legal/compliance blogs.`
      : '';

    // Step 1: Generate metadata as JSON using Gemini's native JSON mode
    // This avoids the bug where large HTML embedded in JSON breaks JSON.parse
    const metaPrompt = `You are an expert Indian legal content strategist for Vakeel.

Generate blog metadata for the topic: "${topic}"
${templateInstruction}

Respond with a JSON object with these exact keys:
- title: SEO-friendly blog title
- slug: URL slug (lowercase, hyphens only, no special chars)
- metaTitle: SEO meta title under 60 characters
- metaDescription: SEO meta description under 160 characters
- tags: array of 5 keyword strings
- category: one of Legal, Tax, GST, Compliance, Startup, Trademark`;

    const metaRaw = await generateText(metaPrompt, { responseMimeType: 'application/json' });
    const meta = parseJsonResponse<{
      title: string;
      slug: string;
      metaTitle: string;
      metaDescription: string;
      tags: string[];
      category: string;
    }>(metaRaw);

    // Step 2: Generate the full HTML content as plain text (NOT wrapped in JSON)
    // This is the key fix: HTML is returned as raw text, not as a JSON string value
    const contentPrompt = `You are an expert Indian legal content writer for Vakeel, an AI-powered legal platform.

Write a complete, SEO-optimized blog post in HTML for:
Title: "${meta.title}"
Topic: "${topic}"
${templateInstruction}

Output ONLY the HTML content — no JSON, no markdown fences, no explanation, no preamble.
Use these HTML tags only: <h2>, <h3>, <p>, <ul>, <li>, <ol>, <strong>, <em>, <blockquote>
Do NOT include <html>, <body>, <head> tags.

Structure:
1. Introduction (2-3 paragraphs)
2. 4-6 main sections with <h2> headings and <h3> sub-sections
3. Step-by-step process with <ol>
4. Required documents or key points with <ul>
5. FAQ section with 6 questions (use <h3> for question, <p> for answer)
6. Conclusion (1-2 paragraphs)

Target: Indian audience, 1500-2000 words, professional but accessible tone.`;

    const content = await generateText(contentPrompt);

    return NextResponse.json({
      title: meta.title,
      slug: meta.slug,
      content,
      metaTitle: meta.metaTitle,
      metaDescription: meta.metaDescription,
      tags: meta.tags,
      category: meta.category,
    });
  } catch (err) {
    console.error('[AI] generate-blog error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to generate blog' },
      { status: 500 }
    );
  }
}
