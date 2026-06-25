// If we are in the browser, we use relative paths. If on the server, we might need absolute URLs or direct function calls.
// Since this can be used from both, we'll try to determine the base URL.
const getBaseUrl = () => {
  if (typeof window !== 'undefined') return ''; // Browser
  return process.env.APP_URL || 'http://localhost:3000';
};

export async function searchImages(query: string) {
  if (!query) return [];

  const baseUrl = getBaseUrl();
  let results: any[] = [];

  // 1. Try Unsplash
  try {
    const res = await fetch(`${baseUrl}/api/images/unsplash?q=${encodeURIComponent(query)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        return data.results;
      }
    } else {
      console.warn(`[SearchImages] Unsplash failed: ${res.statusText}`);
    }
  } catch (error) {
    console.warn(`[SearchImages] Unsplash request error:`, error);
  }

  // 2. Try Pexels
  try {
    const res = await fetch(`${baseUrl}/api/images/pexels?q=${encodeURIComponent(query)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        return data.results;
      }
    } else {
      console.warn(`[SearchImages] Pexels failed: ${res.statusText}`);
    }
  } catch (error) {
    console.warn(`[SearchImages] Pexels request error:`, error);
  }

  // 3. Fallback to AI Generation
  try {
    // If it's a server component, calling /api/ai/generate-image via fetch might be problematic due to auth/headers.
    // However, since it's an internal endpoint without auth protection required for cron, it might work.
    const res = await fetch(`${baseUrl}/api/ai/generate-image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: query })
    });
    
    if (res.ok) {
      const aiData = await res.json();
      if (aiData.url) {
        return [{
          id: 'ai_' + Date.now(),
          imageUrl: aiData.url,
          thumbUrl: aiData.url,
          source: 'ai_generated',
          alt: query,
          author: 'Vakeel AI',
          downloadUrl: aiData.url
        }];
      }
    } else {
      console.warn(`[SearchImages] AI generation failed: ${res.statusText}`);
    }
  } catch (error) {
    console.warn(`[SearchImages] AI generation request error:`, error);
  }

  return results; // Might be empty if ALL fail, but we try hard not to.
}
