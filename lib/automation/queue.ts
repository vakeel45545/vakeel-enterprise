import { Client } from '@upstash/qstash';

// Initialize QStash client only if token is present
const qstashToken = process.env.QSTASH_TOKEN;
const qstashClient = qstashToken ? new Client({ token: qstashToken }) : null;

export type QueueJobType = 'generate_campaign_topic' | 'process_media' | 'sync_content';

export interface QueueMessage {
  type: QueueJobType;
  payload: Record<string, any>;
}

/**
 * Pushes a job to the automation queue.
 * 
 * ARCHITECTURE:
 * - If QSTASH_TOKEN is available, it uses Upstash QStash for true enterprise queues (retries, DLQ, delay).
 * - If missing (local dev or unconfigured), it falls back to a non-blocking asynchronous fetch to the webhook endpoint.
 * This guarantees Next.js Serverless routes will not timeout during heavy AI generation.
 */
export async function enqueueJob(job: QueueMessage, delayInSeconds?: number): Promise<{ success: boolean; messageId?: string }> {
  console.log(`[QUEUE] Enqueueing job type: ${job.type}`);

  if (qstashClient) {
    // Official QStash Route
    try {
      // Resolve absolute URL dynamically or via env (required by QStash)
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vaakil.com'; 
      const destination = `${baseUrl}/api/webhooks/qstash`;

      const result = await qstashClient.publishJSON({
        url: destination,
        body: job,
        delay: delayInSeconds, // Supports scheduling natively
      });

      console.log(`[QUEUE] Published to QStash successfully. Message ID: ${result.messageId}`);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error(`[QUEUE] Failed to publish to QStash:`, error);
      return { success: false };
    }
  } else {
    // Local Fallback Route
    console.warn(`[QUEUE] QSTASH_TOKEN missing. Using local async fallback.`);
    
    // In local or unconfigured mode, we fire a fetch without awaiting its response
    // to prevent the current API route from blocking.
    const localUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/webhooks/qstash`;
    
    try {
      // Fire and forget
      fetch(localUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.CRON_SECRET || 'vakeel-dev-cron-secret-2026'}` // Mock signature
        },
        body: JSON.stringify(job),
      }).catch(err => {
        console.error(`[QUEUE-FALLBACK] Background fetch failed:`, err);
      });

      return { success: true, messageId: `local-${Date.now()}` };
    } catch (error) {
      console.error(`[QUEUE-FALLBACK] Failed to dispatch local job:`, error);
      return { success: false };
    }
  }
}
