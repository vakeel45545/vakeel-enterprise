export interface BlogMeta {
  title: string;
  slug: string;
  description?: string;
  keywords?: string[];
}

export interface QualityReport {
  overallScore: number;       // 0-100
  dimensions: {
    grammar: number;          
    seo: number;              
    readability: number;      
    structure: number;        
    ctaQuality: number;       
  };
  flags: string[];            
}

export function scoreContent(html: string, meta: BlogMeta): QualityReport {
  const flags: string[] = [];
  
  // Strip HTML tags for word count and readability
  const textContent = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const words = textContent.split(' ').filter(w => w.length > 0);
  const wordCount = words.length;

  // Grammar (Proxy using length and basic sentence structure for now)
  let grammarScore = 100;
  if (wordCount < 500) {
    grammarScore -= 30;
    flags.push('low_word_count');
  } else if (wordCount < 800) {
    grammarScore -= 10;
  }
  
  // SEO Score
  let seoScore = 100;
  if (meta.title.length < 30 || meta.title.length > 70) {
    seoScore -= 20;
    flags.push('suboptimal_title_length');
  }
  if (!meta.description || meta.description.length < 100) {
    seoScore -= 20;
    flags.push('missing_or_short_description');
  }
  
  // Structure
  let structureScore = 100;
  const h2Matches = html.match(/<h2[^>]*>/gi);
  const h2Count = h2Matches ? h2Matches.length : 0;
  if (h2Count < 3) {
    structureScore -= 30;
    flags.push('insufficient_headings');
  }
  
  // We look for FAQ indicators
  if (!html.toLowerCase().includes('faq') && !html.toLowerCase().includes('frequently asked')) {
    structureScore -= 20;
    flags.push('missing_faq');
  }

  // CTA Quality
  let ctaQuality = 100;
  if (!html.toLowerCase().includes('contact') && !html.toLowerCase().includes('consultation')) {
    ctaQuality -= 40;
    flags.push('missing_cta');
  }

  // Readability (basic approximation: sentence length)
  let readability = 100;
  const sentences = textContent.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgWordsPerSentence = sentences.length > 0 ? wordCount / sentences.length : 0;
  if (avgWordsPerSentence > 25) {
    readability -= 20;
    flags.push('long_sentences');
  }

  const overallScore = Math.round(
    (grammarScore * 0.2) + 
    (seoScore * 0.3) + 
    (structureScore * 0.2) + 
    (readability * 0.15) + 
    (ctaQuality * 0.15)
  );

  return {
    overallScore,
    dimensions: {
      grammar: grammarScore,
      seo: seoScore,
      readability,
      structure: structureScore,
      ctaQuality
    },
    flags
  };
}
