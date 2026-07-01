import { Folder, Upload, BarChart2, Copy, Cloud, Image as ImageIcon } from 'lucide-react';
import { uploadMediaAction } from '@/app/admin/media/actions';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function MediaLibraryLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      {/* Shared Header & Upload */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-charcoal flex items-center gap-2">
            <Folder className="w-6 h-6 text-violet-600" />
            Enterprise Asset Manager
          </h1>
          <p className="text-gray-500 mt-1">Manage images, videos, documents, and brand assets across all sites.</p>
        </div>
        <form action={async (formData) => { 'use server'; await uploadMediaAction(formData); }} className="flex gap-2">
          <input type="file" name="file" className="hidden" id="global-asset-upload" required />
          <input type="hidden" name="source" value="manual_upload" />
          <select name="asset_type" className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white" required>
            <option value="image">Image</option>
            <option value="brand_asset">Brand Asset (SVG/Logo)</option>
            <option value="document">Document (PDF)</option>
            <option value="video">Video</option>
          </select>
          <label htmlFor="global-asset-upload" className="cursor-pointer bg-white text-charcoal border border-gray-200 hover:bg-gray-50 font-bold flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors">
            Choose File
          </label>
          <Button type="submit" className="bg-violet-600 hover:bg-violet-700 text-white font-bold flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload
          </Button>
        </form>
      </div>

      {/* Sub-navigation Tabs */}
      <div className="flex gap-6 border-b border-gray-200 overflow-x-auto pb-px">
        <Link href="/admin/media" className="flex items-center gap-2 pb-3 text-sm font-semibold text-gray-500 hover:text-violet-600 focus-visible:text-violet-600 focus-visible:border-b-2 focus-visible:border-violet-600 transition-colors">
          <ImageIcon className="w-4 h-4" /> Library
        </Link>
        <Link href="/admin/media/analytics" className="flex items-center gap-2 pb-3 text-sm font-semibold text-gray-500 hover:text-violet-600 focus-visible:text-violet-600 focus-visible:border-b-2 focus-visible:border-violet-600 transition-colors">
          <BarChart2 className="w-4 h-4" /> Asset Analytics
        </Link>
        <Link href="/admin/media/duplicates" className="flex items-center gap-2 pb-3 text-sm font-semibold text-gray-500 hover:text-violet-600 focus-visible:text-violet-600 focus-visible:border-b-2 focus-visible:border-violet-600 transition-colors">
          <Copy className="w-4 h-4" /> Duplicate Finder
        </Link>
        <Link href="/admin/media/cdn" className="flex items-center gap-2 pb-3 text-sm font-semibold text-gray-500 hover:text-violet-600 focus-visible:text-violet-600 focus-visible:border-b-2 focus-visible:border-violet-600 transition-colors">
          <Cloud className="w-4 h-4" /> CDN Settings
        </Link>
      </div>

      {/* Page Content */}
      <div className="pt-2">
        {children}
      </div>
    </div>
  );
}
