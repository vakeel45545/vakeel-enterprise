'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SubmitButton } from '@/components/admin/SubmitButton';
import { useState } from 'react';

interface IndustryFormProps {
  action: (formData: FormData) => Promise<void>;
  initialData?: {
    name?: string;
    slug?: string;
    description?: string | null;
    short_description?: string | null;
    image_url?: string | null;
    icon?: string | null;
    meta_title?: string | null;
    meta_description?: string | null;
    keywords?: string | null;
    og_image?: string | null;
    faq?: any;
    published?: boolean | null;
    featured?: boolean | null;
    display_order?: number | null;
  };
}

export function IndustryForm({ action, initialData }: IndustryFormProps) {
  const [faqs, setFaqs] = useState<{ q: string; a: string }[]>(
    initialData?.faq || []
  );

  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  return (
    <form action={action} className="space-y-8 max-w-4xl">
      {/* Basic Info */}
      <Card className="p-6 border-gray-200 shadow-sm space-y-6">
        <h2 className="text-xl font-display font-bold text-charcoal border-b border-gray-100 pb-4">Basic Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">Industry Name *</label>
            <Input
              name="name"
              required
              defaultValue={initialData?.name || ''}
              placeholder="e.g. Healthcare"
              onChange={(e) => {
                const slugInput = e.target.form?.querySelector('[name="slug"]') as HTMLInputElement;
                if (slugInput && !initialData?.slug) {
                  slugInput.value = generateSlug(e.target.value);
                }
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">Slug *</label>
            <Input name="slug" required defaultValue={initialData?.slug || ''} placeholder="healthcare" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-charcoal mb-2">Short Description</label>
          <Input
            name="short_description"
            defaultValue={initialData?.short_description || ''}
            placeholder="One-line industry description"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-charcoal mb-2">Full Description</label>
          <Textarea
            name="description"
            defaultValue={initialData?.description || ''}
            rows={4}
            placeholder="Detailed description of this industry vertical..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">Icon (Lucide name)</label>
            <Input name="icon" defaultValue={initialData?.icon || ''} placeholder="e.g. Stethoscope" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">Display Order</label>
            <Input name="display_order" type="number" defaultValue={initialData?.display_order || 0} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-charcoal mb-2">Image URL</label>
          <Input name="image_url" defaultValue={initialData?.image_url || ''} placeholder="https://..." />
        </div>
      </Card>

      {/* SEO */}
      <Card className="p-6 border-gray-200 shadow-sm space-y-6">
        <h2 className="text-xl font-display font-bold text-charcoal border-b border-gray-100 pb-4">SEO & Metadata</h2>

        <div>
          <label className="block text-sm font-semibold text-charcoal mb-2">Meta Title</label>
          <Input name="meta_title" defaultValue={initialData?.meta_title || ''} placeholder="SEO title (50-60 chars)" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-charcoal mb-2">Meta Description</label>
          <Textarea
            name="meta_description"
            defaultValue={initialData?.meta_description || ''}
            rows={2}
            placeholder="SEO description (120-160 chars)"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-charcoal mb-2">Keywords</label>
          <Input name="keywords" defaultValue={initialData?.keywords || ''} placeholder="comma, separated, keywords" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-charcoal mb-2">OG Image URL</label>
          <Input name="og_image" defaultValue={initialData?.og_image || ''} placeholder="https://..." />
        </div>
      </Card>

      {/* FAQs */}
      <Card className="p-6 border-gray-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <h2 className="text-xl font-display font-bold text-charcoal">FAQs</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setFaqs([...faqs, { q: '', a: '' }])}
            className="rounded-lg"
          >
            + Add FAQ
          </Button>
        </div>

        {faqs.map((faq, idx) => (
          <div key={idx} className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-charcoal/50">FAQ #{idx + 1}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setFaqs(faqs.filter((_, i) => i !== idx))}
                className="text-red-400 hover:text-red-600 text-xs"
              >
                Remove
              </Button>
            </div>
            <Input
              value={faq.q}
              onChange={(e) => {
                const updated = [...faqs];
                updated[idx] = { ...updated[idx], q: e.target.value };
                setFaqs(updated);
              }}
              placeholder="Question"
            />
            <Textarea
              value={faq.a}
              onChange={(e) => {
                const updated = [...faqs];
                updated[idx] = { ...updated[idx], a: e.target.value };
                setFaqs(updated);
              }}
              rows={2}
              placeholder="Answer"
            />
          </div>
        ))}

        <input type="hidden" name="faq" value={JSON.stringify(faqs)} />
      </Card>

      {/* Publishing */}
      <Card className="p-6 border-gray-200 shadow-sm">
        <h2 className="text-xl font-display font-bold text-charcoal border-b border-gray-100 pb-4 mb-6">Publishing</h2>
        <div className="flex items-center gap-8">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="published"
              defaultChecked={initialData?.published !== false}
              className="w-5 h-5 rounded border-gray-300 text-sage focus:ring-sage"
            />
            <span className="font-semibold text-charcoal">Published</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={initialData?.featured === true}
              className="w-5 h-5 rounded border-gray-300 text-amber focus:ring-amber"
            />
            <span className="font-semibold text-charcoal">Featured</span>
          </label>
        </div>
      </Card>

      <div className="flex justify-end">
        <SubmitButton>{initialData ? 'Update Industry' : 'Create Industry'}</SubmitButton>
      </div>
    </form>
  );
}
