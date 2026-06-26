import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle2, XCircle, Clock, Activity } from 'lucide-react';
import Link from 'next/link';

export default async function CronJobHistoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch the job
  const { data: job, error: jobError } = await supabase
    .from('cron_jobs')
    .select('*')
    .eq('id', id)
    .single();

  if (jobError || !job) {
    notFound();
  }

  // Fetch logs for this job
  const { data: logs } = await supabase
    .from('cron_logs')
    .select('*')
    .eq('cron_job_id', id)
    .order('started_at', { ascending: false })
    .limit(50);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/cron" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-charcoal hover:border-charcoal transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-display font-bold text-charcoal tracking-tight flex items-center gap-3">
            <Activity className="w-8 h-8 text-blue-600" />
            Job History
          </h1>
          <p className="text-gray-500 mt-1">
            Execution logs for <strong>{job.name}</strong> ({job.job_type})
          </p>
        </div>
      </div>

      <Card className="border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Started At</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Retries</th>
                <th className="px-6 py-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {!logs || logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <Clock className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                    <p>No execution history found for this job.</p>
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const durationMs = log.duration_ms;
                  return (
                    <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          log.status === 'success'
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            : 'bg-rose-50 text-rose-600 border border-rose-100'
                        }`}>
                          {log.status === 'success' ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5" />
                          )}
                          {log.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                        {new Date(log.started_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                        {durationMs ? `${(durationMs / 1000).toFixed(2)}s` : '—'}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {log.retries || 0}
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-md truncate text-gray-600 text-xs">
                          {log.error_message ? (
                            <span className="text-rose-600 font-medium">{log.error_message}</span>
                          ) : log.result?.message ? (
                            log.result.message
                          ) : (
                            JSON.stringify(log.result || {})
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
