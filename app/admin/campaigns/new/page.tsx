import { createCampaign } from '../actions';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Target, Settings, AlignLeft } from 'lucide-react';
import { SCHEDULE_PRESETS } from '@/lib/automation/schedule-presets';

export default function NewCampaignPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/admin/campaigns" className="text-sm text-gray-500 hover:text-charcoal flex items-center gap-1 w-fit">
          <ArrowLeft className="w-4 h-4" /> Back to Campaigns
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h1 className="text-2xl font-bold text-charcoal flex items-center gap-2">
            <Target className="w-6 h-6 text-violet-600" />
            Create Content Campaign
          </h1>
          <p className="text-gray-500 mt-1">Configure a new automation run for bulk content generation.</p>
        </div>

        <form action={createCampaign} className="p-6 space-y-8">
          {/* Section 1: Basics */}
          <section className="space-y-4">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <AlignLeft className="w-4 h-4" /> 1. Campaign Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-charcoal">Campaign Name</label>
                <input required type="text" name="name" className="w-full p-3 border border-gray-200 rounded-lg" placeholder="e.g., GST Deep Dive Q3" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-charcoal">Category</label>
                <input required type="text" name="category" className="w-full p-3 border border-gray-200 rounded-lg" placeholder="e.g., Taxation" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-charcoal">Content Type</label>
                <select name="content_type" defaultValue="blog" className="w-full p-3 border border-gray-200 rounded-lg bg-white">
                  <option value="blog">Blog Post</option>
                  <option value="service">Service Page</option>
                  <option value="industry">Industry Page</option>
                  <option value="city">City Page</option>
                  <option value="faq">FAQ Page</option>
                  <option value="page">Landing Page</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">The engine will adjust structure and routing automatically.</p>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-charcoal">Description (Optional)</label>
              <textarea name="description" className="w-full p-3 border border-gray-200 rounded-lg" rows={2} />
            </div>
          </section>

          {/* Section 2: Configuration */}
          <section className="space-y-4">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <Settings className="w-4 h-4" /> 2. Automation Rules
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-charcoal">Schedule</label>
                <select name="schedule_preset" className="w-full p-3 border border-gray-200 rounded-lg bg-white">
                  {Object.entries(SCHEDULE_PRESETS).map(([key, preset]) => (
                    <option key={key} value={key}>{preset.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-charcoal">Topics per Run</label>
                <input type="number" name="topics_per_run" defaultValue={2} className="w-full p-3 border border-gray-200 rounded-lg" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-charcoal">Priority</label>
                <select name="priority" defaultValue="medium" className="w-full p-3 border border-gray-200 rounded-lg bg-white">
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
          </section>

          {/* Section 3: Topics */}
          <section className="space-y-4">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <Target className="w-4 h-4" /> 3. Initial Topics
            </h2>
            <div className="space-y-2">
              <label className="text-sm font-bold text-charcoal">Paste Topics (One per line)</label>
              <textarea name="topics" className="w-full p-3 border border-gray-200 rounded-lg font-mono text-sm" rows={8} placeholder="Topic 1&#10;Topic 2&#10;Topic 3" />
            </div>
          </section>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <Button type="button" variant="outline" asChild className="rounded-xl">
              <Link href="/admin/campaigns">Cancel</Link>
            </Button>
            <Button type="submit" className="bg-violet-600 text-white hover:bg-violet-700 rounded-xl font-bold shadow-lg">
              Create Campaign
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
