import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, MapPin, Eye, Settings } from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch basic stats with safe fallbacks
  let servicesCount = 0, leadsCount = 0, blogsCount = 0, citiesCount = 0;
  try {
    const results = await Promise.all([
      supabase.from('services').select('*', { count: 'exact', head: true }),
      supabase.from('leads').select('*', { count: 'exact', head: true }),
      supabase.from('blogs').select('*', { count: 'exact', head: true }),
      supabase.from('cities').select('*', { count: 'exact', head: true })
    ]);
    servicesCount = results[0].count || 0;
    leadsCount = results[1].count || 0;
    blogsCount = results[2].count || 0;
    citiesCount = results[3].count || 0;
  } catch (e) {
    console.error('[Admin] Failed to fetch stats:', e);
  }

  const stats = [
    { name: 'Total Services', value: servicesCount || 0, icon: FileText, href: '/admin/services', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'Active Leads', value: leadsCount || 0, icon: Users, href: '/admin/leads', color: 'text-sage', bg: 'bg-sage/10' },
    { name: 'Published Blogs', value: blogsCount || 0, icon: Eye, href: '/admin/blogs', color: 'text-amber', bg: 'bg-amber/10' },
    { name: 'Supported Cities', value: citiesCount || 0, icon: MapPin, href: '/admin/cities', color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-charcoal tracking-tight">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Welcome back to your Vakeel OS control center.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => (
          <Link key={stat.name} href={stat.href}>
            <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">{stat.name}</p>
                    <h3 className="text-3xl font-display font-bold text-charcoal">{stat.value}</h3>
                  </div>
                  <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Leads Widget */}
        <div className="lg:col-span-2">
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-100 bg-gray-50/50">
              <CardTitle className="text-lg font-display text-charcoal">Recent Leads</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-6 text-center text-gray-500 text-sm">
                Connect your database to view recent leads.
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-100 bg-gray-50/50">
              <CardTitle className="text-lg font-display text-charcoal">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <Link href="/admin/services/new" className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-sage hover:bg-sage/5 transition-colors text-sm font-medium text-charcoal">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600"><FileText className="w-4 h-4" /></div>
                Add New Service
              </Link>
              <Link href="/admin/blogs/new" className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-amber hover:bg-amber/5 transition-colors text-sm font-medium text-charcoal">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600"><Eye className="w-4 h-4" /></div>
                Publish Blog Post
              </Link>
              <Link href="/admin/settings" className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-blue-500 hover:bg-blue-50 transition-colors text-sm font-medium text-charcoal">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600"><Settings className="w-4 h-4" /></div>
                Update Site Settings
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
