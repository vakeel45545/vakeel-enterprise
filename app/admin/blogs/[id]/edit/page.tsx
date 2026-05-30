import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { updateBlog } from '../../../actions';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { BlogEditorForm } from '@/components/admin/blog/BlogEditorForm';

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  const supabase = await createClient();
  const { data: blog } = await supabase.from('blogs').select('*').eq('id', id).maybeSingle();
  const { data: authors } = await supabase.from('authors').select('*').order('name');

  if (!blog) {
    notFound();
  }

  // Bind the ID to the action
  const updateBlogWithId = updateBlog.bind(null, id);

  return (
    <div className="max-w-6xl mx-auto">
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
          <BlogEditorForm
            mode="edit"
            authors={authors ?? []}
            blog={blog}
            action={updateBlogWithId}
          />
        </CardContent>
      </Card>
    </div>
  );
}
