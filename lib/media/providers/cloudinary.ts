import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { IMediaProvider, MediaAsset, UploadOptions } from '../types';

export class CloudinaryProvider implements IMediaProvider {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true
    });
  }

  async upload(buffer: Buffer, mimeType: string, filename: string, options?: UploadOptions): Promise<Partial<MediaAsset>> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: options?.folder || process.env.CLOUDINARY_FOLDER || 'vaakil',
          upload_preset: options?.preset || process.env.CLOUDINARY_UPLOAD_PRESET,
          resource_type: options?.resourceType === 'video' ? 'video' : options?.resourceType === 'raw' ? 'raw' : 'image',
          tags: options?.tags,
          public_id: filename.split('.')[0] // remove ext
        },
        (error, result: UploadApiResponse | undefined) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('No result from Cloudinary'));

          resolve({
            provider: 'cloudinary',
            publicId: result.public_id,
            version: result.version.toString(),
            url: result.url,
            secureUrl: result.secure_url,
            deliveryUrl: result.secure_url,
            folder: result.folder,
            resourceType: result.resource_type,
            mimeType: result.format ? `${result.resource_type}/${result.format}` : mimeType,
            width: result.width,
            height: result.height,
            sizeBytes: result.bytes,
            etag: result.etag,
            originalFilename: result.original_filename
          });
        }
      );
      
      uploadStream.end(buffer);
    });
  }

  async delete(publicId: string): Promise<boolean> {
    if (!publicId) return false;
    try {
      await cloudinary.uploader.destroy(publicId);
      return true;
    } catch (e) {
      console.error('[CloudinaryProvider] Delete failed:', e);
      return false;
    }
  }

  transform(asset: MediaAsset, variant: string): string {
    if (!asset.publicId) return asset.secureUrl || asset.url;
    
    let transformations = '';
    
    switch (variant) {
      case 'hero':
        transformations = 'w_1600,q_auto,f_auto';
        break;
      case 'card':
        transformations = 'w_700,h_400,c_fill,q_auto,f_auto';
        break;
      case 'thumbnail':
        transformations = 'w_400,h_400,c_fill,q_auto,f_auto';
        break;
      case 'avatar':
        transformations = 'w_150,h_150,c_fill,g_face,r_max,q_auto,f_auto';
        break;
      case 'og':
      case 'twitter':
      case 'linkedin':
        transformations = 'w_1200,h_630,c_fill,q_auto,f_auto';
        break;
      case 'banner':
        transformations = 'w_1920,h_600,c_fill,q_auto,f_auto';
        break;
      case 'inline':
        transformations = 'w_800,q_auto,f_auto';
        break;
      default:
        transformations = 'q_auto,f_auto';
        break;
    }

    // Example Cloudinary URL format: 
    // https://res.cloudinary.com/<cloud_name>/image/upload/<transformations>/v<version>/<public_id>
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const resourceType = asset.resourceType || 'image';
    return `https://res.cloudinary.com/${cloudName}/${resourceType}/upload/${transformations}/v${asset.version || '1'}/${asset.publicId}`;
  }
}
