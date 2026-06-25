import { createServiceRoleClient } from '@/lib/supabase/server';
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';

export async function ensureBucketExists(bucketName: string = 'media') {
  const supabase = createServiceRoleClient();
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    if (error) throw error;
    
    const exists = buckets.some(b => b.name === bucketName);
    if (!exists) {
      console.log(`[Storage] Bucket '${bucketName}' not found. Attempting to create it...`);
      // Warning: User still needs to run SQL if RLS policies are needed, but this creates the bucket if role allows
      await supabase.storage.createBucket(bucketName, {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      });
    }
    return bucketName;
  } catch (error) {
    console.warn(`[Storage] Failed to check/create bucket '${bucketName}', falling back to 'public_uploads':`, error);
    return 'public_uploads';
  }
}

export async function uploadImage(buffer: Buffer, mimeType: string, filename?: string) {
  const supabase = createServiceRoleClient();
  const bucket = await ensureBucketExists('media');
  
  const ext = filename ? filename.split('.').pop() || 'webp' : 'webp';
  // Always use a UUID to prevent collisions
  const finalFilename = `${uuidv4()}.${ext}`;
  const filePath = `blogs/${finalFilename}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, buffer, {
      contentType: mimeType,
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    throw new Error(`Storage upload failed: ${error.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return {
    url: publicUrl,
    filename: finalFilename,
    size: buffer.length
  };
}

export async function deleteImage(url: string) {
  if (!url) return;
  const supabase = createServiceRoleClient();
  
  try {
    // Extract bucket and path from URL
    // e.g., https://.../storage/v1/object/public/media/blogs/123.jpg
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/public/');
    if (pathParts.length === 2) {
      const [bucket, ...rest] = pathParts[1].split('/');
      const filePath = rest.join('/');
      
      await supabase.storage.from(bucket).remove([filePath]);
    }
  } catch (error) {
    console.error('[Storage] Failed to delete image:', error);
  }
}
