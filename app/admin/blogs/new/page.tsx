import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { createBlog } from '../../actions';
import { SubmitButton } from '@/components/admin/SubmitButton';

export default function NewBlogPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/admin/blogs" className="text-gray-500 hover:text-charcoal flex items-center gap-2 text-sm font-medium mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Blogs
        </Link>
        <h1 className="text-3xl font-display font-bold text-charcoal tracking-tight">New Blog Post</h1>
        <p className="text-gray-500 mt-1">Publish an article to your knowledge base.</p>
      </div>

      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="bg-gray-50/50 border-b border-gray-100">
          <CardTitle className="text-lg font-display">Post Details</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form action={createBlog} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-semibold text-charcoal">Post Title *</label>
                <Input id="title" name="title" required placeholder="e.g. New Compliance Rules 2026" className="bg-gray-50 border-gray-200" />
              </div>
              <div className="space-y-2">
                <label htmlFor="slug" className="text-sm font-semibold text-charcoal">URL Slug *</label>
                <Input id="slug" name="slug" required placeholder="e.g. compliance-rules-2026" className="bg-gray-50 border-gray-200" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-semibold text-charcoal">Category</label>
                <Input id="category" name="category" placeholder="e.g. Legal, Tax, Updates" className="bg-gray-50 border-gray-200" />
              </div>
              <div className="space-y-2">
                <label htmlFor="thumbnail" className="text-sm font-semibold text-charcoal">Thumbnail URL</label>
                <Input id="thumbnail" name="thumbnail" placeholder="https://..." className="bg-gray-50 border-gray-200" />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-semibold text-charcoal">Content (HTML or Markdown)</label>
              <Textarea id="content" name="content" rows={12} placeholder="Write your blog post content here..." className="bg-gray-50 border-gray-200 resize-y font-mono text-sm" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                <label htmlFor="meta_title" className="text-sm font-semibold text-charcoal">SEO Meta Title</label>
                <Input id="meta_title" name="meta_title" placeholder="SEO Title" className="bg-gray-50 border-gray-200" />
              </div>
              <div className="space-y-2">
                <label htmlFor="meta_description" className="text-sm font-semibold text-charcoal">SEO Meta Description</label>
                <Input id="meta_description" name="meta_description" placeholder="SEO Description" className="bg-gray-50 border-gray-200" />
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
              <Link href="/admin/blogs">
                <div className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors">Cancel</div>
              </Link>
              <SubmitButton loadingText="Publishing...">Publish Post</SubmitButton>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
