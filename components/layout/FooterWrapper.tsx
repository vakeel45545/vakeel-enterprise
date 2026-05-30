import { getFooterData } from '@/lib/api/services';
import Footer from './Footer';

/**
 * Server component wrapper for Footer.
 * Fetches footer sections, links, and site settings from Supabase.
 * Falls back gracefully if DB tables don't exist yet.
 */
export default async function FooterWrapper() {
  let footerData: { sections: any[]; settings: any } = { sections: [], settings: null };

  try {
    footerData = await getFooterData();
  } catch (e) {
    console.error('[FooterWrapper] Failed to fetch footer data:', e);
  }

  return <Footer footerData={footerData} />;
}
