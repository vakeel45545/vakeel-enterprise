'use server';

import { verifyAdminAndGetClient } from '@/lib/supabase/admin';
import type { Database } from '@/lib/supabase/database.types';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// ─────────────────────────────────────────────
// SERVICES
// ─────────────────────────────────────────────

export async function createService(formData: FormData) {
  const supabase = await verifyAdminAndGetClient();

  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;

  // Parse JSONB fields
  const faqRaw = formData.get('faq') as string;
  const benefitsRaw = formData.get('benefits') as string;
  const processStepsRaw = formData.get('process_steps') as string;
  const sectionsRaw = formData.get('sections') as string;

  const data: Database['public']['Tables']['services']['Insert'] = {
    title,
    slug,
    hero_title: formData.get('hero_title') as string || null,
    hero_description: formData.get('hero_description') as string || null,
    short_description: formData.get('short_description') as string || null,
    icon: formData.get('icon') as string || null,
    image: formData.get('image') as string || null,
    meta_title: formData.get('meta_title') as string || null,
    meta_description: formData.get('meta_description') as string || null,
    keywords: formData.get('keywords') as string || null,
    category: formData.get('category') as string || null,
    cta_title: formData.get('cta_title') as string || null,
    cta_description: formData.get('cta_description') as string || null,
    cta_button_text: formData.get('cta_button_text') as string || null,
    cta_button_url: formData.get('cta_button_url') as string || null,
    faq: faqRaw ? JSON.parse(faqRaw) : null,
    benefits: benefitsRaw ? JSON.parse(benefitsRaw) : null,
    process_steps: processStepsRaw ? JSON.parse(processStepsRaw) : null,
    sections: sectionsRaw ? JSON.parse(sectionsRaw) : null,
    published: formData.get('published') === 'on' || formData.get('published') === 'true',
    featured: formData.get('featured') === 'on' || formData.get('featured') === 'true',
  };

  const { error } = await supabase.from('services').insert([data]);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/services');
  redirect('/admin/services');
}

