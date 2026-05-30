import { notFound } from 'next/navigation';
import { ArrowRight, BookOpen, Clock, ChevronRight, Calendar, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getBlogBySlug, getRelatedBlogs } from '@/lib/api/blogs';
import { marked } from 'marked';
import { generateBlogSEO } from '@/lib/seo/generateMetadata';
import { BlogSchema } from '@/components/seo/BlogSchema';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { FAQSchema } from '@/components/seo/FAQSchema';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

const BASE_URL = process.env.APP_URL || 'https://vakeel.com';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) return {};
  return generateBlogSEO(blog);
}

export default async function BlogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const blog = await getBlogBySlug(slug);
  if (!blog) notFound();

  const relatedBlogs = await getRelatedBlogs(blog.id, blog.category || null, 3);

  const htmlContent = /(<\/?[a-z][\s\S]*>)/i.test(blog.content || '')
    ? (blog.content ?? '')
    : (marked.parse(blog.content || '<p>No content provided.</p>', { async: false }) as string);

  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Blog', href: '/blog' },
    ...(blog.category
      ? [{ name: blog.category, href: `/blog/category/${blog.category.toLowerCase().replace(/\s+/g, '-')}` }]
      : []),
    { name: blog.title, href: `/blog/${slug}` },
  ];

  return (
    <main className="min-h-screen bg-ivory pb-20 selection:bg-sage/30 selection:text-sage">
      <BlogSchema
        title={blog.meta_title || blog.title}
        description={blog.meta_description}
        url={`${BASE_URL}/blog/${slug}`}
        image={blog.og_image || blog.thumbnail}
        publishedTime={blog.created_at}
        modifiedTime={blog.updated_at}
        authorName={blog.author?.name}
        tags={blog.tags}
      />
      <BreadcrumbSchema items={breadcrumbs} />

      {/* Hero */}
      <section className="pt-32 pb-24 md:pt-40 md:pb-32 bg-charcoal text-white rounded-b-[2.5rem] lg:rounded-b-[3rem] relative overflow-hidden noise-overlay">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/[0.03] rounded-full blur-[120px] pointer-events-none animate-pulse-glow" />
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-sage/[0.05] rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

        <div className="container relative z-10 mx-auto px-4 text-center max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-700">
          {/* Breadcrumb */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 text-sm font-semibold text-white/70 backdrop-blur-md">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 text-white/40" />
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            {blog.category && (
              <>
                <ChevronRight className="w-3 h-3 text-white/40" />
                <Link href={`/blog/category/${blog.category.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-white transition-colors truncate max-w-[120px]">
                  {blog.category}
                </Link>
              </>
            )}
            <ChevronRight className="w-3 h-3 text-white/40" />
            <span className="truncate max-w-[200px]">{blog.title}</span>
          </div>

          {blog.category && (
            <Link
              href={`/blog/category/${blog.category.toLowerCase().replace(/\s+/g, '-')}`}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-sage/20 border border-sage/30 text-sage text-xs font-bold uppercase tracking-widest mb-6 hover:bg-sage/30 transition-colors"
            >
              <Tag className="w-3 h-3" /> {blog.category}
            </Link>
          )}

          <h1 className="text-4xl md:text-5xl lg:text-[64px] font-display font-bold mb-6 lg:mb-8 leading-[1.08] tracking-tight">
            {blog.title}
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-24 section-connector-top">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-[2rem] p-8 md:p-12 lg:p-16 border border-charcoal/[0.04] shadow-[0_8px_32px_-8px_rgba(0,0,0,0.04)] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-sage/50 via-emerald-500/50 to-amber/50"></div>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-6 text-charcoal/45 text-sm font-semibold mb-12 border-b border-charcoal/[0.06] pb-6 uppercase tracking-wider">
              <div className="flex items-center gap-2">
                {blog?.author?.avatar ? (
                  <img src={blog.author.avatar} alt={blog.author.name} className="w-6 h-6 rounded-full object-cover shadow-sm" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-sage/20 flex items-center justify-center text-sage font-bold text-xs shadow-sm">
                    {blog?.author?.name?.charAt(0) || 'V'}
                  </div>
                )}
                <span className="text-charcoal/70">{blog?.author?.name || 'Vakeel Team'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-sage" />
                {new Date(blog.created_at || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              {blog.reading_time && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber" /> {blog.reading_time} min read
                </div>
              )}
              {!blog.reading_time && (
                <div className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-amber" /> 5 min read</div>
              )}
            </div>

            {/* Rich content */}
            <div
              className="prose prose-lg lg:prose-xl prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-charcoal prose-headings:mt-12 prose-headings:mb-6 prose-a:text-sage prose-a:font-semibold hover:prose-a:text-emerald-700 prose-p:text-charcoal/75 prose-p:leading-loose prose-p:mb-6 prose-blockquote:border-l-4 prose-blockquote:border-sage prose-blockquote:bg-sage/5 prose-blockquote:p-6 prose-blockquote:rounded-r-xl prose-blockquote:italic prose-blockquote:text-charcoal/80 prose-img:rounded-[2rem] prose-img:shadow-premium prose-hr:border-charcoal/10 prose-strong:text-charcoal prose-strong:font-bold prose-li:text-charcoal/75 prose-li:my-2 prose-ul:my-6 max-w-none transition-all duration-300"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-charcoal/10 flex flex-wrap gap-3">
                {blog.tags.map((tag, i) => (
                  <span key={i} className="px-4 py-2 bg-charcoal/5 rounded-full text-charcoal/60 text-sm font-semibold hover:bg-charcoal/10 transition-colors cursor-pointer">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* CTA bottom */}
            <div className="mt-16 pt-10 border-t border-charcoal/[0.06] flex flex-col sm:flex-row items-center justify-between gap-6 bg-ivory -mx-8 md:-mx-12 lg:-mx-16 -mb-8 md:-mb-12 lg:-mb-16 p-8 md:p-12 lg:p-16">
              <div>
                <h4 className="font-display font-bold text-2xl text-charcoal mb-2">Need legal assistance?</h4>
                <p className="text-charcoal/60 font-medium">Our experts can help you with your compliance and legal needs. Request a callback now.</p>
              </div>
              <Link href="/contact">
                <Button className="bg-charcoal text-white hover:bg-sage shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-premium-hover transition-all duration-300 h-14 px-8 group shrink-0 rounded-xl font-bold">
                  Contact Us <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related Blogs */}
      {relatedBlogs.length > 0 && (
        <section className="py-24 bg-ivory">
          <div className="container mx-auto px-4 max-w-[1440px]">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl lg:text-4xl font-display font-bold text-charcoal tracking-tight">
                Related <span className="text-sage">Articles</span>
              </h2>
              {blog.category && (
                <Link
                  href={`/blog/category/${blog.category.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-sage font-bold text-sm flex items-center gap-1.5 hover:text-emerald-600 transition-colors"
                >
                  More {blog.category} <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedBlogs.map((related) => (
                <article key={related.id} className="group bg-white rounded-[2rem] border border-charcoal/5 shadow-sm hover:shadow-premium-hover transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                  {related.thumbnail && (
                    <div className="h-40 overflow-hidden">
                      <img src={related.thumbnail} alt={related.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                  )}
                  <div className="p-6">
                    {related.category && (
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sage/10 text-sage text-[10px] font-bold uppercase tracking-widest mb-3">
                        {related.category}
                      </div>
                    )}
                    <h3 className="font-display font-bold text-charcoal text-lg mb-3 leading-tight group-hover:text-sage transition-colors line-clamp-2">
                      <Link href={`/blog/${related.slug}`}>{related.title}</Link>
                    </h3>
                    <Link href={`/blog/${related.slug}`} className="text-sage text-sm font-bold flex items-center gap-1 hover:text-emerald-600 transition-colors">
                      Read More <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
