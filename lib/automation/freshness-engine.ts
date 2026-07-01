import { createServiceRoleClient } from '@/lib/supabase/server';
import { differenceInDays } from 'date-fns';
import { getUrlMetrics } from '@/lib/analytics/gsc';

export interface ContentItem {
  id: string;
  table: string;
  updated_at: string;
  url: string;
}

const CONTENT_TABLES = [
  { table: 'blogs', prefix: '/blog/' },
  { table: 'services', prefix: '/services/' },
  { table: 'pages', prefix: '/' }
];

export async function runDecayAnalysis() {
  const supabase = await createServiceRoleClient();
  const results = { checked: 0, decayed: 0 };

  for (const { table, prefix } of CONTENT_TABLES) {
    const { data: items } = await supabase
      .from(table)
      .select('id, slug, updated_at')
      .eq('status', 'published');

    if (!items) continue;

    for (const item of items) {
      results.checked++;
      const url = `${prefix}${item.slug}`.replace('//', '/');
      const daysSinceUpdate = differenceInDays(new Date(), new Date(item.updated_at));
      
      let needsUpdate = false;
      let freshnessScore = 100;

      // 1. Time Decay Logic (180 days = 0 score)
      freshnessScore = Math.max(0, 100 - Math.floor((daysSinceUpdate / 180) * 100));
      if (daysSinceUpdate >= 180) {
        needsUpdate = true;
      }

      // 2. Traffic Decay Logic via Google Search Console
      // If the content is older than 30 days, we fetch real metrics.
      if (daysSinceUpdate > 30) {
        const metrics = await getUrlMetrics(url, 30); // Last 30 days
        
        if (metrics) {
          // Store metrics in gsc_metrics table for Analytics Dashboard
          await supabase
            .from('gsc_metrics')
            .upsert({
              page_url: url,
              clicks: metrics.clicks,
              impressions: metrics.impressions,
              ctr: metrics.ctr,
              position: metrics.position,
              snapshot_date: new Date().toISOString().split('T')[0]
            }, { onConflict: 'page_url,snapshot_date' });

          // If impressions are shockingly low or dropped severely, flag it
          if (metrics.impressions < 50) {
            needsUpdate = true;
            freshnessScore = Math.min(freshnessScore, 40); // Penalty for irrelevance
          }
        }
      }

      // Update DB
      await supabase
        .from(table)
        .update({ 
          freshness_score: freshnessScore, 
          needs_update: needsUpdate 
        })
        .eq('id', item.id);

      if (needsUpdate) results.decayed++;
    }
  }

  return results;
}
