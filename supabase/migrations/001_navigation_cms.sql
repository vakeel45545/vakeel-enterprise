-- Migration: 001_navigation_cms.sql
-- Extends navigation table with full CMS fields for dynamic mega menu

ALTER TABLE public.navigation
  ADD COLUMN IF NOT EXISTS url TEXT,
  ADD COLUMN IF NOT EXISTS visible BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'link',
  ADD COLUMN IF NOT EXISTS icon TEXT,
  ADD COLUMN IF NOT EXISTS mega_menu_data JSONB,
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS badge TEXT;

-- Populate url from slug for backward compat
UPDATE public.navigation SET url = slug WHERE url IS NULL AND slug IS NOT NULL;

-- Seed top-level navigation items for mega menu
-- Run this only if navigation table is empty
INSERT INTO public.navigation (title, url, slug, "order", visible, type, mega_menu_data)
SELECT * FROM (VALUES
  (
    'Startup & Registration',
    '/services/business-registration',
    'startup-registration',
    1, true, 'mega',
    '{
      "description": "Launch your company with zero errors and fast-tracked ROC approval.",
      "icon": "Building2",
      "categories": [
        {
          "title": "Company Registration",
          "links": [
            { "name": "Private Limited Company", "href": "/services/private-limited-company" },
            { "name": "LLP Registration", "href": "/services/llp-registration" },
            { "name": "One Person Company", "href": "/services/opc-registration" },
            { "name": "Partnership Firm", "href": "/services/partnership-firm" },
            { "name": "Sole Proprietorship", "href": "/services/sole-proprietorship" }
          ]
        },
        {
          "title": "Startup Services",
          "links": [
            { "name": "Startup India Registration", "href": "/services/startup-india" },
            { "name": "DPIIT Recognition", "href": "/services/dpiit-recognition" },
            { "name": "Founder Agreements", "href": "/services/founder-agreements" }
          ]
        },
        {
          "title": "International Business",
          "links": [
            { "name": "US Company Registration", "href": "/services/us-incorporation" },
            { "name": "Dubai Company Setup", "href": "/services/dubai-setup" },
            { "name": "Singapore Incorporation", "href": "/services/singapore-incorporation" }
          ]
        }
      ],
      "featured": {
        "title": "Launch Your Startup Faster",
        "desc": "Incorporate + GST + Trademark in one discounted package.",
        "tag": "Best Value",
        "href": "/services/private-limited-company",
        "image": "https://images.unsplash.com/photo-1556761175-5973dc0f32d7?w=600&q=80&auto=format&fit=crop"
      }
    }'::jsonb
  ),
  (
    'GST & Tax',
    '/services/gst-taxation',
    'gst-tax',
    2, true, 'mega',
    '{
      "description": "Automated GST filing, ITR, and corporate tax compliance.",
      "icon": "Calculator",
      "categories": [
        {
          "title": "GST Services",
          "links": [
            { "name": "GST Registration", "href": "/services/gst-registration" },
            { "name": "GST Filing", "href": "/services/gst-filing" },
            { "name": "GST Cancellation", "href": "/services/gst-cancellation" },
            { "name": "GST LUT Filing", "href": "/services/lut-filing" },
            { "name": "GST Notices", "href": "/services/gst-notices" }
          ]
        },
        {
          "title": "Income Tax",
          "links": [
            { "name": "ITR Filing", "href": "/services/itr-filing" },
            { "name": "TDS Filing", "href": "/services/tds-filing" },
            { "name": "Tax Consultation", "href": "/services/tax-consultation" },
            { "name": "Advance Tax", "href": "/services/advance-tax" }
          ]
        },
        {
          "title": "Accounting & Compliance",
          "links": [
            { "name": "Payroll", "href": "/services/payroll" },
            { "name": "Bookkeeping", "href": "/services/bookkeeping" },
            { "name": "Accounting Services", "href": "/services/accounting" }
          ]
        }
      ],
      "featured": {
        "title": "AI GST Assistant",
        "desc": "Scan your expenses and automatically find tax-saving opportunities.",
        "tag": "Automated",
        "href": "/services/gst-registration",
        "image": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80&auto=format&fit=crop"
      }
    }'::jsonb
  ),
  (
    'IP & Trademark',
    '/services/trademark-ip',
    'ip-trademark',
    3, true, 'mega',
    '{
      "description": "Protect your brand identity with trademark and patent registrations.",
      "icon": "Scale",
      "categories": [
        {
          "title": "Trademark Services",
          "links": [
            { "name": "Trademark Registration", "href": "/services/trademark-registration" },
            { "name": "Trademark Renewal", "href": "/services/trademark-renewal" },
            { "name": "Objection Reply", "href": "/services/trademark-objection" },
            { "name": "Trademark Monitoring", "href": "/services/trademark-monitoring" }
          ]
        },
        {
          "title": "Intellectual Property",
          "links": [
            { "name": "Patent Filing", "href": "/services/patent" },
            { "name": "Copyright Registration", "href": "/services/copyright" },
            { "name": "Design Registration", "href": "/services/design-registration" }
          ]
        }
      ],
      "featured": {
        "title": "Protect Your Brand Identity",
        "desc": "Secure your logos, brand names, and slogans legally across India and globally.",
        "tag": "Protection",
        "href": "/services/trademark-registration",
        "image": "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&q=80&auto=format&fit=crop"
      }
    }'::jsonb
  ),
  (
    'Compliance',
    '/services/compliance',
    'compliance',
    4, true, 'mega',
    '{
      "description": "Stay bulletproof with our ongoing compliance tracking.",
      "icon": "CheckCircle2",
      "categories": [
        {
          "title": "Annual Compliance",
          "links": [
            { "name": "ROC Filing", "href": "/services/roc-filing" },
            { "name": "Annual Returns", "href": "/services/annual-returns" },
            { "name": "DIR-3 KYC", "href": "/services/dir-3" }
          ]
        },
        {
          "title": "Licenses",
          "links": [
            { "name": "FSSAI License", "href": "/services/fssai" },
            { "name": "MSME Registration", "href": "/services/msme" },
            { "name": "IEC Code", "href": "/services/iec-code" },
            { "name": "ISO Certification", "href": "/services/iso" }
          ]
        }
      ],
      "featured": {
        "title": "AI Compliance Tracker",
        "desc": "Real-time compliance dashboard with automated alerts and reminders.",
        "tag": "Dashboard",
        "href": "/services/roc-filing",
        "image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80&auto=format&fit=crop"
      }
    }'::jsonb
  ),
  (
    'Resources',
    '/blog',
    'resources',
    5, true, 'mega',
    '{
      "description": "Guides, updates, and templates for modern teams.",
      "icon": "BookOpen",
      "categories": [
        {
          "title": "Blog Categories",
          "links": [
            { "name": "Startup Guides", "href": "/blog/category/startups" },
            { "name": "GST Guides", "href": "/blog/category/gst" },
            { "name": "Trademark Articles", "href": "/blog/category/trademarks" },
            { "name": "Compliance News", "href": "/blog/category/compliance" }
          ]
        },
        {
          "title": "Company",
          "links": [
            { "name": "About Us", "href": "/about" },
            { "name": "Contact", "href": "/contact" },
            { "name": "Careers", "href": "/careers" }
          ]
        }
      ],
      "featured": {
        "title": "Legal Knowledge Center",
        "desc": "Everything you need to know about scaling legally in India.",
        "tag": "Featured",
        "href": "/blog",
        "image": "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&q=80&auto=format&fit=crop"
      }
    }'::jsonb
  )
) AS nav(title, url, slug, "order", visible, type, mega_menu_data)
WHERE NOT EXISTS (SELECT 1 FROM public.navigation LIMIT 1);
