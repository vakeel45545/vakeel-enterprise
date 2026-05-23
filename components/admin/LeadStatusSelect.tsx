'use client';

import { useTransition } from 'react';
import { updateLeadStatus } from '@/app/admin/actions';

export function LeadStatusSelect({ leadId, currentStatus }: { leadId: string, currentStatus: string }) {
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    startTransition(async () => {
      try {
        await updateLeadStatus(leadId, newStatus);
      } catch (error) {
        console.error('Failed to update status:', error);
        alert('Failed to update status.');
      }
    });
  };

  return (
    <select 
      value={currentStatus || 'new'}
      onChange={handleChange}
      disabled={isPending}
      className={`px-3 py-1 text-xs font-bold rounded-full outline-none appearance-none cursor-pointer ${
        currentStatus === 'new' ? 'bg-blue-50 text-blue-600' :
        currentStatus === 'contacted' ? 'bg-amber/10 text-amber' :
        currentStatus === 'converted' ? 'bg-emerald-50 text-emerald-600' :
        'bg-gray-100 text-gray-500'
      } ${isPending ? 'opacity-50' : ''}`}
    >
      <option value="new">New</option>
      <option value="contacted">Contacted</option>
      <option value="converted">Converted</option>
      <option value="closed">Closed</option>
    </select>
  );
}
