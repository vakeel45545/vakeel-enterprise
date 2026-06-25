'use server';

import { verifyAdminAndGetClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { dispatchWebhook } from '@/lib/webhooks/dispatcher';

// ─────────────────────────────────────────────
// INDUSTRIES
// ─────────────────────────────────────────────

export async function createIndustry(formData: FormData) {
  const supabase = await verifyAdminAndGetClient();

  const faqRaw = formData.get('faq') as string;
  const sectionsRaw = formData.get('sections') as string;

  const data = {
    name: formData.get('name') as string,
    slug: formData.get('slug') as string,
    description: formData.get('description') as string || null,
    short_description: formData.get('short_description') as string || null,
    image_url: formData.get('image_url') as string || null,
    icon: formData.get('icon') as string || null,
    meta_title: formData.get('meta_title') as string || null,
    meta_description: formData.get('meta_description') as string || null,
    keywords: formData.get('keywords') as string || null,
    og_image: formData.get('og_image') as string || null,
    faq: faqRaw ? JSON.parse(faqRaw) : null,
    sections: sectionsRaw ? JSON.parse(sectionsRaw) : null,
    published: formData.get('published') === 'on' || formData.get('published') === 'true',
    featured: formData.get('featured') === 'on' || formData.get('featured') === 'true',
    display_order: parseInt(formData.get('display_order') as string) || 0,
  };

  const { error } = await supabase.from('industries').insert([data]);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/industries');
  revalidatePath('/industries');
  redirect('/admin/industries');
}

export async function updateIndustry(id: string, formData: FormData) {
  const supabase = await verifyAdminAndGetClient();

  const faqRaw = formData.get('faq') as string;
  const sectionsRaw = formData.get('sections') as string;

  const data = {
    name: formData.get('name') as string,
    slug: formData.get('slug') as string,
    description: formData.get('description') as string || null,
    short_description: formData.get('short_description') as string || null,
    image_url: formData.get('image_url') as string || null,
    icon: formData.get('icon') as string || null,
    meta_title: formData.get('meta_title') as string || null,
    meta_description: formData.get('meta_description') as string || null,
    keywords: formData.get('keywords') as string || null,
    og_image: formData.get('og_image') as string || null,
    faq: faqRaw ? JSON.parse(faqRaw) : null,
    sections: sectionsRaw ? JSON.parse(sectionsRaw) : null,
    published: formData.get('published') === 'on' || formData.get('published') === 'true',
    featured: formData.get('featured') === 'on' || formData.get('featured') === 'true',
    display_order: parseInt(formData.get('display_order') as string) || 0,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from('industries').update(data).eq('id', id);
  if (error) throw new Error(error.message);

  dispatchWebhook('industry.updated', { id, ...data });

  revalidatePath('/admin/industries');
  revalidatePath('/industries');
  revalidatePath(`/industries/${data.slug}`);
  redirect('/admin/industries');
}

export async function deleteIndustry(id: string) {
  const supabase = await verifyAdminAndGetClient();
  const { error } = await supabase.from('industries').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/industries');
  revalidatePath('/industries');
}

// ─────────────────────────────────────────────
// SERVICE × INDUSTRY
// ─────────────────────────────────────────────

export async function assignServiceToIndustry(formData: FormData) {
  const supabase = await verifyAdminAndGetClient();

  const faqRaw = formData.get('faq') as string;

  const data = {
    service_id: formData.get('service_id') as string,
    industry_id: formData.get('industry_id') as string,
    custom_title: formData.get('custom_title') as string || null,
    custom_description: formData.get('custom_description') as string || null,
    custom_content: formData.get('custom_content') as string || null,
    meta_title: formData.get('meta_title') as string || null,
    meta_description: formData.get('meta_description') as string || null,
    faq: faqRaw ? JSON.parse(faqRaw) : null,
    published: formData.get('published') === 'on' || formData.get('published') === 'true',
  };

  const { error } = await supabase.from('service_industries').upsert([data], {
    onConflict: 'service_id,industry_id',
  });
  if (error) throw new Error(error.message);

  revalidatePath('/admin/industries');
}

export async function removeServiceFromIndustry(id: string) {
  const supabase = await verifyAdminAndGetClient();
  const { error } = await supabase.from('service_industries').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/industries');
}

// ─────────────────────────────────────────────
// WEBHOOKS
// ─────────────────────────────────────────────

export async function createWebhook(formData: FormData) {
  const supabase = await verifyAdminAndGetClient();

  const headersRaw = formData.get('headers') as string;
  const data = {
    name: formData.get('name') as string,
    url: formData.get('url') as string,
    event_type: formData.get('event_type') as string,
    headers: headersRaw ? JSON.parse(headersRaw) : null,
    active: formData.get('active') !== 'off',
  };

  const { error } = await supabase.from('webhooks').insert([data]);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/webhooks');
  redirect('/admin/webhooks');
}

export async function updateWebhook(id: string, formData: FormData) {
  const supabase = await verifyAdminAndGetClient();

  const headersRaw = formData.get('headers') as string;
  const data = {
    name: formData.get('name') as string,
    url: formData.get('url') as string,
    event_type: formData.get('event_type') as string,
    headers: headersRaw ? JSON.parse(headersRaw) : null,
    active: formData.get('active') !== 'off',
  };

  const { error } = await supabase.from('webhooks').update(data).eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/webhooks');
  redirect('/admin/webhooks');
}

export async function deleteWebhook(id: string) {
  const supabase = await verifyAdminAndGetClient();
  const { error } = await supabase.from('webhooks').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/webhooks');
}

// ─────────────────────────────────────────────
// MEDIA LIBRARY
// ─────────────────────────────────────────────

export async function createMediaEntry(formData: FormData) {
  const supabase = await verifyAdminAndGetClient();

  const tagsRaw = formData.get('tags') as string;
  const data = {
    filename: formData.get('filename') as string,
    url: formData.get('url') as string,
    source: formData.get('source') as string || 'upload',
    alt_text: formData.get('alt_text') as string || null,
    mime_type: formData.get('mime_type') as string || null,
    size_bytes: parseInt(formData.get('size_bytes') as string) || null,
    width: parseInt(formData.get('width') as string) || null,
    height: parseInt(formData.get('height') as string) || null,
    tags: tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : null,
  };

  const { error } = await supabase.from('media_library').insert([data]);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/media');
}

export async function deleteMediaEntry(id: string) {
  const supabase = await verifyAdminAndGetClient();
  const { error } = await supabase.from('media_library').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/media');
}
