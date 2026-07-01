import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { mergeDuplicatesAction } from '@/app/admin/media/actions';

export const dynamic = 'force-dynamic';

function formatBytes(bytes: number) {
  if (!+bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export default async function DuplicateDashboard() {
  const supabase = await createClient();

  // Fetch all active assets
  const { data: assets } = await supabase
    .from('media_library')
    .select('*, media_usage(count)')
    .neq('status', 'deleted');

  // Find duplicates based on file_hash
  const hashGroups = new Map<string, any[]>();
  assets?.forEach(a => {
    if (a.file_hash) {
      const group = hashGroups.get(a.file_hash) || [];
      group.push(a);
      hashGroups.set(a.file_hash, group);
    }
  });

  const duplicates = Array.from(hashGroups.values()).filter(group => group.length > 1);
  const potentialSavings = duplicates.reduce((acc, group) => {
    // Save (group.length - 1) * filesize
    const size = group[0].size_bytes || 0;
    return acc + (size * (group.length - 1));
  }, 0);

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-pink-50 to-orange-50 border-pink-100 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-pink-900 flex items-center gap-2">
            <Copy className="w-6 h-6" />
            Duplicate Finder
          </h2>
          <p className="text-pink-700 mt-1 max-w-2xl text-sm">
            We've scanned your entire media library using SHA-256 content hashing. 
            Merging duplicates updates all blog/page references to point to the primary asset automatically, then safely deletes the redundant files to save storage.
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-pink-800">Potential Savings</p>
          <p className="text-3xl font-black text-pink-600">{formatBytes(potentialSavings)}</p>
        </div>
      </Card>

      {duplicates.length === 0 ? (
        <Card className="p-12 text-center flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-charcoal">No Duplicates Found!</h3>
            <p className="text-gray-500">Your media library is perfectly optimized.</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {duplicates.map((group, index) => {
            // Sort group so the one with most usages becomes primary, or oldest
            const sorted = group.map(a => ({...a, useCount: a.media_usage?.[0]?.count || 0}))
              .sort((a, b) => b.useCount - a.useCount || new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
            
            const primary = sorted[0];
            const redundants = sorted.slice(1);
            
            return (
              <Card key={primary.file_hash} className="border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 border-b border-gray-200 p-3 flex justify-between items-center">
                  <span className="text-xs font-mono text-gray-500">Hash: {primary.file_hash.substring(0, 16)}...</span>
                  <span className="text-xs font-semibold px-2 py-1 bg-red-100 text-red-700 rounded">
                    {redundants.length} redundant copies
                  </span>
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Primary */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-500 mb-2">Keep (Primary Asset)</h4>
                    <div className="flex items-start gap-4 p-3 bg-green-50 border border-green-100 rounded-lg">
                      <div className="w-16 h-16 rounded bg-gray-200 flex-shrink-0 overflow-hidden">
                        {primary.resource_type === 'image' && (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={primary.url} alt="" className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-charcoal text-sm truncate">{primary.filename}</p>
                        <p className="text-xs text-gray-500">
                          {formatBytes(primary.size_bytes)} • {primary.provider} • ID: {primary.id.substring(0,8)}
                        </p>
                        <p className="text-xs font-bold text-blue-600 mt-1">{primary.useCount} usages</p>
                      </div>
                    </div>
                  </div>

                  {/* Redundant */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-500 mb-2">Merge & Delete ({redundants.length})</h4>
                    <div className="space-y-2">
                      {redundants.map(red => (
                        <div key={red.id} className="flex items-start gap-3 p-2 bg-red-50 border border-red-100 rounded-lg opacity-80">
                          <div className="w-10 h-10 rounded bg-gray-200 flex-shrink-0 overflow-hidden">
                            {red.resource_type === 'image' && (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img src={red.url} alt="" className="w-full h-full object-cover" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-charcoal text-xs truncate">{red.filename}</p>
                            <p className="text-[10px] text-gray-500">{red.provider} • ID: {red.id.substring(0,8)}</p>
                            {red.useCount > 0 && (
                              <p className="text-[10px] font-bold text-amber-600 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" /> Will remap {red.useCount} usages
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 border-t border-gray-200 p-3 flex justify-end">
                  <form action={async () => { 'use server'; await mergeDuplicatesAction(primary.id, redundants.map(r => r.id)); }}>
                    <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2">
                      Merge & Cleanup <ArrowRight className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
