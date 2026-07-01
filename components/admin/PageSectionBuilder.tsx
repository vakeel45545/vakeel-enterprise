'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus, Trash2, Eye, EyeOff, ChevronUp, ChevronDown,
  Save, ArrowLeft, GripVertical, Settings2,
  Layout, Star, Zap, HelpCircle, Megaphone, FileText, List
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PageSection {
  id?: string;
  page_id: string | null;
  section_key: string;
  title: string | null;
  subtitle: string | null;
  content: Record<string, any>;
  order_index: number;
  visible: boolean;
}

interface PageSectionBuilderProps {
  pageId: string;
  pageTitle: string;
  pageSlug: string;
  initialSections: PageSection[];
}

// ─── Section type definitions ─────────────────────────────────────────────────

const SECTION_TYPES = [
  { key: 'hero', label: 'Hero', icon: Layout, color: 'bg-purple-100 text-purple-700', desc: 'Main banner with title, description, CTA buttons' },
  { key: 'benefits', label: 'Benefits / Features', icon: Star, color: 'bg-amber-100 text-amber-700', desc: 'Feature cards grid with icons' },
  { key: 'process', label: 'Process / Steps', icon: List, color: 'bg-blue-100 text-blue-700', desc: 'Numbered steps list' },
  { key: 'faq', label: 'FAQ', icon: HelpCircle, color: 'bg-green-100 text-green-700', desc: 'Accordion FAQ section' },
  { key: 'cta', label: 'Call to Action', icon: Megaphone, color: 'bg-red-100 text-red-700', desc: 'Full-width CTA banner' },
  { key: 'content', label: 'Rich Content', icon: FileText, color: 'bg-gray-100 text-gray-700', desc: 'Free HTML content block' },
  { key: 'testimonials', label: 'Testimonials', icon: Zap, color: 'bg-sage/20 text-sage', desc: 'Client reviews carousel' },
];

function getSectionIcon(key: string) {
  return SECTION_TYPES.find(t => t.key === key)?.icon ?? Settings2;
}
function getSectionColor(key: string) {
  return SECTION_TYPES.find(t => t.key === key)?.color ?? 'bg-gray-100 text-gray-600';
}

// ─── Default content for each section type ───────────────────────────────────

function getDefaultContent(key: string): Record<string, any> {
  switch (key) {
    case 'hero': return {
      badge: '',
      description: '',
      primaryButtonText: 'Get Started',
      primaryButtonUrl: '/contact',
      secondaryButtonText: 'Learn More',
      secondaryButtonUrl: '/about',
    };
    case 'benefits': return {
      items: [
        { title: 'Fast Processing', description: 'Get your work done in record time.', icon: 'Zap' },
        { title: 'Expert Support', description: '24/7 help from our team.', icon: 'Users' },
      ],
    };
    case 'process': return {
      steps: [
        { step: 1, title: 'Step One', description: 'Describe what happens here.' },
        { step: 2, title: 'Step Two', description: 'Describe the next step.' },
      ],
    };
    case 'faq': return {
      items: [
        { q: 'What is this service?', a: 'This service helps you...' },
        { q: 'How long does it take?', a: 'Typically 2-3 business days.' },
      ],
    };
    case 'cta': return {
      description: 'Take the next step today.',
      buttonText: 'Get Started Now',
      buttonUrl: '/contact',
    };
    case 'content': return { html: '<p>Write your content here.</p>' };
    case 'testimonials': return { items: [] };
    default: return {};
  }
}

// ─── Section Content Editors ─────────────────────────────────────────────────

function HeroEditor({ content, onChange }: { content: any; onChange: (c: any) => void }) {
  return (
    <div className="space-y-3">
      <Field label="Badge text" value={content.badge} onChange={v => onChange({ ...content, badge: v })} placeholder="e.g. Trusted by 50,000+ founders" />
      <Field label="Description" value={content.description} onChange={v => onChange({ ...content, description: v })} placeholder="Supporting text below the title" textarea />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Primary button text" value={content.primaryButtonText} onChange={v => onChange({ ...content, primaryButtonText: v })} placeholder="Get Started" />
        <Field label="Primary button URL" value={content.primaryButtonUrl} onChange={v => onChange({ ...content, primaryButtonUrl: v })} placeholder="/contact" />
        <Field label="Secondary button text" value={content.secondaryButtonText} onChange={v => onChange({ ...content, secondaryButtonText: v })} placeholder="Learn More" />
        <Field label="Secondary button URL" value={content.secondaryButtonUrl} onChange={v => onChange({ ...content, secondaryButtonUrl: v })} placeholder="/about" />
      </div>
      <p className="text-xs text-gray-400 bg-gray-50 px-3 py-2 rounded-lg">💡 The hero title is controlled by the <strong>Title</strong> field above (in the section header).</p>
    </div>
  );
}

