'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X, Image as ImageIcon, Video, FileText, Check } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface MediaAsset {
  id: string;
  url: string;
  secure_url: string;
  filename: string;
  resource_type: string;
}

interface MediaSelectorProps {
  onSelect: (asset: MediaAsset) => void;
  onClose: () => void;
  resourceType?: string; // 'image', 'video', 'document'
}

export function MediaSelector({ onSelect, onClose, resourceType = 'image' }: MediaSelectorProps) {
  const [query, setQuery] = useState('');
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const fetchAssets = useCallback(async (searchQuery: string = '') => {
    setLoading(true);
    let dbQuery = supabase
      .from('media_library')
      .select('id, url, secure_url, filename, resource_type')
      .neq('status', 'deleted')
      .eq('resource_type', resourceType);

    if (searchQuery) {
      dbQuery = dbQuery.or(`filename.ilike.%${searchQuery}%,tags.cs.{${searchQuery}},alt_text.ilike.%${searchQuery}%`);
    }

    const { data } = await dbQuery.order('created_at', { ascending: false }).limit(20);
    setAssets(data || []);
    setLoading(false);
  }, [resourceType, supabase]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAssets();
  }, [fetchAssets]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAssets(query);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <Card className="w-full max-w-4xl max-h-[85vh] flex flex-col bg-white overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-charcoal flex items-center gap-2">
            Select {resourceType.charAt(0).toUpperCase() + resourceType.slice(1)}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-gray-50 bg-gray-50/50">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by filename, tags, or alt text..." 
                className="pl-9 bg-white"
              />
            </div>
            <Button type="submit" variant="secondary" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </form>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50/30">
          {assets.length === 0 && !loading ? (
            <div className="text-center py-12 text-gray-500">
              No assets found. Try a different search.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {assets.map(asset => (
                <div 
                  key={asset.id}
                  onClick={() => onSelect(asset)}
                  className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-transparent hover:border-violet-500 cursor-pointer transition-all shadow-sm hover:shadow-md"
                >
                  {asset.resource_type === 'image' || asset.resource_type === 'brand_asset' ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={asset.secure_url || asset.url} alt={asset.filename} className="w-full h-full object-cover" />
                  ) : asset.resource_type === 'document' ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50"><FileText className="w-12 h-12 text-gray-300" /></div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50"><Video className="w-12 h-12 text-gray-300" /></div>
                  )}
                  
                  <div className="absolute inset-0 bg-violet-600/0 group-hover:bg-violet-600/10 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all bg-violet-600 text-white p-2 rounded-full shadow-lg">
                      <Check className="w-5 h-5" />
                    </div>
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent text-white text-[10px] truncate">
                    {asset.filename}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
