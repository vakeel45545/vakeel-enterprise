import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, ExternalLink, Search, Upload, FileText, Image as ImageIcon, Video, Folder, Link as LinkIcon, RefreshCw, BarChart2, CheckCircle2, AlertCircle, Cloud, Copy, TrendingUp, HardDrive } from 'lucide-react';
import { deleteMediaEntry, restoreMediaEntry, uploadMediaAction } from '@/app/admin/media/actions';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { mediaService } from '@/lib/media/media-service';

export const dynamic = 'force-dynamic';

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export default async function MediaLibraryPage({ searchParams }: { searchParams: Promise<{ q?: string; source?: string; asset_type?: string; status?: string }> }) {
  const supabase = await createClient();
  const { q, source, asset_type = 'image', status = 'ready' } = await searchParams;

  let query = supabase.from('media_library').select('*, media_usage(count)').order('created_at', { ascending: false });

  if (q) {
    query = query.or(`filename.ilike.%${q}%,tags.cs.{${q}},photographer.ilike.%${q}%,dominant_color.ilike.%${q}%`);
  }
  if (source) query = query.eq('origin', source);
  if (asset_type && asset_type !== 'all') query = query.eq('resource_type', asset_type);
  
  if (status === 'deleted') {
    query = query.eq('status', 'deleted');
  } else {
    query = query.neq('status', 'deleted');
  }

  const { data: mediaItems } = await query;

  // ── Enterprise Analytics ──────────────────────────────────
  const { data: allAssets } = await supabase
    .from('media_library')
    .select('id, size_bytes, status, provider, file_hash, created_at')
    .neq('status', 'deleted');

  const totalAssets = allAssets?.length || 0;
  const totalStorage = allAssets?.reduce((acc, curr) => acc + (curr.size_bytes || 0), 0) || 0;

  // Provider breakdown
  const cloudinaryCount = allAssets?.filter(a => a.provider === 'cloudinary').length || 0;
  const supabaseCount = allAssets?.filter(a => a.provider === 'supabase').length || 0;

  // Duplicate detection
  const hashCounts = new Map<string, number>();
  allAssets?.forEach(a => {
    if (a.file_hash) hashCounts.set(a.file_hash, (hashCounts.get(a.file_hash) || 0) + 1);
  });
  const duplicateHashes = [...hashCounts.values()].filter(c => c > 1).length;

  // Uploads today
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const uploadsToday = allAssets?.filter(a => new Date(a.created_at) >= todayStart).length || 0;

  // Deleted assets
  const { count: deletedCount } = await supabase
    .from('media_library')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'deleted');

  // Largest file
  const largestFile = allAssets && allAssets.length > 0 ? allAssets.reduce((max, a) => (a.size_bytes || 0) > (max?.size_bytes || 0) ? a : max, allAssets[0]) : null;

  // Usage tracking
  const { data: distinctUsed } = await supabase.from('media_usage').select('media_id');
  const usedIds = new Set(distinctUsed?.map(u => u.media_id) || []);
  const unusedFiles = totalAssets - usedIds.size;

  return (
    <div className="space-y-6">


      {/* Analytics Dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-3 mb-6">
        <Card className="p-3 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md"><ImageIcon className="w-4 h-4" /></div>
            <p className="text-xs text-gray-500 font-semibold">Total Assets</p>
          </div>
          <p className="text-xl font-bold text-charcoal">{totalAssets}</p>
        </Card>
        <Card className="p-3 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-violet-50 text-violet-600 rounded-md"><HardDrive className="w-4 h-4" /></div>
            <p className="text-xs text-gray-500 font-semibold">Storage</p>
          </div>
          <p className="text-xl font-bold text-charcoal">{formatBytes(totalStorage)}</p>
        </Card>
        <Card className="p-3 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-cyan-50 text-cyan-600 rounded-md"><Cloud className="w-4 h-4" /></div>
            <p className="text-xs text-gray-500 font-semibold">Cloudinary</p>
          </div>
          <p className="text-xl font-bold text-charcoal">{cloudinaryCount}</p>
          <p className="text-[10px] text-gray-400">{supabaseCount} on Supabase</p>
        </Card>
        <Card className="p-3 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-green-50 text-green-600 rounded-md"><CheckCircle2 className="w-4 h-4" /></div>
            <p className="text-xs text-gray-500 font-semibold">In Use</p>
          </div>
          <p className="text-xl font-bold text-charcoal">{usedIds.size}</p>
        </Card>
        <Card className="p-3 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-amber-50 text-amber-600 rounded-md"><AlertCircle className="w-4 h-4" /></div>
            <p className="text-xs text-gray-500 font-semibold">Unused</p>
          </div>
          <p className="text-xl font-bold text-charcoal">{unusedFiles}</p>
        </Card>
        <Card className="p-3 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-pink-50 text-pink-600 rounded-md"><Copy className="w-4 h-4" /></div>
            <p className="text-xs text-gray-500 font-semibold">Duplicates</p>
          </div>
          <p className="text-xl font-bold text-charcoal">{duplicateHashes}</p>
        </Card>
        <Card className="p-3 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-md"><TrendingUp className="w-4 h-4" /></div>
            <p className="text-xs text-gray-500 font-semibold">Today</p>
          </div>
          <p className="text-xl font-bold text-charcoal">{uploadsToday}</p>
        </Card>
        <Card className="p-3 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-red-50 text-red-600 rounded-md"><Trash2 className="w-4 h-4" /></div>
            <p className="text-xs text-gray-500 font-semibold">Deleted</p>
          </div>
          <p className="text-xl font-bold text-charcoal">{deletedCount || 0}</p>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-px overflow-x-auto">
        <a href={`?asset_type=image&q=${q||''}&status=${status}`} className={`whitespace-nowrap pb-2 px-1 font-semibold text-sm ${asset_type === 'image' && status !== 'deleted' ? 'text-violet-600 border-b-2 border-violet-600' : 'text-gray-500 hover:text-gray-700'}`}>Images</a>
        <a href={`?asset_type=brand_asset&q=${q||''}&status=${status}`} className={`whitespace-nowrap pb-2 px-1 font-semibold text-sm ${asset_type === 'brand_asset' && status !== 'deleted' ? 'text-violet-600 border-b-2 border-violet-600' : 'text-gray-500 hover:text-gray-700'}`}>Brand Assets</a>
        <a href={`?asset_type=document&q=${q||''}&status=${status}`} className={`whitespace-nowrap pb-2 px-1 font-semibold text-sm ${asset_type === 'document' && status !== 'deleted' ? 'text-violet-600 border-b-2 border-violet-600' : 'text-gray-500 hover:text-gray-700'}`}>Documents</a>
        <a href={`?asset_type=video&q=${q||''}&status=${status}`} className={`whitespace-nowrap pb-2 px-1 font-semibold text-sm ${asset_type === 'video' && status !== 'deleted' ? 'text-violet-600 border-b-2 border-violet-600' : 'text-gray-500 hover:text-gray-700'}`}>Videos</a>
        <div className="flex-1"></div>
        <a href={`?status=deleted`} className={`whitespace-nowrap pb-2 px-1 font-semibold text-sm flex items-center gap-1 ${status === 'deleted' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500 hover:text-red-600'}`}>
          <Trash2 className="w-4 h-4" /> Trash
        </a>
      </div>

      {/* Toolbar */}
      <Card className="p-4 border border-gray-200 shadow-sm">
        <form className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input name="q" defaultValue={q} placeholder="Search filenames, tags, photographers..." className="pl-9" />
            <input type="hidden" name="asset_type" value={asset_type} />
            <input type="hidden" name="status" value={status} />
          </div>
          <Button type="submit" variant="secondary">Global Search</Button>
        </form>
      </Card>

      {/* Grid View */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {mediaItems?.map((item) => (
          <Card key={item.id} className="overflow-hidden group border border-gray-200 shadow-sm flex flex-col">
            <div className="relative aspect-square bg-gray-50 flex flex-col items-center justify-center p-4">
              {item.resource_type === 'image' || item.resource_type === 'brand_asset' ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={item.url} alt={item.alt_text || item.filename} className={`w-full h-full object-cover rounded shadow-sm ${status === 'deleted' ? 'grayscale opacity-50' : ''}`} />
              ) : item.resource_type === 'document' ? (
                <FileText className="w-16 h-16 text-gray-400" />
              ) : (
                <Video className="w-16 h-16 text-gray-400" />
              )}
              
              <div className="absolute inset-0 bg-charcoal/90 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                <div className="flex justify-end gap-2">
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-white/10 hover:bg-white/30 rounded-md text-white backdrop-blur-sm transition-colors" title="Open original">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  {status === 'deleted' ? (
                    <form action={async () => { 'use server'; await restoreMediaEntry(item.id); }}>
                      <button type="submit" className="p-1.5 bg-green-500/80 hover:bg-green-500 rounded-md text-white backdrop-blur-sm transition-colors" title="Restore">
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </form>
                  ) : (
                    <DeleteButton id={item.id} deleteAction={deleteMediaEntry} itemName="asset" />
                  )}
                </div>
                
                <div className="text-white text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="inline-block px-1.5 py-0.5 rounded bg-violet-500/80 uppercase text-[9px] tracking-wider font-bold">
                      {item.resource_type.replace('_', ' ')}
                    </span>
                    {item.media_usage?.[0]?.count > 0 && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-500/80 text-[9px] font-bold">
                        <LinkIcon className="w-3 h-3" /> {item.media_usage[0].count} uses
                      </span>
                    )}
                  </div>
                  <p className="truncate font-semibold text-sm">{item.filename}</p>
                  <p className="text-[10px] text-gray-300">
                    {formatBytes(item.size_bytes)} • {item.provider}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {mediaItems?.length === 0 && (
        <div className="p-12 text-center text-gray-500 border border-dashed border-gray-300 rounded-xl">
          {status === 'deleted' ? 'Trash is empty.' : 'No assets found matching your criteria.'}
        </div>
      )}
    </div>
  );
}
