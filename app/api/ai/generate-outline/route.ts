import { NextRequest, NextResponse } from 'next/server';
import { generateText, parseJsonResponse } from '@/lib/ai/gemini';

export async function POST(req: NextRequest) {
  try {
    const { topic } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const prompt = `You are an expert content strategist for Vakeel, an Indian legal and compliance platform.

Generate a detailed blog post outline for:
"${topic}"

Return a JSON object with EXACTLY this structure:
{
  "outline": [
    { "type": "h2", "text": "Introduction" },
    { "type": "h2", "text": "What is ..." },
    { "type": "h3", "text": "Sub-section" },
    { "type": "h2", "text": "Benefits" },
    { "type": "h2", "text": "Step-by-Step Process" },
    { "type": "h3", "text": "Step 1: ..." },
    { "type": "h2", "text": "Required Documents" },
    { "type": "h2", "text": "Common FAQs" },
    { "type": "h2", "text": "Conclusion" }
  ]
}

Requirements:
- 8-12 items total mixing h2 and h3
- Specific to the topic, not generic
- Follow Indian legal content conventions
- Include practical process steps and FAQs
- Output ONLY valid JSON, no markdown fences`;

    const raw = await generateText(prompt);
    const data = parseJsonResponse<{
      outline: Array<{ type: 'h2' | 'h3'; text: string }>;
    }>(raw);

    return NextResponse.json(data);
  } catch (err) {
    console.error('[AI] generate-outline error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to generate outline' },
      { status: 500 }
    );
  }
}
