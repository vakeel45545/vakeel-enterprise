import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { Cloud, CheckCircle2, Zap, Settings, Globe, HardDrive } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

function formatBytes(bytes: number) {
  if (!+bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export default async function CDNDashboard() {
  const supabase = await createClient();

  const { data: assets } = await supabase
    .from('media_library')
    .select('provider, size_bytes')
    .neq('status', 'deleted');

  const cloudinaryAssets = assets?.filter(a => a.provider === 'cloudinary') || [];
  const supabaseAssets = assets?.filter(a => a.provider === 'supabase') || [];

  const cloudinarySize = cloudinaryAssets.reduce((acc, a) => acc + (a.size_bytes || 0), 0);
  const supabaseSize = supabaseAssets.reduce((acc, a) => acc + (a.size_bytes || 0), 0);

  const totalSize = cloudinarySize + supabaseSize;
  const cloudinaryPercent = totalSize === 0 ? 0 : Math.round((cloudinarySize / totalSize) * 100);

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-100 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-cyan-900 flex items-center gap-2">
            <Cloud className="w-6 h-6" />
            Cloudinary CDN Engine
          </h2>
          <p className="text-cyan-700 mt-1 max-w-2xl text-sm">
            All newly uploaded media is automatically optimized via Cloudinary. Next-gen formats (WebP/AVIF), smart compression, and responsive delivery are enabled globally.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <p className="text-sm font-semibold text-cyan-800">CDN Adoption</p>
            <p className="text-3xl font-black text-cyan-600">{cloudinaryPercent}%</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Provider Split */}
        <Card className="p-6 border border-gray-200">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Storage Providers</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold text-charcoal flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-cyan-500" /> Cloudinary
                </span>
                <span className="text-gray-500">{cloudinaryAssets.length} assets</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-cyan-500 h-2 rounded-full" style={{ width: `${cloudinaryPercent}%` }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1 text-right">{formatBytes(cloudinarySize)}</p>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold text-charcoal flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-emerald-500" /> Supabase Storage
                </span>
                <span className="text-gray-500">{supabaseAssets.length} assets</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${100 - cloudinaryPercent}%` }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1 text-right">{formatBytes(supabaseSize)}</p>
            </div>
          </div>

          {supabaseAssets.length > 0 && (
            <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-100">
              <p className="text-sm font-semibold text-amber-800 mb-2">Legacy Assets Found</p>
              <p className="text-xs text-amber-700 mb-3">You still have {supabaseAssets.length} assets on Supabase. Run the migration script to move them to Cloudinary.</p>
              <code className="block bg-black/5 p-2 rounded text-xs font-mono text-amber-900 overflow-x-auto">
                npx tsx scripts/migrate-supabase-to-cloudinary.ts
              </code>
            </div>
          )}
        </Card>

        {/* Global Optimizations */}
        <Card className="p-6 border border-gray-200 md:col-span-2">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-500" /> Enabled Optimizations
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-charcoal text-sm">f_auto (Auto-Format)</h4>
                  <p className="text-xs text-gray-500 mt-1">Automatically serves WebP or AVIF based on the user's browser support, saving up to 40% bandwidth.</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-charcoal text-sm">q_auto (Auto-Quality)</h4>
                  <p className="text-xs text-gray-500 mt-1">Smart compression that reduces file size significantly without visible loss in human-perceived quality.</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-charcoal text-sm">Global Edge CDN</h4>
                  <p className="text-xs text-gray-500 mt-1">Assets are cached and delivered from edge servers closest to your visitors, minimizing latency.</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-charcoal text-sm">SHA-256 Deduplication</h4>
                  <p className="text-xs text-gray-500 mt-1">Prevents the exact same file from being uploaded multiple times across the CMS.</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
