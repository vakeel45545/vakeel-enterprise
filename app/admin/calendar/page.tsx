import { fetchCalendarEvents } from './actions';
import MarketingCalendar from '@/components/admin/calendar/MarketingCalendar';
import { Calendar as CalendarIcon, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata = {
  title: 'Marketing Calendar | Vakeel Admin',
};

export default async function CalendarPage() {
  const events = await fetchCalendarEvents();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-violet-600" />
            Marketing Calendar
          </h1>
          <p className="text-gray-500 mt-1">
            Unified scheduling for blogs, campaigns, pages, and programmatic SEO. Drag and drop to reschedule.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/campaigns/new">
            <Button className="bg-violet-600 hover:bg-violet-700 text-white font-bold flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Campaign
            </Button>
          </Link>
        </div>
      </div>

      <MarketingCalendar initialEvents={events} />
    </div>
  );
}
