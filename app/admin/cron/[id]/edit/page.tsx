import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import CronJobForm from '@/components/admin/cron/CronJobForm';
import { updateCronJob } from '../../actions';

export default async function EditCronJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: job, error } = await supabase
    .from('cron_jobs')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !job) {
    notFound();
  }

  // Create an action with the bound ID
  const updateAction = updateCronJob.bind(null, id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <CronJobForm
        initialData={job}
        action={updateAction}
        isEditing={true}
      />
    </div>
  );
}
