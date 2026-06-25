'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Search, Upload, Image as ImageIcon, Sparkles, Loader2, Check } from 'lucide-react';
import { uploadMediaAction } from '@/app/admin/media/actions';
import Image from 'next/link'; // using next/image would require configuring domains

export function ImagePicker({ 
  onSelect, 
  onInsert,
  currentUrl 
}: { 
  onSelect?: (mediaId: string, url: string) => void;
  onInsert?: (url: string, alt: string) => void;
  currentUrl?: string | null;
}) {
  const [tab, setTab] = useState<'upload' | 'search' | 'library'>('upload');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const fetchLibrary = async () => {
    setLoading(true);
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      const { data } = await supabase.from('media_library').select('*').order('created_at', { ascending: false }).limit(20);
      if (data) {
        setResults(data.map(d => ({
          id: d.id,
          imageUrl: d.url,
          thumbUrl: d.url,
          source: d.source,
          alt: d.alt_text || d.filename,
          isLibrary: true // flag to know it's already in DB
        })));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e?: React.FormEvent | React.KeyboardEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!query) return;
    
    setLoading(true);
    try {
      const { searchImages } = await import('@/lib/media/searchImages');
      const data = await searchImages(query);
      if (data && data.length > 0) {
        setResults(data);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (img: any, actionType: 'featured' | 'insert') => {
    let finalUrl = img.imageUrl || img.url;
    let finalId = img.id;

    if (!img.isLibrary) {
      setUploadingId(img.id);
      const formData = new FormData();
      formData.append('url', img.downloadUrl || img.imageUrl || img.url);
      formData.append('source', img.source);
      formData.append('alt_text', img.alt);
      if (img.author) formData.append('credits', `Photo by ${img.author}`);
      if (img.author_url) formData.append('license_url', img.author_url);
      if (img.source === 'ai_generated') formData.append('image_prompt', img.alt);
      
      formData.append('filename', `${img.source}-${img.id}.jpg`);

      const result = await uploadMediaAction(formData) as any;
      if (result.success && result.media) {
        finalUrl = result.media.url;
        finalId = result.media.id;
      } else {
        alert(`Failed to save image: ${result.error}`);
        setUploadingId(null);
        return;
      }
      setUploadingId(null);
    }

    if (actionType === 'featured' && onSelect) {
      onSelect(finalId, finalUrl);
    } else if (actionType === 'insert' && onInsert) {
      onInsert(finalUrl, img.alt || 'Content Image');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('source', 'upload');
    formData.append('filename', file.name);

    const result = await uploadMediaAction(formData) as any;
    if (result.success && result.media) {
      setTab('library');
      fetchLibrary();
    } else {
      alert(`Failed to upload: ${result.error}`);
    }
    setLoading(false);
  };

  return (
    <Card className="p-4 border border-gray-200">
      {/* Current Selection Preview */}
      {currentUrl && (
        <div className="mb-4 relative w-full h-40 bg-gray-100 rounded overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={currentUrl} alt="Selected" className="w-full h-full object-cover" />
          <div className="absolute top-2 right-2 bg-emerald-500 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
            <Check className="w-3 h-3" /> Selected
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-4">
        {[
          { id: 'upload', label: 'Upload', icon: Upload },
          { id: 'search', label: 'Search Online', icon: Search },
          { id: 'library', label: 'Media Library', icon: ImageIcon },
        ].map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => { 
              setTab(t.id as any); 
              setResults([]); 
              setQuery(''); 
              if (t.id === 'library') fetchLibrary();
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium border-b-2 transition-colors ${
              tab === t.id ? 'border-sage text-sage' : 'border-transparent text-gray-500 hover:text-charcoal'
            }`}
          >
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-[300px]">
        {tab === 'upload' && (
          <div className="flex flex-col items-center justify-center h-[300px] border-2 border-dashed border-gray-300 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
            <Upload className="w-8 h-8 text-gray-400 mb-4" />
            <p className="text-sm text-gray-600 mb-4">Drag & drop or click to upload</p>
            <Input type="file" accept="image/*" className="max-w-[250px]" onChange={handleFileUpload} disabled={loading} />
            {loading && <Loader2 className="w-4 h-4 animate-spin mt-4" />}
          </div>
        )}

        {tab === 'search' && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(e) }}
                placeholder="Search images or describe AI prompt..." 
                className="flex-1"
              />
              <Button type="button" onClick={handleSearch} disabled={loading} className="bg-charcoal text-white hover:bg-sage">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              </Button>
            </div>
            <div className="text-xs text-gray-400 flex justify-between">
              <span>Automatically searches: Unsplash &rarr; Pexels &rarr; AI Generation</span>
            </div>
          </div>
        )}

        {(tab === 'search' || tab === 'library') && (
          <div className="grid grid-cols-2 gap-2 h-[250px] overflow-y-auto pr-1 mt-4">
              {results.map((img) => (
                <div 
                  key={img.id} 
                  className="group relative h-24 rounded overflow-hidden border border-gray-200"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.thumbUrl || img.url} alt={img.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  
                  {uploadingId === img.id ? (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Loader2 className="w-5 h-5 text-white animate-spin" />
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-2">
                      {onSelect && (
                        <Button type="button" size="sm" variant="secondary" className="w-full text-[10px] h-6 px-1" onClick={() => handleAction(img, 'featured')}>Featured</Button>
                      )}
                      {onInsert && (
                        <Button type="button" size="sm" variant="secondary" className="w-full text-[10px] h-6 px-1" onClick={() => handleAction(img, 'insert')}>Insert</Button>
                      )}
                    </div>
                  )}
                  
                  {img.author && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1">
                      <p className="text-[10px] text-white truncate">{img.author}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
        )}
      </div>
    </Card>
  );
}
