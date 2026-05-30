import { NextRequest, NextResponse } from 'next/server';
import { genAI, IMAGE_MODEL, generateText, parseJsonResponse } from '@/lib/ai/gemini';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const { topic } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    // Step 1: Generate an image prompt via Gemini text
    const promptGeneration = await generateText(
      `Create a detailed, professional image generation prompt for a blog thumbnail about: "${topic}".
      The image should be suitable for an Indian legal/compliance platform (Vakeel).
      Style: Clean, modern, professional. No text in the image.
      Return ONLY valid JSON: { "imagePrompt": "..." }`
    );

    let imagePrompt = `Professional blog thumbnail for ${topic}, Indian legal platform, clean modern design, no text`;
    try {
      const parsed = parseJsonResponse<{ imagePrompt: string }>(promptGeneration);
      imagePrompt = parsed.imagePrompt;
    } catch {
      // Use default prompt if parsing fails
    }

    // Step 2: Generate image using Gemini image model
    let imageUrl: string | null = null;

    try {
      const imageResponse = await genAI.models.generateContent({
        model: IMAGE_MODEL,
        contents: imagePrompt,
        config: {
          responseModalities: ['IMAGE', 'TEXT'],
        },
      });

      const parts = imageResponse.candidates?.[0]?.content?.parts ?? [];
      for (const part of parts) {
        if (part.inlineData?.data && part.inlineData?.mimeType) {
          // Step 3: Upload to Supabase Storage
          const imageBuffer = Buffer.from(part.inlineData.data, 'base64');
          const fileName = `blog-${Date.now()}.png`;

          const supabase = await createClient();
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('blog-images')
            .upload(fileName, imageBuffer, {
              contentType: part.inlineData.mimeType,
              upsert: false,
            });

          if (!uploadError && uploadData) {
            const { data: publicUrlData } = supabase.storage
              .from('blog-images')
              .getPublicUrl(uploadData.path);
            imageUrl = publicUrlData.publicUrl;
          }
          break;
        }
      }
    } catch (imgErr) {
      console.warn('[AI] Image generation failed, using placeholder:', imgErr);
    }

    // Fallback: Use a placeholder image service if Gemini image generation failed
    if (!imageUrl) {
      const encodedTopic = encodeURIComponent(topic.slice(0, 50));
      imageUrl = `https://images.unsplash.com/1600x900/?${encodedTopic},legal,india&auto=format&fit=crop`;
    }

    return NextResponse.json({ imageUrl });
  } catch (err) {
    console.error('[AI] generate-image error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to generate image' },
      { status: 500 }
    );
  }
}
