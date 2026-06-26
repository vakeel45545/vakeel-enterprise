import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { dispatchWebhook } from '@/lib/webhooks/dispatcher';
import { verifyAdminAndGetClient } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  try {
    // Only admins can trigger replays
    await verifyAdminAndGetClient();

    const { log_id } = await request.json();
    if (!log_id) {
      return NextResponse.json({ error: 'Missing log_id' }, { status: 400 });
    }

    const supabase = createServiceRoleClient();
    
    // Fetch the failed log payload
    const { data: log, error } = await supabase
      .from('webhook_logs')
      .select('payload')
      .eq('id', log_id)
      .single();

    if (error || !log || !log.payload) {
      return NextResponse.json({ error: 'Log not found or missing payload' }, { status: 404 });
    }

    const payload = log.payload as Record<string, any>;
    
    // Dispatch the payload again asynchronously
    // This will spawn new log entries natively
    dispatchWebhook(payload.event as any, payload.data);

    return NextResponse.json({ success: true, message: 'Webhook replay dispatched to queue' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
