import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Clock, Activity, CheckCircle2, XCircle, Play, History, Edit2 } from 'lucide-react';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { deleteCronJob, triggerCronNow } from './actions';
import { toggleCronJob } from '../automation/actions';
import Link from 'next/link';

export default async function AdminCronPage() {
  const supabase = await createClient();
  const { data: jobs } = await supabase
    .from('cron_jobs')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-charcoal tracking-tight">Cron Jobs</h1>
          <p className="text-gray-500 mt-1">Manage scheduled background tasks and automated processes.</p>
        </div>
        <div className="flex items-center gap-3">
          <form action={async () => { "use server"; await triggerCronNow(); }}>
            <Button type="submit" variant="outline" className="rounded-xl font-bold border-sage/20 text-sage hover:bg-sage/5">
              <Play className="w-4 h-4 mr-2" /> Run All Now
            </Button>
          </form>
          <Link href="/admin/cron/new">
            <Button className="bg-charcoal text-white hover:bg-sage transition-colors rounded-xl font-bold shadow-premium">
              <Plus className="w-4 h-4 mr-2" /> New Job
            </Button>
          </Link>
        </div>
      </div>

      {!jobs || jobs.length === 0 ? (
        <Card className="p-12 text-center border-gray-200 border-dashed bg-gray-50/50">
          <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-charcoal mb-2">No cron jobs</h3>
          <p className="text-gray-500 mb-6">Create a job to automate background tasks like SEO audits and scheduled publishing.</p>
          <Link href="/admin/cron/new">
            <Button className="bg-charcoal text-white hover:bg-sage rounded-xl font-bold">
              <Plus className="w-4 h-4 mr-2" /> New Job
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job.id} className="p-6 border-gray-200 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                    job.active ? 'bg-amber-50 text-amber border-amber-100' : 'bg-gray-50 text-gray-400 border-gray-200'
                  }`}>
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-charcoal text-lg truncate">{job.name}</h3>
                      <span className="px-2 py-0.5 rounded-full bg-charcoal/5 text-charcoal/60 text-[10px] font-bold uppercase tracking-wider border border-charcoal/10">
                        {job.job_type}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-gray-500 font-mono text-xs truncate bg-gray-50 px-2 py-1 rounded inline-block">
                        {job.schedule}
                      </p>
                      {job.active && (
                        <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                          <Activity className="w-3 h-3" /> Active
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                       <span className="flex items-center gap-1">
                         {job.last_status === 'success' ? (
                            <><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> <span className="text-emerald-600 font-medium">Last run: Success</span></>
                         ) : job.last_status === 'failed' ? (
                            <><XCircle className="w-3.5 h-3.5 text-rose-500" /> <span className="text-rose-600 font-medium">Last run: Failed</span></>
                         ) : (
                            <><Clock className="w-3.5 h-3.5 text-gray-400" /> Never run</>
                         )}
                       </span>
                       {job.last_run_at && (
                         <span className="text-gray-400 border-l border-gray-200 pl-4">
                           {new Date(job.last_run_at).toLocaleString()}
                         </span>
                       )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <form action={async () => {
                    "use server";
                    await toggleCronJob(job.id, !job.active);
                  }}>
                    <Button type="submit" variant="outline" size="sm" className={`rounded-lg ${job.active ? 'text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200' : 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200'}`}>
                      {job.active ? 'Disable' : 'Enable'}
                    </Button>
                  </form>
                  <Link href={`/admin/cron/${job.id}/history`}>
                    <Button variant="outline" size="sm" className="rounded-lg">
                      <History className="w-4 h-4 mr-1" />
                      History
                    </Button>
                  </Link>
                  <Link href={`/admin/cron/${job.id}/edit`}>
                    <Button variant="outline" size="sm" className="rounded-lg">
                      <Edit2 className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </Link>
                  <DeleteButton id={job.id} deleteAction={deleteCronJob} itemName="job" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
