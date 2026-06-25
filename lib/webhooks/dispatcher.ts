import { createServiceRoleClient } from '@/lib/supabase/server';
import { WebhookEvent, WebhookPayload } from './events';

const RETRY_DELAYS = [2000, 5000, 10000]; // Exponential backoff
const MAX_RETRIES = 3;

/**
 * Send a single webhook with retry logic.
 */
async function sendWithRetry(
  webhook: { id: string; url: string; headers: Record<string, string> | null },
  payload: WebhookPayload,
  supabase: ReturnType<typeof createServiceRoleClient>
): Promise<void> {
  let lastStatus = 0;
  let lastBody = '';

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const customHeaders = webhook.headers || {};

      const res = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Vakeel-Webhook-Dispatcher/1.0',
          'X-Webhook-Attempt': String(attempt),
          ...customHeaders,
        },
        body: JSON.stringify(payload),
      });

      lastStatus = res.status;
      lastBody = await res.text().catch(() => '');

      // Log this attempt
      await supabase.from('webhook_logs').insert([{
        webhook_id: webhook.id,
        event_type: payload.event,
        payload,
        response_status: res.status,
        response_body: lastBody.slice(0, 1000),
      }]);

      // Update last triggered
      await supabase.from('webhooks').update({
        last_triggered_at: new Date().toISOString(),
        last_status: res.status,
      }).eq('id', webhook.id);

      // 2xx = success, stop retrying
      if (res.ok) return;

      // 4xx errors (except 429) = client error, don't retry
      if (res.status >= 400 && res.status < 500 && res.status !== 429) return;

      // 429 or 5xx = retry after delay
      if (attempt < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAYS[attempt - 1] || 10000));
      }
    } catch (networkErr: unknown) {
      const errMsg = networkErr instanceof Error ? networkErr.message : 'Network Error';

      // Log the failed attempt
      await supabase.from('webhook_logs').insert([{
        webhook_id: webhook.id,
        event_type: payload.event,
        payload,
        response_status: 0,
        response_body: `Attempt ${attempt}: ${errMsg}`,
      }]);

      await supabase.from('webhooks').update({
        last_triggered_at: new Date().toISOString(),
        last_status: 0,
      }).eq('id', webhook.id);

      if (attempt < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAYS[attempt - 1] || 10000));
      }
    }
  }
}

/**
 * Dispatches a webhook event to all active webhooks subscribed to it.
 * This should be called without `await` to run asynchronously in the background.
 * 
 * Now includes retry logic with exponential backoff (2s → 5s → 10s).
 */
export async function dispatchWebhook(event: WebhookEvent, data: Record<string, unknown>) {
  try {
    const supabase = createServiceRoleClient();
    
    // Find all active webhooks for this event
    const { data: webhooks, error } = await supabase
      .from('webhooks')
      .select('*')
      .eq('active', true)
      .or(`event_type.eq.${event},event_type.eq.*`);

    if (error || !webhooks || webhooks.length === 0) return;

    const payload: WebhookPayload = {
      event,
      timestamp: new Date().toISOString(),
      data,
    };

    // Send webhooks in parallel (each with its own retry loop)
    await Promise.allSettled(
      webhooks.map(webhook => sendWithRetry(webhook, payload, supabase))
    );
  } catch {
    // Fatal error in dispatcher — never crash the caller
  }
}
