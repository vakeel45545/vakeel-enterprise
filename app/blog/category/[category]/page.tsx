import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getBlogsByCategory, getDistinctBlogCategories } from '@/lib/api/services';
import { generateCategorySEO } from '@/lib/seo/generateMetadata';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { Calendar, ArrowRight, Tag, ChevronRight, BookOpen } from 'lucide-react';
import type { Metadata } from 'next';

interface Params {
  params: Promise<{ category: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { category } = await params;
  const blogs = await getBlogsByCategory(category);
  return generateCategorySEO(category, blogs.length);
}

export default async function BlogCategoryPage({ params }: Params) {
  const { category } = await params;
  const blogs = await getBlogsByCategory(category);

  if (!blogs || blogs.length === 0) {
    notFound();
  }

  const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ');
  const baseUrl = process.env.APP_URL || 'https://vakeel.com';

  return (
    <main className="min-h-screen bg-ivory pb-20 selection:bg-sage/30 selection:text-sage">
      <BreadcrumbSchema
        items={[
          { name: 'Home', href: '/' },
          { name: 'Blog', href: '/blog' },
          { name: formattedCategory, href: `/blog/category/${category}` },
        ]}
      />

      {/* Hero */}
      <section className="pt-32 pb-24 md:pt-40 md:pb-28 bg-charcoal text-white rounded-b-[2.5rem] lg:rounded-b-[3rem] relative overflow-hidden noise-overlay">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/[0.03] rounded-full blur-[120px] pointer-events-none animate-pulse-glow" />
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

        <div className="container relative z-10 mx-auto px-4 text-center max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-700">
          {/* Breadcrumb */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 text-sm font-semibold text-white/70 backdrop-blur-md">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 text-white/40" />
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <ChevronRight className="w-3 h-3 text-white/40" />
            <span>{formattedCategory}</span>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sage/20 border border-sage/30 text-sage text-xs font-bold uppercase tracking-widest mb-6">
            <Tag className="w-3.5 h-3.5" /> {formattedCategory}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-[60px] font-display font-bold mb-6 leading-[1.08] tracking-tight">
            {formattedCategory} <span className="text-sage italic">Articles</span>
          </h1>
          <p className="text-xl text-white/60 mb-4 leading-relaxed max-w-2xl mx-auto text-balance">
            {blogs.length} expert guides on {formattedCategory} for Indian businesses.
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-24 section-connector-top">
        <div className="container mx-auto px-4 max-w-[1440px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, idx) => (
              <article
                key={blog.id}
                className="group bg-white rounded-[2rem] border border-charcoal/5 shadow-sm hover:shadow-premium-hover transition-all duration-500 hover:-translate-y-2 overflow-hidden animate-in fade-in slide-in-from-bottom-8 fill-mode-both"
                style={{ animationDelay: `${idx * 60}ms` }}
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
                  </div>
                )}
                <div className="p-8">
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
                      Read <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
