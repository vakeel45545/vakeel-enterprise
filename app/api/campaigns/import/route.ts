import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  // Simple auth via Bearer token (you could check admin session instead)
  const authHeader = request.headers.get('authorization');
  const CRON_SECRET = process.env.CRON_SECRET || 'vakeel-dev-cron-secret-2026';
  
  if (authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const campaignId = body.campaign_id;
    const topics: string[] = body.topics || [];
    
    if (!campaignId) {
      return NextResponse.json({ error: 'campaign_id is required' }, { status: 400 });
    }
    if (topics.length === 0) {
      return NextResponse.json({ error: 'topics array is required and must not be empty' }, { status: 400 });
    }

    const supabase = createServiceRoleClient();
    
    const { data: existing } = await supabase
      .from('campaign_topics')
      .select('topic')
      .eq('campaign_id', campaignId);
      
    const existingTopics = new Set((existing || []).map(t => t.topic.toLowerCase()));
    
    // Filter duplicates
    const uniqueTopics = topics.filter(t => !existingTopics.has(t.toLowerCase()));
    const duplicates = topics.length - uniqueTopics.length;

    if (uniqueTopics.length === 0) {
      return NextResponse.json({ success: true, imported: 0, duplicates, total: existing?.length || 0 });
    }

    const startIndex = existing?.length || 0;
    const topicInserts = uniqueTopics.map((t, i) => ({
      campaign_id: campaignId,
      topic: t,
      status: 'pending',
      sort_order: startIndex + i
    }));

    const { error } = await supabase
      .from('campaign_topics')
      .insert(topicInserts);

    if (error) {
      throw new Error(error.message);
    }

    // Update total count
    await supabase.rpc('update_campaign_stats', { p_campaign_id: campaignId });

    return NextResponse.json({ 
      success: true, 
      imported: uniqueTopics.length,
      duplicates,
      total: startIndex + uniqueTopics.length
    });
  } catch (error: any) {
    console.error('Import Topics Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
