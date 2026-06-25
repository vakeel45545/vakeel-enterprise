import { notFound } from 'next/navigation';
import { ArrowRight, BookOpen, Clock, ChevronRight, Calendar, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { getBlogById, getRelatedBlogs } from '@/lib/api/blogs';
import { marked } from 'marked';
import { BlogSchema } from '@/components/seo/BlogSchema';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

const BASE_URL = process.env.APP_URL || 'https://vakeel.com';

export default async function BlogPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const blog = await getBlogById(id);
  if (!blog) notFound();

  // If blog is already published, we might want to redirect to live URL or just show preview anyway.
  // For now, allow preview regardless of status.

  const relatedBlogs = await getRelatedBlogs(blog.id, blog.category || null, 3);

  const htmlContent = /(<\/?[a-z][\s\S]*>)/i.test(blog.content || '')
    ? (blog.content ?? '')
    : (marked.parse(blog.content || '<p>No content provided.</p>', { async: false }) as string);

  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Admin', href: '/admin' },
    { name: 'Blog Preview', href: '#' },
  ];

  return (
    <main className="min-h-screen bg-ivory pb-20 selection:bg-sage/30 selection:text-sage relative">

      {/* PREVIEW BANNER */}
      <div className="fixed top-0 left-0 w-full bg-amber text-charcoal text-center text-sm font-bold py-2 z-50 flex items-center justify-center gap-2 shadow-md">
        <Clock className="w-4 h-4" /> DRAFT PREVIEW MODE - Not live to the public
        <Link href={`/admin/blogs/${blog.id}`} className="ml-4 underline text-charcoal/80 hover:text-charcoal">
          Back to Editor
        </Link>
      </div>

      <BlogSchema
        title={blog.meta_title || blog.title}
        description={blog.meta_description}
        url={`${BASE_URL}/blog/preview/${id}`}
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
                <span className="truncate max-w-[120px] text-white/40">{blog.category}</span>
              </>
            )}
            <ChevronRight className="w-3 h-3 text-white/40" />
            <span className="truncate max-w-[200px] text-white/40">{blog.title || 'Untitled Draft'}</span>
          </div>

          {blog.category && (
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-sage/20 border border-sage/30 text-sage text-xs font-bold uppercase tracking-widest mb-6">
              <Tag className="w-3 h-3" /> {blog.category}
            </div>
          )}

          <h1 className="text-4xl md:text-5xl lg:text-[64px] font-display font-bold mb-6 lg:mb-8 leading-[1.08] tracking-tight">
            {blog.title || 'Untitled Draft'}
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-24 section-connector-top mt-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-[2rem] p-8 md:p-12 lg:p-16 border border-charcoal/[0.04] shadow-[0_8px_32px_-8px_rgba(0,0,0,0.04)] relative overflow-hidden">
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

            {/* Featured Image */}
            {blog.thumbnail && (
              <div className="mb-12 rounded-[2rem] overflow-hidden relative w-full h-[400px] md:h-[500px] shadow-premium">
                <Image
                  src={blog.thumbnail}
                  alt={blog.title || 'Blog featured image'}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
            )}

            {/* Rich content */}
            <div
              className="prose prose-lg lg:prose-xl prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-charcoal prose-headings:mt-12 prose-headings:mb-6 prose-a:text-sage prose-a:font-semibold hover:prose-a:text-emerald-700 prose-p:text-charcoal/75 prose-p:leading-loose prose-p:mb-6 prose-blockquote:border-l-4 prose-blockquote:border-sage prose-blockquote:bg-sage/5 prose-blockquote:p-6 prose-blockquote:rounded-r-xl prose-blockquote:italic prose-blockquote:text-charcoal/80 prose-img:rounded-[2rem] prose-img:shadow-premium prose-hr:border-charcoal/10 prose-strong:text-charcoal prose-strong:font-bold prose-li:text-charcoal/75 prose-li:my-2 prose-ul:my-6 max-w-none transition-all duration-300"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-charcoal/10 flex flex-wrap gap-3">
                {blog.tags.map((tag: string, i: number) => (
                  <span key={i} className="px-4 py-2 bg-charcoal/5 rounded-full text-charcoal/60 text-sm font-semibold hover:bg-charcoal/10 transition-colors cursor-pointer">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
