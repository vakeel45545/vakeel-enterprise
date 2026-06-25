'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SubmitButton } from '@/components/admin/SubmitButton';
import { useState } from 'react';
import { Trash2 } from 'lucide-react';

interface WebhookFormProps {
  action: (formData: FormData) => Promise<void>;
  initialData?: {
    name?: string;
    url?: string;
    event_type?: string;
    headers?: Record<string, string>;
    active?: boolean;
  };
}

const EVENTS = [
  { id: '*', label: 'All Events (Firehose)' },
  { id: 'lead.created', label: 'Lead Created' },
  { id: 'lead.updated', label: 'Lead Updated' },
  { id: 'blog.published', label: 'Blog Published' },
  { id: 'service.updated', label: 'Service Updated' },
  { id: 'industry.updated', label: 'Industry Updated' },
];

export function WebhookForm({ action, initialData }: WebhookFormProps) {
  // Convert Record<string, string> to array of {k, v} for the UI
  const initialHeaders = initialData?.headers
    ? Object.entries(initialData.headers).map(([k, v]) => ({ k, v }))
    : [];

  const [headers, setHeaders] = useState<{ k: string; v: string }[]>(initialHeaders);

  const addHeader = () => setHeaders([...headers, { k: '', v: '' }]);
  const removeHeader = (index: number) => setHeaders(headers.filter((_, i) => i !== index));
  const updateHeader = (index: number, key: 'k' | 'v', val: string) => {
    const newHeaders = [...headers];
    newHeaders[index][key] = val;
    setHeaders(newHeaders);
  };

  // Convert array back to object for submission
  const headersObject = headers.reduce((acc, { k, v }) => {
    if (k.trim() && v.trim()) acc[k.trim()] = v.trim();
    return acc;
  }, {} as Record<string, string>);

  return (
    <form action={action} className="space-y-8 max-w-3xl">
      <Card className="p-6 border-gray-200 shadow-sm space-y-6">
        <h2 className="text-xl font-display font-bold text-charcoal border-b border-gray-100 pb-4">Endpoint Configuration</h2>

        <div>
          <label className="block text-sm font-semibold text-charcoal mb-2">Webhook Name *</label>
          <Input name="name" required defaultValue={initialData?.name || ''} placeholder="e.g. Zapier Lead Sync" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-charcoal mb-2">Payload URL *</label>
          <Input name="url" type="url" required defaultValue={initialData?.url || ''} placeholder="https://..." />
          <p className="text-xs text-gray-500 mt-1.5">Where should we send the POST request?</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-charcoal mb-2">Event Trigger *</label>
          <select
            name="event_type"
            required
            defaultValue={initialData?.event_type || '*'}
            className="w-full h-12 px-4 rounded-xl border border-charcoal/10 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all appearance-none"
          >
            {EVENTS.map(evt => (
              <option key={evt.id} value={evt.id}>{evt.label} ({evt.id})</option>
            ))}
          </select>
        </div>
      </Card>

      <Card className="p-6 border-gray-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <h2 className="text-xl font-display font-bold text-charcoal">Custom Headers</h2>
          <Button type="button" variant="outline" size="sm" onClick={addHeader} className="rounded-lg">
            + Add Header
          </Button>
        </div>
        
        {headers.length === 0 ? (
          <p className="text-sm text-gray-500">No custom headers. Standard JSON headers will be sent automatically.</p>
        ) : (
          <div className="space-y-3">
            {headers.map((h, i) => (
              <div key={i} className="flex items-center gap-3">
                <Input
                  placeholder="Key (e.g. Authorization)"
                  value={h.k}
                  onChange={e => updateHeader(i, 'k', e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder="Value"
                  value={h.v}
                  onChange={e => updateHeader(i, 'v', e.target.value)}
                  className="flex-1"
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeHeader(i)} className="text-red-400 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <input type="hidden" name="headers" value={JSON.stringify(headersObject)} />
      </Card>

      <Card className="p-6 border-gray-200 shadow-sm">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="active"
            defaultChecked={initialData?.active !== false}
            className="w-5 h-5 rounded border-gray-300 text-sage focus:ring-sage"
          />
          <div>
             <span className="font-semibold text-charcoal block">Active</span>
             <span className="text-sm text-gray-500">Enable or disable this webhook endpoint</span>
          </div>
        </label>
      </Card>

      <div className="flex justify-end">
        <SubmitButton>{initialData ? 'Update Webhook' : 'Save Webhook'}</SubmitButton>
      </div>
    </form>
  );
}
