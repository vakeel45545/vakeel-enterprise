import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, FileText, Eye, EyeOff, Globe, Edit } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { deletePage } from '../actions';
import { SubmitButton } from '@/components/admin/SubmitButton';

export default async function AdminPagesPage() {
  const supabase = await createClient();

  const { data: pages } = await supabase
    .from('pages')
    .select('*')
    .order('created_at', { ascending: false });

  const pageTypeColors: Record<string, string> = {
    generic: 'bg-blue-100 text-blue-700',
    landing: 'bg-purple-100 text-purple-700',
    legal: 'bg-amber-100 text-amber-700',
    about: 'bg-sage/20 text-sage',
    contact: 'bg-emerald-100 text-emerald-700',
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-charcoal tracking-tight">CMS Pages</h1>
          <p className="text-gray-500 mt-1">Create dynamic pages without code. About, Careers, Contact, Privacy, Legal, Landing pages.</p>
        </div>
        <Link href="/admin/pages/new">
          <Button className="bg-charcoal hover:bg-sage text-white font-semibold shadow-sm">
            <Plus className="w-4 h-4 mr-2" /> New Page
          </Button>
        </Link>
      </div>

      {(!pages || pages.length === 0) ? (
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-2">No CMS pages yet</p>
            <p className="text-gray-400 text-sm mb-6">Create your first page — About, Careers, Contact, Legal, or custom landing pages.</p>
            <Link href="/admin/pages/new">
              <Button className="bg-charcoal hover:bg-sage text-white font-semibold">
                <Plus className="w-4 h-4 mr-2" /> Create First Page
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {pages.map((page) => (
            <Card key={page.id} className="border-gray-200 shadow-sm hover:shadow-md transition-shadow group">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-charcoal/5 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-charcoal/40" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-charcoal truncate">{page.title}</h3>
                        {page.published ? (
                          <Eye className="w-3.5 h-3.5 text-sage shrink-0" />
                        ) : (
                          <EyeOff className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        )}
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest shrink-0 ${pageTypeColors[page.page_type || 'generic'] || pageTypeColors.generic}`}>
                          {page.page_type || 'generic'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                        <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> /{page.slug}</span>
                        {page.updated_at && (
                          <span>Updated {new Date(page.updated_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href={`/${page.slug}`} target="_blank">
                      <Button variant="ghost" size="sm" className="text-gray-500 hover:text-charcoal">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Link href={`/admin/pages/${page.id}/edit`}>
                      <Button variant="ghost" size="sm" className="text-gray-500 hover:text-charcoal">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <form action={async () => { 'use server'; await deletePage(page.id); }}>
                      <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-600 hover:bg-red-50" type="submit">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </form>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
