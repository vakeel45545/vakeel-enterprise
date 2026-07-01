import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { BarChart2, PieChart, FileText, Image as ImageIcon, Video, AlertCircle, Trash2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export default async function AssetAnalyticsDashboard() {
  const supabase = await createClient();

  // Fetch all assets with their usage counts
  const { data: mediaItems } = await supabase
    .from('media_library')
    .select('id, url, filename, size_bytes, resource_type, created_at, media_usage(count)')
    .neq('status', 'deleted');

  const assets = mediaItems || [];

  // Group by resource type
  let imageStorage = 0, videoStorage = 0, docStorage = 0, brandStorage = 0;
  assets.forEach(a => {
    const size = a.size_bytes || 0;
    if (a.resource_type === 'image') imageStorage += size;
    else if (a.resource_type === 'video') videoStorage += size;
    else if (a.resource_type === 'document') docStorage += size;
    else if (a.resource_type === 'brand_asset') brandStorage += size;
  });

  // Usage analysis
  const assetsWithUsage = assets.map(a => ({
    ...a,
    useCount: a.media_usage?.[0]?.count || 0
  }));

  const topUsed = [...assetsWithUsage].sort((a, b) => b.useCount - a.useCount).slice(0, 10);
  const unused = assetsWithUsage.filter(a => a.useCount === 0);

  return (
    <div className="space-y-8">
      {/* Storage Breakdown */}
      <section>
        <h2 className="text-lg font-bold text-charcoal mb-4 flex items-center gap-2">
          <PieChart className="w-5 h-5 text-violet-600" />
          Storage Breakdown
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 border border-gray-200">
            <p className="text-sm text-gray-500 font-medium">Images</p>
            <p className="text-2xl font-bold text-charcoal">{formatBytes(imageStorage)}</p>
          </Card>
          <Card className="p-4 border border-gray-200">
            <p className="text-sm text-gray-500 font-medium">Videos</p>
            <p className="text-2xl font-bold text-charcoal">{formatBytes(videoStorage)}</p>
          </Card>
          <Card className="p-4 border border-gray-200">
            <p className="text-sm text-gray-500 font-medium">Documents</p>
            <p className="text-2xl font-bold text-charcoal">{formatBytes(docStorage)}</p>
          </Card>
          <Card className="p-4 border border-gray-200">
            <p className="text-sm text-gray-500 font-medium">Brand Assets</p>
            <p className="text-2xl font-bold text-charcoal">{formatBytes(brandStorage)}</p>
          </Card>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Used Assets */}
        <section>
          <h2 className="text-lg font-bold text-charcoal mb-4 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-blue-600" />
            Most Used Assets
          </h2>
          <Card className="border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-100">
              {topUsed.filter(a => a.useCount > 0).map(asset => (
                <div key={asset.id} className="p-3 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                  <div className="w-12 h-12 rounded bg-gray-100 flex-shrink-0 overflow-hidden">
                    {(asset.resource_type === 'image' || asset.resource_type === 'brand_asset') ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={asset.url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        {asset.resource_type === 'video' ? <Video className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-charcoal truncate">{asset.filename}</p>
                    <p className="text-xs text-gray-500">{formatBytes(asset.size_bytes || 0)}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-bold">
                      {asset.useCount} references
                    </span>
                  </div>
                </div>
              ))}
              {topUsed.filter(a => a.useCount > 0).length === 0 && (
                <div className="p-6 text-center text-gray-500 text-sm">No usage data available yet.</div>
              )}
            </div>
          </Card>
        </section>

        {/* Unused Assets Scanner */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-charcoal flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              Unused Assets (Orphaned)
            </h2>
            <span className="text-xs font-semibold px-2 py-1 bg-amber-100 text-amber-700 rounded-md">
              {unused.length} files
            </span>
          </div>
          <Card className="border border-gray-200 overflow-hidden">
            <div className="bg-amber-50 p-3 border-b border-amber-100 flex justify-between items-center">
              <p className="text-xs text-amber-800 font-medium">These files have 0 references across the CMS.</p>
              <Link href="/admin/media?status=ready" className="text-xs font-bold text-violet-600 hover:text-violet-700 flex items-center gap-1">
                Manage in Library <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
              {unused.slice(0, 50).map(asset => (
                <div key={asset.id} className="p-3 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 rounded bg-gray-100 flex-shrink-0 overflow-hidden">
                    {(asset.resource_type === 'image' || asset.resource_type === 'brand_asset') ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={asset.url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        {asset.resource_type === 'video' ? <Video className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-charcoal truncate">{asset.filename}</p>
                    <p className="text-xs text-gray-500">Added {new Date(asset.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
              {unused.length > 50 && (
                <div className="p-3 text-center text-xs text-gray-500 font-medium bg-gray-50">
                  + {unused.length - 50} more unused files...
                </div>
              )}
              {unused.length === 0 && (
                <div className="p-6 text-center text-gray-500 text-sm">All assets are currently in use. Excellent!</div>
              )}
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
