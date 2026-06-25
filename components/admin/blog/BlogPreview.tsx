'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Monitor, Tablet, Smartphone, ChevronRight, Tag, Calendar, Clock, BookOpen, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { marked } from 'marked';

export interface BlogPreviewProps {
  title: string;
  category: string;
  content: string;
  thumbnail: string | null;
  authorName: string;
  authorAvatar: string | null;
  tags: string[];
  readingTime: number | null;
}

export function BlogPreview({ title, category, content, thumbnail, authorName, authorAvatar, tags, readingTime }: BlogPreviewProps) {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const htmlContent = /(<\/?[a-z][\s\S]*>)/i.test(content || '')
    ? (content ?? '')
    : (marked.parse(content || '<p>No content provided.</p>', { async: false }) as string);

  const displayTitle = title || 'Your Awesome Blog Title';
  const displayCategory = category || 'Category';

  return (
    <Card className="flex flex-col border border-gray-200 overflow-hidden bg-gray-100">
      {/* Device Toggle Bar */}
      <div className="bg-white border-b border-gray-200 p-2 flex items-center justify-center gap-2 shadow-sm z-10">
        <Button 
          variant={device === 'desktop' ? 'default' : 'ghost'} 
          size="sm" 
          onClick={() => setDevice('desktop')}
          className={device === 'desktop' ? 'bg-charcoal text-white' : 'text-gray-500'}
        >
          <Monitor className="w-4 h-4 mr-2" /> Desktop
        </Button>
        <Button 
          variant={device === 'tablet' ? 'default' : 'ghost'} 
          size="sm" 
          onClick={() => setDevice('tablet')}
          className={device === 'tablet' ? 'bg-charcoal text-white' : 'text-gray-500'}
        >
          <Tablet className="w-4 h-4 mr-2" /> Tablet
        </Button>
        <Button 
          variant={device === 'mobile' ? 'default' : 'ghost'} 
          size="sm" 
          onClick={() => setDevice('mobile')}
          className={device === 'mobile' ? 'bg-charcoal text-white' : 'text-gray-500'}
        >
          <Smartphone className="w-4 h-4 mr-2" /> Mobile
        </Button>
      </div>

      {/* Preview Container */}
      <div className="flex-1 overflow-y-auto p-4 flex justify-center bg-gray-100 h-[600px]">
        <div 
          className={`bg-ivory shadow-xl overflow-y-auto transition-all duration-300 origin-top ${
            device === 'desktop' ? 'w-full max-w-[1440px]' : 
            device === 'tablet' ? 'w-[768px]' : 'w-[390px]'
          }`}
          style={{ height: 'max-content', minHeight: '100%' }}
        >
          {/* Replica of app/blog/[slug]/page.tsx structure */}
          <main className="min-h-screen bg-ivory pb-20 selection:bg-sage/30 selection:text-sage">
            
            {/* Hero */}
            <section className="pt-20 pb-16 md:pt-32 md:pb-24 bg-charcoal text-white rounded-b-[2rem] lg:rounded-b-[3rem] relative overflow-hidden noise-overlay">
              <div className="container relative z-10 mx-auto px-4 text-center max-w-4xl">
                {/* Breadcrumb */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 text-xs md:text-sm font-semibold text-white/70">
                  <span>Home</span>
                  <ChevronRight className="w-3 h-3 text-white/40" />
                  <span>Blog</span>
                  <ChevronRight className="w-3 h-3 text-white/40" />
                  <span className="truncate max-w-[120px] md:max-w-[200px]">{displayTitle}</span>
                </div>

                <div className="mb-6">
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-sage/20 border border-sage/30 text-sage text-xs font-bold uppercase tracking-widest">
                    <Tag className="w-3 h-3" /> {displayCategory}
                  </span>
                </div>

                <h1 className="text-3xl md:text-5xl lg:text-[64px] font-display font-bold mb-6 lg:mb-8 leading-[1.08] tracking-tight">
                  {displayTitle}
                </h1>
              </div>
            </section>

            {/* Content */}
            <section className="py-12 md:py-24 section-connector-top">
              <div className="container mx-auto px-4 max-w-4xl">
                <div className="bg-white rounded-[2rem] p-6 md:p-12 lg:p-16 border border-charcoal/[0.04] shadow-premium relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-sage/50 via-emerald-500/50 to-amber/50"></div>

                  {/* Meta row */}
                  <div className="flex flex-wrap items-center gap-4 md:gap-6 text-charcoal/45 text-xs md:text-sm font-semibold mb-8 md:mb-12 border-b border-charcoal/[0.06] pb-6 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      {authorAvatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={authorAvatar} alt={authorName} className="w-6 h-6 rounded-full object-cover shadow-sm" />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-sage/20 flex items-center justify-center text-sage font-bold text-xs shadow-sm">
                          {authorName.charAt(0) || 'V'}
                        </div>
                      )}
                      <span className="text-charcoal/70">{authorName || 'Vakeel Team'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-sage" />
                      {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-2">
                      {readingTime ? (
                        <><Clock className="w-4 h-4 text-amber" /> {readingTime} min read</>
                      ) : (
                        <><BookOpen className="w-4 h-4 text-amber" /> 5 min read</>
                      )}
                    </div>
                  </div>

                  {/* Thumbnail if any */}
                  {thumbnail && (
                    <div className="mb-10 w-full h-auto max-h-[400px] overflow-hidden rounded-[2rem]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={thumbnail} alt="Featured" className="w-full h-full object-cover" />
                    </div>
                  )}

                  {/* Rich content */}
                  <div
                    className="prose prose-sm md:prose-lg lg:prose-xl prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-charcoal prose-headings:mt-8 md:prose-headings:mt-12 prose-headings:mb-4 md:prose-headings:mb-6 prose-a:text-sage prose-a:font-semibold prose-p:text-charcoal/75 prose-p:leading-loose prose-p:mb-6 prose-blockquote:border-l-4 prose-blockquote:border-sage prose-blockquote:bg-sage/5 prose-blockquote:p-4 md:prose-blockquote:p-6 prose-blockquote:rounded-r-xl prose-blockquote:italic prose-blockquote:text-charcoal/80 prose-img:rounded-[1rem] md:prose-img:rounded-[2rem] prose-img:shadow-premium max-w-none"
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                  />

                  {/* Tags */}
                  {tags && tags.length > 0 && (
                    <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-charcoal/10 flex flex-wrap gap-2 md:gap-3">
                      {tags.map((tag, i) => (
                        <span key={i} className="px-3 md:px-4 py-1.5 md:py-2 bg-charcoal/5 rounded-full text-charcoal/60 text-xs md:text-sm font-semibold hover:bg-charcoal/10 transition-colors cursor-pointer">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Fake CTA */}
                  <div className="mt-10 md:mt-16 pt-8 md:pt-10 border-t border-charcoal/[0.06] flex flex-col sm:flex-row items-center justify-between gap-6 bg-ivory -mx-6 md:-mx-12 lg:-mx-16 -mb-6 md:-mb-12 lg:-mb-16 p-6 md:p-12 lg:p-16">
                    <div>
                      <h4 className="font-display font-bold text-xl md:text-2xl text-charcoal mb-2">Need legal assistance?</h4>
                      <p className="text-charcoal/60 font-medium text-sm md:text-base">Our experts can help you with your compliance and legal needs.</p>
                    </div>
                    <Button className="bg-charcoal text-white hover:bg-sage transition-all duration-300 h-12 md:h-14 px-6 md:px-8 rounded-xl font-bold">
                      Contact Us <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </Card>
  );
}
