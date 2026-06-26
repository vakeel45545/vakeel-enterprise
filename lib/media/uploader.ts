import { createServiceRoleClient } from '@/lib/supabase/server';
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';

export interface UploadMediaParams {
  url?: string;           // Remote URL to fetch from (Unsplash/Pexels)
  file?: File | Blob;     // Or a direct file upload
  filename?: string;
  source: 'upload' | 'unsplash' | 'pexels' | 'ai_generated';
  alt_text?: string;
  tags?: string[];
  image_prompt?: string;
  credits?: string;
  license_url?: string;
  uploaded_by?: string;
}

export async function uploadToMediaLibrary(params: UploadMediaParams) {
  const supabase = createServiceRoleClient();
  let buffer: Buffer;
  let mimeType: string = 'image/jpeg';
  let sizeBytes = 0;
  
  const ext = params.filename ? params.filename.split('.').pop() || 'jpg' : 'jpg';
  const newFilename = `${uuidv4()}.${ext}`;
  const filePath = `images/${newFilename}`;

  // 1. Get the file buffer
  if (params.url) {
    // Trigger download from remote source
    // Note: Unsplash API requires hitting the download_location endpoint to track downloads.
    // For simplicity, we assume params.url is the actual image source or download endpoint.
    const response = await fetch(params.url);
    if (!response.ok) throw new Error(`Failed to fetch image from URL: ${response.statusText}`);
    
    const arrayBuffer = await response.arrayBuffer();
    buffer = Buffer.from(arrayBuffer);
    mimeType = response.headers.get('content-type') || 'image/jpeg';
    sizeBytes = buffer.length;
  } else if (params.file) {
    const arrayBuffer = await params.file.arrayBuffer();
    buffer = Buffer.from(arrayBuffer);
    mimeType = params.file.type || 'image/jpeg';
    sizeBytes = buffer.length;
  } else {
    throw new Error('Must provide either url or file');
  }

  const { uploadImage } = await import('./storage');
  
  // 3. Compute SHA-256 hash to prevent duplicates
  const crypto = await import('crypto');
  const fileHash = crypto.createHash('sha256').update(buffer).digest('hex');

  // Check if this file already exists in the database
  const { data: existingMedia } = await supabase
    .from('media_library')
    .select('*')
    .eq('file_hash', fileHash)
    .limit(1)
    .maybeSingle();

  if (existingMedia) {
    // If it exists, skip uploading and just return the existing record!
    return existingMedia;
  }

  // 4. Upload to storage
  const uploaded = await uploadImage(buffer, mimeType, newFilename);

  // 5. Create media_library record
  const mediaRecord = {
    filename: params.filename || uploaded.filename,
    url: uploaded.url,
    source: params.source,
    alt_text: params.alt_text || null,
    mime_type: mimeType,
    size_bytes: sizeBytes,
    width: null, // Would require image processing lib like sharp to determine
    height: null,
    tags: params.tags || [],
    uploaded_by: params.uploaded_by || null,
    image_prompt: params.image_prompt || null,
    credits: params.credits || null,
    license_url: params.license_url || null,
    file_hash: fileHash,
  };

  const { data: media, error: dbError } = await supabase
    .from('media_library')
    .insert([mediaRecord])
    .select()
    .single();

  if (dbError) {
    // Attempt rollback of storage
    const { deleteImage } = await import('./storage');
    await deleteImage(uploaded.url);
    throw new Error(`Failed to insert media record: ${dbError.message}`);
  }

  return media;
}
