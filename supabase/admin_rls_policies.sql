-- =============================================
-- Admin RLS Policies Migration
-- =============================================
-- This migration adds INSERT, UPDATE, DELETE policies
-- for authenticated admin users on all admin-managed tables.
--
-- HOW TO RUN:
-- 1. Go to your Supabase Dashboard
-- 2. Navigate to SQL Editor
-- 3. Paste this entire file and click "Run"
-- =============================================

-- Helper: Check if user is an admin
-- Used by all policies below
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admins WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- SERVICES
-- =============================================
CREATE POLICY "Admin insert access for services"
  ON public.services FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin update access for services"
  ON public.services FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin delete access for services"
  ON public.services FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- =============================================
-- CITIES
-- =============================================
CREATE POLICY "Admin insert access for cities"
  ON public.cities FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin update access for cities"
  ON public.cities FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin delete access for cities"
  ON public.cities FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- =============================================
-- SERVICE_CITY_PAGES
-- =============================================
CREATE POLICY "Admin insert access for service_city_pages"
  ON public.service_city_pages FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin update access for service_city_pages"
  ON public.service_city_pages FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin delete access for service_city_pages"
  ON public.service_city_pages FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- =============================================
-- BLOGS
-- =============================================
CREATE POLICY "Admin insert access for blogs"
  ON public.blogs FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin update access for blogs"
  ON public.blogs FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin delete access for blogs"
  ON public.blogs FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- =============================================
-- FAQS
-- =============================================
CREATE POLICY "Admin insert access for faqs"
  ON public.faqs FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin update access for faqs"
  ON public.faqs FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin delete access for faqs"
  ON public.faqs FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- =============================================
-- TESTIMONIALS
-- =============================================
CREATE POLICY "Admin insert access for testimonials"
  ON public.testimonials FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin update access for testimonials"
  ON public.testimonials FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin delete access for testimonials"
  ON public.testimonials FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- =============================================
-- LEADS
-- =============================================
-- Note: Public INSERT already exists for leads (contact form).
-- Only add admin UPDATE and DELETE.
CREATE POLICY "Admin update access for leads"
  ON public.leads FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin delete access for leads"
  ON public.leads FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- Admin also needs SELECT on leads (not public)
CREATE POLICY "Admin read access for leads"
  ON public.leads FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- =============================================
-- NAVIGATION
-- =============================================
CREATE POLICY "Admin insert access for navigation"
  ON public.navigation FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin update access for navigation"
  ON public.navigation FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin delete access for navigation"
  ON public.navigation FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- =============================================
-- SITE_SETTINGS
-- =============================================
CREATE POLICY "Admin update access for site_settings"
  ON public.site_settings FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =============================================
-- ADMINS TABLE
-- =============================================
-- Admins can read their own record
CREATE POLICY "Admins can read own record"
  ON public.admins FOR SELECT
  TO authenticated
  USING (id = auth.uid());
