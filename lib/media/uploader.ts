import { mediaService } from './media-service';

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
  asset_type?: string; // 'image', 'video', 'document', 'archive', 'audio'
  folder?: string;
}

export async function uploadToMediaLibrary(params: UploadMediaParams) {
  let buffer: Buffer;
  let mimeType: string = 'application/octet-stream';
  
  // 1. Get the file buffer
  if (params.url) {
    const response = await fetch(params.url);
    if (!response.ok) throw new Error(`Failed to fetch media from URL: ${response.statusText}`);
    
    const arrayBuffer = await response.arrayBuffer();
    buffer = Buffer.from(arrayBuffer);
    mimeType = response.headers.get('content-type') || mimeType;
  } else if (params.file) {
    const arrayBuffer = await params.file.arrayBuffer();
    buffer = Buffer.from(arrayBuffer);
    mimeType = params.file.type || mimeType;
  } else {
    throw new Error('Must provide either url or file');
  }

  // 2. Delegate to Universal MediaService
  const asset = await mediaService.upload(
    buffer, 
    mimeType, 
    params.filename || 'upload.bin',
    {
      source: params.source,
      tags: params.tags,
      resourceType: params.asset_type || 'image',
      folder: params.folder
    }
  );

  return asset;
}
