import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Webhook, Activity, CheckCircle2, XCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { deleteWebhook } from '../industries/actions';

export default async function AdminWebhooksPage() {
  const supabase = await createClient();
  const { data: webhooks } = await supabase
    .from('webhooks')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-charcoal tracking-tight">Webhooks</h1>
          <p className="text-gray-500 mt-1">Manage outbound webhook integrations to external systems.</p>
        </div>
        <Link href="/admin/webhooks/new">
          <Button className="bg-charcoal text-white hover:bg-sage transition-colors rounded-xl font-bold shadow-premium">
            <Plus className="w-4 h-4 mr-2" /> New Webhook
          </Button>
        </Link>
      </div>

      {!webhooks || webhooks.length === 0 ? (
        <Card className="p-12 text-center border-gray-200 border-dashed bg-gray-50/50">
          <Webhook className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-charcoal mb-2">No webhooks configured</h3>
          <p className="text-gray-500 mb-6">Create a webhook to send real-time events to other systems.</p>
          <Link href="/admin/webhooks/new">
            <Button className="bg-charcoal text-white hover:bg-sage rounded-xl font-bold">
              <Plus className="w-4 h-4 mr-2" /> Add Webhook
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {webhooks.map((hook) => (
            <Card key={hook.id} className="p-6 border-gray-200 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                    hook.active ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-gray-50 text-gray-400 border-gray-200'
                  }`}>
                    <Activity className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-charcoal text-lg truncate">{hook.name}</h3>
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider border border-blue-100">
                        {hook.event_type}
                      </span>
                    </div>
                    <p className="text-gray-500 font-mono text-xs truncate mt-1 bg-gray-50 px-2 py-1 rounded inline-block">
                      {hook.url}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                       <span className="flex items-center gap-1">
                         {hook.last_status && hook.last_status >= 200 && hook.last_status < 300 ? (
                            <><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> <span className="text-emerald-600 font-medium">{hook.last_status} OK</span></>
                         ) : hook.last_status ? (
                            <><XCircle className="w-3.5 h-3.5 text-rose-500" /> <span className="text-rose-600 font-medium">Failed ({hook.last_status})</span></>
                         ) : (
                            <><Clock className="w-3.5 h-3.5 text-gray-400" /> Never triggered</>
                         )}
                       </span>
                       {hook.last_triggered_at && (
                         <span className="text-gray-400">
                           Last fired: {hook.last_triggered_at.replace('T', ' ').split('.')[0]}
                         </span>
                       )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button asChild variant="outline" size="sm" className="rounded-lg">
                    <Link href={`/admin/webhooks/${hook.id}`}>
                      Edit
                    </Link>
                  </Button>
                  <DeleteButton id={hook.id} deleteAction={deleteWebhook} itemName="webhook" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
