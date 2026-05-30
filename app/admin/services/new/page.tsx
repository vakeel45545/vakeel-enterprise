import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { RichTextEditor } from '@/components/editor/rich-text-editor';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { createService } from '../../actions';
import { SubmitButton } from '@/components/admin/SubmitButton';

export default function NewServicePage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href="/admin/services" className="text-gray-500 hover:text-charcoal flex items-center gap-2 text-sm font-medium mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Services
        </Link>
        <h1 className="text-3xl font-display font-bold text-charcoal tracking-tight">Add New Service</h1>
        <p className="text-gray-500 mt-1">Create a new service offering.</p>
      </div>

      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="bg-gray-50/50 border-b border-gray-100">
          <CardTitle className="text-lg font-display">Service Details</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form action={createService} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-semibold text-charcoal">Service Title *</label>
                <Input id="title" name="title" required placeholder="e.g. Private Limited Company Registration" className="bg-gray-50 border-gray-200" />
              </div>
              <div className="space-y-2">
                <label htmlFor="slug" className="text-sm font-semibold text-charcoal">URL Slug *</label>
                <Input id="slug" name="slug" required placeholder="e.g. pvt-ltd-registration" className="bg-gray-50 border-gray-200" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="hero_title" className="text-sm font-semibold text-charcoal">Hero Title</label>
                <Input id="hero_title" name="hero_title" placeholder="e.g. Register Your Private Limited Company" className="bg-gray-50 border-gray-200" />
              </div>
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-semibold text-charcoal">Category</label>
                <Input id="category" name="category" placeholder="e.g. Registration, Tax, IP" className="bg-gray-50 border-gray-200" />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="hero_description" className="text-sm font-semibold text-charcoal">Hero Description</label>
              <textarea
                id="hero_description"
                name="hero_description"
                rows={3}
                className="w-full bg-gray-50 border border-gray-200 rounded-md p-3 text-sm"
                placeholder="Longer description for the service overview section..."
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="short_description" className="text-sm font-semibold text-charcoal">Short Description</label>
              <RichTextEditor id="short_description" name="short_description" placeholder="Brief summary of the service..." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="keywords" className="text-sm font-semibold text-charcoal">SEO Keywords</label>
                <Input id="keywords" name="keywords" placeholder="keyword1, keyword2, keyword3" className="bg-gray-50 border-gray-200" />
              </div>
              <div className="space-y-2">
                <label htmlFor="image" className="text-sm font-semibold text-charcoal">OG Image URL</label>
                <Input id="image" name="image" placeholder="https://..." className="bg-gray-50 border-gray-200" />
              </div>
            </div>

            {/* CTA Fields */}
            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-sm font-bold text-charcoal mb-4 uppercase tracking-wider">CTA Section</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="cta_title" className="text-sm font-semibold text-charcoal">CTA Title</label>
                  <Input id="cta_title" name="cta_title" placeholder="Ready to get started?" className="bg-gray-50 border-gray-200" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="cta_button_text" className="text-sm font-semibold text-charcoal">CTA Button Text</label>
                  <Input id="cta_button_text" name="cta_button_text" placeholder="Get Started Now" className="bg-gray-50 border-gray-200" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="cta_description" className="text-sm font-semibold text-charcoal">CTA Description</label>
                  <Input id="cta_description" name="cta_description" placeholder="Join thousands who trust Vakeel..." className="bg-gray-50 border-gray-200" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="cta_button_url" className="text-sm font-semibold text-charcoal">CTA Button URL</label>
                  <Input id="cta_button_url" name="cta_button_url" placeholder="/contact" className="bg-gray-50 border-gray-200" />
                </div>
              </div>
            </div>

            {/* JSONB Fields */}
            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-sm font-bold text-charcoal mb-4 uppercase tracking-wider">Dynamic Content (JSON)</h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="faq" className="text-sm font-semibold text-charcoal">FAQ</label>
                  <textarea
                    id="faq" name="faq" rows={4}
                    className="w-full bg-gray-50 border border-gray-200 rounded-md p-3 text-sm font-mono"
                    placeholder='[{"q":"What is GST?","a":"GST stands for..."},{"q":"How long?","a":"7-10 days..."}]'
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="benefits" className="text-sm font-semibold text-charcoal">Benefits</label>
                  <textarea
                    id="benefits" name="benefits" rows={4}
                    className="w-full bg-gray-50 border border-gray-200 rounded-md p-3 text-sm font-mono"
                    placeholder='[{"title":"AI-Powered","description":"Zero errors","icon":"Zap"}]'
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="process_steps" className="text-sm font-semibold text-charcoal">Process Steps</label>
                  <textarea
                    id="process_steps" name="process_steps" rows={4}
                    className="w-full bg-gray-50 border border-gray-200 rounded-md p-3 text-sm font-mono"
                    placeholder='[{"step":1,"title":"Submit","description":"Upload documents online"}]'
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="sections" className="text-sm font-semibold text-charcoal">Sections (Page Builder)</label>
                  <textarea
                    id="sections" name="sections" rows={4}
                    className="w-full bg-gray-50 border border-gray-200 rounded-md p-3 text-sm font-mono"
                    placeholder='[{"type":"hero","title":"..."},{"type":"benefits","items":[...]}]'
                  />
                  <p className="text-xs text-gray-400">
                    If sections JSON is set, the page will use the section builder instead of the default layout.
                  </p>
                </div>
              </div>
            </div>

            {/* SEO */}
            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-sm font-bold text-charcoal mb-4 uppercase tracking-wider">SEO Settings</h3>
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
            </div>

            {/* Status */}
            <div className="border-t border-gray-100 pt-6 flex gap-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="published" defaultChecked className="w-4 h-4 rounded border-gray-300 text-sage focus:ring-sage" />
                <span className="text-sm font-semibold text-charcoal">Published</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="featured" className="w-4 h-4 rounded border-gray-300 text-sage focus:ring-sage" />
                <span className="text-sm font-semibold text-charcoal">Featured</span>
              </label>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
              <Link href="/admin/services">
                <div className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors">Cancel</div>
              </Link>
              <SubmitButton loadingText="Creating...">Create Service</SubmitButton>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
