import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const page = searchParams.get('page') || '1';
  
  if (!query) {
    return NextResponse.json({ error: 'Query is required' }, { status: 400 });
  }

  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    return NextResponse.json({ error: 'Unsplash API key not configured' }, { status: 500 });
  }

  try {
    const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=20`, {
      headers: {
        Authorization: `Client-ID ${accessKey}`
      }
    });

    if (!res.ok) {
      throw new Error(`Unsplash API error: ${res.statusText}`);
    }

    const data = await res.json();
    
    // Map to a unified format
    const results = data.results.map((img: any) => ({
      id: img.id,
      imageUrl: img.urls.regular,
      thumbUrl: img.urls.thumb,
      alt: img.alt_description || 'Unsplash image',
      author: img.user.name,
      authorUrl: img.user.links.html,
      source: 'unsplash',
      downloadUrl: img.urls.regular
    }));

    return NextResponse.json({ results });
  } catch (error: any) {
    console.error('Unsplash search error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
