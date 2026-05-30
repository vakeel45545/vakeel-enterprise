import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { RichTextEditor } from '@/components/editor/rich-text-editor';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { createFaq } from '../../actions';
import { SubmitButton } from '@/components/admin/SubmitButton';

export default function NewFaqPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href="/admin/faqs" className="text-gray-500 hover:text-charcoal flex items-center gap-2 text-sm font-medium mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to FAQs
        </Link>
        <h1 className="text-3xl font-display font-bold text-charcoal tracking-tight">Add New FAQ</h1>
        <p className="text-gray-500 mt-1">Create a frequently asked question.</p>
      </div>

      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="bg-gray-50/50 border-b border-gray-100">
          <CardTitle className="text-lg font-display">FAQ Details</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form action={createFaq} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="question" className="text-sm font-semibold text-charcoal">Question *</label>
              <Input id="question" name="question" required placeholder="e.g. What documents are required?" className="bg-gray-50 border-gray-200" />
            </div>

            <div className="space-y-2">
              <label htmlFor="answer" className="text-sm font-semibold text-charcoal">Answer *</label>
              <RichTextEditor id="answer" name="answer" placeholder="Provide a detailed answer..." />
            </div>

            <div className="space-y-2">
              <label htmlFor="service_slug" className="text-sm font-semibold text-charcoal">Service Slug (Optional)</label>
              <Input id="service_slug" name="service_slug" placeholder="e.g. pvt-ltd-registration (Leave blank for global FAQ)" className="bg-gray-50 border-gray-200" />
              <p className="text-xs text-gray-500">If provided, this FAQ will only appear on that specific service page.</p>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
              <Link href="/admin/faqs">
                <div className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors">Cancel</div>
              </Link>
              <SubmitButton loadingText="Creating...">Create FAQ</SubmitButton>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
