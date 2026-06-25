import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Copy, Search, ExternalLink, Filter } from 'lucide-react';
import { deleteMediaEntry } from '@/app/admin/media/actions';
import { DeleteButton } from '@/components/admin/DeleteButton';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function MediaLibraryPage({ searchParams }: { searchParams: Promise<{ q?: string; source?: string; view?: string }> }) {
  const supabase = await createClient();
  const { q, source, view = 'grid' } = await searchParams;

  let query = supabase.from('media_library').select('*').order('created_at', { ascending: false });

  if (q) {
    query = query.ilike('filename', `%${q}%`);
  }
  if (source) {
    query = query.eq('source', source);
  }

  const { data: mediaItems } = await query;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-charcoal tracking-tight">Media Library</h1>
          <p className="text-gray-500 mt-1">Manage all central images for blogs, services, and pages.</p>
        </div>
      </div>

      {/* Toolbar */}
      <Card className="p-4 mb-8 border border-gray-200">
        <form className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input name="q" defaultValue={q} placeholder="Search filenames..." className="pl-9" />
              <input type="hidden" name="view" value={view} />
            </div>
            <div className="relative w-full sm:w-48">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select name="source" defaultValue={source || ''} className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent">
                <option value="">All Sources</option>
                <option value="upload">Direct Upload</option>
                <option value="unsplash">Unsplash</option>
                <option value="pexels">Pexels</option>
                <option value="ai_generated">AI Generated</option>
              </select>
            </div>
            <Button type="submit" variant="secondary" className="w-full sm:w-auto">Filter</Button>
          </div>
          
          <div className="flex items-center gap-2 border border-gray-200 rounded-md p-1 bg-gray-50 shrink-0">
            <a href={`?view=grid&q=${q||''}&source=${source||''}`} className={`px-3 py-1.5 text-sm font-medium rounded ${view === 'grid' ? 'bg-white shadow-sm text-charcoal' : 'text-gray-500 hover:text-charcoal'}`}>
              Grid
            </a>
            <a href={`?view=list&q=${q||''}&source=${source||''}`} className={`px-3 py-1.5 text-sm font-medium rounded ${view === 'list' ? 'bg-white shadow-sm text-charcoal' : 'text-gray-500 hover:text-charcoal'}`}>
              List
            </a>
          </div>
        </form>
      </Card>

      {/* Grid View */}
      {view === 'grid' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {mediaItems?.map((item) => (
            <Card key={item.id} className="overflow-hidden group border border-gray-200">
              <div className="relative aspect-square bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.url} alt={item.alt_text || item.filename} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                
                <div className="absolute inset-0 bg-charcoal/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                  <div className="flex justify-end gap-2">
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-white/20 hover:bg-white/40 rounded-md text-white backdrop-blur-sm transition-colors" title="Open original">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <DeleteButton id={item.id} deleteAction={deleteMediaEntry} itemName="media" />
                  </div>
                  
                  <div className="text-white text-xs truncate">
                    <span className="inline-block px-1.5 py-0.5 rounded bg-black/40 mb-1 uppercase text-[9px] tracking-wider font-bold">
                      {item.source}
                    </span>
                    <p className="truncate font-semibold">{item.filename}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* List View */}
      {view === 'list' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
              <tr>
                <th className="px-6 py-4 font-semibold">Image</th>
                <th className="px-6 py-4 font-semibold">Filename</th>
                <th className="px-6 py-4 font-semibold">Source</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mediaItems?.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="w-12 h-12 rounded overflow-hidden bg-gray-100 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.url} alt={item.alt_text || item.filename} className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-charcoal">
                    {item.filename}
                    {item.alt_text && <p className="text-xs text-gray-400 font-normal mt-0.5 max-w-[200px] truncate">{item.alt_text}</p>}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-sage/10 text-sage text-xs font-bold uppercase tracking-widest">
                      {item.source}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(item.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-sage transition-colors" title="Open original">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <DeleteButton id={item.id} deleteAction={deleteMediaEntry} itemName="media" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(!mediaItems || mediaItems.length === 0) && (
        <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-200 rounded-xl mt-4">
          <p className="text-gray-500">No media files found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
