import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { createNavigation } from '../../actions';
import { SubmitButton } from '@/components/admin/SubmitButton';
import { createClient } from '@/lib/supabase/server';

export default async function NewNavigationPage() {
  const supabase = await createClient();
  const { data: topLevelNav } = await supabase.from('navigation').select('*').is('parent_id', null).order('order');

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href="/admin/navigation" className="text-gray-500 hover:text-charcoal flex items-center gap-2 text-sm font-medium mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Navigation
        </Link>
        <h1 className="text-3xl font-display font-bold text-charcoal tracking-tight">Add Navigation Item</h1>
        <p className="text-gray-500 mt-1">Create a new menu item for the website.</p>
      </div>

      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="bg-gray-50/50 border-b border-gray-100">
          <CardTitle className="text-lg font-display">Item Details</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form action={createNavigation} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-semibold text-charcoal">Title *</label>
                <Input id="title" name="title" required placeholder="e.g. Corporate Services" className="bg-gray-50 border-gray-200" />
              </div>
              <div className="space-y-2">
                <label htmlFor="slug" className="text-sm font-semibold text-charcoal">URL / Slug</label>
                <Input id="slug" name="slug" placeholder="e.g. /services or /about" className="bg-gray-50 border-gray-200" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="parent_id" className="text-sm font-semibold text-charcoal">Parent Item (Optional)</label>
                <select id="parent_id" name="parent_id" className="w-full h-10 px-3 rounded-md border border-gray-200 bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-sage/20">
                  <option value="">None (Top Level)</option>
                  {topLevelNav?.map(nav => (
                    <option key={nav.id} value={nav.id}>{nav.title}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500">Select a parent to make this a dropdown item.</p>
              </div>
              <div className="space-y-2">
                <label htmlFor="order" className="text-sm font-semibold text-charcoal">Display Order</label>
                <Input id="order" name="order" type="number" defaultValue="0" className="bg-gray-50 border-gray-200" />
              </div>
            </div>

            <div className="space-y-2 flex items-center gap-3">
              <input type="checkbox" id="featured" name="featured" className="w-4 h-4 rounded text-sage border-gray-300 focus:ring-sage/20" />
              <label htmlFor="featured" className="text-sm font-semibold text-charcoal m-0">Featured Item (Highlight in menu)</label>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
              <Link href="/admin/navigation">
                <div className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors">Cancel</div>
              </Link>
              <SubmitButton loadingText="Creating...">Create Item</SubmitButton>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
