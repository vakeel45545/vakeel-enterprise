import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, ExternalLink, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { createFooterSection, createFooterLink, deleteFooterSection, deleteFooterLink } from '../actions';
import { SubmitButton } from '@/components/admin/SubmitButton';

export default async function AdminFooterPage() {
  const supabase = await createClient();

  const { data: sections } = await supabase
    .from('footer_sections')
    .select('*, footer_links(*)')
    .order('order', { ascending: true });

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-charcoal tracking-tight">Footer Management</h1>
          <p className="text-gray-500 mt-1">Manage footer sections and links. Changes reflect immediately on the site.</p>
        </div>
      </div>

      {/* Add Section Form */}
      <Card className="border-gray-200 shadow-sm mb-8">
        <CardHeader className="bg-gray-50/50 border-b border-gray-100">
          <CardTitle className="text-lg font-display flex items-center gap-2">
            <Plus className="w-5 h-5 text-sage" /> Add Footer Section
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form action={createFooterSection} className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px] space-y-2">
              <label className="text-sm font-semibold text-charcoal">Section Title *</label>
              <Input name="title" required placeholder="e.g. Services, Company, Legal" className="bg-gray-50 border-gray-200" />
            </div>
            <div className="w-24 space-y-2">
              <label className="text-sm font-semibold text-charcoal">Order</label>
              <Input name="order" type="number" defaultValue="0" className="bg-gray-50 border-gray-200" />
            </div>
            <SubmitButton loadingText="Adding...">Add Section</SubmitButton>
          </form>
        </CardContent>
      </Card>

      {/* Existing Sections */}
      <div className="space-y-6">
        {(!sections || sections.length === 0) ? (
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="p-12 text-center">
              <p className="text-gray-400 text-lg">No footer sections yet. Add one above to get started.</p>
            </CardContent>
          </Card>
        ) : (
          sections.map((section) => (
            <Card key={section.id} className="border-gray-200 shadow-sm">
              <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-display flex items-center gap-3">
                    {section.visible ? <Eye className="w-4 h-4 text-sage" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                    {section.title}
                    <span className="text-xs text-gray-400 font-normal ml-2">Order: {section.order}</span>
                  </CardTitle>
                  <form action={async () => { 'use server'; await deleteFooterSection(section.id); }}>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50" type="submit">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {/* Links in this section */}
                {section.footer_links && section.footer_links.length > 0 ? (
                  <div className="space-y-2 mb-6">
                    {(section.footer_links as any[]).sort((a: any, b: any) => (a.order || 0) - (b.order || 0)).map((link: any) => (
                      <div key={link.id} className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl border border-gray-100 group hover:border-gray-200 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-charcoal text-sm">{link.title}</span>
                          <span className="text-gray-400 text-xs flex items-center gap-1">
                            <ExternalLink className="w-3 h-3" /> {link.url}
                          </span>
                        </div>
                        <form action={async () => { 'use server'; await deleteFooterLink(link.id); }}>
                          <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity" type="submit">
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </form>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm mb-4">No links in this section yet.</p>
                )}

                {/* Add Link to Section */}
                <form action={createFooterLink} className="flex flex-wrap gap-3 items-end pt-4 border-t border-gray-100">
                  <input type="hidden" name="section_id" value={section.id} />
                  <div className="flex-1 min-w-[150px] space-y-1">
                    <label className="text-xs font-semibold text-gray-500">Link Title</label>
                    <Input name="title" required placeholder="e.g. GST Registration" className="h-9 text-sm bg-gray-50 border-gray-200" />
                  </div>
                  <div className="flex-1 min-w-[150px] space-y-1">
                    <label className="text-xs font-semibold text-gray-500">URL</label>
                    <Input name="url" required placeholder="/services/gst-registration" className="h-9 text-sm bg-gray-50 border-gray-200" />
                  </div>
                  <div className="w-20 space-y-1">
                    <label className="text-xs font-semibold text-gray-500">Order</label>
                    <Input name="order" type="number" defaultValue="0" className="h-9 text-sm bg-gray-50 border-gray-200" />
                  </div>
                  <SubmitButton loadingText="..." className="h-9 text-sm px-4">+ Add Link</SubmitButton>
                </form>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
