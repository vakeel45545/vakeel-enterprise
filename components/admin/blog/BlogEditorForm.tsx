'use client';

import { useState, useRef, useCallback, useEffect, forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { RichTextEditor, RichTextEditorHandle } from '@/components/editor/rich-text-editor';
import Link from 'next/link';
import { SubmitButton } from '@/components/admin/SubmitButton';
import { ImagePicker } from '@/components/admin/blog/ImagePicker';
import { BlogPreview } from '@/components/admin/blog/BlogPreview';
import { SocialPreview } from '@/components/admin/blog/SocialPreview';
import { SEOValidator } from '@/components/admin/blog/SEOValidator';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { saveBlogDraft } from '@/app/admin/actions';

import {
  Eye,
  Sparkles,
  Wand2,
  Search,
  Image as ImageIcon,
  List,
  MessageSquare,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Copy,
  BarChart2,
  X,
  AlignLeft,
  Minimize2,
  Maximize2,
  Zap,
  Trash2,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────

interface Author {
  id: string;
  name: string;
}

interface Blog {
  id?: string;
  title?: string | null;
  slug?: string | null;
  category?: string | null;
  thumbnail?: string | null;
  og_image?: string | null;
  content?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  tags?: string[] | null;
  author_id?: string | null;
  reading_time?: number | null;
  published?: boolean | null;
  featured?: boolean | null;
}

interface BlogEditorFormProps {
  mode: 'new' | 'edit';
  authors: Author[];
  blog?: Blog;
  // Server action — accepts FormData (compatible with both createBlog and updateBlog.bind)
  action: (formData: FormData) => Promise<void> | void;
}

type AiStatus = 'idle' | 'loading' | 'success' | 'error';

const TEMPLATES = [
  'Legal Blog',
  'Tax Blog',
  'GST Guide',
  'Trademark Guide',
  'Startup Guide',
  'Compliance Guide',
];

// ─────────────────────────────────────────────────────────
// Content Quality Score (computed client-side)
// ─────────────────────────────────────────────────────────

function computeQualityScore(content: string, title: string, metaTitle: string, metaDesc: string, tags: string) {
  const plainText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = plainText.split(' ').filter(Boolean).length;
  const h2Count = (content.match(/<h2/gi) || []).length;
  const h3Count = (content.match(/<h3/gi) || []).length;

  const lengthScore = Math.min(100, Math.round((wordCount / 1500) * 100));
  const headingScore = Math.min(100, Math.round(((h2Count + h3Count) / 5) * 100));
  const seoScore = [metaTitle, metaDesc, tags].filter(Boolean).length > 0
    ? Math.min(100, Math.round(([metaTitle.length > 10, metaTitle.length < 61, metaDesc.length > 50, metaDesc.length < 161, tags.length > 3].filter(Boolean).length / 5) * 100))
    : 0;
  const readabilityScore = wordCount > 100 ? Math.min(100, Math.round(70 + Math.min(30, h2Count * 5))) : 0;

  return { wordCount, lengthScore, headingScore, seoScore, readabilityScore };
}

function ScoreBar({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500">{label}</span>
        <span className="text-xs font-bold" style={{ color }}>{score}%</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// AI Action Button
// ─────────────────────────────────────────────────────────

function AiButton({
  onClick,
  onCancel,
  status,
  icon: Icon,
  label,
  small = false,
}: {
  onClick: () => void;
  onCancel?: () => void;
  status: AiStatus;
  icon: React.ElementType;
  label: string;
  small?: boolean;
}) {
  const isLoading = status === 'loading';

  return (
    <div className="flex gap-2 w-full">
      <button
        type="button"
        onClick={onClick}
        disabled={isLoading}
        className={`
          inline-flex items-center gap-1.5 font-semibold rounded-lg border transition-all duration-150 flex-1
          ${small
            ? 'px-2.5 py-1 text-xs'
            : 'px-3 py-2 text-xs w-full justify-center'}
          ${status === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
            : status === 'error'
            ? 'bg-red-50 border-red-200 text-red-700'
            : 'bg-white border-gray-200 text-gray-700 hover:bg-violet-50 hover:border-violet-300 hover:text-violet-700'}
          ${isLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        {isLoading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : status === 'success' ? (
          <CheckCircle2 className="w-3.5 h-3.5" />
        ) : status === 'error' ? (
          <AlertCircle className="w-3.5 h-3.5" />
        ) : (
          <Icon className="w-3.5 h-3.5" />
        )}
        {label}
      </button>
      {isLoading && onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className={`flex-shrink-0 flex items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors ${small ? 'w-7 h-7' : 'w-9 h-9'}`}
          title="Cancel Generation"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────

export function BlogEditorForm({ mode, authors, blog, action }: BlogEditorFormProps) {
  // ── Form field values (controlled so AI can set them) ──
  const [title, setTitle] = useState(blog?.title ?? '');
  const [slug, setSlug] = useState(blog?.slug ?? '');
  const [category, setCategory] = useState(blog?.category ?? '');
  const [thumbnail, setThumbnail] = useState(blog?.thumbnail ?? '');
  const [ogImage, setOgImage] = useState(blog?.og_image ?? '');
  const [metaTitle, setMetaTitle] = useState(blog?.meta_title ?? '');
  const [metaDesc, setMetaDesc] = useState(blog?.meta_description ?? '');
  const [tags, setTags] = useState(blog?.tags?.join(', ') ?? '');
  const [content, setContent] = useState(blog?.content ?? '');

  // AI Studio state
  const [aiTopic, setAiTopic] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [panelOpen, setPanelOpen] = useState(true);
  const [activeSection, setActiveSection] = useState<string | null>('generate');

  // Main Tabs
  const [mainTab, setMainTab] = useState<'editor' | 'preview' | 'social' | 'seo'>('editor');

  // Image picker modal
  const [showImagePicker, setShowImagePicker] = useState(false);

  // Image preview
  const [thumbnailPreview, setThumbnailPreview] = useState(blog?.thumbnail ?? '');

  // Outline modal
  const [outlineModal, setOutlineModal] = useState(false);
  const [outline, setOutline] = useState<Array<{ type: 'h2' | 'h3'; text: string }>>([]);

  // AI statuses
  const [statusBlog, setStatusBlog] = useState<AiStatus>('idle');
  const [statusSeo, setStatusSeo] = useState<AiStatus>('idle');
  const [statusImage, setStatusImage] = useState<AiStatus>('idle');
  const [statusOutline, setStatusOutline] = useState<AiStatus>('idle');
  const [statusFaqs, setStatusFaqs] = useState<AiStatus>('idle');
  const [statusRewrite, setStatusRewrite] = useState<AiStatus>('idle');

  // Editor ref for programmatic content injection
  const editorRef = useRef<RichTextEditorHandle>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Auto-generate slug from title
  const autoSlug = useCallback((t: string) => {
    return t
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }, []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!slug || slug === autoSlug(title)) {
      setSlug(autoSlug(val));
    }
    if (!aiTopic) setAiTopic(val);
  };

  // Thumbnail preview sync
  useEffect(() => {
    setThumbnailPreview(thumbnail);
  }, [thumbnail]);

  // Quality score (live)
  const quality = computeQualityScore(content, title, metaTitle, metaDesc, tags);

  // ── AI Actions ──────────────────────────────────────────

  const abortControllers = useRef<{ [key: string]: AbortController }>({});

  const cancelAiFetch = (type: string) => {
    if (abortControllers.current[type]) {
      abortControllers.current[type].abort();
      delete abortControllers.current[type];
    }
  };

  const handleAiError = (err: any) => {
    if (err.name === 'AbortError') {
      toast.info('AI generation cancelled');
      return;
    }
    try {
      if (err.message === 'Failed to fetch' || err.message.includes('Network')) {
        toast.error('Unable to connect to the AI service.');
        return;
      }
      
      const parsed = JSON.parse(err.message);
      if (parsed.status === 503 || parsed.status === 504) {
        toast.error('AI service is temporarily busy due to high demand. Please try again in a few moments.');
      } else if (parsed.status === 429) {
        toast.error('Rate limit reached. Please wait before generating another blog.');
      } else if (parsed.status >= 500) {
        toast.error('Unexpected AI server error.');
      } else {
        toast.error('An unexpected error occurred during AI generation.');
      }
    } catch {
       toast.error('An unexpected error occurred during AI generation.');
    }
  };

  const aiFetchWithRetry = async (url: string, body: any, type: string) => {
    cancelAiFetch(type);
    const controller = new AbortController();
    abortControllers.current[type] = controller;

    let attempt = 1;
    const maxAttempts = 3;

    while (attempt <= maxAttempts) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          signal: controller.signal,
        });
        
        if (res.ok) {
          return await res.json();
        }

        const errorText = await res.text();
        const status = res.status;

        if (attempt === maxAttempts || (![503, 504, 429].includes(status) && status >= 400)) {
           throw new Error(JSON.stringify({ status, message: errorText }));
        }

        const delay = attempt === 1 ? 2000 : 4000;
        await new Promise(resolve => setTimeout(resolve, delay));
        attempt++;
      } catch (err: any) {
        if (err.name === 'AbortError') {
          throw err;
        }
        if (attempt === maxAttempts || err.message === 'Failed to fetch') {
           throw err;
        }
        const delay = attempt === 1 ? 2000 : 4000;
        await new Promise(resolve => setTimeout(resolve, delay));
        attempt++;
      }
    }
  };

  const generateBlog = async () => {
    const topic = aiTopic || title;
    if (!topic.trim()) return;
    setStatusBlog('loading');
    try {
      const data = await aiFetchWithRetry('/api/ai/generate-blog', { topic, template: selectedTemplate }, 'blog');
      if (!data) return; // Cancelled
      setTitle(data.title ?? title);
      setSlug(data.slug ?? autoSlug(data.title ?? title));
      setCategory(data.category ?? category);
      setMetaTitle(data.metaTitle ?? metaTitle);
      setMetaDesc(data.metaDescription ?? metaDesc);
      setTags(Array.isArray(data.tags) ? data.tags.join(', ') : tags);
      if (editorRef.current && data.content) {
        editorRef.current.setContent(data.content);
      }
      if (data.content) setContent(data.content);
      setStatusBlog('success');
      setTimeout(() => setStatusBlog('idle'), 3000);
    } catch (err) {
      handleAiError(err);
      setStatusBlog('error');
      setTimeout(() => setStatusBlog('idle'), 3000);
    }
  };

  const generateSeo = async () => {
    if (!title.trim()) return;
    setStatusSeo('loading');
    try {
      const data = await aiFetchWithRetry('/api/ai/generate-seo', { title, content }, 'seo');
      if (!data) return;
      setMetaTitle(data.metaTitle ?? metaTitle);
      setMetaDesc(data.metaDescription ?? metaDesc);
      setTags(Array.isArray(data.tags) ? data.tags.join(', ') : tags);
      setStatusSeo('success');
      setTimeout(() => setStatusSeo('idle'), 3000);
    } catch (err) {
      handleAiError(err);
      setStatusSeo('error');
      setTimeout(() => setStatusSeo('idle'), 3000);
    }
  };

  const generateImage = async () => {
    const topic = aiTopic || title;
    if (!topic.trim()) return;
    setStatusImage('loading');
    try {
      const data = await aiFetchWithRetry('/api/ai/generate-image', { topic }, 'image');
      if (!data) return;
      setThumbnail(data.imageUrl ?? thumbnail);
      setThumbnailPreview(data.imageUrl ?? thumbnailPreview);
      setStatusImage('success');
      setTimeout(() => setStatusImage('idle'), 3000);
    } catch (err) {
      handleAiError(err);
      setStatusImage('error');
      setTimeout(() => setStatusImage('idle'), 3000);
    }
  };

  const generateOutline = async () => {
    const topic = aiTopic || title;
    if (!topic.trim()) return;
    setStatusOutline('loading');
    try {
      const data = await aiFetchWithRetry('/api/ai/generate-outline', { topic }, 'outline');
      if (!data) return;
      setOutline(data.outline ?? []);
      setOutlineModal(true);
      setStatusOutline('success');
      setTimeout(() => setStatusOutline('idle'), 3000);
    } catch (err) {
      handleAiError(err);
      setStatusOutline('error');
      setTimeout(() => setStatusOutline('idle'), 3000);
    }
  };

  const applyOutline = () => {
    const html = outline
      .map((item) =>
        item.type === 'h2'
          ? `<h2>${item.text}</h2><p></p>`
          : `<h3>${item.text}</h3><p></p>`
      )
      .join('\n');
    if (editorRef.current) {
      editorRef.current.setContent(html);
    }
    setContent(html);
    setOutlineModal(false);
  };

  const generateFaqs = async () => {
    if (!title.trim()) return;
    setStatusFaqs('loading');
    try {
      const data = await aiFetchWithRetry('/api/ai/generate-faqs', { title, content }, 'faqs');
      if (!data) return;
      const newContent = (content || '') + '\n' + (data.faqsHtml ?? '');
      if (editorRef.current) {
        editorRef.current.setContent(newContent);
      }
      setContent(newContent);
      setStatusFaqs('success');
      setTimeout(() => setStatusFaqs('idle'), 3000);
    } catch (err) {
      handleAiError(err);
      setStatusFaqs('error');
      setTimeout(() => setStatusFaqs('idle'), 3000);
    }
  };

  const rewrite = async (mode: string) => {
    const selectedText = window.getSelection()?.toString() ?? '';
    const textToRewrite = selectedText || content.replace(/<[^>]*>/g, ' ').trim();
    if (!textToRewrite) return;
    setStatusRewrite('loading');
    try {
      const data = await aiFetchWithRetry('/api/ai/rewrite', { text: textToRewrite, mode }, 'rewrite');
      if (!data) return;
      if (selectedText && editorRef.current) {
        editorRef.current.insertAtCursor(data.result ?? '');
      } else if (editorRef.current) {
        editorRef.current.setContent(data.result ?? '');
        setContent(data.result ?? '');
      }
      setStatusRewrite('success');
      setTimeout(() => setStatusRewrite('idle'), 3000);
    } catch (err) {
      handleAiError(err);
      setStatusRewrite('error');
      setTimeout(() => setStatusRewrite('idle'), 3000);
    }
  };

  const toggleSection = (s: string) => setActiveSection(activeSection === s ? null : s);

  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  const handlePreviewDraft = async () => {
    if (!formRef.current) return;
    setIsPreviewLoading(true);

    try {
      if (!blog?.id) {
        const formData = new FormData(formRef.current);
        if (!formData.get('id')) formData.delete('id');
        const res = await saveBlogDraft(formData);
        
        if (res.success && res.id) {
          window.open(`/preview/blog/${res.id}`, '_blank');
        } else {
          toast.error("Unable to preview. Please save the draft first.");
        }
      } else {
        const formData = new FormData(formRef.current);
        const res = await saveBlogDraft(formData);
        if (res.success) {
          window.open(`/preview/blog/${blog.id}`, '_blank');
        } else {
          toast.error("Unable to preview. Please save the draft first.");
        }
      }
    } catch {
      toast.error("Unable to preview. Please save the draft first.");
    } finally {
      setIsPreviewLoading(false);
    }
  };

  // ── Render ───────────────────────────────────────────────

  return (
    <>
      {/* Outline Modal */}
      {outlineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <List className="w-4 h-4 text-violet-600" />
                <h3 className="font-semibold text-charcoal">Generated Outline</h3>
              </div>
              <button type="button" onClick={() => setOutlineModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-2 max-h-80 overflow-y-auto">
              {outline.map((item, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 p-2 rounded-lg border text-sm ${
                    item.type === 'h2'
                      ? 'bg-violet-50 border-violet-100 text-violet-800 font-semibold'
                      : 'bg-gray-50 border-gray-100 text-gray-700 ml-4'
                  }`}
                >
                  <span className="text-xs font-mono text-gray-400">{item.type}</span>
                  <input
                    type="text"
                    value={item.text}
                    onChange={(e) => {
                      const updated = [...outline];
                      updated[i] = { ...item, text: e.target.value };
                      setOutline(updated);
                    }}
                    className="flex-1 bg-transparent outline-none"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 p-5 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setOutlineModal(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={applyOutline}
                className="px-4 py-2 text-sm font-semibold bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
              >
                Apply Outline to Editor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Tabs */}
      <div className="flex border-b border-gray-200 mb-6 gap-6">
        <button
          type="button"
          onClick={() => setMainTab('editor')}
          className={`pb-2 text-sm font-semibold border-b-2 transition-colors ${mainTab === 'editor' ? 'border-charcoal text-charcoal' : 'border-transparent text-gray-500 hover:text-charcoal'}`}
        >
          Editor
        </button>
        <button
          type="button"
          onClick={() => setMainTab('preview')}
          className={`pb-2 text-sm font-semibold border-b-2 transition-colors ${mainTab === 'preview' ? 'border-charcoal text-charcoal' : 'border-transparent text-gray-500 hover:text-charcoal'}`}
        >
          Live Preview
        </button>
        <button
          type="button"
          onClick={() => setMainTab('social')}
          className={`pb-2 text-sm font-semibold border-b-2 transition-colors ${mainTab === 'social' ? 'border-charcoal text-charcoal' : 'border-transparent text-gray-500 hover:text-charcoal'}`}
        >
          Social Preview
        </button>
        <button
          type="button"
          onClick={() => setMainTab('seo')}
          className={`pb-2 text-sm font-semibold border-b-2 transition-colors ${mainTab === 'seo' ? 'border-charcoal text-charcoal' : 'border-transparent text-gray-500 hover:text-charcoal'}`}
        >
          SEO Validator
        </button>
      </div>

      <form ref={formRef} action={action} className="flex gap-6 items-start">
        {/* ── LEFT: Main Content Area ── */}
        <div className="flex-1 min-w-0 space-y-6">

          <div className={`space-y-6 ${mainTab === 'editor' ? 'block' : 'hidden'}`}>

          {/* Title + Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-semibold text-charcoal">Post Title *</label>
              <Input
                id="title"
                name="title"
                required
                value={title}
                onChange={handleTitleChange}
                placeholder="e.g. New Compliance Rules 2026"
                className="bg-gray-50 border-gray-200"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="slug" className="text-sm font-semibold text-charcoal">URL Slug *</label>
              <Input
                id="slug"
                name="slug"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. new-compliance-rules-2026"
                className="bg-gray-50 border-gray-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-semibold text-charcoal">Category</label>
              <Input
                id="category"
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Taxation"
                className="bg-gray-50 border-gray-200"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="author_id" className="text-sm font-semibold text-charcoal">Author</label>
              <select
                id="author_id"
                name="author_id"
                defaultValue={blog?.author_id ?? ''}
                className="w-full h-10 px-3 rounded-md border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent"
              >
                <option value="">Select Author...</option>
                {authors.map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Featured Image */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-charcoal">Featured Image</label>
            <input type="hidden" name="thumbnail" value={thumbnail} />
            <input type="hidden" name="og_image" id="og_image" value={ogImage} />
            
            <div className="flex gap-4 items-start">
              {thumbnailPreview && (
                <div className="w-48 h-32 rounded-xl border border-gray-200 overflow-hidden relative group shrink-0 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={thumbnailPreview} alt="Thumbnail preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button type="button" onClick={() => { setThumbnail(''); setThumbnailPreview(''); }} className="p-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
              
              <div className="flex-1">
                <button
                  type="button"
                  onClick={() => setShowImagePicker(true)}
                  className="px-4 py-2 bg-charcoal text-white text-sm font-semibold rounded hover:bg-sage transition-colors"
                >
                  Choose from Media Library
                </button>
              </div>

              {/* Inline Image Picker (simulating Modal) */}
              {showImagePicker && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                  <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
                    <button type="button" onClick={() => setShowImagePicker(false)} className="absolute top-4 right-4 text-gray-500 hover:text-charcoal z-10 bg-white rounded-full p-1 shadow">
                      <X className="w-5 h-5" />
                    </button>
                    <div className="p-6">
                      <h2 className="text-xl font-bold mb-4">Select Image</h2>
                      <ImagePicker 
                        currentUrl={thumbnail}
                        onSelect={(mediaId, url) => {
                          setThumbnail(url);
                          setThumbnailPreview(url);
                          // Auto-fill og_image if empty
                          if (!ogImage) {
                            setOgImage(url);
                          }
                          setShowImagePicker(false);
                        }}
                        onInsert={(url, alt) => {
                          if (editorRef.current) {
                            editorRef.current.insertAtCursor(`<img src="${url}" alt="${alt}" />`);
                          }
                          setShowImagePicker(false);
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-semibold text-charcoal">Content (HTML or Markdown)</label>
            <RichTextEditor
              ref={editorRef}
              id="content"
              name="content"
              defaultValue={blog?.content ?? ''}
              placeholder="Write your blog post content here..."
              onContentChange={setContent}
              onOpenImagePicker={() => setShowImagePicker(true)}
            />
          </div>

          {/* SEO Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="meta_title" className="text-sm font-semibold text-charcoal">SEO Meta Title</label>
              <Input
                id="meta_title"
                name="meta_title"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="SEO Title"
                className="bg-gray-50 border-gray-200"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="meta_description" className="text-sm font-semibold text-charcoal">SEO Meta Description</label>
              <Input
                id="meta_description"
                name="meta_description"
                value={metaDesc}
                onChange={(e) => setMetaDesc(e.target.value)}
                placeholder="SEO Description"
                className="bg-gray-50 border-gray-200"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label htmlFor="tags" className="text-sm font-semibold text-charcoal">Tags (comma-separated)</label>
            <Input
              id="tags"
              name="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="GST, Startup, Compliance, India"
              className="bg-gray-50 border-gray-200"
            />
          </div>

          {/* Publish / Featured toggles */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm font-medium text-charcoal cursor-pointer">
              <input type="checkbox" name="published" defaultChecked={blog?.published ?? false} className="w-4 h-4 rounded border-gray-300 text-sage" />
              Published
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-charcoal cursor-pointer">
              <input type="checkbox" name="featured" defaultChecked={blog?.featured ?? false} className="w-4 h-4 rounded border-gray-300 text-sage" />
              Featured
            </label>
          </div>
          </div>

          {mainTab === 'preview' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <BlogPreview
                title={title}
                category={category}
                content={content}
                thumbnail={thumbnail}
                authorName={authors.find(a => a.id === blog?.author_id)?.name || 'Vakeel Team'}
                authorAvatar={null}
                tags={tags.split(',').map(t => t.trim()).filter(Boolean)}
                readingTime={quality.wordCount ? Math.ceil(quality.wordCount / 200) : 5}
              />
            </div>
          )}

          {mainTab === 'social' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <SocialPreview
                title={metaTitle || title}
                description={metaDesc}
                url={`https://vaakil.com/blog/${slug}`}
                imageUrl={thumbnail}
              />
            </div>
          )}

          {mainTab === 'seo' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <SEOValidator
                title={metaTitle || title}
                metaDescription={metaDesc}
                content={content}
                hasFeaturedImage={!!thumbnail}
                hasOgImage={!!thumbnail} // Assume true if thumbnail is present due to auto-fill
                hasFaq={content.toLowerCase().includes('faq') || content.toLowerCase().includes('frequently asked questions')}
                hasSchema={content.includes('application/ld+json') || metaDesc.length > 0} // Simplification for schema presence
                targetKeyword={tags.split(',')[0]?.trim() || category}
                internalLinksCount={0}
              />
            </div>
          )}

          {/* Form Actions (always visible at bottom) */}
          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
            <Link href="/admin/blogs">
              <div className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors">Cancel</div>
            </Link>
            <Button 
               type="button"
               variant="outline" 
               className="text-gray-600 bg-white"
               onClick={handlePreviewDraft}
               disabled={isPreviewLoading}
            >
              {isPreviewLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Eye className="w-4 h-4 mr-2" />}
              {isPreviewLoading ? 'Saving...' : 'Preview Draft'}
            </Button>
            <SubmitButton loadingText={mode === 'new' ? 'Publishing...' : 'Updating...'}>
              {mode === 'new' ? 'Publish Post' : 'Save Changes'}
            </SubmitButton>
          </div>
        </div>

        {/* ── RIGHT: AI Studio Panel ─────────────────────────── */}
        <div className="w-72 flex-shrink-0 sticky top-6">
          {/* Panel Header */}
          <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-t-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-sm font-bold text-white">AI Studio</span>
            </div>
            <button
              type="button"
              onClick={() => setPanelOpen(!panelOpen)}
              className="text-white/70 hover:text-white transition-colors"
            >
              {panelOpen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>

          {panelOpen && (
            <div className="border border-gray-200 border-t-0 rounded-b-xl bg-white overflow-hidden divide-y divide-gray-100">

              {/* Topic Input */}
              <div className="p-3 space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Topic / Subject</label>
                <input
                  type="text"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder="e.g. GST Registration for Startups"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-100 transition-all"
                />
                <select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 outline-none focus:border-violet-400 transition-all"
                >
                  <option value="">No template</option>
                  {TEMPLATES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* ── Section: Generate ── */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleSection('generate')}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-violet-500" /> Generate Content</span>
                  {activeSection === 'generate' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
                {activeSection === 'generate' && (
                  <div className="px-3 pb-3 space-y-2">
                    <AiButton onCancel={() => cancelAiFetch('blog')} onClick={generateBlog} status={statusBlog} icon={Wand2} label="Generate Full Blog" />
                    <AiButton onCancel={() => cancelAiFetch('outline')} onClick={generateOutline} status={statusOutline} icon={List} label="Generate Outline" />
                    <AiButton onCancel={() => cancelAiFetch('faqs')} onClick={generateFaqs} status={statusFaqs} icon={MessageSquare} label="Generate FAQs" />
                  </div>
                )}
              </div>

              {/* ── Section: SEO ── */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleSection('seo')}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <span className="flex items-center gap-1.5"><Search className="w-3.5 h-3.5 text-blue-500" /> SEO Tools</span>
                  {activeSection === 'seo' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
                {activeSection === 'seo' && (
                  <div className="px-3 pb-3 space-y-2">
                    <AiButton onCancel={() => cancelAiFetch('seo')} onClick={generateSeo} status={statusSeo} icon={Search} label="Generate SEO Metadata" />
                    {metaTitle && (
                      <div className="text-xs bg-blue-50 rounded-lg p-2 text-blue-800 space-y-1">
                        <div><span className="font-semibold">Title:</span> {metaTitle.slice(0, 50)}{metaTitle.length > 50 ? '…' : ''}</div>
                        <div className="text-blue-600">{metaDesc.slice(0, 80)}{metaDesc.length > 80 ? '…' : ''}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ── Section: Image ── */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleSection('image')}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <span className="flex items-center gap-1.5"><ImageIcon className="w-3.5 h-3.5 text-emerald-500" /> Featured Image</span>
                  {activeSection === 'image' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
                {activeSection === 'image' && (
                  <div className="px-3 pb-3 space-y-2">
                    <AiButton onCancel={() => cancelAiFetch('image')} onClick={generateImage} status={statusImage} icon={Sparkles} label="Auto-Generate Cover" />
                    {thumbnailPreview && (
                      <div className="rounded-lg overflow-hidden border border-gray-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={thumbnailPreview} alt="Preview" className="w-full h-24 object-cover" onError={() => setThumbnailPreview('')} />
                      </div>
                    )}
                    <p className="text-xs text-gray-400">Image will be saved to thumbnail field</p>
                  </div>
                )}
              </div>

              {/* ── Section: Rewrite Tools ── */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleSection('rewrite')}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <span className="flex items-center gap-1.5"><RefreshCw className="w-3.5 h-3.5 text-amber-500" /> Rewrite Tools</span>
                  {activeSection === 'rewrite' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
                {activeSection === 'rewrite' && (
                  <div className="px-3 pb-3 space-y-2">
                    <p className="text-xs text-gray-400">Select text in editor, or applies to full content.</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      <AiButton onClick={() => rewrite('rewrite')} status={statusRewrite} icon={RefreshCw} label="Rewrite" small />
                      <AiButton onClick={() => rewrite('expand')} status={statusRewrite} icon={Maximize2} label="Expand" small />
                      <AiButton onClick={() => rewrite('shorten')} status={statusRewrite} icon={Minimize2} label="Shorten" small />
                      <AiButton onClick={() => rewrite('professional')} status={statusRewrite} icon={AlignLeft} label="Pro Tone" small />
                      <AiButton onClick={() => rewrite('simple')} status={statusRewrite} icon={Copy} label="Simple" small />
                    </div>
                  </div>
                )}
              </div>

              {/* ── Content Quality Score ── */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleSection('quality')}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <span className="flex items-center gap-1.5"><BarChart2 className="w-3.5 h-3.5 text-rose-500" /> Quality Score</span>
                  {activeSection === 'quality' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
                {activeSection === 'quality' && (
                  <div className="px-3 pb-3 space-y-3">
                    <div className="text-xs text-gray-500 flex justify-between">
                      <span>Word count</span>
                      <span className="font-bold text-gray-700">{quality.wordCount}</span>
                    </div>
                    <ScoreBar label="Content Length" score={quality.lengthScore} color="#8b5cf6" />
                    <ScoreBar label="SEO Metadata" score={quality.seoScore} color="#3b82f6" />
                    <ScoreBar label="Heading Structure" score={quality.headingScore} color="#10b981" />
                    <ScoreBar label="Readability" score={quality.readabilityScore} color="#f59e0b" />
                  </div>
                )}
              </div>

            </div>
          )}
        </div>
      </form>
    </>
  );
}