function BenefitsEditor({ content, onChange }: { content: any; onChange: (c: any) => void }) {
  const items = content.items ?? [];
  const updateItem = (idx: number, field: string, val: string) =>
    onChange({ ...content, items: items.map((item: any, i: number) => i === idx ? { ...item, [field]: val } : item) });
  const addItem = () => onChange({ ...content, items: [...items, { title: '', description: '', icon: 'Zap' }] });
  const removeItem = (idx: number) => onChange({ ...content, items: items.filter((_: any, i: number) => i !== idx) });

  const ICON_OPTIONS = ['Zap', 'Users', 'Clock', 'ShieldCheck', 'Star', 'TrendingUp', 'Building2', 'FileText', 'CheckCircle2'];

  return (
    <div className="space-y-3">
      <div className="space-y-3">
        {items.map((item: any, idx: number) => (
          <div key={idx} className="border border-gray-200 rounded-xl p-4 bg-gray-50/50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Card {idx + 1}</span>
              <button type="button" onClick={() => removeItem(idx)} className="text-red-400 hover:text-red-600 p-1 rounded transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Title" value={item.title} onChange={v => updateItem(idx, 'title', v)} placeholder="Feature title" />
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Icon</label>
                <select value={item.icon || 'Zap'} onChange={e => updateItem(idx, 'icon', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-2.5 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/20">
                  {ICON_OPTIONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <Field label="Description" value={item.description} onChange={v => updateItem(idx, 'description', v)} placeholder="Short description" textarea />
              </div>
            </div>
          </div>
        ))}
      </div>
      <button type="button" onClick={addItem} className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 border border-dashed border-gray-300 hover:border-gray-400 px-3 py-2 rounded-lg transition-colors w-full justify-center">
        <Plus className="w-3.5 h-3.5" /> Add Feature Card
      </button>
    </div>
  );
}

function ProcessEditor({ content, onChange }: { content: any; onChange: (c: any) => void }) {
  const steps = content.steps ?? [];
  const updateStep = (idx: number, field: string, val: string) =>
    onChange({ ...content, steps: steps.map((s: any, i: number) => i === idx ? { ...s, [field]: val } : s) });
  const addStep = () => onChange({ ...content, steps: [...steps, { step: steps.length + 1, title: '', description: '' }] });
  const removeStep = (idx: number) => onChange({ ...content, steps: steps.filter((_: any, i: number) => i !== idx) });

  return (
    <div className="space-y-3">
      {steps.map((step: any, idx: number) => (
        <div key={idx} className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 flex gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-1">{idx + 1}</div>
          <div className="flex-1 space-y-2">
            <Field label="Step title" value={step.title} onChange={v => updateStep(idx, 'title', v)} placeholder="e.g. Submit Documents" />
            <Field label="Description" value={step.description} onChange={v => updateStep(idx, 'description', v)} placeholder="What happens in this step" textarea />
          </div>
          <button type="button" onClick={() => removeStep(idx)} className="text-red-400 hover:text-red-600 p-1 rounded self-start transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
      <button type="button" onClick={addStep} className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 border border-dashed border-gray-300 hover:border-gray-400 px-3 py-2 rounded-lg transition-colors w-full justify-center">
        <Plus className="w-3.5 h-3.5" /> Add Step
      </button>
    </div>
  );
}

function FaqEditor({ content, onChange }: { content: any; onChange: (c: any) => void }) {
  const items = content.items ?? [];
  const updateItem = (idx: number, field: string, val: string) =>
    onChange({ ...content, items: items.map((item: any, i: number) => i === idx ? { ...item, [field]: val } : item) });
  const addItem = () => onChange({ ...content, items: [...items, { q: '', a: '' }] });
  const removeItem = (idx: number) => onChange({ ...content, items: items.filter((_: any, i: number) => i !== idx) });

  return (
    <div className="space-y-3">
      {items.map((item: any, idx: number) => (
        <div key={idx} className="border border-gray-200 rounded-xl p-4 bg-gray-50/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-500">Q{idx + 1}</span>
            <button type="button" onClick={() => removeItem(idx)} className="text-red-400 hover:text-red-600 p-1 rounded transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-2">
            <Field label="Question" value={item.q} onChange={v => updateItem(idx, 'q', v)} placeholder="What is..." />
            <Field label="Answer" value={item.a} onChange={v => updateItem(idx, 'a', v)} placeholder="The answer is..." textarea />
          </div>
        </div>
      ))}
      <button type="button" onClick={addItem} className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 border border-dashed border-gray-300 hover:border-gray-400 px-3 py-2 rounded-lg transition-colors w-full justify-center">
        <Plus className="w-3.5 h-3.5" /> Add FAQ
      </button>
    </div>
  );
}

function CtaEditor({ content, onChange }: { content: any; onChange: (c: any) => void }) {
  return (
    <div className="space-y-3">
      <Field label="Description" value={content.description} onChange={v => onChange({ ...content, description: v })} placeholder="Compelling call-to-action text" textarea />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Button text" value={content.buttonText} onChange={v => onChange({ ...content, buttonText: v })} placeholder="Get Started Now" />
        <Field label="Button URL" value={content.buttonUrl} onChange={v => onChange({ ...content, buttonUrl: v })} placeholder="/contact" />
      </div>
      <p className="text-xs text-gray-400 bg-gray-50 px-3 py-2 rounded-lg">💡 The CTA headline is controlled by the <strong>Title</strong> field above.</p>
    </div>
  );
}

function ContentEditor({ content, onChange }: { content: any; onChange: (c: any) => void }) {
  return (
    <div className="space-y-3">
      <Field label="HTML Content" value={content.html} onChange={v => onChange({ ...content, html: v })} placeholder="<p>Your content here...</p>" textarea rows={8} mono />
      <p className="text-xs text-gray-400 bg-gray-50 px-3 py-2 rounded-lg">Supports HTML tags: &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;, &lt;a&gt;, etc.</p>
    </div>
  );
}

// ─── Shared Field component ───────────────────────────────────────────────────

function Field({ label, value, onChange, placeholder, textarea, rows = 3, mono }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; textarea?: boolean; rows?: number; mono?: boolean;
}) {
  const base = `w-full border border-gray-200 rounded-lg px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-400 transition ${mono ? 'font-mono text-xs' : ''}`;
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      {textarea ? (
        <textarea value={value ?? ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} className={base} />
      ) : (
        <input value={value ?? ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={base} />
      )}
    </div>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────

function SectionCard({
  section, index, total, onUpdate, onDelete, onMoveUp, onMoveDown, onToggleVisible
}: {
  section: PageSection; index: number; total: number;
  onUpdate: (s: PageSection) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onToggleVisible: () => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const colorClass = getSectionColor(section.section_key);
  const sectionDef = SECTION_TYPES.find(t => t.key === section.section_key);

  const renderEditor = () => {
    const content = section.content ?? {};
    const update = (c: any) => onUpdate({ ...section, content: c });
    switch (section.section_key) {
      case 'hero': return <HeroEditor content={content} onChange={update} />;
      case 'benefits': return <BenefitsEditor content={content} onChange={update} />;
      case 'process': return <ProcessEditor content={content} onChange={update} />;
      case 'faq': return <FaqEditor content={content} onChange={update} />;
      case 'cta': return <CtaEditor content={content} onChange={update} />;
      case 'content': return <ContentEditor content={content} onChange={update} />;
      default: return <p className="text-xs text-gray-400 italic">No editor available for this section type.</p>;
    }
  };

  return (
    <div className={`bg-white border rounded-2xl overflow-hidden transition-all duration-200 ${!section.visible ? 'opacity-60' : ''} border-gray-200`}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-gray-50/80 border-b border-gray-100">
        <GripVertical className="w-4 h-4 text-gray-300 shrink-0" />
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${colorClass} shrink-0`}>
          {React.createElement(getSectionIcon(section.section_key), { className: "w-3.5 h-3.5" })}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-900 truncate">
              {section.title || sectionDef?.label || section.section_key}
            </span>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${colorClass}`}>
              {section.section_key}
            </span>
          </div>
          {section.subtitle && <p className="text-xs text-gray-400 truncate mt-0.5">{section.subtitle}</p>}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button type="button" onClick={onMoveUp} disabled={index === 0}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
          <button type="button" onClick={onMoveDown} disabled={index === total - 1}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <button type="button" onClick={onToggleVisible}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
            {section.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>
          <button type="button" onClick={onDelete}
            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button type="button" onClick={() => setExpanded(e => !e)}
            className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors ml-1">
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Body */}
      {expanded && (
        <div className="p-4 space-y-4">
          {/* Common fields */}
          <div className="grid grid-cols-2 gap-3 pb-4 border-b border-gray-100">
            <Field label="Section title" value={section.title ?? ''} onChange={v => onUpdate({ ...section, title: v })}
              placeholder={`e.g. ${sectionDef?.label}`} />
            <Field label="Section subtitle" value={section.subtitle ?? ''} onChange={v => onUpdate({ ...section, subtitle: v })}
              placeholder="Optional supporting text" />
          </div>
          {/* Type-specific editor */}
          {renderEditor()}
        </div>
      )}
    </div>
  );
}

// ─── Add Section Modal ────────────────────────────────────────────────────────

function AddSectionModal({ onAdd, onClose }: { onAdd: (key: string) => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-1">Add Section</h3>
        <p className="text-sm text-gray-500 mb-5">Choose the type of section to add to this page.</p>
        <div className="grid grid-cols-2 gap-3">
          {SECTION_TYPES.map(type => {
            const Icon = type.icon;
            return (
              <button key={type.key} type="button" onClick={() => { onAdd(type.key); onClose(); }}
                className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all text-left group">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${type.color}`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900 group-hover:text-gray-700">{type.label}</div>
                  <div className="text-xs text-gray-400 mt-0.5 leading-tight">{type.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
        <button type="button" onClick={onClose} className="mt-4 w-full py-2 text-sm font-semibold text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
}

// ─── Main Builder ─────────────────────────────────────────────────────────────

export default function PageSectionBuilder({ pageId, pageTitle, pageSlug, initialSections }: PageSectionBuilderProps) {
  const router = useRouter();
  const [sections, setSections] = useState<PageSection[]>(
    [...initialSections].sort((a, b) => a.order_index - b.order_index)
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addSection = (key: string) => {
    const newSection: PageSection = {
      page_id: pageId,
      section_key: key,
      title: null,
      subtitle: null,
      content: getDefaultContent(key),
      order_index: sections.length,
      visible: true,
    };
    setSections(s => [...s, newSection]);
  };

  const updateSection = (idx: number, updated: PageSection) => {
    setSections(s => s.map((item, i) => i === idx ? updated : item));
  };

  const deleteSection = (idx: number) => {
    setSections(s => s.filter((_, i) => i !== idx));
  };

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    setSections(s => {
      const arr = [...s];
      [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
      return arr.map((item, i) => ({ ...item, order_index: i }));
    });
  };

  const moveDown = (idx: number) => {
    setSections(s => {
      if (idx >= s.length - 1) return s;
      const arr = [...s];
      [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
      return arr.map((item, i) => ({ ...item, order_index: i }));
    });
  };

  const toggleVisible = (idx: number) => {
    setSections(s => s.map((item, i) => i === idx ? { ...item, visible: !item.visible } : item));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/page-sections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageId, sections: sections.map((s, i) => ({ ...s, order_index: i })) }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? 'Save failed');
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {showAddModal && <AddSectionModal onAdd={addSection} onClose={() => setShowAddModal(false)} />}

      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <button onClick={() => router.push('/admin/pages')}
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-3">
              <ArrowLeft className="w-4 h-4" /> Back to Pages
            </button>
            <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
            <p className="text-sm text-gray-500 mt-1">
              <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-xs">/{pageSlug}</span>
              <span className="ml-2">{sections.length} section{sections.length !== 1 ? 's' : ''}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a href={`/${pageSlug}`} target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Eye className="w-3.5 h-3.5" /> Preview
            </a>
            <button onClick={handleSave} disabled={saving}
              className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-lg transition-all ${saved ? 'bg-green-600 text-white' : 'bg-gray-900 text-white hover:bg-gray-700'} disabled:opacity-60`}>
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save All'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-medium">
            {error}
          </div>
        )}

        {/* Sections list */}
        {sections.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-16 text-center mb-4">
            <Layout className="w-10 h-10 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium mb-2">No sections yet</p>
            <p className="text-sm text-gray-400 mb-6">Add your first section to build this page.</p>
            <button type="button" onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 transition-colors">
              <Plus className="w-4 h-4" /> Add First Section
            </button>
          </div>
        ) : (
          <div className="space-y-3 mb-4">
            {sections.map((section, idx) => (
              <SectionCard
                key={`${section.id ?? 'new'}-${idx}`}
                section={section}
                index={idx}
                total={sections.length}
                onUpdate={updated => updateSection(idx, updated)}
                onDelete={() => deleteSection(idx)}
                onMoveUp={() => moveUp(idx)}
                onMoveDown={() => moveDown(idx)}
                onToggleVisible={() => toggleVisible(idx)}
              />
            ))}
          </div>
        )}

        {/* Add section button */}
        <button type="button" onClick={() => setShowAddModal(true)}
          className="w-full py-3 border border-dashed border-gray-300 hover:border-gray-500 text-sm font-semibold text-gray-500 hover:text-gray-900 rounded-2xl transition-all flex items-center justify-center gap-2 bg-white hover:bg-gray-50">
          <Plus className="w-4 h-4" /> Add Section
        </button>

        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
          <p className="text-xs text-blue-700 font-medium">
            💡 <strong>How it works:</strong> Click <strong>Save All</strong> to publish your changes. They will appear on the live page immediately.
          </p>
        </div>
      </div>
    </div>
  );
}