import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { SmoothScrolling } from '@/components/shared/SmoothScrolling';
import NavbarWrapper from '@/components/layout/NavbarWrapper';
import FooterWrapper from '@/components/layout/FooterWrapper';
import { OneSignalProvider } from '@/components/providers/OneSignalProvider';
import { getSiteSettings } from '@/lib/api/services';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-display',
});

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const companyName = settings?.company_name || 'Vakeel';

  return {
    title: {
      default: (settings as any)?.seo_default_title || 'Vakeel — AI-Powered Legal & Compliance OS for India',
      template: `%s | ${companyName}`,
    },
    description: (settings as any)?.seo_default_description || "Register your company, file GST, get trademarks, and manage compliance with Vakeel's AI-powered platform.",
    metadataBase: new URL(process.env.APP_URL || 'https://vakeel.com'),
    openGraph: {
      siteName: companyName,
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      site: '@vakeel',
      card: 'summary_large_image',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="font-sans bg-ivory text-charcoal antialiased" suppressHydrationWarning>
        <SmoothScrolling>
          <NavbarWrapper />
          <OneSignalProvider>
            {children}
          </OneSignalProvider>
          <FooterWrapper />
        </SmoothScrolling>
      </body>
    </html>
  );
}
