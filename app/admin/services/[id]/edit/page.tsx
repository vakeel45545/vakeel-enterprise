import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { RichTextEditor } from '@/components/editor/rich-text-editor';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { updateService } from '../../../actions';
import { SubmitButton } from '@/components/admin/SubmitButton';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  const supabase = await createClient();
  const { data: service } = await supabase.from('services').select('*').eq('id', id).maybeSingle();

  if (!service) {
    notFound();
  }

  // Bind the ID to the action
  const updateServiceWithId = updateService.bind(null, id);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href="/admin/services" className="text-gray-500 hover:text-charcoal flex items-center gap-2 text-sm font-medium mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Services
        </Link>
        <h1 className="text-3xl font-display font-bold text-charcoal tracking-tight">Edit Service</h1>
        <p className="text-gray-500 mt-1">Update existing service information.</p>
      </div>

      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="bg-gray-50/50 border-b border-gray-100">
          <CardTitle className="text-lg font-display">Service Details</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form action={updateServiceWithId} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-semibold text-charcoal">Service Title *</label>
                <Input id="title" name="title" defaultValue={service.title} required className="bg-gray-50 border-gray-200" />
              </div>
              <div className="space-y-2">
                <label htmlFor="slug" className="text-sm font-semibold text-charcoal">URL Slug *</label>
                <Input id="slug" name="slug" defaultValue={service.slug} required className="bg-gray-50 border-gray-200" />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="hero_title" className="text-sm font-semibold text-charcoal">Hero Title</label>
              <Input id="hero_title" name="hero_title" defaultValue={service.hero_title || ''} className="bg-gray-50 border-gray-200" />
            </div>

            <div className="space-y-2">
              <label htmlFor="short_description" className="text-sm font-semibold text-charcoal">Short Description</label>
              <RichTextEditor id="short_description" name="short_description" defaultValue={service.short_description || ''} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                <label htmlFor="meta_title" className="text-sm font-semibold text-charcoal">SEO Meta Title</label>
                <Input id="meta_title" name="meta_title" defaultValue={service.meta_title || ''} className="bg-gray-50 border-gray-200" />
              </div>
              <div className="space-y-2">
                <label htmlFor="meta_description" className="text-sm font-semibold text-charcoal">SEO Meta Description</label>
                <Input id="meta_description" name="meta_description" defaultValue={service.meta_description || ''} className="bg-gray-50 border-gray-200" />
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
              <Link href="/admin/services">
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
