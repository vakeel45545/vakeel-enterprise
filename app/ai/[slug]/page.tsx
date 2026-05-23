import { Star, ArrowRight, CheckCircle2, Sparkles, Bot, Zap, ShieldCheck, Activity, BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function AIPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const formattedTitle = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <main className="min-h-screen bg-ivory pb-20 selection:bg-sage/30 selection:text-sage">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden bg-charcoal text-white rounded-b-[3rem] noise-overlay shadow-2xl">
        <div className="absolute inset-0 z-0 opacity-90">
          <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-gradient-to-tr from-sage/20 to-emerald-800/20 rounded-full blur-[150px] pointer-events-none animate-pulse-glow mix-blend-screen" />
          <div className="absolute top-1/2 left-1/4 w-[800px] h-[800px] bg-amber/10 rounded-full blur-[120px] pointer-events-none animate-float-slow mix-blend-screen" />
          <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] bg-[size:64px_64px] pointer-events-none" />
        </div>

        <div className="container relative z-10 mx-auto px-4 max-w-[1440px]">
          <div className="flex flex-col lg:flex-row gap-16 xl:gap-24 items-center">
            <div className="w-full lg:w-1/2 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 mb-6 text-xs font-bold uppercase tracking-widest text-white shadow-premium backdrop-blur-2xl">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Vakeel AI 2.0
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-[84px] font-display font-bold mb-6 leading-[1.05] tracking-tight drop-shadow-sm">
                {formattedTitle} <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-sage via-emerald-400 to-sage animate-shimmer relative z-10 bg-[length:200%_auto] block mt-2">Powered by AI.</span>
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl text-white/70 mb-10 leading-relaxed text-balance font-medium">
                Experience the future of legal tech. Our {formattedTitle} uses advanced AI to automate compliance, analyze documents, and give you 24/7 expert insights.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-charcoal hover:bg-sage hover:text-white shadow-premium-hover transition-all transition-spring h-14 lg:h-16 px-8 lg:px-10 text-base lg:text-lg w-full sm:w-auto group rounded-xl font-bold">
                  Try {formattedTitle} Free <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
              
              <div className="mt-14 flex flex-wrap items-center gap-6 lg:gap-8 text-white/50 text-xs font-bold uppercase tracking-wider">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-sage" /> Bank-level parsing</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-sage" /> 0-turnaround time</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-sage" /> Hallucination-free</div>
              </div>
            </div>

            {/* AI Mockup visualization */}
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end animate-in fade-in slide-in-from-right-12 duration-1000 delay-300">
               <div className="bg-white/95 backdrop-blur-3xl border border-charcoal/10 rounded-[2rem] p-6 shadow-premium relative overflow-hidden w-full max-w-xl floating-card ring-1 ring-charcoal/5">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-sage via-emerald-500 to-sage bg-[length:200%_auto] animate-shimmer"></div>
                  
                  <div className="flex items-center justify-between p-3 border-b border-charcoal/5 mb-6 bg-ivory rounded-xl">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-amber text-amber border-none"></div>
                      <div className="w-3 h-3 rounded-full bg-sage border-none"></div>
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-charcoal/40 bg-charcoal/[0.04] px-3 py-1.5 rounded-md flex items-center gap-2">
                       <ShieldCheck className="w-3.5 h-3.5 text-sage" />
                       AI Processing Core
                    </div>
                  </div>
                  
                  <div className="space-y-6 px-2 pb-2">
                     <div className="bg-ivory border border-charcoal/5 rounded-[1.5rem] p-6 shadow-sm relative overflow-hidden group/mockup">
                       <div className="absolute -right-10 -top-10 w-48 h-48 bg-sage/10 rounded-full blur-3xl pointer-events-none group-hover/mockup:bg-sage/20 transition-colors duration-1000"></div>
                       
                       <div className="flex items-center gap-4 mb-8 relative z-10">
                         <div className="w-14 h-14 rounded-[1.25rem] bg-white shadow-sm border border-sage/15 flex items-center justify-center shadow-inner">
                           <BrainCircuit className="w-7 h-7 text-sage animate-pulse-glow" />
                         </div>
                         <div>
                           <div className="font-display font-bold text-charcoal text-xl mb-1">Neural Engine Active</div>
                           <div className="text-sm font-semibold text-charcoal/50 flex items-center gap-2">
                             Analyzing {slug} frameworks
                             <span className="flex h-1.5 w-1.5 relative">
                               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber opacity-75"></span>
                               <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber"></span>
                             </span>
                           </div>
                         </div>
                       </div>
                       
                       <div className="space-y-4 relative z-10">
                         <div className="h-3 bg-charcoal/[0.04] rounded-full overflow-hidden border border-charcoal/5 shadow-inner">
                           <div className="h-full bg-gradient-to-r from-sage to-emerald-500 rounded-full w-[85%] relative overflow-hidden shadow-glow">
                              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.6),transparent)] animate-shimmer w-full"></div>
                           </div>
                         </div>
                         <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-charcoal/50">
                           <span className="flex items-center gap-1.5"><Activity className="w-3 h-3 text-sage" /> Processing contexts...</span>
                           <span className="text-sage">85% Complete</span>
                         </div>
                       </div>
                       
                       <div className="mt-8 flex gap-3 relative z-10">
                         <div className="flex-1 h-14 bg-white border border-charcoal/5 rounded-xl flex items-center px-5 text-sm font-semibold text-charcoal/45 shadow-inner">
                           <span className="animate-pulse">Extracting compliance clauses...</span>
                         </div>
                         <Button size="icon" className="h-14 w-14 shrink-0 rounded-xl bg-charcoal hover:bg-sage shadow-premium-hover transition-colors group/btn">
                           <Zap className="w-5 h-5 text-white group-hover/btn:scale-110 transition-transform" />
                         </Button>
                       </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-32 md:py-40 section-connector-top">
        <div className="container mx-auto px-4 max-w-[1440px]">
          <div className="text-center max-w-3xl mx-auto mb-20 lg:mb-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h2 className="text-4xl md:text-5xl lg:text-[64px] font-display font-bold mb-6 tracking-tight text-charcoal leading-[1.08]">Redefining <br/><span className="text-sage italic pr-2">{formattedTitle}</span></h2>
            <p className="text-lg md:text-xl xl:text-2xl text-charcoal/65 leading-relaxed text-balance font-medium">
              We have trained our proprietary AI models on millions of legal documents and compliance frameworks specifically for the Indian jurisdiction.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-[1200px] mx-auto">
            {[
              { icon: Zap, title: "100x Faster", desc: "What used to take days now takes seconds. Immediate document generation and clause analysis." },
              { icon: ShieldCheck, title: "Zero Hallucinations", desc: "Grounded strictly in verified Indian legal literature, High Court rulings, and ROC guidelines." },
              { icon: Bot, title: "Always Learning", desc: "Automatically updates with every new government notification, tax slab, and compliance deadline." }
            ].map((feature, i) => (
              <div 
                key={i} 
                className="bg-white p-8 lg:p-10 rounded-[2rem] border border-charcoal/5 shadow-sm group hover:shadow-premium-hover transition-all duration-500 hover:-translate-y-2 animate-in fade-in slide-in-from-bottom-8 fill-mode-both relative overflow-hidden"
                style={{ animationDelay: `${200 + i * 150}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-sage/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-[1.25rem] bg-sage/10 flex items-center justify-center mb-6 lg:mb-8 text-sage group-hover:bg-sage group-hover:text-white group-hover:scale-110 group-hover:shadow-glow transition-all duration-500 transition-spring relative z-10 shadow-inner">
                  <feature.icon className="w-7 h-7 lg:w-8 lg:h-8" />
                </div>
                <h3 className="font-bold text-2xl lg:text-3xl text-charcoal mb-4 relative z-10">{feature.title}</h3>
                <p className="text-charcoal/60 leading-relaxed text-lg relative z-10 font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
