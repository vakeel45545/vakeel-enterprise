import { createClient } from '@/lib/supabase/server';
import { generateSeoMatrix } from './actions';
import { Button } from '@/components/ui/button';

export const metadata = { title: 'Programmatic SEO Builder | Vakeel Admin' };

export default async function ProgrammaticSeoPage() {
  const supabase = await createClient();

  // Fetch active services
  const { data: services } = await supabase
    .from('services')
    .select('id, title')
    .eq('published', true)
    .order('title');

  // Fetch active cities
  const { data: cities } = await supabase
    .from('cities')
    .select('id, name, state')
    .eq('is_active', true)
    .order('state')
    .order('name');

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-charcoal">Programmatic SEO Builder</h1>
        <p className="text-gray-500 mt-1">
          Generate mass hyper-local content matrices (e.g. GST Registration in Mumbai, Bangalore, Delhi) with one click.
        </p>
      </div>

      <form action={generateSeoMatrix} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        
        <div className="space-y-2">
          <label className="text-sm font-bold text-charcoal">Campaign Name</label>
          <input 
            required 
            type="text" 
            name="campaign_name" 
            className="w-full p-3 border border-gray-200 rounded-lg" 
            placeholder="e.g., GST Metro Cities Rollout" 
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-charcoal">Base Service</label>
          <select 
            required 
            name="service_id" 
            className="w-full p-3 border border-gray-200 rounded-lg bg-white"
          >
            <option value="">Select a service...</option>
            {services?.map(s => (
              <option key={s.id} value={s.id}>{s.title}</option>
            ))}
          </select>
          <p className="text-xs text-gray-500">The core service template that will be localized.</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-charcoal">Target Cities</label>
          <p className="text-xs text-gray-500 mb-2">Hold Ctrl/Cmd to select multiple cities.</p>
          <select 
            required 
            multiple 
            name="city_ids" 
            className="w-full p-3 border border-gray-200 rounded-lg bg-white h-64"
          >
            {cities?.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.state})
              </option>
            ))}
          </select>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <Button type="submit" className="bg-charcoal hover:bg-black text-white font-bold rounded-lg px-8 py-6">
            Generate Campaign Matrix
          </Button>
        </div>
        
      </form>
    </div>
  );
}
