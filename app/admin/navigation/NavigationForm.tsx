'use client';

import Image from 'next/image';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createNavigation, updateNavigation } from '@/app/admin/actions';
import {
  Plus, Trash2, ChevronDown, ChevronUp, GripVertical,
  Link as LinkIcon, Layers, Image as ImageIcon, Tag, ArrowRight
} from 'lucide-react';

// ─── Types matching MegaMenuDataSchema ───────────────────────────────────────
interface MegaLink { name: string; href: string }
interface MegaCategory { title: string; links: MegaLink[] }
interface MegaFeatured { title: string; desc: string; tag: string; href: string; image: string }
interface MegaMenuData {
  description: string;
  icon: string;
  categories: MegaCategory[];
  featured: MegaFeatured | null;
}

interface NavItem {
  id: string;
  title: string;
  slug: string | null;
  url: string | null;
  parent_id: string | null;
  type: string;
  order: number;
  visible: boolean;
  featured: boolean;
  icon: string | null;
  description: string | null;
  badge: string | null;
  mega_menu_data: MegaMenuData | null;
}

interface NavigationFormProps {
  item?: NavItem;
  allItems?: NavItem[];
  mode: 'create' | 'edit';
}

const ICON_OPTIONS = [
  'Building2', 'Calculator', 'Scale', 'FileText',
  'Zap', 'Sparkles', 'BookOpen', 'Briefcase', 'CheckCircle2'
];

const emptyCategory = (): MegaCategory => ({ title: '', links: [{ name: '', href: '' }] });
const emptyFeatured = (): MegaFeatured => ({ title: '', desc: '', tag: '', href: '', image: '' });

