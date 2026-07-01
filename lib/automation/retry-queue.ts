// Backoff schedule: 5m -> 15m -> 1h -> 24h -> Dead Letter Queue
const BACKOFF_DELAYS_MS = [
  5 * 60 * 1000,      // 5 minutes
  15 * 60 * 1000,     // 15 minutes
  60 * 60 * 1000,     // 1 hour
  24 * 60 * 60 * 1000, // 24 hours
];

export function getNextRetryAt(retries: number): Date | null {
  if (retries >= BACKOFF_DELAYS_MS.length) return null; // -> Dead Letter Queue
  return new Date(Date.now() + BACKOFF_DELAYS_MS[retries]);
}

export async function processRetryQueue(campaignId: string): Promise<number> {
  // This will be invoked inside processCampaignBatch.
  // We'll select topics where status='failed' AND next_retry_at <= NOW()
  // And change their status back to 'pending' so they get picked up.
  const { createServiceRoleClient } = await import('@/lib/supabase/server');
  const supabase = createServiceRoleClient();
  
  const { data, error } = await supabase
    .from('campaign_topics')
    .select('id')
    .eq('campaign_id', campaignId)
    .eq('status', 'failed')
    .lte('next_retry_at', new Date().toISOString());

  if (error || !data || data.length === 0) return 0;

  const ids = data.map(t => t.id);

  await supabase
    .from('campaign_topics')
    .update({ status: 'pending', error_message: null })
    .in('id', ids);

  return ids.length;
}

export async function moveToDeadLetter(topicId: string): Promise<void> {
  const { createServiceRoleClient } = await import('@/lib/supabase/server');
  const supabase = createServiceRoleClient();
  
  await supabase
    .from('campaign_topics')
    .update({ status: 'dead_letter' })
    .eq('id', topicId);
}
