import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { AlertTriangle, CheckCircle2, Link2Off, FileX, RouteOff } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function SystemHealthPage() {
  const supabase = await createClient();

  // Run health checks
  const [navRes, pagesRes, servicesRes, blogsRes] = await Promise.all([
    supabase.from('navigation').select('*'),
    supabase.from('pages').select('id, slug, title'),
    supabase.from('services').select('id, slug, title'),
    supabase.from('blogs').select('id, slug, title'),
  ]);

  const navigation = navRes.data || [];
  const pages = pagesRes.data || [];
  const services = servicesRes.data || [];
  const blogs = blogsRes.data || [];

  // Build route index for fast lookup
  const allValidRoutes = new Set([
    '/', '/about', '/contact', '/blog', '/services', '/admin',
    ...pages.map(p => `/${p.slug}`),
    ...services.map(s => `/services/${s.slug}`),
    ...blogs.map(b => `/blog/${b.slug}`)
  ]);

  const issues: { type: string; severity: string; message: string; actionLink?: string }[] = [];

  // 1. Check for broken navigation links
  navigation.forEach(nav => {
    const targetUrl = nav.url || nav.slug;
    if (targetUrl && !targetUrl.startsWith('http') && !targetUrl.startsWith('#') && !allValidRoutes.has(targetUrl)) {
      // Check if it's a dynamic or complex route that might be valid but not in DB
      if (!['/careers', '/mission', '/support'].some(r => targetUrl.startsWith(r))) {
        issues.push({
          type: 'broken_link',
          severity: 'high',
          message: `Navigation item "${nav.title}" points to non-existent route: ${targetUrl}`,
          actionLink: `/admin/navigation/${nav.id}/edit`
        });
      }
    }
  });

  // 2. Check for duplicate slugs
  const allSlugs = [...pages.map(p => p.slug), ...services.map(s => `services/${s.slug}`), ...blogs.map(b => `blog/${b.slug}`)];
  const slugCounts = allSlugs.reduce((acc, slug) => {
    acc[slug] = (acc[slug] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  Object.entries(slugCounts).forEach(([slug, count]) => {
    if (count > 1) {
      issues.push({
        type: 'duplicate_slug',
        severity: 'critical',
        message: `Duplicate route detected: /${slug} is used ${count} times across different entities.`,
      });
    }
  });

  // 3. Check for empty mega menu data for 'mega' type menus
  navigation.forEach(nav => {
    if (nav.type === 'mega' && !nav.mega_menu_data) {
      issues.push({
        type: 'missing_data',
        severity: 'medium',
        message: `Mega menu "${nav.title}" is missing its JSON structure.`,
        actionLink: `/admin/navigation/${nav.id}/edit`
      });
    }
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-charcoal tracking-tight">System Health Check</h1>
          <p className="text-gray-500 mt-1">Real-time CMS integrity, routing validation, and SEO health.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="p-6 border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">CMS Entities</p>
            <p className="text-2xl font-bold text-charcoal">{pages.length + services.length + blogs.length}</p>
          </div>
        </Card>
        
        <Card className="p-6 border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <RouteOff className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Active Routes</p>
            <p className="text-2xl font-bold text-charcoal">{allValidRoutes.size}</p>
          </div>
        </Card>

        <Card className="p-6 border-gray-200 shadow-sm flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${issues.length > 0 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Active Issues</p>
            <p className="text-2xl font-bold text-charcoal">{issues.length}</p>
          </div>
        </Card>
      </div>

      <h2 className="text-xl font-display font-bold text-charcoal mb-6">Integrity Report</h2>
      
      {issues.length === 0 ? (
        <Card className="p-12 text-center border-gray-200 border-dashed bg-gray-50/50">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-charcoal mb-2">System is Healthy</h3>
          <p className="text-gray-500">No broken links, duplicate routes, or missing configurations detected.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {issues.map((issue, idx) => (
            <Card key={idx} className={`p-6 border-l-4 ${issue.severity === 'critical' ? 'border-rose-500 bg-rose-50/20' : issue.severity === 'high' ? 'border-amber-500 bg-amber-50/20' : 'border-blue-500 bg-blue-50/20'} flex items-start justify-between gap-4`}>
              <div className="flex items-start gap-4">
                {issue.type === 'broken_link' && <Link2Off className="w-6 h-6 text-amber-500 mt-1" />}
                {issue.type === 'duplicate_slug' && <RouteOff className="w-6 h-6 text-rose-500 mt-1" />}
                {issue.type === 'missing_data' && <FileX className="w-6 h-6 text-blue-500 mt-1" />}
                
                <div>
                  <h4 className="font-bold text-charcoal text-lg mb-1">{issue.type.replace('_', ' ').toUpperCase()}</h4>
                  <p className="text-gray-600">{issue.message}</p>
                </div>
              </div>
              {issue.actionLink && (
                <Link href={issue.actionLink}>
                  <Button variant="outline" size="sm">Fix Issue</Button>
                </Link>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
