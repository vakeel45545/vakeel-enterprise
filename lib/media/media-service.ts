import { createServiceRoleClient } from '@/lib/supabase/server';
import { MediaAsset, UploadOptions } from './types';
import { mediaProviderRegistry } from './registry';
import { processAiMetadataJob } from './ai-metadata';
import * as crypto from 'crypto';

export class MediaService {
  /**
   * Universal Upload Pipeline
   * Handles Hash Duplication Check -> Provider Upload -> Database Insert
   */
  async upload(buffer: Buffer, mimeType: string, filename: string, options?: UploadOptions): Promise<MediaAsset> {
    const supabase = createServiceRoleClient();
    
    // 1. Calculate Hash
    const fileHash = crypto.createHash('sha256').update(buffer).digest('hex');

    // 2. Duplicate Check
    const { data: existingAsset } = await supabase
      .from('media_library')
      .select('*')
      .eq('file_hash', fileHash)
      .limit(1)
      .maybeSingle();

    if (existingAsset) {
      console.log(`[MediaService] Duplicate asset detected. Returning existing asset: ${existingAsset.id}`);
      return this.mapToAsset(existingAsset);
    }

    // 3. Upload to Provider
    const provider = mediaProviderRegistry.getProvider();
    const uploadedData = await provider.upload(buffer, mimeType, filename, options);

    // 4. Insert into DB
    const insertData = {
      filename: filename,
      original_filename: uploadedData.originalFilename || filename,
      provider: uploadedData.provider,
      resource_type: uploadedData.resourceType || options?.resourceType || 'image',
      mime_type: uploadedData.mimeType || mimeType,
      size_bytes: uploadedData.sizeBytes,
      url: uploadedData.url,
      secure_url: uploadedData.secureUrl,
      delivery_url: uploadedData.deliveryUrl,
      folder: uploadedData.folder,
      version_number: 1,
      cloudinary_version: uploadedData.version,
      cloudinary_public_id: uploadedData.publicId,
      etag: uploadedData.etag,
      file_hash: fileHash,
      status: 'processing',
      origin: options?.source || 'manual_upload',
      tags: options?.tags || []
    };

    const { data: mediaRecord, error } = await supabase
      .from('media_library')
      .insert([insertData])
      .select()
      .single();

    if (error) {
      // Rollback upload
      if (uploadedData.publicId) await provider.delete(uploadedData.publicId);
      throw new Error(`Database insert failed: ${error.message}`);
    }

    // 5. Fire background job (don't await)
    processAiMetadataJob(mediaRecord.id, mediaRecord.secure_url || mediaRecord.url, mediaRecord.mime_type, buffer).catch(e => {
      console.error('[MediaService] Background job failed:', e);
    });

    return this.mapToAsset(mediaRecord);
  }

  /**
   * Generates a transformed URL for an asset based on a named variant
   */
  variant(asset: MediaAsset, variantName: string): string {
    const provider = mediaProviderRegistry.getProvider(asset.provider);
    return provider.transform(asset, variantName);
  }

  /**
   * Soft deletes an asset
   */
  async softDelete(id: string, userId?: string): Promise<boolean> {
    const supabase = createServiceRoleClient();
    const { error } = await supabase
      .from('media_library')
      .update({
        status: 'deleted',
        deleted_at: new Date().toISOString(),
        deleted_by: userId || null
      })
      .eq('id', id);

    return !error;
  }

  /**
   * Restores a soft-deleted asset
   */
  async restore(id: string): Promise<boolean> {
    const supabase = createServiceRoleClient();
    const { error } = await supabase
      .from('media_library')
      .update({
        status: 'ready',
        deleted_at: null,
        deleted_by: null
      })
      .eq('id', id);

    return !error;
  }

  /**
   * Universal search across AI metadata, filenames, and tags
   */
  async search(query: string, options?: { resourceType?: string; limit?: number }): Promise<MediaAsset[]> {
    const supabase = createServiceRoleClient();
    
    let dbQuery = supabase
      .from('media_library')
      .select('*')
      .neq('status', 'deleted');
      
    if (query) {
      dbQuery = dbQuery.or(`filename.ilike.%${query}%,tags.cs.{${query}},photographer.ilike.%${query}%,dominant_color.ilike.%${query}%,keywords.cs.{"${query}"},alt_text.ilike.%${query}%,caption.ilike.%${query}%`);
    }

    if (options?.resourceType) {
      dbQuery = dbQuery.eq('resource_type', options.resourceType);
    }

    dbQuery = dbQuery.order('created_at', { ascending: false }).limit(options?.limit || 20);

    const { data } = await dbQuery;
    if (!data) return [];
    
    return data.map(record => this.mapToAsset(record));
  }

  private mapToAsset(dbRecord: any): MediaAsset {
    return {
      id: dbRecord.id,
      filename: dbRecord.filename,
      originalFilename: dbRecord.original_filename,
      provider: dbRecord.provider,
      resourceType: dbRecord.resource_type,
      mimeType: dbRecord.mime_type,
      width: dbRecord.width,
      height: dbRecord.height,
      sizeBytes: dbRecord.size_bytes,
      url: dbRecord.url,
      secureUrl: dbRecord.secure_url,
      deliveryUrl: dbRecord.delivery_url,
      publicId: dbRecord.public_id || dbRecord.cloudinary_public_id,
      folder: dbRecord.folder,
      version: dbRecord.cloudinary_version,
      etag: dbRecord.etag,
      hash: dbRecord.file_hash,
      status: dbRecord.status,
      createdAt: dbRecord.created_at,
      updatedAt: dbRecord.updated_at
    };
  }
}

export const mediaService = new MediaService();
