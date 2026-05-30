import { NextRequest, NextResponse } from 'next/server';
import { generateText, parseJsonResponse } from '@/lib/ai/gemini';

export async function POST(req: NextRequest) {
  try {
    const { text, mode } = await req.json();

    if (!text || !mode) {
      return NextResponse.json({ error: 'text and mode are required' }, { status: 400 });
    }

    const modeInstructions: Record<string, string> = {
      rewrite: 'Rewrite the following text to be clearer, more engaging, and better structured. Keep the same meaning and length.',
      expand: 'Expand the following text with more detail, examples, and explanation. Make it approximately 50% longer.',
      shorten: 'Shorten the following text to its most essential points. Reduce it to about 50% of its original length.',
      professional: 'Rewrite the following text in a formal, professional tone suitable for a legal/compliance blog. Keep the same meaning.',
      simple: 'Rewrite the following text in simple, easy-to-understand language suitable for someone with no legal background. Keep the same meaning.',
    };

    const instruction = modeInstructions[mode];
    if (!instruction) {
      return NextResponse.json({ error: 'Invalid mode' }, { status: 400 });
    }

    const prompt = `${instruction}

Text to process:
"${text}"

Return a JSON object with EXACTLY this structure:
{
  "result": "The rewritten/processed text here as plain text or minimal HTML"
}

Requirements:
- Preserve any HTML tags if the input contains them
- Output ONLY valid JSON, no markdown fences
- The result field must contain only the processed text, nothing else`;

    const raw = await generateText(prompt);
    const data = parseJsonResponse<{ result: string }>(raw);

    return NextResponse.json(data);
  } catch (err) {
    console.error('[AI] rewrite error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to rewrite content' },
      { status: 500 }
    );
  }
}
