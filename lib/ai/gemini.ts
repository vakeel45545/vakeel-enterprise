import { GoogleGenAI } from '@google/genai';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set in environment variables.');
}

export const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const TEXT_MODEL = 'gemini-2.5-flash';
export const IMAGE_MODEL = 'gemini-2.0-flash-preview-image-generation';

/**
 * Generate text content using Gemini.
 * Pass responseMimeType: 'application/json' to get guaranteed valid JSON output.
 */
export async function generateText(
  prompt: string,
  options?: { responseMimeType?: string }
): Promise<string> {
  const response = await genAI.models.generateContent({
    model: TEXT_MODEL,
    contents: prompt,
    config: options?.responseMimeType
      ? { responseMimeType: options.responseMimeType }
      : undefined,
  });
  return response.text ?? '';
}

/**
 * Parse a JSON block from Gemini's response text.
 * Strips markdown code fences if present, then finds the first valid JSON object.
 */
export function parseJsonResponse<T>(text: string): T {
  // Strip ```json ... ``` fences
  let cleaned = text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/i, '')
    .trim();

  // Try direct parse first
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    // Fall back: find the first '{' and last '}' and try parsing that slice
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start !== -1 && end !== -1 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1)) as T;
    }
    throw new Error('Could not extract valid JSON from Gemini response');
  }
}
