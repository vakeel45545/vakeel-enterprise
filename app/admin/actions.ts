'use server';

import { verifyAdminAndGetClient } from '@/lib/supabase/admin';
import type { Database } from '@/lib/supabase/database.types';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// --- SERVICES ---
export async function createService(formData: FormData) {
  const supabase = await verifyAdminAndGetClient();

  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;

  const data: Database['public']['Tables']['services']['Insert'] = {
    title,
    slug,
    hero_title: formData.get('hero_title') as string || null,
    short_description: formData.get('short_description') as string || null,
    icon: formData.get('icon') as string || null,
    image: formData.get('image') as string || null,
    meta_title: formData.get('meta_title') as string || null,
    meta_description: formData.get('meta_description') as string || null,
  };

  const { error } = await supabase.from('services').insert([data]);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/services');
  redirect('/admin/services');
}

export async function updateService(id: string, formData: FormData) {
  const supabase = await verifyAdminAndGetClient();

  const data: Database['public']['Tables']['services']['Update'] = {
    title: formData.get('title') as string,
    slug: formData.get('slug') as string,
    hero_title: formData.get('hero_title') as string || null,
    short_description: formData.get('short_description') as string || null,
    icon: formData.get('icon') as string || null,
    image: formData.get('image') as string || null,
    meta_title: formData.get('meta_title') as string || null,
    meta_description: formData.get('meta_description') as string || null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from('services').update(data).eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/services');
  revalidatePath(`/services/${data.slug}`);
  redirect('/admin/services');
}

export async function deleteService(id: string) {
  const supabase = await verifyAdminAndGetClient();
  const { error } = await supabase.from('services').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/services');
}

// --- CITIES ---
export async function createCity(formData: FormData) {
  const supabase = await verifyAdminAndGetClient();

  const data: Database['public']['Tables']['cities']['Insert'] = {
    city_name: formData.get('city_name') as string,
    slug: formData.get('slug') as string,
    state: formData.get('state') as string || null,
  };

  const { error } = await supabase.from('cities').insert([data]);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/cities');
  redirect('/admin/cities');
}

export async function updateCity(id: string, formData: FormData) {
  const supabase = await verifyAdminAndGetClient();

  const data: Database['public']['Tables']['cities']['Update'] = {
    city_name: formData.get('city_name') as string,
    slug: formData.get('slug') as string,
    state: formData.get('state') as string || null,
  };

  const { error } = await supabase.from('cities').update(data).eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/cities');
  redirect('/admin/cities');
}

export async function deleteCity(id: string) {
  const supabase = await verifyAdminAndGetClient();
  const { error } = await supabase.from('cities').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/cities');
}

// --- BLOGS ---
export async function createBlog(formData: FormData) {
  const supabase = await verifyAdminAndGetClient();

  const data: Database['public']['Tables']['blogs']['Insert'] = {
    title: formData.get('title') as string,
    slug: formData.get('slug') as string,
    category: formData.get('category') as string || null,
    thumbnail: formData.get('thumbnail') as string || null,
    content: formData.get('content') as string || null,
    meta_title: formData.get('meta_title') as string || null,
    meta_description: formData.get('meta_description') as string || null,
  };

  const { error } = await supabase.from('blogs').insert([data]);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/blogs');
  redirect('/admin/blogs');
}

export async function updateBlog(id: string, formData: FormData) {
  const supabase = await verifyAdminAndGetClient();

  const data: Database['public']['Tables']['blogs']['Update'] = {
    title: formData.get('title') as string,
    slug: formData.get('slug') as string,
    category: formData.get('category') as string || null,
    thumbnail: formData.get('thumbnail') as string || null,
    content: formData.get('content') as string || null,
    meta_title: formData.get('meta_title') as string || null,
    meta_description: formData.get('meta_description') as string || null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from('blogs').update(data).eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/blogs');
  revalidatePath(`/blog/${data.slug}`);
  redirect('/admin/blogs');
}

export async function deleteBlog(id: string) {
  const supabase = await verifyAdminAndGetClient();
  const { error } = await supabase.from('blogs').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/blogs');
}

// --- FAQS ---
export async function createFaq(formData: FormData) {
  const supabase = await verifyAdminAndGetClient();

  const data: Database['public']['Tables']['faqs']['Insert'] = {
    question: formData.get('question') as string,
    answer: formData.get('answer') as string,
    service_slug: formData.get('service_slug') as string || null,
  };

  const { error } = await supabase.from('faqs').insert([data]);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/faqs');
  redirect('/admin/faqs');
}

export async function updateFaq(id: string, formData: FormData) {
  const supabase = await verifyAdminAndGetClient();

  const data: Database['public']['Tables']['faqs']['Update'] = {
    question: formData.get('question') as string,
    answer: formData.get('answer') as string,
    service_slug: formData.get('service_slug') as string || null,
  };

  const { error } = await supabase.from('faqs').update(data).eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/faqs');
  redirect('/admin/faqs');
}

export async function deleteFaq(id: string) {
  const supabase = await verifyAdminAndGetClient();
  const { error } = await supabase.from('faqs').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/faqs');
}

// --- LEADS ---
export async function updateLeadStatus(id: string, status: string) {
  const supabase = await verifyAdminAndGetClient();
  const data: Database['public']['Tables']['leads']['Update'] = { status };

  const { error } = await supabase.from('leads').update(data).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/leads');
}

export async function deleteLead(id: string) {
  const supabase = await verifyAdminAndGetClient();
  const { error } = await supabase.from('leads').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/leads');
}

// --- NAVIGATION ---
export async function createNavigation(formData: FormData) {
  const supabase = await verifyAdminAndGetClient();

  const parent_id = formData.get('parent_id') as string;
  const data: Database['public']['Tables']['navigation']['Insert'] = {
    title: formData.get('title') as string,
    slug: formData.get('slug') as string || null,
    parent_id: parent_id ? parent_id : null,
    featured: formData.get('featured') === 'on',
    order: parseInt(formData.get('order') as string) || 0,
  };

  const { error } = await supabase.from('navigation').insert([data]);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/navigation');
  revalidatePath('/');
  redirect('/admin/navigation');
}

export async function updateNavigation(id: string, formData: FormData) {
  const supabase = await verifyAdminAndGetClient();

  const parent_id = formData.get('parent_id') as string;
  const data: Database['public']['Tables']['navigation']['Update'] = {
    title: formData.get('title') as string,
    slug: formData.get('slug') as string || null,
    parent_id: parent_id ? parent_id : null,
    featured: formData.get('featured') === 'on',
    order: parseInt(formData.get('order') as string) || 0,
  };

  const { error } = await supabase.from('navigation').update(data).eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/navigation');
  revalidatePath('/');
  redirect('/admin/navigation');
}

export async function deleteNavigation(id: string) {
  const supabase = await verifyAdminAndGetClient();
  const { error } = await supabase.from('navigation').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/navigation');
  revalidatePath('/');
}

// --- SETTINGS ---
export async function updateSiteSettings(id: string, formData: FormData) {
  const supabase = await verifyAdminAndGetClient();

  const data: Database['public']['Tables']['site_settings']['Update'] = {
    company_name: formData.get('company_name') as string || null,
    phone: formData.get('phone') as string || null,
    email: formData.get('email') as string || null,
    address: formData.get('address') as string || null,
    whatsapp: formData.get('whatsapp') as string || null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from('site_settings').update(data).eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/settings');
  revalidatePath('/');
  redirect('/admin/settings');
}
