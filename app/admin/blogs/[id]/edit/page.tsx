import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { updateBlog } from '../../../actions';
import { SubmitButton } from '@/components/admin/SubmitButton';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  const supabase = await createClient();
  const { data: blog } = await supabase.from('blogs').select('*').eq('id', id).maybeSingle();

  if (!blog) {
    notFound();
  }

  // Bind the ID to the action
  const updateBlogWithId = updateBlog.bind(null, id);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/admin/blogs" className="text-gray-500 hover:text-charcoal flex items-center gap-2 text-sm font-medium mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Blogs
        </Link>
        <h1 className="text-3xl font-display font-bold text-charcoal tracking-tight">Edit Blog Post</h1>
        <p className="text-gray-500 mt-1">Update an existing article.</p>
      </div>

      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="bg-gray-50/50 border-b border-gray-100">
          <CardTitle className="text-lg font-display">Post Details</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form action={updateBlogWithId} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-semibold text-charcoal">Post Title *</label>
                <Input id="title" name="title" defaultValue={blog.title} required className="bg-gray-50 border-gray-200" />
              </div>
              <div className="space-y-2">
                <label htmlFor="slug" className="text-sm font-semibold text-charcoal">URL Slug *</label>
                <Input id="slug" name="slug" defaultValue={blog.slug} required className="bg-gray-50 border-gray-200" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-semibold text-charcoal">Category</label>
                <Input id="category" name="category" defaultValue={blog.category || ''} className="bg-gray-50 border-gray-200" />
              </div>
              <div className="space-y-2">
                <label htmlFor="thumbnail" className="text-sm font-semibold text-charcoal">Thumbnail URL</label>
                <Input id="thumbnail" name="thumbnail" defaultValue={blog.thumbnail || ''} className="bg-gray-50 border-gray-200" />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-semibold text-charcoal">Content (HTML or Markdown)</label>
              <Textarea id="content" name="content" defaultValue={blog.content || ''} rows={12} className="bg-gray-50 border-gray-200 resize-y font-mono text-sm" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                <label htmlFor="meta_title" className="text-sm font-semibold text-charcoal">SEO Meta Title</label>
                <Input id="meta_title" name="meta_title" defaultValue={blog.meta_title || ''} className="bg-gray-50 border-gray-200" />
              </div>
              <div className="space-y-2">
                <label htmlFor="meta_description" className="text-sm font-semibold text-charcoal">SEO Meta Description</label>
                <Input id="meta_description" name="meta_description" defaultValue={blog.meta_description || ''} className="bg-gray-50 border-gray-200" />
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
              <Link href="/admin/blogs">
                <div className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors">Cancel</div>
              </Link>
              <SubmitButton loadingText="Updating...">Save Changes</SubmitButton>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
