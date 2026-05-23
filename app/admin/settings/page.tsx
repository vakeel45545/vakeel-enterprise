import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { updateSiteSettings } from '../actions';
import { SubmitButton } from '@/components/admin/SubmitButton';

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from('site_settings')
    .select('*')
    .limit(1)
    .single();

  if (!settings) {
    return <div className="p-8 text-center text-gray-500">Settings not initialized. Please run database seed.</div>;
  }

  const updateSettingsWithId = updateSiteSettings.bind(null, settings.id);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-charcoal tracking-tight">Site Settings</h1>
        <p className="text-gray-500 mt-1">Manage global website configuration. Changes apply across the entire site.</p>
      </div>

      <form action={updateSettingsWithId} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-100 bg-gray-50/50">
              <CardTitle className="text-lg font-display text-charcoal">Company Information</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="space-y-2">
                <label htmlFor="company_name" className="text-xs font-bold uppercase tracking-wider text-gray-500 block">Company Name</label>
                <Input id="company_name" name="company_name" defaultValue={settings.company_name || ''} className="bg-gray-50 border-gray-200" />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-gray-500 block">Phone Number</label>
                <Input id="phone" name="phone" defaultValue={settings.phone || ''} className="bg-gray-50 border-gray-200" />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-gray-500 block">Email Address</label>
                <Input id="email" name="email" type="email" defaultValue={settings.email || ''} className="bg-gray-50 border-gray-200" />
              </div>
              <div className="space-y-2">
                <label htmlFor="whatsapp" className="text-xs font-bold uppercase tracking-wider text-gray-500 block">WhatsApp Number</label>
                <Input id="whatsapp" name="whatsapp" defaultValue={settings.whatsapp || ''} className="bg-gray-50 border-gray-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-100 bg-gray-50/50">
              <CardTitle className="text-lg font-display text-charcoal">Address & Branding</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="space-y-2">
                <label htmlFor="logo" className="text-xs font-bold uppercase tracking-wider text-gray-500 block">Logo URL</label>
                <Input id="logo" name="logo" defaultValue={settings.logo || ''} className="bg-gray-50 border-gray-200" />
              </div>
              <div className="space-y-2">
                <label htmlFor="address" className="text-xs font-bold uppercase tracking-wider text-gray-500 block">Office Address</label>
                <Textarea id="address" name="address" defaultValue={settings.address || ''} rows={4} className="bg-gray-50 border-gray-200 resize-none" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <SubmitButton loadingText="Saving Changes...">Save Settings</SubmitButton>
        </div>
      </form>
    </div>
  );
}
