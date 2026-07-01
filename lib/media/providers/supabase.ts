import { IMediaProvider, MediaAsset, UploadOptions } from '../types';
import { createServiceRoleClient } from '@/lib/supabase/server';
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';
import { ensureBucketExists, deleteImage as legacyDelete } from '../storage';

export class SupabaseProvider implements IMediaProvider {
  
  async upload(buffer: Buffer, mimeType: string, filename: string, options?: UploadOptions): Promise<Partial<MediaAsset>> {
    const supabase = createServiceRoleClient();
    const bucket = await ensureBucketExists('media');
    
    const ext = filename ? filename.split('.').pop() || 'webp' : 'webp';
    const finalFilename = `${uuidv4()}.${ext}`;
    const folder = options?.folder || 'vaakil/uploads';
    const filePath = `${folder}/${finalFilename}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType: mimeType,
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      throw new Error(`Supabase Storage upload failed: ${error.message}`);
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return {
      provider: 'supabase',
      publicId: filePath,
      url: publicUrl,
      secureUrl: publicUrl,
      deliveryUrl: publicUrl,
      folder: folder,
      resourceType: options?.resourceType || 'image',
      mimeType: mimeType,
      sizeBytes: buffer.length,
      originalFilename: filename
    };
  }

  async delete(publicIdOrUrl: string): Promise<boolean> {
    if (!publicIdOrUrl) return false;
    try {
      await legacyDelete(publicIdOrUrl);
      return true;
    } catch (e) {
      console.error('[SupabaseProvider] Delete failed:', e);
      return false;
    }
  }

  transform(asset: MediaAsset, variant: string): string {
    // Supabase Storage doesn't have on-the-fly transformations built-in by default
    // We just return the original URL
    return asset.secureUrl || asset.url;
  }
}
