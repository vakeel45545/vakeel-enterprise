import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { Mail, Phone } from 'lucide-react';
import { deleteLead } from '../actions';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { LeadStatusSelect } from '@/components/admin/LeadStatusSelect';

export default async function AdminLeadsPage() {
  const supabase = await createClient();
  
  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-charcoal tracking-tight">Leads Management</h1>
          <p className="text-gray-500 mt-1">Track and manage all incoming leads from your website.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-gray-200 text-gray-600">Export CSV</Button>
        </div>
      </div>

      <Card className="border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leads && leads.length > 0 ? (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-charcoal">{lead.name}</td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                          <Mail className="w-3 h-3" /> {lead.email}
                        </div>
                        {lead.phone && (
                          <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                            <Phone className="w-3 h-3" /> {lead.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {lead.service && (
                        <span className="px-3 py-1 bg-sage/10 text-sage text-xs font-bold rounded-full">{lead.service}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <LeadStatusSelect leadId={lead.id} currentStatus={lead.status || 'new'} />
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {lead.created_at ? lead.created_at.split('T')[0] : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" className="w-8 h-8 rounded-lg border-gray-200 text-gray-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <DeleteButton id={lead.id} deleteAction={deleteLead} itemName="this lead" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No leads yet. Leads will appear here when users submit forms on your website.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
