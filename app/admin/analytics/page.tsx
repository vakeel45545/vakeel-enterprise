import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  PieChart,
  TrendingUp,
  MousePointerClick,
  Eye,
  Coins,
  Cpu,
  Zap,
  ArrowUpRight,
  Activity
} from 'lucide-react';

export const metadata = {
  title: 'Analytics & Costs | Vakeel Admin',
};

export default async function AnalyticsPage() {
  const supabase = await createClient();

  // 1. Fetch Token Usage from Campaign Topics
  const { data: topics } = await supabase
    .from('campaign_topics')
    .select('input_tokens, output_tokens, status');

  const totalInputTokens = topics?.reduce((acc, curr) => acc + (curr.input_tokens || 0), 0) || 0;
  const totalOutputTokens = topics?.reduce((acc, curr) => acc + (curr.output_tokens || 0), 0) || 0;
  const generatedBlogs = topics?.filter(t => t.status === 'completed').length || 0;

  // Cost Estimation (Gemini 1.5 Flash rates approx)
  const inputCostPerMillion = 0.075;
  const outputCostPerMillion = 0.30;
  const estimatedInputCost = (totalInputTokens / 1_000_000) * inputCostPerMillion;
  const estimatedOutputCost = (totalOutputTokens / 1_000_000) * outputCostPerMillion;
  const totalCost = estimatedInputCost + estimatedOutputCost;

  // 2. Fetch GSC Traffic Metrics
  const { data: gscData } = await supabase
    .from('gsc_metrics')
    .select('clicks, impressions, ctr, position')
    .order('snapshot_date', { ascending: false });

  // Aggregate Traffic
  const totalClicks = gscData?.reduce((acc, curr) => acc + (curr.clicks || 0), 0) || 0;
  const totalImpressions = gscData?.reduce((acc, curr) => acc + (curr.impressions || 0), 0) || 0;
  
  // Averages
  const avgCtr = gscData && gscData.length > 0 
    ? (gscData.reduce((acc, curr) => acc + (curr.ctr || 0), 0) / gscData.length).toFixed(2) 
    : 0;
  
  const avgPosition = gscData && gscData.length > 0 
    ? (gscData.reduce((acc, curr) => acc + (curr.position || 0), 0) / gscData.length).toFixed(1) 
    : 0;

  return (
    <div className="space-y-8 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-charcoal tracking-tight flex items-center gap-3">
            <PieChart className="w-8 h-8 text-blue-600" />
            Analytics & Costs
          </h1>
          <p className="text-gray-500 mt-1">
            Track AI token usage, provider costs, and Google Search Console organic traffic metrics.
          </p>
        </div>
      </div>

      {/* ── AI Provider Costs ── */}
      <div>
        <h2 className="text-xl font-bold text-charcoal flex items-center gap-2 mb-4">
          <Cpu className="w-5 h-5 text-violet-600" /> AI Generation Costs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 border-gray-200 shadow-sm bg-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                <Coins className="w-4 h-4" />
              </div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Est. Cost</p>
            </div>
            <p className="text-3xl font-bold text-charcoal">${totalCost.toFixed(4)}</p>
            <p className="text-xs text-gray-400 mt-1">Gemini 1.5 Flash</p>
          </Card>

          <Card className="p-5 border-gray-200 shadow-sm bg-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <Zap className="w-4 h-4" />
              </div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Generated Blogs</p>
            </div>
            <p className="text-3xl font-bold text-charcoal">{generatedBlogs}</p>
            <p className="text-xs text-gray-400 mt-1">Fully automated via pipelines</p>
          </Card>

          <Card className="p-5 border-gray-200 shadow-sm bg-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-gray-50 text-gray-600">
                <PieChart className="w-4 h-4" />
              </div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Input Tokens</p>
            </div>
            <p className="text-3xl font-bold text-charcoal">{totalInputTokens.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-1">${estimatedInputCost.toFixed(4)}</p>
          </Card>

          <Card className="p-5 border-gray-200 shadow-sm bg-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-gray-50 text-gray-600">
                <TrendingUp className="w-4 h-4" />
              </div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Output Tokens</p>
            </div>
            <p className="text-3xl font-bold text-charcoal">{totalOutputTokens.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-1">${estimatedOutputCost.toFixed(4)}</p>
          </Card>
        </div>
      </div>

      {/* ── Search Console Organic Traffic ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-charcoal flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" /> Organic Traffic (Search Console)
          </h2>
          <Button asChild variant="outline" size="sm" className="rounded-lg text-xs font-semibold">
            <Link href="/admin/content-decay">View Content Decay Engine <ArrowUpRight className="w-3 h-3 ml-1"/></Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 border-gray-200 shadow-sm bg-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-orange-50 text-orange-600">
                <MousePointerClick className="w-4 h-4" />
              </div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Clicks</p>
            </div>
            <p className="text-3xl font-bold text-charcoal">{totalClicks.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-1">Across all tracked URLs</p>
          </Card>

          <Card className="p-5 border-gray-200 shadow-sm bg-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                <Eye className="w-4 h-4" />
              </div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Impressions</p>
            </div>
            <p className="text-3xl font-bold text-charcoal">{totalImpressions.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-1">Search visibility</p>
          </Card>

          <Card className="p-5 border-gray-200 shadow-sm bg-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-pink-50 text-pink-600">
                <PieChart className="w-4 h-4" />
              </div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Average CTR</p>
            </div>
            <p className="text-3xl font-bold text-charcoal">{avgCtr}%</p>
            <p className="text-xs text-gray-400 mt-1">Click-through rate</p>
          </Card>

          <Card className="p-5 border-gray-200 shadow-sm bg-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-cyan-50 text-cyan-600">
                <TrendingUp className="w-4 h-4" />
              </div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Avg Position</p>
            </div>
            <p className="text-3xl font-bold text-charcoal">{avgPosition}</p>
            <p className="text-xs text-gray-400 mt-1">Global search ranking</p>
          </Card>
        </div>
      </div>

      {/* Info Notice */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mt-8 flex items-start gap-4">
        <div className="mt-1 text-blue-500">
          <Activity className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-blue-900">Enterprise Intelligence Enabled</h4>
          <p className="text-sm text-blue-700 mt-1">
            This dashboard correlates generative AI spending with actual Google Search Console traffic returns. When `GOOGLE_APPLICATION_CREDENTIALS_JSON` is supplied, the platform automatically tracks decaying articles and feeds them into the background AI update queue.
          </p>
        </div>
      </div>
    </div>
  );
}
