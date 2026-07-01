'use client';

import { useState } from 'react';
import { ChevronDown, Check, Circle, PenTool, Search, ShieldCheck, CheckCircle2, Clock, Globe } from 'lucide-react';

type EditorialStatus = 'draft' | 'generated' | 'editor_review' | 'seo_review' | 'legal_review' | 'approved' | 'scheduled' | 'published';

interface StatusConfig {
  value: EditorialStatus;
  label: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

export const STATUS_CONFIG: Record<EditorialStatus, StatusConfig> = {
  draft: { value: 'draft', label: 'Draft', icon: Circle, color: 'text-gray-500', bgColor: 'bg-gray-100' },
  generated: { value: 'generated', label: 'AI Generated', icon: PenTool, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  editor_review: { value: 'editor_review', label: 'Editor Review', icon: PenTool, color: 'text-amber-600', bgColor: 'bg-amber-100' },
  seo_review: { value: 'seo_review', label: 'SEO Review', icon: Search, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  legal_review: { value: 'legal_review', label: 'Legal Review', icon: ShieldCheck, color: 'text-red-600', bgColor: 'bg-red-100' },
  approved: { value: 'approved', label: 'Approved', icon: CheckCircle2, color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
  scheduled: { value: 'scheduled', label: 'Scheduled', icon: Clock, color: 'text-cyan-600', bgColor: 'bg-cyan-100' },
  published: { value: 'published', label: 'Published', icon: Globe, color: 'text-emerald-700', bgColor: 'bg-emerald-50 border border-emerald-200' },
};

export const STATUS_ORDER: EditorialStatus[] = [
  'draft',
  'generated',
  'editor_review',
  'seo_review',
  'legal_review',
  'approved',
  'scheduled',
  'published'
];

interface EditorialStatusDropdownProps {
  currentStatus: EditorialStatus;
}

export function EditorialStatusDropdown({ currentStatus }: EditorialStatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<EditorialStatus>(currentStatus);

  const activeConfig = STATUS_CONFIG[selected];
  const ActiveIcon = activeConfig.icon;

  return (
    <div className="relative inline-block text-left w-full sm:w-64">
      {/* Hidden input to securely submit the value with the form */}
      <input type="hidden" name="status" value={selected} />
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors outline-none focus:ring-2 focus:ring-violet-500"
      >
        <div className="flex items-center gap-2">
          <div className={`flex items-center justify-center w-6 h-6 rounded-full ${activeConfig.bgColor}`}>
            <ActiveIcon className={`w-3.5 h-3.5 ${activeConfig.color}`} />
          </div>
          <span className="text-sm font-medium text-gray-700">{activeConfig.label}</span>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-100 rounded-lg shadow-xl overflow-hidden py-1 max-h-64 overflow-y-auto transform origin-top animate-in fade-in zoom-in-95 duration-100">
            {STATUS_ORDER.map((status) => {
              const config = STATUS_CONFIG[status];
              const Icon = config.icon;
              const isSelected = selected === status;

              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => {
                    setSelected(status);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 ${isSelected ? 'bg-gray-50/50' : ''}`}
                >
                  <div className="flex items-center gap-3">
                     <div className={`flex items-center justify-center w-6 h-6 rounded-full ${config.bgColor}`}>
                      <Icon className={`w-3.5 h-3.5 ${config.color}`} />
                    </div>
                    <span className={`font-medium ${isSelected ? 'text-charcoal' : 'text-gray-600'}`}>
                      {config.label}
                    </span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-violet-600" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
