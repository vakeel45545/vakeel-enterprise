import { NextRequest, NextResponse } from 'next/server';
import { processCampaignBatch } from '@/lib/automation/campaign-runner';

export async function POST(request: NextRequest) {
  // Simple auth via Bearer token
  const authHeader = request.headers.get('authorization');
  const CRON_SECRET = process.env.CRON_SECRET || 'vakeel-dev-cron-secret-2026';
  
  if (authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const campaignId = body.campaign_id;
    
    if (!campaignId) {
      // Logic to find next highest priority campaign could go here
      // For now, if no ID is passed, just return success
      return NextResponse.json({ success: true, message: 'No campaign_id provided' });
    }

    const topicsPerRun = body.topics_per_run || 1;
    const result = await processCampaignBatch(campaignId, topicsPerRun);

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error('Campaign Worker Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
