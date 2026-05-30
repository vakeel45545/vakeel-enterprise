/**
 * ONE-TIME SCRIPT: Seed mega_menu_data into the navigation table.
 * Run with: node scripts/seed-navigation.mjs
 *
 * This reads NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
 * from .env.local automatically (via dotenv).
 *
 * NOTE: You need the service role key to bypass RLS if anon key is restricted.
 * Add SUPABASE_SERVICE_ROLE_KEY to .env.local if anon key doesn't work.
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// ── Read .env.local manually ───────────────────────────────────────────────
const envFile = readFileSync('.env.local', 'utf8');
const env = Object.fromEntries(
  envFile.split('\n')
    .filter(line => line && !line.startsWith('#'))
    .map(line => {
      const [key, ...rest] = line.split('=');
      return [key.trim(), rest.join('=').trim().replace(/^"|"$/g, '')];
    })
);

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
// Prefer service role key (bypasses RLS); fallback to anon
const SUPABASE_KEY = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Mega menu data (exact match to original MEGA_MENU_CONTENT) ─────────────
const NAVIGATION_MEGA_DATA = [
  {
    id: 'e0000000-0000-0000-0000-000000000001',
    title: 'Startup & Registration',
    type: 'mega',
    mega_menu_data: {
      description: 'Launch your company with zero errors and fast-tracked ROC approval.',
      icon: 'Building2',
      categories: [
        {
          title: 'Company Registration',
          links: [
            { name: 'Private Limited Company', href: '/services/private-limited-company' },
            { name: 'LLP Registration', href: '/services/llp-registration' },
            { name: 'One Person Company', href: '/services/opc-registration' },
            { name: 'Partnership Firm', href: '/services/partnership-firm' },
            { name: 'Sole Proprietorship', href: '/services/sole-proprietorship' },
          ],
        },
        {
          title: 'Startup Services',
          links: [
            { name: 'Startup India Registration', href: '/services/startup-india' },
            { name: 'DPIIT Recognition', href: '/services/dpiit-recognition' },
            { name: 'Pitch Deck Support', href: '/services/pitch-deck' },
            { name: 'Founder Agreements', href: '/services/founder-agreements' },
          ],
        },
        {
          title: 'International Business',
          links: [
            { name: 'US Company Registration', href: '/services/us-incorporation' },
            { name: 'Dubai Company Setup', href: '/services/dubai-setup' },
            { name: 'Singapore Incorporation', href: '/services/singapore-incorporation' },
          ],
        },
      ],
      featured: {
        title: 'Launch Your Startup Faster',
        desc: 'Incorporate + GST + Trademark in one discounted package.',
        tag: 'Best Value',
        href: '/bundles/startup',
        image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32d7?w=600&q=80&auto=format&fit=crop',
      },
    },
  },
  {
    id: 'e0000000-0000-0000-0000-000000000002',
    title: 'GST & Tax',
    type: 'mega',
    mega_menu_data: {
      description: 'Automated GST filing, ITR, and corporate tax compliance.',
      icon: 'Calculator',
      categories: [
        {
          title: 'GST Services',
          links: [
            { name: 'GST Registration', href: '/services/gst-registration' },
            { name: 'GST Filing', href: '/services/gst-filing' },
            { name: 'GST Cancellation', href: '/services/gst-cancellation' },
            { name: 'GST LUT Filing', href: '/services/lut-filing' },
            { name: 'GST Notices', href: '/services/gst-notices' },
          ],
        },
        {
          title: 'Income Tax',
          links: [
            { name: 'ITR Filing', href: '/services/itr-filing' },
            { name: 'TDS Filing', href: '/services/tds-filing' },
            { name: 'Tax Consultation', href: '/services/tax-consultation' },
            { name: 'Advance Tax', href: '/services/advance-tax' },
          ],
        },
        {
          title: 'Accounting & Compliance',
          links: [
            { name: 'Payroll', href: '/services/payroll' },
            { name: 'Bookkeeping', href: '/services/bookkeeping' },
            { name: 'Accounting Services', href: '/services/accounting' },
            { name: 'Audit Support', href: '/services/audit-support' },
          ],
        },
      ],
      featured: {
        title: 'AI GST Assistant',
        desc: 'Scan your expenses and automatically find tax-saving opportunities.',
        tag: 'Automated',
        href: '/ai/tax-optimizer',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80&auto=format&fit=crop',
      },
    },
  },
  {
    id: 'e0000000-0000-0000-0000-000000000003',
    title: 'IP & Trademark',
    type: 'mega',
    mega_menu_data: {
      description: 'Protect your brand identity with trademark and patent registrations.',
      icon: 'Scale',
      categories: [
        {
          title: 'Trademark Services',
          links: [
            { name: 'Trademark Registration', href: '/services/trademark-registration' },
            { name: 'Trademark Renewal', href: '/services/trademark-renewal' },
            { name: 'Objection Reply', href: '/services/trademark-objection' },
            { name: 'Trademark Monitoring', href: '/services/trademark-monitoring' },
          ],
        },
        {
          title: 'Intellectual Property',
          links: [
            { name: 'Patent Filing', href: '/services/patent' },
            { name: 'Copyright Registration', href: '/services/copyright' },
            { name: 'Design Registration', href: '/services/design-registration' },
          ],
        },
        {
          title: 'Legal Protection',
          links: [
            { name: 'IP Consultation', href: '/services/ip-consultation' },
            { name: 'Legal Notices', href: '/services/legal-notices' },
            { name: 'Brand Protection', href: '/services/brand-protection' },
          ],
        },
      ],
      featured: {
        title: 'Protect Your Brand Identity',
        desc: 'Secure your logos, brand names, and slogans legally across India and globally.',
        tag: 'Protection',
        href: '/services/trademark-registration',
        image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&q=80&auto=format&fit=crop',
      },
    },
  },
  {
    id: 'e0000000-0000-0000-0000-000000000004',
    title: 'Licenses',
    type: 'mega',
    mega_menu_data: {
      description: 'Get essential business licenses and government certifications.',
      icon: 'FileText',
      categories: [
        {
          title: 'Food & Trade Licenses',
          links: [
            { name: 'FSSAI License', href: '/services/fssai' },
            { name: 'Trade License', href: '/services/trade-license' },
            { name: 'Shop & Establishment', href: '/services/shop-establishment' },
          ],
        },
        {
          title: 'Government Registrations',
          links: [
            { name: 'MSME Registration', href: '/services/msme' },
            { name: 'IEC Code', href: '/services/iec-code' },
            { name: 'PF & ESI Registration', href: '/services/pf-esi' },
          ],
        },
        {
          title: 'Certifications',
          links: [
            { name: 'ISO Certification', href: '/services/iso' },
            { name: 'BIS Certification', href: '/services/bis' },
            { name: 'Startup Certifications', href: '/services/startup-certifications' },
          ],
        },
      ],
      featured: {
        title: 'Get Business Ready',
        desc: 'Stay fully compliant with essential trade licenses and registrations.',
        tag: 'Licenses',
        href: '/services/fssai',
        image: 'https://images.unsplash.com/photo-1618044733300-9472054094ee?w=600&q=80&auto=format&fit=crop',
      },
    },
  },
  {
    id: 'e0000000-0000-0000-0000-000000000005',
    title: 'Compliance',
    type: 'mega',
    mega_menu_data: {
      description: 'Stay bulletproof with our ongoing compliance tracking.',
      icon: 'CheckCircle2',
      categories: [
        {
          title: 'Annual Compliance',
          links: [
            { name: 'ROC Filing', href: '/services/roc-filing' },
            { name: 'Annual Returns', href: '/services/annual-returns' },
            { name: 'DIR-3 KYC', href: '/services/dir-3' },
            { name: 'Compliance Calendar', href: '/dashboard/compliance' },
          ],
        },
        {
          title: 'Secretarial Services',
          links: [
            { name: 'Board Resolutions', href: '/services/board-resolutions' },
            { name: 'Share Transfer', href: '/services/share-transfer' },
            { name: 'Legal Documentation', href: '/services/legal-docs' },
          ],
        },
        {
          title: 'Environmental Compliance',
          links: [
            { name: 'Pollution NOC', href: '/services/pollution-noc' },
            { name: 'Waste Management', href: '/services/waste-management' },
            { name: 'Environmental Clearance', href: '/services/environmental-clearance' },
          ],
        },
      ],
      featured: {
        title: 'AI Compliance Tracker',
        desc: 'Real-time compliance dashboard with automated alerts and reminders.',
        tag: 'Dashboard',
        href: '/dashboard/compliance',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80&auto=format&fit=crop',
      },
    },
  },
  {
    id: 'e0000000-0000-0000-0000-000000000006',
    title: 'AI Assistant',
    type: 'mega',
    mega_menu_data: {
      description: 'Futuristic tools to automate your legal workflows.',
      icon: 'Sparkles',
      categories: [
        {
          title: 'AI Tools',
          links: [
            { name: 'AI Legal Chatbot', href: '/ai/chat' },
            { name: 'AI GST Assistant', href: '/ai/gst' },
            { name: 'AI Document Analyzer', href: '/ai/document' },
            { name: 'AI Compliance Reminder', href: '/ai/reminders' },
          ],
        },
        {
          title: 'AI Automation',
          links: [
            { name: 'Smart Filing', href: '/ai/filing' },
            { name: 'Workflow Automation', href: '/ai/workflow' },
            { name: 'AI Notifications', href: '/ai/notifications' },
            { name: 'AI Summaries', href: '/ai/summaries' },
          ],
        },
        {
          title: 'Smart Systems',
          links: [
            { name: 'AI Recommendations', href: '/ai/recommendations' },
            { name: 'Legal Risk Analysis', href: '/ai/risk' },
            { name: 'Smart Tracking', href: '/ai/tracking' },
          ],
        },
      ],
      featured: {
        title: 'Meet Your AI Legal Co-Pilot',
        desc: "Upload contracts, ask questions, and automate your company's entire legal life.",
        tag: 'Vaakil AI 2.0',
        href: '/ai',
        image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=80&auto=format&fit=crop',
      },
    },
  },
  {
    id: 'e0000000-0000-0000-0000-000000000007',
    title: 'Resources & News',
    type: 'mega',
    mega_menu_data: {
      description: 'Guides, updates, and templates for modern teams.',
      icon: 'BookOpen',
      categories: [
        {
          title: 'Blogs',
          links: [
            { name: 'Startup Guides', href: '/blog/startups' },
            { name: 'GST Guides', href: '/blog/gst' },
            { name: 'Trademark Articles', href: '/blog/trademarks' },
            { name: 'Compliance News', href: '/blog/compliance' },
          ],
        },
        {
          title: 'News & Updates',
          links: [
            { name: 'Government Updates', href: '/news/gov' },
            { name: 'Taxation Changes', href: '/news/tax' },
            { name: 'Startup Policies', href: '/news/policies' },
            { name: 'Compliance Deadlines', href: '/news/deadlines' },
          ],
        },
        {
          title: 'Learning Center',
          links: [
            { name: 'Templates & Documents', href: '/resources/templates' },
            { name: 'Video Tutorials', href: '/resources/videos' },
            { name: 'Webinars', href: '/resources/webinars' },
            { name: 'Case Studies', href: '/case-studies' },
          ],
        },
      ],
      featured: {
        title: "The Founder's Legal Handbook",
        desc: 'Everything you need to know about scaling legally in India.',
        tag: 'Featured Guide',
        href: '/resources/handbook',
        image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&q=80&auto=format&fit=crop',
      },
    },
  },
  {
    id: 'e0000000-0000-0000-0000-000000000008',
    title: 'Company',
    type: 'mega',
    mega_menu_data: {
      description: 'About us, careers, and getting in touch.',
      icon: 'Briefcase',
      categories: [
        {
          title: 'Company',
          links: [
            { name: 'About Vakeel', href: '/about' },
            { name: 'Mission', href: '/mission' },
            { name: 'Leadership', href: '/leadership' },
            { name: 'Press & Media', href: '/press' },
          ],
        },
        {
          title: 'Careers',
          links: [
            { name: 'Open Roles', href: '/careers#openings' },
            { name: 'Engineering', href: '/careers/engineering' },
            { name: 'Legal Experts', href: '/careers/legal' },
            { name: 'Life at Vakeel', href: '/careers#culture' },
          ],
        },
        {
          title: 'Contact',
          links: [
            { name: 'Office Locations', href: '/contact#locations' },
            { name: 'Support Center', href: '/support' },
            { name: 'Consultation Booking', href: '/book' },
            { name: 'WhatsApp Support', href: '/whatsapp' },
          ],
        },
      ],
      featured: {
        title: 'Join the Legal-Tech Revolution',
        desc: 'We are hiring engineers, CA/CS, and designers to build the future.',
        tag: "We're Hiring",
        href: '/careers',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80&auto=format&fit=crop',
      },
    },
  },
];

// ── Run Updates ──────────────────────────────────────────────────────────────
async function seed() {
  console.log('🚀 Seeding mega_menu_data into navigation table...\n');

  for (const item of NAVIGATION_MEGA_DATA) {
    const { error } = await supabase
      .from('navigation')
      .update({
        type: item.type,
        mega_menu_data: item.mega_menu_data,
        visible: true,
      })
      .eq('id', item.id);

    if (error) {
      console.error(`❌ Failed to update "${item.title}":`, error.message);
    } else {
      console.log(`✅ Updated "${item.title}"`);
    }
  }

  // Verify
  console.log('\n📊 Verification:');
  const { data, error } = await supabase
    .from('navigation')
    .select('id, title, type, visible, mega_menu_data')
    .is('parent_id', null)
    .order('order', { ascending: true });

  if (error) {
    console.error('❌ Verification error:', error.message);
    return;
  }

  for (const row of data ?? []) {
    const status = row.mega_menu_data ? '✅ HAS DATA' : '❌ NULL';
    console.log(`  ${status} — [${row.type}] ${row.title}`);
  }

  console.log('\n✅ Done! Refresh your browser to see the mega menu.');
}

seed().catch(console.error);
