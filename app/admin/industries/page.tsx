import { createClient } from '@/lib/supabase/server';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Globe, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { deleteIndustry } from './actions';

export default async function AdminIndustriesPage() {
  const supabase = await createClient();
  const { data: industries } = await supabase
    .from('industries')
    .select('*')
    .order('display_order', { ascending: true });

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-charcoal tracking-tight">Industries</h1>
          <p className="text-gray-500 mt-1">Manage industry verticals and their service assignments.</p>
        </div>
        <Link href="/admin/industries/new">
          <Button className="bg-charcoal text-white hover:bg-sage transition-colors rounded-xl font-bold shadow-premium">
            <Plus className="w-4 h-4 mr-2" /> New Industry
          </Button>
        </Link>
      </div>

      {!industries || industries.length === 0 ? (
        <Card className="p-12 text-center border-gray-200 border-dashed bg-gray-50/50">
          <Globe className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-charcoal mb-2">No industries yet</h3>
          <p className="text-gray-500 mb-6">Create your first industry to start building cross-vertical pages.</p>
          <Link href="/admin/industries/new">
            <Button className="bg-charcoal text-white hover:bg-sage rounded-xl font-bold">
              <Plus className="w-4 h-4 mr-2" /> Create Industry
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {industries.map((industry) => (
            <Card key={industry.id} className="p-6 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  {industry.image_url ? (
                    <Image
                      src={industry.image_url}
                      alt={industry.name}
                      width={56}
                      height={56}
                      className="w-14 h-14 rounded-xl object-cover border border-charcoal/5"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-sage/10 flex items-center justify-center text-sage font-bold text-xl border border-sage/20">
                      {industry.name.charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-charcoal text-lg truncate">{industry.name}</h3>
                      {industry.published ? (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold">
                          <Eye className="w-3 h-3" /> Live
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs font-bold">
                          <EyeOff className="w-3 h-3" /> Draft
                        </span>
                      )}
                      {industry.featured && (
                        <span className="px-2 py-0.5 rounded-full bg-amber/10 text-amber text-xs font-bold">Featured</span>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm truncate mt-0.5">
                      /industries/{industry.slug}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button asChild variant="outline" size="sm" className="rounded-lg">
                    <Link href={`/admin/industries/${industry.id}`}>
                      <Edit className="w-4 h-4 mr-1" /> Edit
                    </Link>
                  </Button>
                  <DeleteButton id={industry.id} deleteAction={deleteIndustry} itemName="industry" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
