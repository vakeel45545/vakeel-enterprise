import { NextRequest, NextResponse } from 'next/server';
import { generateText, parseJsonResponse } from '@/lib/ai/gemini';

export async function POST(req: NextRequest) {
  try {
    const { title, content } = await req.json();

    if (!title && !content) {
      return NextResponse.json({ error: 'Title or content is required' }, { status: 400 });
    }

    const plainText = content
      ? content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 2000)
      : '';

    const prompt = `You are an expert in Indian legal and compliance content.

Generate 7 SEO-focused FAQs for this blog:
Title: "${title}"
Content: "${plainText}"

Return a JSON object with EXACTLY this structure:
{
  "faqsHtml": "<h2>Frequently Asked Questions</h2><div class='faq-section'><h3>Question 1?</h3><p>Answer 1.</p><h3>Question 2?</h3><p>Answer 2.</p>...</div>"
}

Requirements:
- 7 questions that people actually search for on Google
- Answers must be 2-4 sentences, practical and informative
- Use simple, clear language suitable for non-lawyers
- Focus on Indian legal context
- The HTML must only use <h2>, <h3>, <p>, <ul>, <li>, <strong> tags
- Output ONLY valid JSON, no markdown fences`;

    const raw = await generateText(prompt);
    const data = parseJsonResponse<{ faqsHtml: string }>(raw);

    return NextResponse.json(data);
  } catch (err) {
    console.error('[AI] generate-faqs error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to generate FAQs' },
      { status: 500 }
    );
  }
}
