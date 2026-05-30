import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { RichTextEditor } from '@/components/editor/rich-text-editor';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { createPage } from '../../actions';
import { SubmitButton } from '@/components/admin/SubmitButton';

export default function NewPagePage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href="/admin/pages" className="text-gray-500 hover:text-charcoal flex items-center gap-2 text-sm font-medium mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Pages
        </Link>
        <h1 className="text-3xl font-display font-bold text-charcoal tracking-tight">Create New Page</h1>
        <p className="text-gray-500 mt-1">Create a dynamic CMS page — About, Careers, Legal, Contact, or custom landing pages.</p>
      </div>

      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="bg-gray-50/50 border-b border-gray-100">
          <CardTitle className="text-lg font-display">Page Details</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form action={createPage} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-semibold text-charcoal">Page Title *</label>
                <Input id="title" name="title" required placeholder="e.g. About Us" className="bg-gray-50 border-gray-200" />
              </div>
              <div className="space-y-2">
                <label htmlFor="slug" className="text-sm font-semibold text-charcoal">URL Slug *</label>
                <Input id="slug" name="slug" required placeholder="e.g. about" className="bg-gray-50 border-gray-200" />
                <p className="text-xs text-gray-400">This becomes: vakeel.com/<strong>about</strong></p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="page_type" className="text-sm font-semibold text-charcoal">Page Type</label>
                <select id="page_type" name="page_type" className="w-full h-10 bg-gray-50 border border-gray-200 rounded-md px-3 text-sm">
                  <option value="generic">Generic</option>
                  <option value="landing">Landing Page</option>
                  <option value="legal">Legal</option>
                  <option value="about">About</option>
                  <option value="contact">Contact</option>
                </select>
              </div>
              <div className="space-y-2 flex items-end">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="published" defaultChecked className="w-4 h-4 rounded border-gray-300 text-sage focus:ring-sage" />
                  <span className="text-sm font-semibold text-charcoal">Published</span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-semibold text-charcoal">Page Content (HTML)</label>
              <RichTextEditor id="content" name="content" placeholder="Write your page content..." />
            </div>

            <div className="space-y-2">
              <label htmlFor="sections" className="text-sm font-semibold text-charcoal">
                Sections JSON <span className="text-gray-400 font-normal">(advanced — section builder)</span>
              </label>
              <textarea
                id="sections"
                name="sections"
                rows={6}
                className="w-full bg-gray-50 border border-gray-200 rounded-md p-3 text-sm font-mono"
                placeholder='[{"type":"hero","title":"...","description":"..."},{"type":"cta","title":"...","buttonText":"..."}]'
              />
              <p className="text-xs text-gray-400">
                Supported types: <code>hero</code>, <code>benefits</code>, <code>process</code>, <code>faq</code>, <code>cta</code>, <code>content</code>
              </p>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-sm font-bold text-charcoal mb-4 uppercase tracking-wider">SEO Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="meta_title" className="text-sm font-semibold text-charcoal">Meta Title</label>
                  <Input id="meta_title" name="meta_title" placeholder="SEO Title" className="bg-gray-50 border-gray-200" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="meta_description" className="text-sm font-semibold text-charcoal">Meta Description</label>
                  <Input id="meta_description" name="meta_description" placeholder="SEO Description" className="bg-gray-50 border-gray-200" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="keywords" className="text-sm font-semibold text-charcoal">Keywords</label>
                  <Input id="keywords" name="keywords" placeholder="keyword1, keyword2" className="bg-gray-50 border-gray-200" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="og_image" className="text-sm font-semibold text-charcoal">OG Image URL</label>
                  <Input id="og_image" name="og_image" placeholder="https://..." className="bg-gray-50 border-gray-200" />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
              <Link href="/admin/pages">
                <div className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors">Cancel</div>
              </Link>
              <SubmitButton loadingText="Creating...">Create Page</SubmitButton>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
