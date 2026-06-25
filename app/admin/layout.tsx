import Link from 'next/link';
import { Settings, FileText, MapPin, Users, HelpCircle, LayoutDashboard, LogOut, Navigation, Menu, Footprints, BookOpen, Activity, Building2, Webhook, Clock, ImageIcon, Zap } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let user = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data?.user;
  } catch (e) {
    console.error('[Admin] Auth check failed:', e);
  }

  if (!user) {
    redirect('/login');
  }

  const sidebarLinks = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Media Library', href: '/admin/media', icon: ImageIcon },
    { name: 'Industries', href: '/admin/industries', icon: Building2 },
    { name: 'Services', href: '/admin/services', icon: FileText },
    { name: 'Cities', href: '/admin/cities', icon: MapPin },
    { name: 'Blogs', href: '/admin/blogs', icon: FileText },
    { name: 'Pages', href: '/admin/pages', icon: BookOpen },
    { name: 'FAQs', href: '/admin/faqs', icon: HelpCircle },
    { name: 'Leads', href: '/admin/leads', icon: Users },
    { name: 'Navigation', href: '/admin/navigation', icon: Navigation },
    { name: 'Footer', href: '/admin/footer', icon: Footprints },
    { name: 'Webhooks', href: '/admin/webhooks', icon: Webhook },
    { name: 'Cron Jobs', href: '/admin/cron', icon: Clock },
    { name: 'Automation', href: '/admin/automation', icon: Zap },
    { name: 'System', href: '/admin/system', icon: Activity },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-charcoal text-white p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="font-display font-bold text-xl tracking-tight">Vakeel Admin</div>
        <button className="p-2"><Menu className="w-6 h-6" /></button>
      </div>

      {/* Sidebar */}
      <aside className="w-64 bg-charcoal text-white hidden md:flex flex-col h-screen sticky top-0 shadow-2xl">
        <div className="p-6 border-b border-white/10">
          <div className="font-display font-bold text-2xl tracking-tight text-white">
            Vakeel <span className="text-sage">OS</span>
          </div>
          <div className="text-xs text-white/50 mt-1 uppercase tracking-widest font-semibold">Enterprise Admin</div>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all font-medium group"
            >
              <link.icon className="w-5 h-5 text-white/50 group-hover:text-sage transition-colors" />
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-3 text-sm text-white/50">
            <div className="w-8 h-8 rounded-full bg-sage/20 flex items-center justify-center text-sage font-bold uppercase">
              {user.email?.charAt(0) || 'A'}
            </div>
            <div className="truncate flex-1 font-medium">{user.email}</div>
          </div>
          <form action="/auth/signout" method="post">
            <button className="w-full mt-2 flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-400 hover:bg-red-400/10 transition-colors font-medium text-sm">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen overflow-x-hidden">
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
