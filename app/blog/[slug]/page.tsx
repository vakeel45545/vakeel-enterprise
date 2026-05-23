import { notFound } from 'next/navigation';
import { ArrowRight, BookOpen, Clock, FileText, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getBlogBySlug } from '@/lib/api/blogs';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const blog = await getBlogBySlug(slug);

  const fallbackTitle = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return {
    title: blog?.meta_title || `${blog?.title || fallbackTitle} | Vakeel`,
    description: blog?.meta_description || `Read about ${blog?.title || fallbackTitle}`,
  };
}

export default async function BlogPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-ivory pb-20 selection:bg-sage/30 selection:text-sage">
      <section className="pt-32 pb-24 md:pt-40 md:pb-32 bg-charcoal text-white rounded-b-[2.5rem] lg:rounded-b-[3rem] relative overflow-hidden noise-overlay">
        {/* Glows */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/[0.03] rounded-full blur-[120px] pointer-events-none animate-pulse-glow" />
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-sage/[0.05] rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
        
        <div className="container relative z-10 mx-auto px-4 text-center max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 text-sm font-semibold text-white/70 backdrop-blur-md">
             <span>Home</span> <ChevronRight className="w-3 h-3 text-white/40" /> <Link href="/blog" className="hover:text-white transition-colors">Blog</Link> <ChevronRight className="w-3 h-3 text-white/40" /> <span className="truncate max-w-[200px] inline-block align-bottom">{blog.title}</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-[64px] font-display font-bold mb-6 lg:mb-8 leading-[1.08] tracking-tight">
            {blog.title}
          </h1>
          {blog.category && (
            <p className="text-lg lg:text-xl text-sage mb-10 font-bold uppercase tracking-widest">
              {blog.category}
            </p>
          )}
        </div>
      </section>

      <section className="py-24 section-connector-top">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-[2rem] p-8 md:p-12 lg:p-16 border border-charcoal/[0.04] shadow-[0_8px_32px_-8px_rgba(0,0,0,0.04)] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both relative overflow-hidden">
            
            {/* Top decorative gradient line */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-sage/50 via-emerald-500/50 to-amber/50"></div>

            <div className="flex items-center gap-6 text-charcoal/45 text-sm font-semibold mb-12 border-b border-charcoal/[0.06] pb-6 uppercase tracking-wider">
              <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-sage" /> {new Date(blog.created_at || Date.now()).toLocaleDateString()}</div>
              <div className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-amber" /> 5 min read</div>
            </div>
            
            {/* Render blog rich text content */}
            <div className="prose prose-lg lg:prose-xl prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight prose-a:text-sage prose-a:font-semibold hover:prose-a:text-emerald-700 prose-p:text-charcoal/70 prose-p:leading-relaxed max-w-none prose-li:text-charcoal/70" dangerouslySetInnerHTML={{ __html: blog.content || '<p>No content provided.</p>' }} />
            
            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-charcoal/10 flex flex-wrap gap-3">
                {blog.tags.map((tag, i) => (
                  <span key={i} className="px-4 py-2 bg-charcoal/5 rounded-full text-charcoal/60 text-sm font-semibold hover:bg-charcoal/10 transition-colors cursor-pointer">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-16 pt-10 border-t border-charcoal/[0.06] flex flex-col sm:flex-row items-center justify-between gap-6 bg-ivory -mx-8 -mx-12 lg:-mx-16 -mb-8 -mb-12 lg:-mb-16 p-8 md:p-12 lg:p-16">
              <div>
                <h4 className="font-display font-bold text-2xl text-charcoal mb-2">Need legal assistance?</h4>
                <p className="text-charcoal/60">Our experts can help you with your compliance and legal needs.</p>
              </div>
              <Link href="/">
                <Button className="bg-charcoal text-white hover:bg-sage shadow-xl shadow-charcoal/10 hover:shadow-sage/20 transition-all duration-300 h-14 px-8 group shrink-0 rounded-xl">
                  Contact Us <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
