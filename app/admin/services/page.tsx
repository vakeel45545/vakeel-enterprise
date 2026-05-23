import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { deleteService } from '../actions';
import { DeleteButton } from '@/components/admin/DeleteButton';

export default async function AdminServicesPage() {
  const supabase = await createClient();
  
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-charcoal tracking-tight">Services Management</h1>
          <p className="text-gray-500 mt-1">Manage your legal and compliance service offerings.</p>
        </div>
        <Link href="/admin/services/new">
          <Button className="bg-sage hover:bg-emerald-700 text-white shadow-md">
            <Plus className="w-4 h-4 ml-2 mr-2" /> Add New Service
          </Button>
        </Link>
      </div>

      <Card className="border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Service Name</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Created Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {services && services.length > 0 ? (
                services.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-charcoal">{service.title}</td>
                    <td className="px-6 py-4 text-gray-500 font-mono text-xs bg-gray-50/50 rounded px-2 py-1 inline-block mt-3">{service.slug}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(service.created_at || '').toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/services/${service.slug}`} target="_blank">
                          <Button variant="outline" size="icon" className="w-8 h-8 rounded-lg border-gray-200 text-gray-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/services/${service.id}/edit`}>
                          <Button variant="outline" size="icon" className="w-8 h-8 rounded-lg border-gray-200 text-gray-500 hover:text-amber hover:border-amber/30 hover:bg-amber/10">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <DeleteButton id={service.id} deleteAction={deleteService} itemName={service.title} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    No services found. Click &quot;Add New Service&quot; to get started.
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
