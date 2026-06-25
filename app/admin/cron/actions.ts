'use server';

import { verifyAdminAndGetClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

// ─────────────────────────────────────────────
// CRON JOBS
// ─────────────────────────────────────────────

export async function createCronJob(formData: FormData) {
  const supabase = await verifyAdminAndGetClient();

  const configRaw = formData.get('config') as string;

  const data = {
    name: formData.get('name') as string,
    schedule: formData.get('schedule') as string,
    job_type: formData.get('job_type') as string,
    config: configRaw ? JSON.parse(configRaw) : null,
    active: formData.get('active') !== 'off',
  };

  const { error } = await supabase.from('cron_jobs').insert([data]);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/cron');
}

export async function updateCronJob(id: string, formData: FormData) {
  const supabase = await verifyAdminAndGetClient();

  const configRaw = formData.get('config') as string;

  const data = {
    name: formData.get('name') as string,
    schedule: formData.get('schedule') as string,
    job_type: formData.get('job_type') as string,
    config: configRaw ? JSON.parse(configRaw) : null,
    active: formData.get('active') !== 'off',
  };

  const { error } = await supabase.from('cron_jobs').update(data).eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/cron');
}

export async function deleteCronJob(id: string) {
  const supabase = await verifyAdminAndGetClient();
  const { error } = await supabase.from('cron_jobs').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/cron');
}

export async function triggerCronNow() {
  const supabase = await verifyAdminAndGetClient();
  
  // This just hits the internal route to trigger a run immediately
  const CRON_SECRET = process.env.CRON_SECRET || 'vakeel-dev-cron-secret-2026';
  const url = process.env.APP_URL || 'http://localhost:3000';
  
  try {
    const res = await fetch(`${url}/api/cron`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${CRON_SECRET}`
      }
    });
    
    if (!res.ok) throw new Error('Trigger failed');
    
    revalidatePath('/admin/cron');
    return { success: true };
  } catch (e: any) {
    throw new Error(e.message || 'Trigger failed');
  }
}
