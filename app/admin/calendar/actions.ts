'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'blog' | 'campaign' | 'service' | 'page' | 'seo';
  status: string;
}

export async function fetchCalendarEvents(): Promise<CalendarEvent[]> {
  const supabase = await createClient();
  const events: CalendarEvent[] = [];

  // Fetch Blogs
  const { data: blogs } = await supabase.from('blogs').select('id, title, scheduled_at, created_at, status');
  if (blogs) {
    events.push(...blogs.map(b => ({
      id: b.id,
      title: b.title,
      date: b.scheduled_at || b.created_at,
      type: 'blog' as const,
      status: b.status || 'draft'
    })));
  }

  // Fetch Campaigns
  const { data: campaigns } = await supabase.from('campaigns').select('id, name, scheduled_at, created_at, status');
  if (campaigns) {
    events.push(...campaigns.map(c => ({
      id: c.id,
      title: c.name,
      date: c.scheduled_at || c.created_at,
      type: 'campaign' as const,
      status: c.status || 'active'
    })));
  }

  // Fetch Services
  const { data: services } = await supabase.from('services').select('id, title, scheduled_at, created_at, published');
  if (services) {
    events.push(...services.map(s => ({
      id: s.id,
      title: s.title,
      date: s.scheduled_at || s.created_at,
      type: 'service' as const,
      status: s.published ? 'published' : 'draft'
    })));
  }

  // Fetch Pages
  const { data: pages } = await supabase.from('pages').select('id, title, scheduled_at, created_at, published');
  if (pages) {
    events.push(...pages.map(p => ({
      id: p.id,
      title: p.title,
      date: p.scheduled_at || p.created_at,
      type: 'page' as const,
      status: p.published ? 'published' : 'draft'
    })));
  }

  return events;
}

export async function rescheduleEvent(id: string, type: string, newDateString: string) {
  const supabase = await createClient();
  
  const tableMap: Record<string, string> = {
    blog: 'blogs',
    campaign: 'campaigns',
    service: 'services',
    page: 'pages',
    seo: 'service_city_content'
  };

  const table = tableMap[type];
  if (!table) throw new Error('Unknown event type');

  const { error } = await supabase
    .from(table)
    .update({ scheduled_at: newDateString })
    .eq('id', id);

  if (error) throw new Error(error.message);

  revalidatePath('/admin/calendar');
  return { success: true };
}
