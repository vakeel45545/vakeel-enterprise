import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { updateWebhook } from '../../industries/actions';
import { WebhookForm } from '@/components/admin/WebhookForm';

export default async function EditWebhookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: webhook } = await supabase
    .from('webhooks')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (!webhook) return notFound();

  const updateWithId = updateWebhook.bind(null, id);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-charcoal tracking-tight">Edit Webhook</h1>
        <p className="text-gray-500 mt-1">Update destination URL and trigger events.</p>
      </div>
      <WebhookForm action={updateWithId} initialData={webhook} />
    </div>
  );
}
