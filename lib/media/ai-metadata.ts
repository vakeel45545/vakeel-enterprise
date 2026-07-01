import { generateVisionText, parseJsonResponse } from '@/lib/ai/gemini';
import { createServiceRoleClient } from '@/lib/supabase/server';

interface VisionMetadata {
  alt_text: string;
  caption: string;
  keywords: string[];
  dominant_color: string;
}

export async function processAiMetadataJob(assetId: string, url: string, mimeType: string, buffer?: Buffer) {
  const supabase = createServiceRoleClient();
  
  try {
    // Only process images
    if (!mimeType.startsWith('image/')) {
      await supabase.from('media_library').update({ status: 'ready' }).eq('id', assetId);
      return;
    }

    let imageBuffer = buffer;
    if (!imageBuffer) {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch image for AI processing');
      imageBuffer = Buffer.from(await response.arrayBuffer());
    }

    const prompt = `Analyze this image for a professional legal & startup consulting CMS.
Extract the following details and return EXACTLY this JSON structure, nothing else:
{
  "alt_text": "A highly descriptive, SEO-friendly alt text (1-2 sentences)",
  "caption": "A professional, engaging caption suitable for an enterprise blog or service page",
  "keywords": ["5-10", "relevant", "seo", "tags", "describing", "the", "image"],
  "dominant_color": "The dominant hex color code (e.g., #FFFFFF)"
}`;

    const textResult = await generateVisionText(prompt, imageBuffer, mimeType, { responseMimeType: 'application/json' });
    const metadata = parseJsonResponse<VisionMetadata>(textResult);

    // Update DB
    await supabase.from('media_library').update({
      alt_text: metadata.alt_text,
      caption: metadata.caption,
      keywords: metadata.keywords,
      dominant_color: metadata.dominant_color,
      status: 'ready'
    }).eq('id', assetId);

    console.log(`[AI Metadata] Successfully processed asset ${assetId}`);

  } catch (error) {
    console.error(`[AI Metadata] Failed to process asset ${assetId}:`, error);
    // Even if it fails, mark it ready so it doesn't stay 'processing' forever
    await supabase.from('media_library').update({ status: 'ready' }).eq('id', assetId);
  }
}
