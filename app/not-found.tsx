import Link from 'next/link';
import { ArrowRight, Home, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-ivory flex items-center justify-center px-4 selection:bg-sage/30 selection:text-sage">
      <div className="text-center max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
        {/* Large 404 */}
        <div className="relative mb-12">
          <span className="text-[200px] md:text-[280px] font-display font-bold text-charcoal/[0.04] leading-none block select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-[2rem] bg-charcoal flex items-center justify-center shadow-premium">
              <Search className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-display font-bold text-charcoal mb-4 tracking-tight">
          Page Not Found
        </h1>
        <p className="text-xl text-charcoal/55 mb-12 leading-relaxed max-w-lg mx-auto text-balance font-medium">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let us help you find what you need.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/">
            <Button className="bg-charcoal text-white hover:bg-sage h-14 px-8 rounded-xl font-bold shadow-premium-hover transition-all group">
              <Home className="w-5 h-5 mr-2" /> Go Home
            </Button>
          </Link>
          <Link href="/blog">
            <Button variant="outline" className="border-charcoal/10 text-charcoal hover:bg-charcoal/5 h-14 px-8 rounded-xl font-bold transition-all group">
              Browse Articles <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
