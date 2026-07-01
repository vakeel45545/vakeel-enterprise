'use server';

import { verifyAdminAndGetClient } from '@/lib/supabase/admin';
import { uploadToMediaLibrary } from '@/lib/media/uploader';
import { mediaService } from '@/lib/media/media-service';
import { revalidatePath } from 'next/cache';
import { createServiceRoleClient } from '@/lib/supabase/server';

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
  const asset_type = formData.get('asset_type') as string;

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
      asset_type,
    });

    revalidatePath('/admin/media');
    return { success: true, media };
  } catch (error: any) {
    console.error('Media upload action failed:', error);
    return { success: false, error: error.message };
  }
}

export async function softDeleteMediaEntry(id: string) {
  const supabase = await verifyAdminAndGetClient();
  const { data: { user } } = await supabase.auth.getUser();
  const success = await mediaService.softDelete(id, user?.id);
  if (!success) throw new Error('Failed to soft delete media');
  revalidatePath('/admin/media');
}

export async function restoreMediaEntry(id: string) {
  await verifyAdminAndGetClient(); // enforce auth
  const success = await mediaService.restore(id);
  if (!success) throw new Error('Failed to restore media');
  revalidatePath('/admin/media');
}

export async function deleteMediaEntry(id: string) {
  // We keep this named deleteMediaEntry for the UI component backward compatibility,
  // but it actually soft deletes now.
  return softDeleteMediaEntry(id);
}

export async function mergeDuplicatesAction(primaryId: string, redundantIds: string[]) {
  const supabase = createServiceRoleClient();
  
  // 1. Get primary asset details
  const { data: primary } = await supabase.from('media_library').select('*').eq('id', primaryId).single();
  if (!primary) throw new Error('Primary asset not found');

  for (const redId of redundantIds) {
    // 2. Get redundant asset details
    const { data: redundant } = await supabase.from('media_library').select('*').eq('id', redId).single();
    if (!redundant) continue;

    // 3. Find usages
    const { data: usages } = await supabase.from('media_usage').select('*').eq('media_id', redId);
    
    if (usages && usages.length > 0) {
      for (const usage of usages) {
        // 4. Update the actual entity table (e.g., blogs.thumbnail)
        if (usage.entity_type && usage.field_name && usage.entity_id) {
          // We can dynamically update the table since field_name matches column name in most cases
          // E.g., 'blogs', 'thumbnail'
          // However, inline_content is an exception (embedded in HTML). We'll skip complex HTML replacements here
          // and focus on direct fields.
          if (usage.field_name !== 'inline_content') {
            await supabase
              .from(usage.entity_type)
              .update({ [usage.field_name]: primary.url })
              .eq('id', usage.entity_id);
          }
        }
        
        // 5. Re-point the usage record to the primary asset
        await supabase
          .from('media_usage')
          .update({ media_id: primaryId })
          .eq('id', usage.id);
      }
    }

    // 6. Soft delete the redundant asset (this cleans up provider storage too)
    await mediaService.softDelete(redId);
  }

  revalidatePath('/admin/media/duplicates');
  revalidatePath('/admin/media');
}
