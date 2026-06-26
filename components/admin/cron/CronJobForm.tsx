'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Save, Clock } from 'lucide-react';
import Link from 'next/link';

interface CronJobFormProps {
  initialData?: {
    id: string;
    name: string;
    job_type: string;
    schedule: string;
    active: boolean;
    config: any;
  };
  action: (formData: FormData) => Promise<void>;
  isEditing?: boolean;
}

const JOB_TYPES = [
  { value: 'generate_blog', label: 'Generate Blog' },
  { value: 'publish_scheduled', label: 'Publish Scheduled Blogs' },
  { value: 'refresh_sitemap', label: 'Refresh Sitemap' },
  { value: 'seo_audit', label: 'SEO Audit' },
  { value: 'cleanup_media', label: 'Cleanup Media' },
];

export default function CronJobForm({ initialData, action, isEditing }: CronJobFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    // If switch is off, it won't be included in formData. We handle it in the action, 
    // but just in case, if the checkbox isn't checked, the action handles it as !== 'on'.
    
    try {
      await action(formData);
      router.push('/admin/cron');
    } catch (err: any) {
      setError(err.message || 'Failed to save cron job');
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/cron" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-charcoal hover:border-charcoal transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-display font-bold text-charcoal tracking-tight">
            {isEditing ? 'Edit Cron Job' : 'New Cron Job'}
          </h1>
          <p className="text-gray-500">Configure background tasks and scheduling</p>
        </div>
      </div>

      <Card className="p-8 border-gray-200 shadow-sm">
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-charcoal">Job Name</label>
              <Input
                id="name"
                name="name"
                placeholder="e.g. Daily Blog Generator"
                defaultValue={initialData?.name}
                required
                className="bg-gray-50/50"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="job_type" className="text-sm font-medium text-charcoal">Job Type</label>
              <select
                id="job_type"
                name="job_type"
                defaultValue={initialData?.job_type || JOB_TYPES[0].value}
                required
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-gray-50/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {JOB_TYPES.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label htmlFor="schedule" className="text-sm font-medium text-charcoal">CRON Schedule Expression</label>
              <div className="relative">
                <Input
                  id="schedule"
                  name="schedule"
                  placeholder="0 0 * * * (Daily at midnight)"
                  defaultValue={initialData?.schedule || '0 0 * * *'}
                  required
                  className="bg-gray-50/50 pl-10 font-mono"
                />
                <Clock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              <p className="text-xs text-gray-500 mt-1 flex gap-4">
                <span><strong className="text-charcoal">0 * * * *</strong> = Hourly</span>
                <span><strong className="text-charcoal">0 0 * * *</strong> = Daily</span>
                <span><strong className="text-charcoal">0 0 * * 0</strong> = Weekly</span>
              </p>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label htmlFor="config" className="text-sm font-medium text-charcoal">JSON Configuration (Optional)</label>
              <textarea
                id="config"
                name="config"
                placeholder={'{\n  "keywords": ["startup", "tax"],\n  "publish_immediately": true\n}'}
                defaultValue={initialData?.config ? JSON.stringify(initialData.config, null, 2) : ''}
                className="flex min-h-[120px] w-full rounded-md border border-input bg-gray-50/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
            <input
              type="checkbox"
              id="active"
              name="active"
              className="w-5 h-5 rounded text-sage border-gray-300 focus:ring-sage"
              defaultChecked={initialData ? initialData.active : true}
            />
            <label htmlFor="active" className="cursor-pointer text-sm font-medium text-charcoal">Active / Enabled</label>
          </div>

          <div className="pt-6 flex justify-end gap-3 border-t border-gray-100">
            <Link href="/admin/cron">
              <Button type="button" variant="outline" className="rounded-xl">Cancel</Button>
            </Link>
            <Button type="submit" disabled={loading} className="bg-charcoal text-white hover:bg-sage rounded-xl shadow-premium">
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Saving...' : 'Save Job'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
