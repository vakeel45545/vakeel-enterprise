import { IMediaProvider } from './types';
import { CloudinaryProvider } from './providers/cloudinary';
import { SupabaseProvider } from './providers/supabase';

class ProviderRegistry {
  private providers: Map<string, IMediaProvider> = new Map();

  constructor() {
    this.register('cloudinary', new CloudinaryProvider());
    this.register('supabase', new SupabaseProvider());
    // Future: this.register('s3', new S3Provider());
  }

  register(name: string, provider: IMediaProvider) {
    this.providers.set(name, provider);
  }

  getProvider(name?: string): IMediaProvider {
    const providerName = name || process.env.MEDIA_PROVIDER || 'cloudinary';
    const provider = this.providers.get(providerName);
    
    if (!provider) {
      console.warn(`Provider '${providerName}' not found, falling back to Supabase`);
      return this.providers.get('supabase')!;
    }
    
    return provider;
  }
}

export const mediaProviderRegistry = new ProviderRegistry();
