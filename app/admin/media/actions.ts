'use server';

import { verifyAdminAndGetClient } from '@/lib/supabase/admin';
import { uploadToMediaLibrary } from '@/lib/media/uploader';
import { revalidatePath } from 'next/cache';

export async function uploadMediaAction(formData: FormData) {
  // Verify admin auth
  const supabase = await verifyAdminAndGetClient();
  const { data: { user } } = await supabase.auth.getUser();

  const source = formData.get('source') as 'upload' | 'unsplash' | 'pexels' | 'ai_generated' || 'upload';
  const url = formData.get('url') as string;
  const file = formData.get('file') as File;
  const alt_text = formData.get('alt_text') as string;
  const image_prompt = formData.get('image_prompt') as string;
  const credits = formData.get('credits') as string;
  const license_url = formData.get('license_url') as string;
  const tagsRaw = formData.get('tags') as string;
  const filename = formData.get('filename') as string;

  const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()) : [];

  try {
    const media = await uploadToMediaLibrary({
      url: url || undefined,
      file: file || undefined,
      filename: filename || (file ? file.name : undefined),
      source,
      alt_text,
      image_prompt,
      credits,
      license_url,
      tags,
      uploaded_by: user?.id,
    });

    revalidatePath('/admin/media');
    return { success: true, media };
  } catch (error: any) {
    console.error('Media upload action failed:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteMediaEntry(id: string) {
  const supabase = await verifyAdminAndGetClient();
  const { error } = await supabase.from('media_library').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/media');
}
