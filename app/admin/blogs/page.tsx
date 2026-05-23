import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { deleteBlog } from '../actions';
import { DeleteButton } from '@/components/admin/DeleteButton';

export default async function AdminBlogsPage() {
  const supabase = await createClient();
  
  const { data: blogs } = await supabase
    .from('blogs')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-charcoal tracking-tight">Blog Management</h1>
          <p className="text-gray-500 mt-1">Create, edit, and manage your blog posts.</p>
        </div>
        <Link href="/admin/blogs/new">
          <Button className="bg-sage hover:bg-emerald-700 text-white shadow-md">
            <Plus className="w-4 h-4 mr-2" /> New Blog Post
          </Button>
        </Link>
      </div>

      <Card className="border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Published</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {blogs && blogs.length > 0 ? (
                blogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-charcoal max-w-[300px] truncate">{blog.title}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-sage/10 text-sage text-xs font-bold rounded-full">{blog.category}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(blog.created_at || '').toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/blog/${blog.slug}`} target="_blank">
                          <Button variant="outline" size="icon" className="w-8 h-8 rounded-lg border-gray-200 text-gray-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/blogs/${blog.id}/edit`}>
                          <Button variant="outline" size="icon" className="w-8 h-8 rounded-lg border-gray-200 text-gray-500 hover:text-amber hover:border-amber/30 hover:bg-amber/10">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <DeleteButton id={blog.id} deleteAction={deleteBlog} itemName={blog.title} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    No blog posts found. Click &quot;New Blog Post&quot; to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
