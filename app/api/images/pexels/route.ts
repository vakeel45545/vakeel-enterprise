import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const page = searchParams.get('page') || '1';
  
  if (!query) {
    return NextResponse.json({ error: 'Query is required' }, { status: 400 });
  }

  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Pexels API key not configured' }, { status: 500 });
  }

  try {
    const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&page=${page}&per_page=20`, {
      headers: {
        Authorization: apiKey
      }
    });

    if (!res.ok) {
      throw new Error(`Pexels API error: ${res.statusText}`);
    }

    const data = await res.json();
    
    // Map to a unified format
    const results = data.photos.map((img: any) => ({
      id: img.id.toString(),
      imageUrl: img.src.large,
      thumbUrl: img.src.medium,
      alt: img.alt || 'Pexels image',
      author: img.photographer,
      authorUrl: img.photographer_url,
      source: 'pexels',
      downloadUrl: img.src.large2x || img.src.large
    }));

    return NextResponse.json({ results });
  } catch (error: any) {
    console.error('Pexels search error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
