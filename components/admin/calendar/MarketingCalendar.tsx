'use client';

import { useState, useMemo } from 'react';
import { CalendarEvent, rescheduleEvent } from '@/app/admin/calendar/actions';
import { ChevronLeft, ChevronRight, FileText, Target, Layout, CheckCircle2, Clock } from 'lucide-react';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth, isSameDay, addMonths, subMonths, parseISO } from 'date-fns';
import { toast } from 'sonner';

export default function MarketingCalendar({ initialEvents }: { initialEvents: CalendarEvent[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [isDragging, setIsDragging] = useState(false);

  // Generate calendar days
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Navigation
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, eventId: string) => {
    e.dataTransfer.setData('eventId', eventId);
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = async (e: React.DragEvent, dateString: string) => {
    e.preventDefault();
    setIsDragging(false);
    const eventId = e.dataTransfer.getData('eventId');
    if (!eventId) return;

    // Optimistic UI update
    const eventIndex = events.findIndex(ev => ev.id === eventId);
    if (eventIndex === -1) return;
    const eventToMove = events[eventIndex];
    
    // Prevent pointless moves
    if (format(parseISO(eventToMove.date), 'yyyy-MM-dd') === dateString) return;

    const newDate = new Date(dateString).toISOString();
    
    const newEvents = [...events];
    newEvents[eventIndex] = { ...eventToMove, date: newDate };
    setEvents(newEvents);

    // Persist to server
    try {
      await rescheduleEvent(eventId, eventToMove.type, newDate);
      toast.success('Event rescheduled');
    } catch (err: any) {
      toast.error('Failed to reschedule: ' + err.message);
      // Revert optimism
      setEvents(initialEvents);
    }
  };

  // Type styling
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'campaign': return 'bg-violet-100 text-violet-700 border-violet-200';
      case 'blog': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'service': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'page': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'seo': return 'bg-pink-100 text-pink-700 border-pink-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'campaign': return <Target className="w-3 h-3" />;
      case 'blog': return <FileText className="w-3 h-3" />;
      default: return <Layout className="w-3 h-3" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-charcoal">{format(currentDate, 'MMMM yyyy')}</h2>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg"><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
          <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 hover:bg-gray-100 text-sm font-bold rounded-lg text-gray-600">Today</button>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg"><ChevronRight className="w-5 h-5 text-gray-600" /></button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50/50">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-3 text-center text-xs font-bold text-gray-500 uppercase">{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 bg-gray-200 gap-px">
        {days.map(day => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const dayEvents = events.filter(e => format(parseISO(e.date), 'yyyy-MM-dd') === dateKey);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={dateKey}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, dateKey)}
              className={`min-h-[140px] p-2 bg-white ${!isCurrentMonth ? 'opacity-50 bg-gray-50' : ''} ${isDragging ? 'hover:bg-violet-50 transition-colors' : ''}`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className={`text-sm font-bold ${isToday ? 'bg-violet-600 text-white w-6 h-6 flex items-center justify-center rounded-full' : 'text-gray-500 px-1'}`}>
                  {format(day, 'd')}
                </span>
                {dayEvents.length > 0 && (
                  <span className="text-[10px] font-bold text-gray-400">{dayEvents.length} items</span>
                )}
              </div>
              
              <div className="space-y-1.5">
                {dayEvents.map(event => (
                  <div
                    key={event.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, event.id)}
                    onDragEnd={handleDragEnd}
                    className={`p-2 text-xs rounded border cursor-grab active:cursor-grabbing ${getTypeColor(event.type)}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1 opacity-70">
                        {getTypeIcon(event.type)}
                        <span className="uppercase font-bold tracking-wider text-[9px]">{event.type}</span>
                      </div>
                      {event.status === 'published' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    </div>
                    <div className="font-semibold truncate" title={event.title}>{event.title}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
