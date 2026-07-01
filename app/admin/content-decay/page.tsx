'use client';

import { useState, useEffect } from 'react';
import { fetchDecayingContent, runAnalysisAction, triggerAiRefresh } from './actions';
import { format } from 'date-fns';
import { RefreshCw, Activity, AlertTriangle, Search, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function ContentDecayPage() {
  const [content, setContent] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [refreshingId, setRefreshingId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const data = await fetchDecayingContent();
    setContent(data);
    setIsLoading(false);
  };

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    toast.info('Running Freshness Analysis...');
    try {
      const results = await runAnalysisAction();
      toast.success(`Analysis complete. Checked: ${results.checked}. Decayed: ${results.decayed}`);
      await loadData();
    } catch (err: any) {
      toast.error('Failed to run analysis: ' + err.message);
    }
    setIsAnalyzing(false);
  };

  const handleRefreshContent = async (id: string, type: string) => {
    setRefreshingId(id);
    toast.info('Triggering AI Refresh Pipeline...');
    try {
      await triggerAiRefresh(id, type);
      toast.success('Content Refreshed! Moved back to Editorial Queue.');
      await loadData();
    } catch (err: any) {
      toast.error('Failed to refresh content: ' + err.message);
    }
    setRefreshingId(null);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal flex items-center gap-2">
            <Activity className="w-6 h-6 text-orange-500" />
            Content Decay & Search Console
          </h1>
          <p className="text-gray-500 mt-1">
            Monitor evergreen content freshness. Automatically flag decaying pages and trigger AI updates.
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={handleRunAnalysis} 
            disabled={isAnalyzing}
            className="bg-white text-charcoal border border-gray-200 hover:bg-gray-50 font-bold flex items-center gap-2"
          >
            <Search className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            Run Analysis
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
            <tr>
              <th className="p-4 font-semibold w-[40%]">Content Title</th>
              <th className="p-4 font-semibold">Type</th>
              <th className="p-4 font-semibold">Last Updated</th>
              <th className="p-4 font-semibold">Freshness Score</th>
              <th className="p-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr><td colSpan={5} className="p-8 text-center text-gray-500">Loading metrics...</td></tr>
            ) : content.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-gray-500">No content found.</td></tr>
            ) : content.map((item) => (
              <tr key={item.id} className={`hover:bg-gray-50 transition-colors ${item.needs_update ? 'bg-orange-50/30' : ''}`}>
                <td className="p-4 font-medium text-charcoal">
                  <div className="flex items-center gap-2">
                    {item.needs_update && <AlertTriangle className="w-4 h-4 text-orange-500" />}
                    {item.title}
                  </div>
                </td>
                <td className="p-4">
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs uppercase font-bold tracking-wider">
                    {item.type}
                  </span>
                </td>
                <td className="p-4 text-gray-500">
                  {format(new Date(item.updated_at), 'MMM d, yyyy')}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${item.freshness_score < 50 ? 'bg-orange-500' : 'bg-emerald-500'}`} 
                        style={{ width: `${item.freshness_score}%` }} 
                      />
                    </div>
                    <span className={`font-bold ${item.freshness_score < 50 ? 'text-orange-600' : 'text-emerald-600'}`}>
                      {item.freshness_score}/100
                    </span>
                  </div>
                </td>
                <td className="p-4 text-right">
                  {item.needs_update ? (
                    <Button 
                      onClick={() => handleRefreshContent(item.id, item.type)}
                      disabled={refreshingId === item.id}
                      className="bg-orange-500 hover:bg-orange-600 text-white font-bold h-8 px-3 rounded-lg text-xs"
                    >
                      <Zap className={`w-3 h-3 mr-1 ${refreshingId === item.id ? 'animate-pulse' : ''}`} />
                      {refreshingId === item.id ? 'Refreshing...' : 'AI Refresh'}
                    </Button>
                  ) : (
                    <span className="text-gray-400 text-xs font-semibold">Healthy</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
