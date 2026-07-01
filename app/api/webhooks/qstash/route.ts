import { NextRequest, NextResponse } from 'next/server';
import { verifySignatureAppRouter } from '@upstash/qstash/dist/nextjs';
import type { QueueMessage } from '@/lib/automation/queue';
import { generateCompleteBlog } from '@/lib/automation/blog-generator';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { moveToDeadLetter } from '@/lib/automation/retry-queue';

// Optional: Upstash QStash verification wrapper
// If QSTASH_TOKEN isn't set, we fall back to a manual local check
const qstashEnabled = !!process.env.QSTASH_TOKEN;

async function handler(request: NextRequest) {
  try {
    // If local fallback, verify the mock authorization header
    if (!qstashEnabled) {
      const authHeader = request.headers.get('authorization');
      const expectedAuth = `Bearer ${process.env.CRON_SECRET || 'vakeel-dev-cron-secret-2026'}`;
      if (authHeader !== expectedAuth) {
        return NextResponse.json({ error: 'Unauthorized local webhook' }, { status: 401 });
      }
    }

    const job = (await request.json()) as QueueMessage;
    console.log(`[WEBHOOK] Received Job: ${job.type}`, job.payload);

    const supabase = createServiceRoleClient();

    switch (job.type) {
      case 'generate_campaign_topic': {
        const { topic_id } = job.payload;
        
        // 1. Fetch topic
        const { data: topic, error: fetchError } = await supabase
          .from('campaign_topics')
          .select('*, campaigns(author_id, category)')
          .eq('id', topic_id)
          .single();

        if (fetchError || !topic) {
          throw new Error(`Topic not found: ${topic_id}`);
        }

        // 2. Mark as processing
        await supabase
          .from('campaign_topics')
          .update({ status: 'processing', error_message: null })
          .eq('id', topic_id);

        // 3. Generate
        const result = await generateCompleteBlog({
          keywords: [topic.topic],
          publishImmediately: false, // Campaigns generate drafts by default
          category: topic.campaigns?.category,
          authorId: topic.campaigns?.author_id,
        });

        // 4. Update status
        if (result.success) {
          await supabase
            .from('campaign_topics')
            .update({ status: 'completed', generated_blog_id: result.blogId })
            .eq('id', topic_id);
        } else {
          // If we fail here, QStash will auto-retry. We track the immediate error.
          await supabase
            .from('campaign_topics')
            .update({ status: 'failed', error_message: result.error })
            .eq('id', topic_id);
          
          throw new Error(`Generation failed for topic ${topic_id}: ${result.error}`);
        }
        break;
      }
      // Future job types can be added here
      default:
        console.warn(`[WEBHOOK] Unknown job type: ${job.type}`);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(`[WEBHOOK] Job Failed:`, error);
    // Returning 500 triggers QStash to retry this job
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Export the handler. If QStash is enabled, wrap it in their signature verifier for security.
// Otherwise, export the raw handler.
export const POST = qstashEnabled ? verifySignatureAppRouter(handler) : handler;
