import { createWebhook } from '../../industries/actions';
import { WebhookForm } from '@/components/admin/WebhookForm';

export default function NewWebhookPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-charcoal tracking-tight">Create Webhook</h1>
        <p className="text-gray-500 mt-1">Send platform events in real-time to external applications.</p>
      </div>
      <WebhookForm action={createWebhook} />
    </div>
  );
}
