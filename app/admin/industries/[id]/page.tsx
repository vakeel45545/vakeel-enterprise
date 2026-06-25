import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { updateIndustry } from '../actions';
import { IndustryForm } from '@/components/admin/IndustryForm';

export default async function EditIndustryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: industry } = await supabase
    .from('industries')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (!industry) return notFound();

  const updateWithId = updateIndustry.bind(null, id);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-charcoal tracking-tight">Edit Industry</h1>
        <p className="text-gray-500 mt-1">Update &ldquo;{industry.name}&rdquo; details and SEO.</p>
      </div>
      <IndustryForm action={updateWithId} initialData={industry} />
    </div>
  );
}
