'use server';

import { verifyAdminAndGetClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function createCampaign(formData: FormData) {
  const supabase = await verifyAdminAndGetClient();

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const category = formData.get('category') as string;
  const schedule_preset = formData.get('schedule_preset') as string;
  const priority = formData.get('priority') as string;
  const topicsRaw = formData.get('topics') as string;
  const topics_per_run = parseInt(formData.get('topics_per_run') as string) || 1;
  const content_type = (formData.get('content_type') as string) || 'blog';

  if (!name) throw new Error("Name is required");

  // 1. Insert Campaign
  const { data: campaign, error: campaignError } = await supabase
    .from('campaigns')
    .insert([{
      name,
      description,
      category,
      schedule_preset,
      priority,
      topics_per_run,
      content_type,
      status: 'active'
    }])
    .select()
    .single();

  if (campaignError) throw new Error(campaignError.message);

  // 2. Insert Topics
  if (topicsRaw) {
    const topicsList = topicsRaw.split('\n').map(t => t.trim()).filter(t => t.length > 0);
    if (topicsList.length > 0) {
      const topicInserts = topicsList.map((t, i) => ({
        campaign_id: campaign.id,
        topic: t,
        status: 'pending',
        content_type,
        sort_order: i
      }));

      const { error: topicsError } = await supabase
        .from('campaign_topics')
        .insert(topicInserts);

      if (topicsError) {
        console.error("Topics insertion failed", topicsError);
      } else {
        await supabase
          .from('campaigns')
          .update({ total_topics: topicsList.length })
          .eq('id', campaign.id);
      }
    }
  }

  revalidatePath('/admin/campaigns');
  
  const { redirect } = await import('next/navigation');
  redirect('/admin/campaigns');
}

export async function toggleCampaignStatus(id: string, currentStatus: string) {
  const supabase = await verifyAdminAndGetClient();
  const newStatus = currentStatus === 'active' ? 'paused' : 'active';

  const { error } = await supabase
    .from('campaigns')
    .update({ status: newStatus })
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/admin/campaigns');
}

export async function triggerCampaignNow(id: string) {
  const CRON_SECRET = process.env.CRON_SECRET || 'vakeel-dev-cron-secret-2026';
  const url = process.env.APP_URL || 'http://localhost:3000';
  
  try {
    const res = await fetch(`${url}/api/campaigns/worker`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CRON_SECRET}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ campaign_id: id })
    });
    
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Trigger failed: ${errText}`);
    }
    
    revalidatePath(`/admin/campaigns/${id}`);
    revalidatePath('/admin/campaigns');
    return { success: true };
  } catch (e: any) {
    throw new Error(e.message || 'Trigger failed');
  }
}

export async function importTopicsAction(campaignId: string, topics: string[]) {
  const supabase = await verifyAdminAndGetClient();
  
  const { data: existing } = await supabase
    .from('campaign_topics')
    .select('id, content_type')
    .eq('campaign_id', campaignId);
    
  const startIndex = existing?.length || 0;
  
  const topicInserts = topics.map((t, i) => ({
    campaign_id: campaignId,
    topic: t,
    status: 'pending',
    content_type: existing?.[0]?.content_type || 'blog', // Inherit from existing or default to blog
    sort_order: startIndex + i
  }));

  const { error } = await supabase
    .from('campaign_topics')
    .insert(topicInserts);

  if (error) throw new Error(error.message);

  // Update total topics count
  await supabase.rpc('update_campaign_stats', { p_campaign_id: campaignId });

  revalidatePath(`/admin/campaigns/${campaignId}`);
  return { success: true, count: topics.length };
}
