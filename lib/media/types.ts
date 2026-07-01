export interface MediaAsset {
  id: string;
  filename: string;
  originalFilename: string;
  provider: string; // 'cloudinary', 'supabase', 'local'
  resourceType: string; // 'image', 'video', 'document', 'audio', 'archive'
  mimeType: string;
  width?: number | null;
  height?: number | null;
  duration?: number | null;
  sizeBytes: number;
  url: string;
  secureUrl?: string;
  deliveryUrl?: string;
  publicId?: string;
  folder?: string;
  version?: string;
  etag?: string;
  hash?: string;
  
  // Metadata
  altText?: string | null;
  caption?: string | null;
  title?: string | null;
  credits?: string | null;
  license?: string | null;
  photographer?: string | null;
  photographerUrl?: string | null;
  source?: string; // 'manual_upload', 'unsplash', 'pexels', 'ai_generated'
  tags?: string[];
  aiPrompt?: string | null;
  dominantColor?: string | null;
  
  // Lifecycle
  status?: string; // 'uploading', 'processing', 'ready', 'archived', 'deleted'
  createdAt: string;
  updatedAt: string;
}

export interface UploadOptions {
  folder?: string;
  preset?: string;
  tags?: string[];
  resourceType?: string;
  source?: string;
}

export interface IMediaProvider {
  /**
   * Uploads a buffer directly to the provider.
   */
  upload(buffer: Buffer, mimeType: string, filename: string, options?: UploadOptions): Promise<Partial<MediaAsset>>;
  
  /**
   * Deletes an asset from the provider.
   */
  delete(publicIdOrUrl: string): Promise<boolean>;

  /**
   * Transforms an existing asset URL (e.g. resizing).
   */
  transform(asset: MediaAsset, variant: string): string;
}
