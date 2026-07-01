import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Zap,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Image as ImageIcon,
  RefreshCw,
  Activity,
  BarChart2,
  Play,
  Globe,
  Trash2,
  Target,
} from 'lucide-react';
import {
  triggerBlogGeneration,
  refreshSitemaps,
  refreshAllCaches,
} from './actions';

export default async function AutomationPage() {
  const supabase = await createClient();

  // Date 30 days ago
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const thirtyDaysAgoStr = thirtyDaysAgo.toISOString();

  // Fetch stats in parallel
  const [
    { count: aiBlogsCount },
    { data: recentCronLogs },
    { data: recentWebhookLogs },
    { data: lastGenerated },
    { data: recentLogs },
    { data: cronJobs },
    { count: activeCampaignsCount },
    // Queue Metrics
    { count: pendingQueueCount },
    { count: processingQueueCount },
    { count: failedQueueCount },
    { count: dlqCount },
  ] = await Promise.all([
    supabase.from('cron_logs').select('id', { count: 'exact', head: true })
      .eq('status', 'success')
      .not('blog_id', 'is', null),
    supabase.from('cron_logs').select('status').gte('started_at', thirtyDaysAgoStr),
    supabase.from('webhook_logs').select('response_status').gte('created_at', thirtyDaysAgoStr),
    supabase.from('blogs').select('id, title, slug, status, created_at, thumbnail')
      .order('created_at', { ascending: false }).limit(1).single(),
    supabase.from('cron_logs').select('*, cron_jobs(name, job_type)')
      .order('started_at', { ascending: false }).limit(10),
    supabase.from('cron_jobs').select('*').order('created_at', { ascending: false }),
    supabase.from('campaigns').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('campaign_topics').select('*', { count: 'exact', head: true }).in('status', ['pending', 'queued']),
    supabase.from('campaign_topics').select('*', { count: 'exact', head: true }).eq('status', 'processing'),
    supabase.from('campaign_topics').select('*', { count: 'exact', head: true }).eq('status', 'failed'),
    supabase.from('campaign_topics').select('*', { count: 'exact', head: true }).eq('status', 'dead_letter'),
  ]);

  const activeJobs = (cronJobs || []).filter((j: Record<string, unknown>) => j.active).length;
  const failedJobs = (cronJobs || []).filter((j: Record<string, unknown>) => j.last_status === 'failed').length;

  const cronTotal = recentCronLogs?.length || 0;
  const cronSuccess = recentCronLogs?.filter(l => l.status === 'success').length || 0;
  const cronSuccessRate = cronTotal > 0 ? Math.round((cronSuccess / cronTotal) * 100) : 100;

  const webhookTotal = recentWebhookLogs?.length || 0;
  const webhookSuccess = recentWebhookLogs?.filter(l => l.response_status >= 200 && l.response_status < 300).length || 0;
  const webhookSuccessRate = webhookTotal > 0 ? Math.round((webhookSuccess / webhookTotal) * 100) : 100;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-charcoal tracking-tight flex items-center gap-3">
            <Zap className="w-8 h-8 text-violet-600" />
            Automation
          </h1>
          <p className="text-gray-500 mt-1">Enterprise blog generation pipeline, cron jobs, and system health.</p>
        </div>
        <div className="flex items-center gap-3">
          <form action={async () => { "use server"; await refreshSitemaps(); }}>
            <Button type="submit" variant="outline" className="rounded-xl font-bold border-sage/20 text-sage hover:bg-sage/5">
              <Globe className="w-4 h-4 mr-2" /> Rebuild Sitemap
            </Button>
          </form>
          <form action={async () => { "use server"; await refreshAllCaches(); }}>
            <Button type="submit" variant="outline" className="rounded-xl font-bold border-blue-200 text-blue-600 hover:bg-blue-50">
              <RefreshCw className="w-4 h-4 mr-2" /> Refresh Cache
            </Button>
          </form>
          <form action={async () => { "use server"; await triggerBlogGeneration(); }}>
            <Button type="submit" className="bg-violet-600 text-white hover:bg-violet-700 rounded-xl font-bold shadow-lg">
              <Zap className="w-4 h-4 mr-2" /> Generate Blog Now
            </Button>
          </form>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-5 border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-charcoal">{aiBlogsCount ?? 0}</p>
              <p className="text-xs text-gray-500 font-medium">AI Blogs Generated</p>
            </div>
          </div>
        </Card>

        <Card className="p-5 border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-charcoal">{cronSuccessRate}%</p>
              <p className="text-xs text-gray-500 font-medium">Cron Success (30d)</p>
            </div>
          </div>
        </Card>

        <Card className="p-5 border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-charcoal">{webhookSuccessRate}%</p>
              <p className="text-xs text-gray-500 font-medium">Webhook Delivery</p>
            </div>
          </div>
        </Card>

        <Card className="p-5 border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-charcoal">{activeJobs}/{(cronJobs || []).length}</p>
              <p className="text-xs text-gray-500 font-medium">Active Jobs {failedJobs > 0 && <span className="text-red-500">({failedJobs} failed)</span>}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Campaign Summary — NEW SECTION */}
      <Card className="border-gray-200 shadow-sm overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <h2 className="font-bold text-charcoal flex items-center gap-2">
            <Target className="w-5 h-5 text-violet-600" />
            Content Campaigns
          </h2>
          <Button asChild variant="outline" size="sm" className="rounded-lg text-xs">
            <Link href="/admin/campaigns">Manage Campaigns</Link>
          </Button>
        </div>
        <div className="p-5 flex items-center gap-6">
          <div>
            <p className="text-3xl font-bold text-charcoal">{activeCampaignsCount || 0}</p>
            <p className="text-sm text-gray-500 font-medium">Active Campaigns</p>
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600">
              The Enterprise Content Operations Platform is now active. Campaigns have replaced the legacy job-centric workflow, enabling queue management, automatic retries, exponential backoff, and Cloudinary distribution for bulk content generation.
            </p>
          </div>
          <Button asChild className="bg-violet-600 text-white hover:bg-violet-700 rounded-xl font-bold">
            <Link href="/admin/campaigns/new">Create Campaign</Link>
          </Button>
        </div>
      </Card>

      {/* ── QUEUE MANAGER (NEW) ── */}
      <Card className="border-gray-200 shadow-sm overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <h2 className="font-bold text-charcoal flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Background Job Queue
          </h2>
        </div>
        <div className="p-5 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-center">
            <p className="text-3xl font-bold text-gray-700">{pendingQueueCount || 0}</p>
            <p className="text-xs text-gray-500 font-medium uppercase mt-1">Pending / Queued</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 text-center">
            <p className="text-3xl font-bold text-blue-700">{processingQueueCount || 0}</p>
            <p className="text-xs text-blue-500 font-medium uppercase mt-1">Processing</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 text-center">
            <p className="text-3xl font-bold text-amber-700">{failedQueueCount || 0}</p>
            <p className="text-xs text-amber-500 font-medium uppercase mt-1">Failed (Will Retry)</p>
          </div>
          <div className="bg-red-50 rounded-xl p-4 border border-red-100 text-center flex flex-col justify-between items-center">
            <div>
              <p className="text-3xl font-bold text-red-700">{dlqCount || 0}</p>
              <p className="text-xs text-red-500 font-medium uppercase mt-1">Dead Letter Queue</p>
            </div>
          </div>
        </div>
        {(failedQueueCount || 0) > 0 && (
          <div className="p-4 bg-amber-50 border-t border-amber-100 flex items-center justify-between">
            <p className="text-sm text-amber-800">Jobs in the Failed state will be automatically retried by the exponential backoff engine.</p>
          </div>
        )}
      </Card>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Last Generated Blog */}
        <Card className="border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <h2 className="font-bold text-charcoal flex items-center gap-2">
              <Zap className="w-4 h-4 text-violet-600" /> Last Generated Blog
            </h2>
          </div>
          <div className="p-5">
            {lastGenerated ? (
              <div className="flex gap-4">
                {lastGenerated.thumbnail && (
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={lastGenerated.thumbnail}
                      alt={lastGenerated.title || ''}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-charcoal truncate">{lastGenerated.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      lastGenerated.status === 'published'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-amber-50 text-amber-600'
                    }`}>
                      {lastGenerated.status || 'draft'}
                    </span>
                    <span className="text-xs text-gray-400">
                      {lastGenerated.created_at ? lastGenerated.created_at.split('T')[0] : ''}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button asChild variant="outline" size="sm" className="rounded-lg text-xs">
                      <Link href={`/admin/blogs/${lastGenerated.id}/edit`}>Edit</Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="rounded-lg text-xs">
                      <Link href={`/blog/${lastGenerated.slug}`} target="_blank">View</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No blogs generated yet.</p>
            )}
          </div>
        </Card>

        {/* Cron Jobs Status */}
        <Card className="border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <h2 className="font-bold text-charcoal flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" /> Cron Jobs
            </h2>
            <Button asChild variant="outline" size="sm" className="rounded-lg text-xs">
              <Link href="/admin/cron">Manage</Link>
            </Button>
          </div>
          <div className="divide-y divide-gray-100">
            {(cronJobs || []).length === 0 ? (
              <div className="p-5 text-gray-500 text-sm">No cron jobs configured.</div>
            ) : (
              (cronJobs || []).slice(0, 5).map((job: Record<string, unknown>) => (
                <div key={job.id as string} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {job.last_status === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    ) : job.last_status === 'failed' ? (
                      <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    ) : (
                      <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-charcoal truncate">{job.name as string}</p>
                      <p className="text-xs text-gray-400 font-mono">{job.schedule as string}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    job.active ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {job.active ? 'Active' : 'Paused'}
                  </span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Recent Automation Logs */}
      <Card className="border-gray-200 shadow-sm overflow-hidden mt-6">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="font-bold text-charcoal flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-blue-600" /> Recent Automation Logs
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold border-b border-gray-100">
              <tr>
                <th className="px-5 py-3">Job</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Duration</th>
                <th className="px-5 py-3">Started</th>
                <th className="px-5 py-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(!recentLogs || recentLogs.length === 0) ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-gray-500">
                    No automation logs yet. Run a cron job to see results.
                  </td>
                </tr>
              ) : (
                recentLogs.map((log: Record<string, unknown>) => {
                  const cronJob = log.cron_jobs as Record<string, unknown> | null;
                  const result = log.result as Record<string, unknown> | null;
                  const durationMs = log.duration_ms as number | null;

                  return (
                    <tr key={log.id as string} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3">
                        <div>
                          <p className="font-medium text-charcoal">{cronJob?.name as string || 'Unknown'}</p>
                          <p className="text-xs text-gray-400">{cronJob?.job_type as string || ''}</p>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          log.status === 'success'
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-red-50 text-red-600'
                        }`}>
                          {log.status === 'success' ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <XCircle className="w-3 h-3" />
                          )}
                          {log.status as string}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-500 text-xs font-mono">
                        {durationMs ? `${(durationMs / 1000).toFixed(1)}s` : '—'}
                      </td>
                      <td className="px-5 py-3 text-gray-500 text-xs">
                        {log.started_at ? (log.started_at as string).split('T')[0] : '—'}
                      </td>
                      <td className="px-5 py-3 text-gray-500 text-xs max-w-[200px] truncate">
                        {result?.message as string || result?.error as string || '—'}
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
