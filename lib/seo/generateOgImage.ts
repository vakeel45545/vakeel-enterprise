import { uploadToMediaLibrary } from '@/lib/media/uploader';

interface OgImageParams {
  title: string;
  category?: string;
  brandColors?: string; // Optional, could pass a hex code
}

export async function generateAndStoreOgImage(params: OgImageParams) {
  // We assume there is an API route at /api/og that uses @vercel/og or similar
  // to dynamically generate an image based on query parameters.
  const baseUrl = process.env.APP_URL || 'http://localhost:3000';
  
  const searchParams = new URLSearchParams();
  searchParams.set('title', params.title);
  if (params.category) searchParams.set('category', params.category);
  if (params.brandColors) searchParams.set('color', params.brandColors);

  const ogUrl = `${baseUrl}/api/og?${searchParams.toString()}`;

  try {
    // 1. Fetch the generated OG image from our own endpoint
    const response = await fetch(ogUrl);
    if (!response.ok) {
      throw new Error(`Failed to generate OG image from ${ogUrl}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Create a File-like object or Blob for the uploader
    const file = new File([buffer], `og-${Date.now()}.png`, { type: 'image/png' });

    // 2. Upload to Supabase Storage and media_library via our shared uploader
    const media = await uploadToMediaLibrary({
      file,
      source: 'ai_generated',
      alt_text: `OG Image for ${params.title}`,
      tags: ['og-image', 'auto-generated'],
    });

    return media;
  } catch (error) {
    console.error('Error generating and storing OG image:', error);
    throw error;
  }
}
