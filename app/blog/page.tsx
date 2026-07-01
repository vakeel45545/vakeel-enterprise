import Link from 'next/link';
import Image from 'next/image';
import { getBlogs, getDistinctBlogCategories } from '@/lib/api/services';
import { generateSEOMetadata } from '@/lib/seo/generateMetadata';
import { Calendar, Tag, ArrowRight, BookOpen } from 'lucide-react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Blog & Legal Guides',
  description: 'Expert guides on GST, company registration, trademark, compliance and startup law in India. Written by Vakeel\'s legal team.',
  keywords: 'legal blog india, gst guides, startup law, compliance articles, trademark news',
  path: 'blog',
});

export default async function BlogListingPage() {
  const [blogs, categories] = await Promise.all([
    getBlogs(),
    getDistinctBlogCategories(),
  ]);

  const formattedCategory = (cat: string) =>
    cat.charAt(0).toUpperCase() + cat.slice(1);

  return (
    <main className="min-h-screen bg-ivory pb-20 selection:bg-sage/30 selection:text-sage">
      {/* Hero */}
      <section className="pt-32 pb-24 md:pt-40 md:pb-32 bg-charcoal text-white rounded-b-[2.5rem] lg:rounded-b-[3rem] relative overflow-hidden noise-overlay">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/[0.03] rounded-full blur-[120px] pointer-events-none animate-pulse-glow" />
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-sage/[0.05] rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

        <div className="container relative z-10 mx-auto px-4 text-center max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 text-sm font-semibold text-white/70 backdrop-blur-md">
            <BookOpen className="w-4 h-4 text-sage" /> Legal Knowledge Center
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-[64px] font-display font-bold mb-6 leading-[1.08] tracking-tight">
            Blog & Legal <span className="text-sage italic">Guides</span>
          </h1>
          <p className="text-xl text-white/60 mb-10 leading-relaxed max-w-2xl mx-auto text-balance">
            Expert insights on GST, company registration, trademarks, and compliance — written by India&apos;s leading legal professionals.
          </p>

          {/* Category Filter Pills */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-3 justify-center mt-8">
              <Link
                href="/blog"
                className="px-5 py-2.5 rounded-full bg-sage text-white text-sm font-bold hover:bg-emerald-600 transition-colors"
              >
                All
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/blog/category/${cat.toLowerCase().replace(/\s+/g, '-')}`}
                  className="px-5 py-2.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-semibold hover:bg-white/20 hover:text-white transition-all"
                >
                  {formattedCategory(cat)}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-24 section-connector-top">
        <div className="container mx-auto px-4 max-w-[1440px]">
          {blogs.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 text-charcoal/20 mx-auto mb-6" />
              <h2 className="text-2xl font-display font-bold text-charcoal mb-3">No articles yet</h2>
              <p className="text-charcoal/55">Check back soon for expert legal guides and compliance articles.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <article
                  key={blog.id}
                  className="group bg-white rounded-[2rem] border border-charcoal/5 shadow-sm hover:shadow-premium-hover transition-all duration-500 hover:-translate-y-2 overflow-hidden animate-in fade-in slide-in-from-bottom-8 fill-mode-both"
                >
                  {blog.thumbnail && (
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={blog.thumbnail}
                        alt={blog.title}
                        width={800}
                        height={500}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      {blog.category && (
                        <div className="absolute top-4 left-4">
                          <Link
                            href={`/blog/category/${blog.category.toLowerCase().replace(/\s+/g, '-')}`}
                            className="px-3 py-1.5 rounded-full bg-charcoal/80 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-widest hover:bg-sage transition-colors"
                          >
                            {blog.category}
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="p-8">
                    {!blog.thumbnail && blog.category && (
                      <Link
                        href={`/blog/category/${blog.category.toLowerCase().replace(/\s+/g, '-')}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sage/10 text-sage text-[11px] font-bold uppercase tracking-widest mb-4 hover:bg-sage/20 transition-colors"
                      >
                        <Tag className="w-3 h-3" /> {blog.category}
                      </Link>
                    )}
                    <h2 className="text-xl font-display font-bold text-charcoal mb-3 leading-tight group-hover:text-sage transition-colors">
                      <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
                    </h2>
                    {blog.meta_description && (
                      <p className="text-charcoal/55 text-sm leading-relaxed mb-6 line-clamp-2">{blog.meta_description}</p>
                    )}
                    <div className="flex items-center justify-between text-charcoal/40 text-xs font-semibold uppercase tracking-wider border-t border-charcoal/5 pt-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(blog.created_at || new Date(0).getTime()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      <Link
                        href={`/blog/${blog.slug}`}
                        className="flex items-center gap-1 text-sage hover:text-emerald-600 transition-colors font-bold"
                      >
                        Read <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
