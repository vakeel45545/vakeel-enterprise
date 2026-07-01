import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ArrowLeft, Target, Play, Pause, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CampaignProgress from '@/components/admin/campaigns/CampaignProgress';
import TopicQueue from '@/components/admin/campaigns/TopicQueue';
import TopicImporter from '@/components/admin/campaigns/TopicImporter';
import { notFound } from 'next/navigation';
import { toggleCampaignStatus, triggerCampaignNow, importTopicsAction } from '../actions';

export default async function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const { data: campaign } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', id)
    .single();

  if (!campaign) {
    notFound();
  }

  const { data: topics } = await supabase
    .from('campaign_topics')
    .select('*')
    .eq('campaign_id', id)
    .order('sort_order', { ascending: true });

  const isActive = campaign.status === 'active';
  const total = campaign.total_topics || 1;
  const completed = campaign.completed_topics || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/admin/campaigns" className="text-sm text-gray-500 hover:text-charcoal flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Campaigns
        </Link>
        <div className="flex gap-2">
          <form action={async () => { 'use server'; await toggleCampaignStatus(id, campaign.status); }}>
            <Button variant="outline" size="sm" className="rounded-lg">
              {isActive ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isActive ? 'Pause Campaign' : 'Resume Campaign'}
            </Button>
          </form>
          <form action={async () => { 'use server'; await triggerCampaignNow(id); }}>
            <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-bold">
              <Play className="w-4 h-4 mr-2" /> Run Batch Now
            </Button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-gray-100 text-gray-600">
                    {campaign.category || 'General'}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {campaign.status}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-charcoal">{campaign.name}</h1>
                <p className="text-gray-500 text-sm mt-1">{campaign.description || 'No description provided.'}</p>
              </div>
            </div>

            <CampaignProgress total={total} completed={completed} failed={campaign.failed_topics || 0} />
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Total Topics</p>
                <p className="text-xl font-bold text-charcoal">{campaign.total_topics || 0}</p>
              </div>
              <div>
                <p className="text-xs text-emerald-600 font-bold uppercase mb-1">Published</p>
                <p className="text-xl font-bold text-emerald-700">{campaign.published_topics || 0}</p>
              </div>
              <div>
                <p className="text-xs text-amber-600 font-bold uppercase mb-1">In Draft</p>
                <p className="text-xl font-bold text-amber-700">{(completed - (campaign.published_topics || 0))}</p>
              </div>
              <div>
                <p className="text-xs text-red-600 font-bold uppercase mb-1">Failed</p>
                <p className="text-xl font-bold text-red-700">{campaign.failed_topics || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h2 className="font-bold text-charcoal flex items-center gap-2">
                <Target className="w-5 h-5 text-violet-600" />
                Topic Queue
              </h2>
            </div>
            <TopicQueue topics={topics || []} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-6">
            <h3 className="font-bold text-charcoal flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-blue-600" /> Activity Details
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between items-center py-1 border-b border-gray-50">
                <span className="text-gray-500">Schedule</span>
                <span className="font-medium text-charcoal">{campaign.schedule_preset?.replace('_', ' ')}</span>
              </li>
              <li className="flex justify-between items-center py-1 border-b border-gray-50">
                <span className="text-gray-500">Batch Size</span>
                <span className="font-medium text-charcoal">{campaign.topics_per_run} topics/run</span>
              </li>
              <li className="flex justify-between items-center py-1 border-b border-gray-50">
                <span className="text-gray-500">Priority</span>
                <span className="font-medium text-charcoal capitalize">{campaign.priority}</span>
              </li>
              <li className="flex justify-between items-center py-1">
                <span className="text-gray-500">Avg Time/Topic</span>
                <span className="font-medium text-charcoal font-mono">
                  {campaign.avg_topic_duration_ms ? `${(campaign.avg_topic_duration_ms / 1000).toFixed(1)}s` : '—'}
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-6">
            <h3 className="font-bold text-charcoal flex items-center gap-2 mb-4">
              <Target className="w-4 h-4 text-emerald-600" /> Add Topics
            </h3>
            <TopicImporter onImport={async (newTopics) => {
              'use server';
              await importTopicsAction(id, newTopics);
            }} />
          </div>
        </div>
        
      </div>
    </div>
  );
}
