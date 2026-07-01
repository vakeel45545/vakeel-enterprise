import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { PlusCircle, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CampaignCard from '@/components/admin/campaigns/CampaignCard';

export default async function CampaignsPage() {
  const supabase = await createClient();

  const { data: campaigns } = await supabase
    .from('campaigns')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-charcoal tracking-tight flex items-center gap-3">
            <Target className="w-8 h-8 text-violet-600" />
            Content Campaigns
          </h1>
          <p className="text-gray-500 mt-1">Manage large-scale automated content generation.</p>
        </div>
        <Button asChild className="bg-violet-600 text-white hover:bg-violet-700 rounded-xl font-bold shadow-lg">
          <Link href="/admin/campaigns/new">
            <PlusCircle className="w-4 h-4 mr-2" /> New Campaign
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {!campaigns || campaigns.length === 0 ? (
          <div className="col-span-2 text-center p-12 bg-white rounded-xl border border-dashed border-gray-300">
            <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-charcoal mb-2">No Campaigns Yet</h2>
            <p className="text-gray-500 mb-6">Create your first campaign to automate content generation at scale.</p>
            <Button asChild className="bg-violet-600 text-white hover:bg-violet-700 rounded-lg">
              <Link href="/admin/campaigns/new">Create Campaign</Link>
            </Button>
          </div>
        ) : (
          campaigns.map((campaign) => (
            <CampaignCard 
              key={campaign.id} 
              campaign={campaign} 
            />
          ))
        )}
      </div>
    </div>
  );
}