export async function updateService(id: string, formData: FormData) {
  const supabase = await verifyAdminAndGetClient();

  const faqRaw = formData.get('faq') as string;
  const benefitsRaw = formData.get('benefits') as string;
  const processStepsRaw = formData.get('process_steps') as string;
  const sectionsRaw = formData.get('sections') as string;

  const data: Database['public']['Tables']['services']['Update'] = {
    title: formData.get('title') as string,
    slug: formData.get('slug') as string,
    hero_title: formData.get('hero_title') as string || null,
    hero_description: formData.get('hero_description') as string || null,
    short_description: formData.get('short_description') as string || null,
    icon: formData.get('icon') as string || null,
    image: formData.get('image') as string || null,
    meta_title: formData.get('meta_title') as string || null,
    meta_description: formData.get('meta_description') as string || null,
    keywords: formData.get('keywords') as string || null,
    category: formData.get('category') as string || null,
    cta_title: formData.get('cta_title') as string || null,
    cta_description: formData.get('cta_description') as string || null,
    cta_button_text: formData.get('cta_button_text') as string || null,
    cta_button_url: formData.get('cta_button_url') as string || null,
    faq: faqRaw ? JSON.parse(faqRaw) : null,
    benefits: benefitsRaw ? JSON.parse(benefitsRaw) : null,
    process_steps: processStepsRaw ? JSON.parse(processStepsRaw) : null,
    sections: sectionsRaw ? JSON.parse(sectionsRaw) : null,
    published: formData.get('published') === 'on' || formData.get('published') === 'true',
    featured: formData.get('featured') === 'on' || formData.get('featured') === 'true',
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

// ─────────────────────────────────────────────
// CITIES
// ─────────────────────────────────────────────

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

// ─────────────────────────────────────────────
// BLOGS
// ─────────────────────────────────────────────

export async function createBlog(formData: FormData) {
  const supabase = await verifyAdminAndGetClient();

  const tagsRaw = formData.get('tags') as string;
  const data: Database['public']['Tables']['blogs']['Insert'] = {
    title: formData.get('title') as string,
    slug: formData.get('slug') as string,
    category: formData.get('category') as string || null,
    thumbnail: formData.get('thumbnail') as string || null,
    og_image: formData.get('og_image') as string || null,
    content: formData.get('content') as string || null,
    meta_title: formData.get('meta_title') as string || null,
    meta_description: formData.get('meta_description') as string || null,
    author_id: formData.get('author_id') as string || null,
    tags: tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : null,
    reading_time: parseInt(formData.get('reading_time') as string) || null,
    published: formData.get('published') === 'on' || formData.get('published') === 'true',
    featured: formData.get('featured') === 'on' || formData.get('featured') === 'true',
  };

  const { error } = await supabase.from('blogs').insert([data]);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/blogs');
  revalidatePath('/blog');
  redirect('/admin/blogs');
}

export async function updateBlog(id: string, formData: FormData) {
  const supabase = await verifyAdminAndGetClient();

  const tagsRaw = formData.get('tags') as string;
  const data: Database['public']['Tables']['blogs']['Update'] = {
    title: formData.get('title') as string,
    slug: formData.get('slug') as string,
    category: formData.get('category') as string || null,
    thumbnail: formData.get('thumbnail') as string || null,
    og_image: formData.get('og_image') as string || null,
    content: formData.get('content') as string || null,
    meta_title: formData.get('meta_title') as string || null,
    meta_description: formData.get('meta_description') as string || null,
    author_id: formData.get('author_id') as string || null,
    tags: tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : null,
    reading_time: parseInt(formData.get('reading_time') as string) || null,
    published: formData.get('published') === 'on' || formData.get('published') === 'true',
    featured: formData.get('featured') === 'on' || formData.get('featured') === 'true',
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from('blogs').update(data).eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/blogs');
  revalidatePath('/blog');
  revalidatePath(`/blog/${data.slug}`);
  redirect('/admin/blogs');
}

export async function deleteBlog(id: string) {
  const supabase = await verifyAdminAndGetClient();
  const { error } = await supabase.from('blogs').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/blogs');
  revalidatePath('/blog');
}

// ─────────────────────────────────────────────
// FAQS
// ─────────────────────────────────────────────

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

// ─────────────────────────────────────────────
// LEADS
// ─────────────────────────────────────────────

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

// ─────────────────────────────────────────────
// NAVIGATION
// ─────────────────────────────────────────────

export async function createNavigation(formData: FormData) {
  const supabase = await verifyAdminAndGetClient();

  const parent_id = formData.get('parent_id') as string;
  const megaMenuDataRaw = formData.get('mega_menu_data') as string;

  const data: Database['public']['Tables']['navigation']['Insert'] = {
    title: formData.get('title') as string,
    slug: formData.get('slug') as string || null,
    url: formData.get('url') as string || null,
    parent_id: parent_id ? parent_id : null,
    featured: formData.get('featured') === 'on',
    visible: formData.get('visible') !== 'off',
    order: parseInt(formData.get('order') as string) || 0,
    type: formData.get('type') as string || 'link',
    icon: formData.get('icon') as string || null,
    description: formData.get('description') as string || null,
    badge: formData.get('badge') as string || null,
    mega_menu_data: megaMenuDataRaw ? JSON.parse(megaMenuDataRaw) : null,
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
  const megaMenuDataRaw = formData.get('mega_menu_data') as string;

  const data: Database['public']['Tables']['navigation']['Update'] = {
    title: formData.get('title') as string,
    slug: formData.get('slug') as string || null,
    url: formData.get('url') as string || null,
    parent_id: parent_id ? parent_id : null,
    featured: formData.get('featured') === 'on',
    visible: formData.get('visible') !== 'off',
    order: parseInt(formData.get('order') as string) || 0,
    type: formData.get('type') as string || 'link',
    icon: formData.get('icon') as string || null,
    description: formData.get('description') as string || null,
    badge: formData.get('badge') as string || null,
    mega_menu_data: megaMenuDataRaw ? JSON.parse(megaMenuDataRaw) : null,
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

// ─────────────────────────────────────────────
// FOOTER (CMS)
// ─────────────────────────────────────────────

export async function createFooterSection(formData: FormData) {
  const supabase = await verifyAdminAndGetClient();

  const data: Database['public']['Tables']['footer_sections']['Insert'] = {
    title: formData.get('title') as string,
    order: parseInt(formData.get('order') as string) || 0,
    visible: formData.get('visible') !== 'off',
  };

  const { error } = await supabase.from('footer_sections').insert([data]);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/footer');
  revalidatePath('/');
  redirect('/admin/footer');
}

export async function updateFooterSection(id: string, formData: FormData) {
  const supabase = await verifyAdminAndGetClient();

  const data: Database['public']['Tables']['footer_sections']['Update'] = {
    title: formData.get('title') as string,
    order: parseInt(formData.get('order') as string) || 0,
    visible: formData.get('visible') !== 'off',
  };

  const { error } = await supabase.from('footer_sections').update(data).eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/footer');
  revalidatePath('/');
  redirect('/admin/footer');
}

export async function deleteFooterSection(id: string) {
  const supabase = await verifyAdminAndGetClient();
  const { error } = await supabase.from('footer_sections').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/footer');
  revalidatePath('/');
}

export async function createFooterLink(formData: FormData) {
  const supabase = await verifyAdminAndGetClient();

  const data: Database['public']['Tables']['footer_links']['Insert'] = {
    section_id: formData.get('section_id') as string || null,
    title: formData.get('title') as string,
    url: formData.get('url') as string,
    order: parseInt(formData.get('order') as string) || 0,
    visible: formData.get('visible') !== 'off',
    icon: formData.get('icon') as string || null,
    open_new_tab: formData.get('open_new_tab') === 'on',
  };

  const { error } = await supabase.from('footer_links').insert([data]);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/footer');
  revalidatePath('/');
  redirect('/admin/footer');
}

export async function updateFooterLink(id: string, formData: FormData) {
  const supabase = await verifyAdminAndGetClient();

  const data: Database['public']['Tables']['footer_links']['Update'] = {
    section_id: formData.get('section_id') as string || null,
    title: formData.get('title') as string,
    url: formData.get('url') as string,
    order: parseInt(formData.get('order') as string) || 0,
    visible: formData.get('visible') !== 'off',
    icon: formData.get('icon') as string || null,
    open_new_tab: formData.get('open_new_tab') === 'on',
  };

  const { error } = await supabase.from('footer_links').update(data).eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/footer');
  revalidatePath('/');
  redirect('/admin/footer');
}

export async function deleteFooterLink(id: string) {
  const supabase = await verifyAdminAndGetClient();
  const { error } = await supabase.from('footer_links').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/footer');
  revalidatePath('/');
}

// ─────────────────────────────────────────────
// CMS PAGES (Universal Page System)
// ─────────────────────────────────────────────

export async function createPage(formData: FormData) {
  const supabase = await verifyAdminAndGetClient();

  const sectionsRaw = formData.get('sections') as string;
  const data: Database['public']['Tables']['pages']['Insert'] = {
    title: formData.get('title') as string,
    slug: formData.get('slug') as string,
    meta_title: formData.get('meta_title') as string || null,
    meta_description: formData.get('meta_description') as string || null,
    keywords: formData.get('keywords') as string || null,
    og_image: formData.get('og_image') as string || null,
    canonical_url: formData.get('canonical_url') as string || null,
    content: formData.get('content') as string || null,
    sections: sectionsRaw ? JSON.parse(sectionsRaw) : null,
    page_type: formData.get('page_type') as string || 'generic',
    published: formData.get('published') === 'on' || formData.get('published') === 'true',
  };

  const { error } = await supabase.from('pages').insert([data]);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/pages');
  revalidatePath(`/${data.slug}`);
  redirect('/admin/pages');
}

export async function updatePage(id: string, formData: FormData) {
  const supabase = await verifyAdminAndGetClient();

  const sectionsRaw = formData.get('sections') as string;
  const data: Database['public']['Tables']['pages']['Update'] = {
    title: formData.get('title') as string,
    slug: formData.get('slug') as string,
    meta_title: formData.get('meta_title') as string || null,
    meta_description: formData.get('meta_description') as string || null,
    keywords: formData.get('keywords') as string || null,
    og_image: formData.get('og_image') as string || null,
    canonical_url: formData.get('canonical_url') as string || null,
    content: formData.get('content') as string || null,
    sections: sectionsRaw ? JSON.parse(sectionsRaw) : null,
    page_type: formData.get('page_type') as string || 'generic',
    published: formData.get('published') === 'on' || formData.get('published') === 'true',
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from('pages').update(data).eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/pages');
  revalidatePath(`/${data.slug}`);
  redirect('/admin/pages');
}

export async function deletePage(id: string) {
  const supabase = await verifyAdminAndGetClient();
  const { error } = await supabase.from('pages').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/pages');
}

// ─────────────────────────────────────────────
// SETTINGS
// ─────────────────────────────────────────────

export async function updateSiteSettings(id: string, formData: FormData) {
  const supabase = await verifyAdminAndGetClient();

  const footerBadgesRaw = formData.get('footer_badges') as string;

  const data: Database['public']['Tables']['site_settings']['Update'] = {
    company_name: formData.get('company_name') as string || null,
    phone: formData.get('phone') as string || null,
    email: formData.get('email') as string || null,
    address: formData.get('address') as string || null,
    whatsapp: formData.get('whatsapp') as string || null,
    footer_tagline: formData.get('footer_tagline') as string || null,
    footer_cta_title: formData.get('footer_cta_title') as string || null,
    footer_cta_description: formData.get('footer_cta_description') as string || null,
    footer_cta_button_text: formData.get('footer_cta_button_text') as string || null,
    footer_cta_button_url: formData.get('footer_cta_button_url') as string || null,
    copyright_text: formData.get('copyright_text') as string || null,
    footer_badges: footerBadgesRaw ? JSON.parse(footerBadgesRaw) : null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from('site_settings').update(data).eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/settings');
  revalidatePath('/');
  redirect('/admin/settings');
}


// ─────────────────────────────────────────────
// ADD THESE TO YOUR EXISTING app/admin/actions.ts
// ─────────────────────────────────────────────
// Copy everything below and paste at the bottom of your actions.ts file

export async function upsertPageSection(formData: FormData) {
  const supabase = await verifyAdminAndGetClient();

  const id = formData.get('id') as string;
  const page_id = formData.get('page_id') as string;
  const section_key = formData.get('section_key') as string;
  const contentRaw = formData.get('content') as string;

  const payload = {
    page_id,
    section_key,
    title: formData.get('title') as string || null,
    subtitle: formData.get('subtitle') as string || null,
    content: contentRaw ? JSON.parse(contentRaw) : {},
    order_index: parseInt(formData.get('order_index') as string) || 0,
    visible: formData.get('visible') !== 'false',
    updated_at: new Date().toISOString(),
  };

  if (id) {
    const { error } = await supabase.from('page_sections').update(payload).eq('id', id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from('page_sections').insert([payload]);
    if (error) throw new Error(error.message);
  }

  revalidatePath('/admin/pages');
  revalidatePath('/');
}

export async function deletePageSection(id: string) {
  const supabase = await verifyAdminAndGetClient();
  const { error } = await supabase.from('page_sections').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/pages');
  revalidatePath('/');
}

export async function reorderPageSections(sections: { id: string; order_index: number }[]) {
  const supabase = await verifyAdminAndGetClient();
  await Promise.all(
    sections.map(({ id, order_index }) =>
      supabase.from('page_sections').update({ order_index }).eq('id', id)
    )
  );
  revalidatePath('/admin/pages');
  revalidatePath('/');
}