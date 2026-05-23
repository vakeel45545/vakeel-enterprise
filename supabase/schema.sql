-- Supabase Schema for Enterprise SaaS Platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. services
CREATE TABLE public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    hero_title TEXT,
    short_description TEXT,
    content JSONB, -- Can store rich text HTML or structured JSON
    icon TEXT,
    image TEXT,
    meta_title TEXT,
    meta_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. cities
CREATE TABLE public.cities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city_name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    state TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. service_city_pages (dynamic combinations)
CREATE TABLE public.service_city_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
    city_id UUID REFERENCES public.cities(id) ON DELETE CASCADE,
    meta_title TEXT,
    meta_description TEXT,
    hero_title TEXT,
    hero_content TEXT,
    pricing JSONB,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(service_id, city_id)
);

-- 4. blogs
CREATE TABLE public.blogs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT,
    thumbnail TEXT,
    content TEXT,
    tags TEXT[],
    meta_title TEXT,
    meta_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. faqs
CREATE TABLE public.faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    service_slug TEXT REFERENCES public.services(slug) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6. testimonials
CREATE TABLE public.testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_name TEXT NOT NULL,
    company TEXT,
    review TEXT NOT NULL,
    image TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 7. leads
CREATE TABLE public.leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    service TEXT,
    message TEXT,
    status TEXT DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 8. navigation
CREATE TABLE public.navigation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT,
    parent_id UUID REFERENCES public.navigation(id) ON DELETE CASCADE,
    featured BOOLEAN DEFAULT false,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 9. site_settings (Single row table)
CREATE TABLE public.site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name TEXT,
    phone TEXT,
    email TEXT,
    logo TEXT,
    whatsapp TEXT,
    social_links JSONB,
    address TEXT,
    seo_defaults JSONB,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 10. admins
CREATE TABLE public.admins (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'admin',
    permissions JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Configure RLS (Row Level Security)
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_city_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Public read access policies for frontend content
CREATE POLICY "Public read access for services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Public read access for cities" ON public.cities FOR SELECT USING (true);
CREATE POLICY "Public read access for service_city_pages" ON public.service_city_pages FOR SELECT USING (true);
CREATE POLICY "Public read access for blogs" ON public.blogs FOR SELECT USING (true);
CREATE POLICY "Public read access for faqs" ON public.faqs FOR SELECT USING (true);
CREATE POLICY "Public read access for testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Public read access for navigation" ON public.navigation FOR SELECT USING (true);
CREATE POLICY "Public read access for site_settings" ON public.site_settings FOR SELECT USING (true);

-- Allow public to insert leads
CREATE POLICY "Public insert access for leads" ON public.leads FOR INSERT WITH CHECK (true);

-- Storage bucket for uploads (Assuming 'public_uploads' bucket)
-- Note: You will need to create a bucket named 'public_uploads' in your Supabase Storage dashboard manually.