export default function NavigationForm({ item, allItems = [], mode }: NavigationFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Basic fields
  const [title, setTitle] = useState(item?.title ?? '');
  const [slug, setSlug] = useState(item?.slug ?? '');
  const [url, setUrl] = useState(item?.url ?? '');
  const [type, setType] = useState(item?.type ?? 'link');
  const [order, setOrder] = useState(String(item?.order ?? 0));
  const [visible, setVisible] = useState(item?.visible ?? true);
  const [featured, setFeatured] = useState(item?.featured ?? false);
  const [icon, setIcon] = useState(item?.icon ?? '');
  const [description, setDescription] = useState(item?.description ?? '');
  const [badge, setBadge] = useState(item?.badge ?? '');
  const [parentId, setParentId] = useState(item?.parent_id ?? '');

  // Mega menu state
  const defaultMega: MegaMenuData = {
    description: '',
    icon: '',
    categories: [emptyCategory()],
    featured: null,
    ...item?.mega_menu_data,
  };
  const [megaDesc, setMegaDesc] = useState(defaultMega.description ?? '');
  const [megaIcon, setMegaIcon] = useState(defaultMega.icon ?? '');
  const [categories, setCategories] = useState<MegaCategory[]>(
    defaultMega.categories?.length ? defaultMega.categories : [emptyCategory()]
  );
  const [hasFeatured, setHasFeatured] = useState(!!item?.mega_menu_data?.featured);
  const [featuredData, setFeaturedData] = useState<MegaFeatured>(
    item?.mega_menu_data?.featured ?? emptyFeatured()
  );

  // ── Category helpers ──
  const addCategory = () => setCategories(c => [...c, emptyCategory()]);
  const removeCategory = (ci: number) => setCategories(c => c.filter((_, i) => i !== ci));
  const updateCategoryTitle = (ci: number, val: string) =>
    setCategories(c => c.map((cat, i) => i === ci ? { ...cat, title: val } : cat));

  // ── Link helpers ──
  const addLink = (ci: number) =>
    setCategories(c => c.map((cat, i) => i === ci
      ? { ...cat, links: [...cat.links, { name: '', href: '' }] }
      : cat));
  const removeLink = (ci: number, li: number) =>
    setCategories(c => c.map((cat, i) => i === ci
      ? { ...cat, links: cat.links.filter((_, j) => j !== li) }
      : cat));
  const updateLink = (ci: number, li: number, field: 'name' | 'href', val: string) =>
    setCategories(c => c.map((cat, i) => i === ci
      ? { ...cat, links: cat.links.map((lnk, j) => j === li ? { ...lnk, [field]: val } : lnk) }
      : cat));

  // ── Submit ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const fd = new FormData();
      fd.append('title', title);
      fd.append('slug', slug);
      fd.append('url', url);
      fd.append('type', type);
      fd.append('order', order);
      fd.append('visible', visible ? 'on' : 'off');
      fd.append('featured', featured ? 'on' : 'off');
      fd.append('icon', icon);
      fd.append('description', description);
      fd.append('badge', badge);
      if (parentId) fd.append('parent_id', parentId);

      if (type === 'mega') {
        const megaMenuData: MegaMenuData = {
          description: megaDesc,
          icon: megaIcon,
          categories: categories.filter(c => c.title.trim()).map(c => ({
            title: c.title,
            links: c.links.filter(l => l.name.trim() && l.href.trim()),
          })),
          featured: hasFeatured && featuredData.title.trim() ? featuredData : null,
        };
        fd.append('mega_menu_data', JSON.stringify(megaMenuData));
      }

      if (mode === 'create') {
        await createNavigation(fd);
      } else if (item) {
        await updateNavigation(item.id, fd);
      }
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong');
      setLoading(false);
    }
  };

  const parentOptions = allItems.filter(i => i.id !== item?.id && !i.parent_id);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-medium">
          {error}
        </div>
      )}

      {/* ── Basic Info ── */}
      <section className="bg-white border border-gray-200 rounded-2xl p-6">
        <h2 className="text-sm font-bold text-gray-900 mb-5 uppercase tracking-widest">Basic Info</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Title *</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              placeholder="e.g. Startup & Registration"
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-400 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Type *</label>
            <select
              value={type}
              onChange={e => setType(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-400 transition bg-white"
            >
              <option value="link">Link (simple nav item)</option>
              <option value="mega">Mega Menu (with categories + cards)</option>
              <option value="dropdown">Dropdown</option>
            </select>
            <p className="text-[11px] text-gray-400 mt-1">
              {type === 'mega' ? 'Shows full mega menu dropdown with categories, links, and featured card.' :
               type === 'dropdown' ? 'Shows child items as a simple dropdown.' :
               'Simple link, no dropdown.'}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Order</label>
            <input
              type="number"
              value={order}
              onChange={e => setOrder(e.target.value)}
              min={0}
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-400 transition"
            />
            <p className="text-[11px] text-gray-400 mt-1">Lower number = appears first in navbar.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Slug (internal path)</label>
            <input
              value={slug}
              onChange={e => setSlug(e.target.value)}
              placeholder="/startup-registration"
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-400 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">External URL</label>
            <input
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://..."
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-400 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Badge text</label>
            <input
              value={badge}
              onChange={e => setBadge(e.target.value)}
              placeholder="e.g. New"
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-400 transition"
            />
            <p className="text-[11px] text-gray-400 mt-1">Small pill shown next to title.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Parent Item</label>
            <select
              value={parentId}
              onChange={e => setParentId(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-400 transition bg-white"
            >
              <option value="">None (top-level)</option>
              {parentOptions.map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2 flex gap-6 pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={visible}
                onChange={e => setVisible(e.target.checked)}
                className="w-4 h-4 rounded accent-gray-900"
              />
              <span className="text-sm font-medium text-gray-700">Visible in navbar</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={e => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded accent-gray-900"
              />
              <span className="text-sm font-medium text-gray-700">Featured</span>
            </label>
          </div>
        </div>
      </section>

      {/* ── Mega Menu Builder ── */}
      {type === 'mega' && (
        <>
          {/* Mega menu header */}
          <section className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="text-sm font-bold text-gray-900 mb-1 uppercase tracking-widest">Mega Menu Header</h2>
            <p className="text-xs text-gray-400 mb-5">Shows as the title + description in the top-left of the dropdown.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Description</label>
                <input
                  value={megaDesc}
                  onChange={e => setMegaDesc(e.target.value)}
                  placeholder="e.g. Everything to start your business in India"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-400 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Icon</label>
                <select
                  value={megaIcon}
                  onChange={e => setMegaIcon(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-400 transition bg-white"
                >
                  <option value="">No icon</option>
                  {ICON_OPTIONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                </select>
              </div>
            </div>
          </section>

          {/* Categories + Links */}
          <section className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Categories & Links</h2>
                <p className="text-xs text-gray-400 mt-0.5">Each category appears as a column in the mega menu.</p>
              </div>
              <button
                type="button"
                onClick={addCategory}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-900 text-white text-xs font-semibold rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Category
              </button>
            </div>

            <div className="space-y-5">
              {categories.map((cat, ci) => (
                <div key={ci} className="border border-gray-200 rounded-xl overflow-hidden">
                  {/* Category header */}
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-b border-gray-200">
                    <GripVertical className="w-4 h-4 text-gray-300 shrink-0" />
                    <div className="flex-1">
                      <input
                        value={cat.title}
                        onChange={e => updateCategoryTitle(ci, e.target.value)}
                        placeholder="Category name (e.g. Company Registration)"
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold text-gray-900 placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-400 transition"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCategory(ci)}
                      disabled={categories.length === 1}
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Links */}
                  <div className="p-4 space-y-2">
                    {cat.links.map((link, li) => (
                      <div key={li} className="flex items-center gap-2">
                        <input
                          value={link.name}
                          onChange={e => updateLink(ci, li, 'name', e.target.value)}
                          placeholder="Link name (e.g. Private Limited Company)"
                          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-400 transition"
                        />
                        <input
                          value={link.href}
                          onChange={e => updateLink(ci, li, 'href', e.target.value)}
                          placeholder="/services/pvt-ltd"
                          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-400 transition"
                        />
                        <button
                          type="button"
                          onClick={() => removeLink(ci, li)}
                          disabled={cat.links.length === 1}
                          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => addLink(ci)}
                      className="inline-flex items-center gap-1.5 mt-1 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      <Plus className="w-3 h-3" /> Add Link
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Featured Card */}
          <section className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Featured Card</h2>
                <p className="text-xs text-gray-400 mt-0.5">Dark card shown on the right side of the mega menu.</p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasFeatured}
                  onChange={e => setHasFeatured(e.target.checked)}
                  className="w-4 h-4 rounded accent-gray-900"
                />
                <span className="text-sm font-medium text-gray-700">Enable featured card</span>
              </label>
            </div>

            {hasFeatured && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Title *</label>
                  <input
                    value={featuredData.title}
                    onChange={e => setFeaturedData(f => ({ ...f, title: e.target.value }))}
                    placeholder="e.g. Launch Your Startup Faster"
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-400 transition"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Description</label>
                  <input
                    value={featuredData.desc}
                    onChange={e => setFeaturedData(f => ({ ...f, desc: e.target.value }))}
                    placeholder="e.g. Everything you need to go from idea to incorporated."
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-400 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tag</label>
                  <input
                    value={featuredData.tag}
                    onChange={e => setFeaturedData(f => ({ ...f, tag: e.target.value }))}
                    placeholder="e.g. Most Popular"
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-400 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Button URL</label>
                  <input
                    value={featuredData.href}
                    onChange={e => setFeaturedData(f => ({ ...f, href: e.target.value }))}
                    placeholder="/services/startup"
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-400 transition"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Background Image URL</label>
                  <input
                    value={featuredData.image}
                    onChange={e => setFeaturedData(f => ({ ...f, image: e.target.value }))}
                    placeholder="https://... (Supabase storage URL or external)"
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-400 transition"
                  />
                  {featuredData.image && (
                    <div className="mt-2 relative h-24 w-full rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                      <Image src={featuredData.image} alt="preview" fill className="object-cover opacity-70" />
                    </div>
                  )}
                </div>

                {/* Live preview */}
                {featuredData.title && (
                  <div className="sm:col-span-2">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Preview</p>
                    <div className="bg-gray-900 rounded-xl p-5 relative overflow-hidden max-w-xs">
                      {featuredData.image && (
                        <div
                          className="absolute inset-0 opacity-30 bg-cover bg-center"
                          style={{ backgroundImage: `url(${featuredData.image})` }}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/90 to-transparent" />
                      <div className="relative z-10">
                        <span className="inline-block text-[9px] font-bold uppercase tracking-widest text-white/60 bg-white/10 px-2 py-1 rounded-full mb-2">
                          {featuredData.tag || 'Tag'}
                        </span>
                        <h5 className="font-bold text-white text-sm leading-snug mb-1">
                          {featuredData.title}
                        </h5>
                        <p className="text-white/60 text-xs mb-3 line-clamp-2">{featuredData.desc}</p>
                        <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
                          Explore Now <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        </>
      )}

      {/* ── Submit ── */}
      <div className="flex items-center gap-3 pb-10">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : mode === 'create' ? 'Create Nav Item' : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/navigation')}
          className="px-6 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}