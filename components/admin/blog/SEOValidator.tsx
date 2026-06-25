'use client';

import { Card } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { useMemo } from 'react';

export interface SEOValidatorProps {
  title: string;
  metaDescription: string;
  content: string;
  hasFeaturedImage: boolean;
  hasOgImage?: boolean;
  hasFaq?: boolean;
  hasSchema?: boolean;
  targetKeyword?: string;
  internalLinksCount?: number;
}

export function SEOValidator({ 
  title, 
  metaDescription, 
  content, 
  hasFeaturedImage, 
  hasOgImage = false,
  hasFaq = false,
  hasSchema = false,
  targetKeyword = '',
  internalLinksCount = 0 
}: SEOValidatorProps) {
  const analysis = useMemo(() => {
    const checks = [];
    let score = 0;

    // 1. Title Length (10 pts) - 50-60 optimal
    const titleLen = title.length;
    if (titleLen === 0) {
      checks.push({ type: 'error', text: 'Title is required' });
    } else if (titleLen < 50 || titleLen > 60) {
      checks.push({ type: 'warning', text: `Title is ${titleLen} chars. Aim for 50-60.` });
      score += 5;
    } else {
      checks.push({ type: 'success', text: 'Title length is optimal' });
      score += 10;
    }

    // 2. Meta Description Length (10 pts) - 140-160 optimal
    const descLen = metaDescription.length;
    if (descLen === 0) {
      checks.push({ type: 'error', text: 'Meta description is required' });
    } else if (descLen < 140 || descLen > 160) {
      checks.push({ type: 'warning', text: `Description is ${descLen} chars. Aim for 140-160.` });
      score += 5;
    } else {
      checks.push({ type: 'success', text: 'Meta description length is optimal' });
      score += 10;
    }

    // 3. Featured Image (10 pts)
    if (!hasFeaturedImage) {
      checks.push({ type: 'error', text: 'Featured image is missing' });
    } else {
      checks.push({ type: 'success', text: 'Featured image is present' });
      score += 10;
    }

    // 4. OG Image (10 pts)
    if (!hasOgImage) {
      checks.push({ type: 'error', text: 'Social OG Image is missing' });
    } else {
      checks.push({ type: 'success', text: 'Social OG Image is set' });
      score += 10;
    }

    // 5. Headings Structure (10 pts)
    const h1Matches = content.match(/<h1[^>]*>/g) || [];
    const h2Matches = content.match(/<h2[^>]*>/g) || [];
    if (h1Matches.length > 1) {
      checks.push({ type: 'error', text: `Found ${h1Matches.length} H1 tags. Use only 1.` });
    } else if (h2Matches.length === 0) {
      checks.push({ type: 'warning', text: 'No H2 tags found. Use headings to structure content.' });
      score += 5;
    } else {
      checks.push({ type: 'success', text: 'Good heading structure' });
      score += 10;
    }

    // 6. Internal Links (10 pts)
    const linkMatches = content.match(/href="\/(.*?)"/g) || [];
    const internalLinks = internalLinksCount + linkMatches.length;
    if (internalLinks < 2) {
      checks.push({ type: 'warning', text: `Only ${internalLinks} internal links found. Aim for at least 2.` });
      score += 5;
    } else {
      checks.push({ type: 'success', text: `Good amount of internal links (${internalLinks})` });
      score += 10;
    }

    // 7. Content Length (10 pts)
    const wordCount = content.replace(/<[^>]*>?/gm, '').split(/\s+/).filter(w => w.length > 0).length;
    if (wordCount < 300) {
      checks.push({ type: 'error', text: `Content is thin (${wordCount} words). Minimum 300.` });
      score += 5;
    } else {
      checks.push({ type: 'success', text: `Good content length (${wordCount} words)` });
      score += 10;
    }

    // 8. Keyword Usage (10 pts)
    if (!targetKeyword) {
      checks.push({ type: 'warning', text: 'No target keyword set for tracking' });
    } else {
      const keywordRegex = new RegExp(targetKeyword, 'gi');
      const titleMatches = (title.match(keywordRegex) || []).length;
      const contentMatches = (content.match(keywordRegex) || []).length;
      if (titleMatches === 0) {
        checks.push({ type: 'error', text: 'Target keyword is missing from Title' });
        score += 3;
      } else if (contentMatches < 3) {
        checks.push({ type: 'warning', text: `Target keyword appears ${contentMatches} times in content. Aim for 3+.` });
        score += 7;
      } else {
        checks.push({ type: 'success', text: 'Target keyword usage is excellent' });
        score += 10;
      }
    }

    // 9. FAQ Present (10 pts)
    if (!hasFaq) {
      checks.push({ type: 'warning', text: 'No FAQs attached to this blog' });
    } else {
      checks.push({ type: 'success', text: 'FAQs are present' });
      score += 10;
    }

    // 10. Schema Present (10 pts)
    if (!hasSchema) {
      checks.push({ type: 'warning', text: 'No custom Schema markup attached' });
    } else {
      checks.push({ type: 'success', text: 'Custom Schema markup is present' });
      score += 10;
    }

    return { score, checks };
  }, [title, metaDescription, content, hasFeaturedImage, hasOgImage, hasFaq, hasSchema, targetKeyword, internalLinksCount]);

  return (
    <Card className="p-4 border border-gray-200">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
        <h3 className="font-bold text-charcoal">SEO Validation</h3>
        <div className={`px-3 py-1 rounded-full font-bold text-sm ${
          analysis.score >= 90 ? 'bg-emerald-50 text-emerald-600' :
          analysis.score >= 70 ? 'bg-amber-50 text-amber-600' :
          'bg-rose-50 text-rose-600'
        }`}>
          Score: {analysis.score}/100
        </div>
      </div>

      <div className="space-y-3">
        {analysis.checks.map((check, i) => (
          <div key={i} className="flex items-start gap-2 text-sm">
            {check.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />}
            {check.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />}
            {check.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />}
            <span className={
              check.type === 'error' ? 'text-rose-700' :
              check.type === 'warning' ? 'text-amber-700' :
              'text-gray-600'
            }>{check.text}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
