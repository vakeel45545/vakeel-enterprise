'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Globe, Linkedin, Facebook, MessageCircle, Twitter } from 'lucide-react';

export interface SocialPreviewProps {
  title: string;
  description: string;
  url: string;
  imageUrl?: string | null;
  siteName?: string;
}

export function SocialPreview({ title, description, url, imageUrl, siteName = 'Vaakil.com' }: SocialPreviewProps) {
  const [activeTab, setActiveTab] = useState<'google' | 'linkedin' | 'facebook' | 'whatsapp' | 'twitter'>('google');

  // Fallback values for empty state
  const displayTitle = title || 'Your Blog Title Here';
  const displayDesc = description || 'A short description of your blog post will appear here. It should be engaging and descriptive.';
  const displayUrl = url || 'https://vaakil.com/blog/your-slug';
  const displayDomain = displayUrl.replace(/^https?:\/\//, '').split('/')[0];

  return (
    <Card className="p-0 border border-gray-200 overflow-hidden bg-gray-50/30">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white">
        <button onClick={() => setActiveTab('google')} className={`flex-1 py-2 text-sm font-medium flex items-center justify-center gap-2 border-b-2 ${activeTab === 'google' ? 'border-sage text-sage' : 'border-transparent text-gray-500 hover:text-charcoal'}`}>
          <Globe className="w-4 h-4" /> Google
        </button>
        <button onClick={() => setActiveTab('linkedin')} className={`flex-1 py-2 text-sm font-medium flex items-center justify-center gap-2 border-b-2 ${activeTab === 'linkedin' ? 'border-sage text-sage' : 'border-transparent text-gray-500 hover:text-charcoal'}`}>
          <Linkedin className="w-4 h-4" /> LinkedIn
        </button>
        <button onClick={() => setActiveTab('facebook')} className={`flex-1 py-2 text-sm font-medium flex items-center justify-center gap-2 border-b-2 ${activeTab === 'facebook' ? 'border-sage text-sage' : 'border-transparent text-gray-500 hover:text-charcoal'}`}>
          <Facebook className="w-4 h-4" /> Facebook
        </button>
        <button onClick={() => setActiveTab('whatsapp')} className={`flex-1 py-2 text-sm font-medium flex items-center justify-center gap-2 border-b-2 ${activeTab === 'whatsapp' ? 'border-sage text-sage' : 'border-transparent text-gray-500 hover:text-charcoal'}`}>
          <MessageCircle className="w-4 h-4" /> WhatsApp
        </button>
        <button onClick={() => setActiveTab('twitter')} className={`flex-1 py-2 text-sm font-medium flex items-center justify-center gap-2 border-b-2 ${activeTab === 'twitter' ? 'border-sage text-sage' : 'border-transparent text-gray-500 hover:text-charcoal'}`}>
          <Twitter className="w-4 h-4" /> X
        </button>
      </div>

      {/* Preview Area */}
      <div className="p-6 flex items-center justify-center min-h-[350px]">
        
        {/* Google Preview */}
        {activeTab === 'google' && (
          <div className="w-full max-w-[600px] bg-white p-4 rounded shadow-sm border border-gray-100 font-sans text-left">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-500">V</div>
              <div>
                <p className="text-[14px] text-[#202124] leading-tight">{siteName}</p>
                <p className="text-[12px] text-[#4d5156] leading-tight">{displayUrl}</p>
              </div>
            </div>
            <h3 className="text-[20px] text-[#1a0dab] hover:underline cursor-pointer leading-tight mb-1">
              {displayTitle}
            </h3>
            <p className="text-[14px] text-[#4d5156] leading-[1.58]">
              {displayDesc}
            </p>
          </div>
        )}

        {/* LinkedIn / Facebook Preview (Similar structures) */}
        {(activeTab === 'linkedin' || activeTab === 'facebook') && (
          <div className="w-full max-w-[520px] bg-white border border-[#e0e0e0] rounded overflow-hidden shadow-sm text-left font-sans">
            <div className="w-full h-[272px] bg-[#f3f2ef] flex items-center justify-center border-b border-[#e0e0e0] relative">
              {imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-[#00000099]">1200 x 627 Image</span>
              )}
            </div>
            <div className={`p-3 ${activeTab === 'facebook' ? 'bg-[#f0f2f5]' : 'bg-white'}`}>
              <p className="text-[12px] text-[#00000099] uppercase tracking-wide mb-1">{displayDomain}</p>
              <h3 className="text-[16px] font-semibold text-[#000000e6] leading-tight mb-1 line-clamp-2">
                {displayTitle}
              </h3>
              {activeTab === 'facebook' && (
                <p className="text-[14px] text-[#65676b] line-clamp-1">{displayDesc}</p>
              )}
            </div>
          </div>
        )}

        {/* WhatsApp Preview */}
        {activeTab === 'whatsapp' && (
          <div className="w-full max-w-[300px] bg-[#e1f5fe] p-2 rounded-xl text-left font-sans">
            <div className="bg-[#128C7E] text-white p-2 rounded-t-lg font-bold text-sm flex items-center justify-center">Chat</div>
            <div className="bg-[#e4ebd3] p-2 mt-2 rounded-lg shadow-sm border border-gray-200">
              <div className="bg-[#f0f2f5] rounded-lg overflow-hidden border border-[#d3d3d3]">
                <div className="w-full h-[150px] bg-white flex items-center justify-center relative">
                  {imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-400 text-xs">Image</span>
                  )}
                </div>
                <div className="p-2 bg-[#f0f2f5]">
                  <h3 className="text-[14px] font-bold text-[#000000] leading-tight line-clamp-1 mb-1">{displayTitle}</h3>
                  <p className="text-[13px] text-[#4a4a4a] leading-tight line-clamp-1 mb-1">{displayDesc}</p>
                  <p className="text-[11px] text-[#8e8e8e]">{displayDomain}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Twitter/X Preview */}
        {activeTab === 'twitter' && (
          <div className="w-full max-w-[500px] bg-white border border-[#cfd9de] rounded-2xl overflow-hidden shadow-sm text-left font-sans">
            <div className="w-full h-[260px] bg-[#f7f9f9] flex items-center justify-center border-b border-[#cfd9de] relative">
              {imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-[#536471]">Summary Large Image</span>
              )}
            </div>
            <div className="p-3">
              <p className="text-[15px] text-[#536471] mb-0.5">{displayDomain}</p>
              <h3 className="text-[15px] text-[#0f1419] leading-tight line-clamp-1">
                {displayTitle}
              </h3>
              <p className="text-[15px] text-[#536471] line-clamp-2 mt-1">{displayDesc}</p>
            </div>
          </div>
        )}
        
      </div>
    </Card>
  );
}
