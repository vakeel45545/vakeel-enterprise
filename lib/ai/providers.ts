import { generateText as geminiGenerateText } from './gemini';

export interface AIOptions {
  responseMimeType?: string;
  purpose?: string;
  sourceId?: string;
}

export interface AIResponse {
  text: string;
  inputTokens?: number;
  outputTokens?: number;
  model: string;
  provider: string;
  durationMs: number;
}

export interface AIProvider {
  name: string;
  isAvailable(): boolean;
  generateText(prompt: string, options?: AIOptions): Promise<AIResponse>;
}

// ============================================================================
// GEMINI PROVIDER
// ============================================================================
export class GeminiProvider implements AIProvider {
  name = 'gemini';

  isAvailable(): boolean {
    return !!process.env.GEMINI_API_KEY;
  }

  async generateText(prompt: string, options?: AIOptions): Promise<AIResponse> {
    const startTime = Date.now();
    try {
      // Re-uses the existing gemini.ts which has model definitions
      const text = await geminiGenerateText(prompt, options);
      const durationMs = Date.now() - startTime;
      
      return {
        text,
        model: 'gemini-2.5-flash', // Hardcoded here, could be read from gemini.ts
        provider: this.name,
        durationMs,
        // Gemini API via @google/genai doesn't always expose tokens directly in standard response.text
        // We'll leave tokens undefined for now unless we enhance the geminiGenerateText later
      };
    } catch (error: any) {
      throw new Error(`Gemini Error: ${error.message}`);
    }
  }
}

// ============================================================================
// PROVIDER CHAIN & FALLBACK LOGIC
// ============================================================================

const PROVIDERS: AIProvider[] = [
  new GeminiProvider(),
  // Can add ClaudeProvider, OpenAIProvider here in the future
];

export function getProviderChain(): AIProvider[] {
  return PROVIDERS.filter(p => p.isAvailable());
}

/**
 * Generates text using the first available provider in the chain.
 * If one fails, it transparently falls back to the next one.
 */
export async function generateWithFallback(
  prompt: string,
  options?: AIOptions
): Promise<AIResponse> {
  const chain = getProviderChain();
  
  if (chain.length === 0) {
    throw new Error('No AI providers are configured or available.');
  }

  let lastError: any = null;

  for (const provider of chain) {
    try {
      const response = await provider.generateText(prompt, options);
      
      // Async: Log usage (don't await it so we don't slow down the response)
      logAIUsage(response, options).catch(console.error);
      
      return response;
    } catch (err: any) {
      console.warn(`[AI Fallback] Provider ${provider.name} failed:`, err.message);
      lastError = err;
      
      // Log the failure
      logAIUsage(
        { text: '', model: 'unknown', provider: provider.name, durationMs: 0 },
        options,
        err.message
      ).catch(console.error);
      
      continue;
    }
  }

  throw new Error(`All AI providers failed. Last error: ${lastError?.message}`);
}

/**
 * Parse a JSON block from response text.
 */
export function parseJsonResponse<T>(text: string): T {
  let cleaned = text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/i, '')
    .trim();

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start !== -1 && end !== -1 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1)) as T;
    }
    throw new Error('Could not extract valid JSON from AI response');
  }
}

async function logAIUsage(
  response: AIResponse, 
  options?: AIOptions,
  errorMessage?: string
): Promise<void> {
  try {
    const { createServiceRoleClient } = await import('@/lib/supabase/server');
    const supabase = createServiceRoleClient();
    
    await supabase.from('ai_usage_logs').insert([{
      provider: response.provider,
      model: response.model,
      purpose: options?.purpose || 'general',
      input_tokens: response.inputTokens || null,
      output_tokens: response.outputTokens || null,
      duration_ms: response.durationMs,
      status: errorMessage ? 'failed' : 'success',
      error_message: errorMessage || null,
      source_id: options?.sourceId || null
    }]);
  } catch (err) {
    console.error('Failed to log AI usage', err);
  }
}
