import { processRetryQueue, getNextRetryAt, moveToDeadLetter } from './retry-queue';
import { runPostPublishPipeline, runPostCreationPipeline } from './post-publish';
import { generateCompleteContent } from './universal-generator';
import { enqueueJob } from './queue';

export interface BatchResult {
  processed: number;
  campaignId: string;
}

export async function processCampaignBatch(campaignId: string, topicsPerRun: number): Promise<BatchResult> {
  const TIME_BUDGET_MS = 240_000; // 4 minutes max to avoid vercel timeout
  const startTime = Date.now();
  let processed = 0;
  
  const { createServiceRoleClient } = await import('@/lib/supabase/server');
  const supabase = createServiceRoleClient();

  // 1. Process retry queue first
  await processRetryQueue(campaignId);

  // 2. Fetch campaign details
  const { data: campaign } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', campaignId)
    .single();

  if (!campaign || campaign.status !== 'active') {
    return { processed: 0, campaignId };
  }

  // 3. Fetch next pending topics
  const { data: topics } = await supabase
    .from('campaign_topics')
    .select('*')
    .eq('campaign_id', campaignId)
    .eq('status', 'pending')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })
    .limit(topicsPerRun);

  if (!topics || topics.length === 0) {
    // Check if campaign is completely done
    const { count } = await supabase
      .from('campaign_topics')
      .select('id', { count: 'exact', head: true })
      .eq('campaign_id', campaignId)
      .in('status', ['pending', 'processing', 'failed']); // Active topics
      
    if (count === 0) {
      await supabase.from('campaigns').update({ status: 'completed' }).eq('id', campaignId);
    }
    return { processed: 0, campaignId };
  }

  // 4. Queue each topic
  for (const topic of topics) {
    if (Date.now() - startTime > TIME_BUDGET_MS) break;

    // Mark as queued (prevent duplicate pickups)
    await supabase
      .from('campaign_topics')
      .update({ status: 'queued', processing_started_at: new Date().toISOString() })
      .eq('id', topic.id);

    try {
      // Offload to QStash / Webhook
      const queueResult = await enqueueJob({
        type: 'generate_campaign_topic',
        payload: { topic_id: topic.id }
      });

      if (!queueResult.success) {
        throw new Error('Queue provider failed to accept the job');
      }

      processed++;
    } catch (err: any) {
      console.error(`[CAMPAIGN] Queueing failed for topic ${topic.id}:`, err);
      
      // Fallback: Increment retries
      const retries = (topic.retries || 0) + 1;
      const nextRetry = getNextRetryAt(retries);

      if (nextRetry) {
        await supabase
          .from('campaign_topics')
          .update({ 
            status: 'failed', 
            error_message: err.message || 'Unknown error queueing job',
            retries,
            next_retry_at: nextRetry.toISOString()
          })
          .eq('id', topic.id);
      } else {
        await moveToDeadLetter(topic.id);
      }
    }
  }

  // 5. Update campaign stats
  const { data: statsData } = await supabase.rpc('update_campaign_stats', { p_campaign_id: campaignId });
  // (Alternatively, do a select count group by status if RPC is not available)

  return { processed, campaignId };
}
