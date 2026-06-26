import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { Activity, AlertTriangle } from 'lucide-react';
import ReplayButton from './ReplayButton';

export default async function DLQPage() {
  const supabase = await createClient();

  // Fetch dead letter queue entries
  const { data: dlqLogs } = await supabase
    .from('webhook_logs')
    .select('id, webhook_id, event_type, response_body, created_at, webhooks(name)')
    .eq('response_status', -1)
    .order('created_at', { ascending: false })
    .limit(50);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-charcoal tracking-tight flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-red-500" />
            Dead Letter Queue
          </h1>
          <p className="text-gray-500 mt-1">Permanently failed webhook events that exhausted all retries.</p>
        </div>
      </div>

      <Card className="border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="font-bold text-charcoal flex items-center gap-2">
            <Activity className="w-4 h-4 text-red-500" /> Failed Payloads
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold border-b border-gray-100">
              <tr>
                <th className="px-5 py-3">Webhook</th>
                <th className="px-5 py-3">Event</th>
                <th className="px-5 py-3">Error Detail</th>
                <th className="px-5 py-3">Failed At</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(!dlqLogs || dlqLogs.length === 0) ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-gray-500">
                    No failed webhooks in the DLQ. Your endpoints are healthy!
                  </td>
                </tr>
              ) : (
                dlqLogs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3 font-medium text-charcoal">
                      {log.webhooks?.name || 'Unknown'}
                    </td>
                    <td className="px-5 py-3 text-gray-500">
                      <span className="px-2 py-0.5 rounded-md bg-gray-100 font-mono text-xs">
                        {log.event_type}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-red-500 text-xs max-w-xs truncate" title={log.response_body}>
                      {log.response_body}
                    </td>
                    <td className="px-5 py-3 text-gray-400 text-xs">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <ReplayButton logId={log.id} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
