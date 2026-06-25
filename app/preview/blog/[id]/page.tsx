import { verifyAdminAndGetClient } from '@/lib/supabase/admin';
import { notFound } from 'next/navigation';
import { BlogPreview } from '@/components/admin/blog/BlogPreview';

export const dynamic = 'force-dynamic';

export default async function DraftBlogPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await verifyAdminAndGetClient();
  const { id } = await params;

  // We fetch by ID because the draft might not have a finalized slug, or it's not published yet.
  const { data: blog, error } = await supabase
    .from('blogs')
    .select(`
      *,
      author:authors (
        name,
        avatar
      )
    `)
    .eq('id', id)
    .single();

  if (error || !blog) {
    notFound();
  }

  // Get author details
  // Note: Depending on your exact DB structure, author might be returned as an array or object
  let authorName = 'Vakeel Team';
  let authorAvatar = null;
  if (blog.author && !Array.isArray(blog.author)) {
    authorName = blog.author.name || 'Vakeel Team';
    authorAvatar = blog.author.avatar || null;
  } else if (Array.isArray(blog.author) && blog.author.length > 0) {
    authorName = blog.author[0].name || 'Vakeel Team';
    authorAvatar = blog.author[0].avatar || null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Admin Top Bar */}
      <div className="bg-charcoal text-white px-6 py-3 flex items-center justify-between shadow-md z-50 sticky top-0">
        <div className="flex items-center gap-3">
          <span className="font-bold">Draft Preview</span>
          <span className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
            {blog.status || 'draft'}
          </span>
        </div>
        <div>
          <a href={`/admin/blogs/${id}/edit`} className="text-sm font-semibold hover:text-sage transition-colors">
            Back to Editor
          </a>
        </div>
      </div>

      <div className="flex-1 p-6 flex justify-center items-start">
        <div className="w-full max-w-[1500px]">
          <BlogPreview
            title={blog.title}
            category={blog.category || 'Uncategorized'}
            content={blog.content || ''}
            thumbnail={blog.thumbnail}
            authorName={authorName}
            authorAvatar={authorAvatar}
            tags={blog.tags || []}
            readingTime={blog.reading_time}
          />
        </div>
      </div>
    </div>
  );
}
