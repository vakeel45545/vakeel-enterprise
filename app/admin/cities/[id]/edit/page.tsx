import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { updateCity } from '../../../actions';
import { SubmitButton } from '@/components/admin/SubmitButton';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

export default async function EditCityPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  const supabase = await createClient();
  const { data: city } = await supabase.from('cities').select('*').eq('id', id).maybeSingle();

  if (!city) {
    notFound();
  }

  // Bind the ID to the action
  const updateCityWithId = updateCity.bind(null, id);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href="/admin/cities" className="text-gray-500 hover:text-charcoal flex items-center gap-2 text-sm font-medium mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Cities
        </Link>
        <h1 className="text-3xl font-display font-bold text-charcoal tracking-tight">Edit City</h1>
        <p className="text-gray-500 mt-1">Update existing city information.</p>
      </div>

      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="bg-gray-50/50 border-b border-gray-100">
          <CardTitle className="text-lg font-display">City Details</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form action={updateCityWithId} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="city_name" className="text-sm font-semibold text-charcoal">City Name *</label>
                <Input id="city_name" name="city_name" defaultValue={city.city_name} required className="bg-gray-50 border-gray-200" />
              </div>
              <div className="space-y-2">
                <label htmlFor="slug" className="text-sm font-semibold text-charcoal">URL Slug *</label>
                <Input id="slug" name="slug" defaultValue={city.slug} required className="bg-gray-50 border-gray-200" />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="state" className="text-sm font-semibold text-charcoal">State / Region</label>
              <Input id="state" name="state" defaultValue={city.state || ''} className="bg-gray-50 border-gray-200" />
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
              <Link href="/admin/cities">
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
