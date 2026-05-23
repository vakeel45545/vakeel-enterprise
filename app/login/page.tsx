'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/admin');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center p-4 selection:bg-sage/30 selection:text-sage">
      <div className="w-full max-w-md bg-white rounded-[2rem] p-8 md:p-10 shadow-premium border border-charcoal/5 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sage/10 to-transparent rounded-bl-full pointer-events-none" />
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-charcoal text-white flex items-center justify-center mb-4 shadow-xl shadow-charcoal/20">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-display font-bold text-charcoal tracking-tight text-center">Vakeel OS</h1>
          <p className="text-charcoal/50 text-sm font-medium mt-1">Enterprise Admin Portal</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5 relative z-10">
          <div className="relative group">
            <input 
              type="email" 
              id="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="peer w-full bg-gray-50 border border-charcoal/[0.08] rounded-xl h-14 px-4 pt-4 outline-none focus:ring-2 focus:ring-sage/20 focus:border-sage/50 focus:bg-white transition-all text-charcoal font-semibold hover:border-charcoal/[0.15]" 
              placeholder=" " 
              required
            />
            <label htmlFor="email" className="absolute text-xs font-bold uppercase tracking-wider text-charcoal/40 left-4 top-4 transition-all peer-focus:-translate-y-2 peer-focus:text-[10px] peer-focus:text-sage peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:text-[10px]">
              Admin Email
            </label>
          </div>

          <div className="relative group">
            <input 
              type="password" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="peer w-full bg-gray-50 border border-charcoal/[0.08] rounded-xl h-14 px-4 pt-4 outline-none focus:ring-2 focus:ring-sage/20 focus:border-sage/50 focus:bg-white transition-all text-charcoal font-semibold hover:border-charcoal/[0.15]" 
              placeholder=" " 
              required
            />
            <label htmlFor="password" className="absolute text-xs font-bold uppercase tracking-wider text-charcoal/40 left-4 top-4 transition-all peer-focus:-translate-y-2 peer-focus:text-[10px] peer-focus:text-sage peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:text-[10px]">
              Password
            </label>
          </div>

          <Button 
            disabled={loading}
            className="w-full bg-charcoal hover:bg-sage text-white h-14 shadow-premium-hover mt-8 text-base rounded-xl transition-all duration-300 font-bold"
          >
            {loading ? 'Authenticating...' : 'Secure Login'}
          </Button>
        </form>
      </div>
    </div>
  );
}
