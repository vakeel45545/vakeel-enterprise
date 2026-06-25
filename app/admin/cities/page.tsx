import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit } from 'lucide-react';
import Link from 'next/link';
import { deleteCity } from '../actions';
import { DeleteButton } from '@/components/admin/DeleteButton';

export default async function AdminCitiesPage() {
  const supabase = await createClient();
  
  const { data: cities } = await supabase
    .from('cities')
    .select('*')
    .order('city_name', { ascending: true });

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-charcoal tracking-tight">Cities Management</h1>
          <p className="text-gray-500 mt-1">Manage supported cities for your service pages.</p>
        </div>
        <Link href="/admin/cities/new">
          <Button className="bg-sage hover:bg-emerald-700 text-white shadow-md">
            <Plus className="w-4 h-4 mr-2" /> Add City
          </Button>
        </Link>
      </div>

      <Card className="border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">City Name</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">State</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {cities && cities.length > 0 ? (
                cities.map((city) => (
                  <tr key={city.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-charcoal">{city.city_name}</td>
                    <td className="px-6 py-4 text-gray-500 font-mono text-xs">{city.slug}</td>
                    <td className="px-6 py-4 text-gray-500">{city.state}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button asChild variant="outline" size="icon" className="w-8 h-8 rounded-lg border-gray-200 text-gray-500 hover:text-amber hover:border-amber/30 hover:bg-amber/10">
                          <Link href={`/admin/cities/${city.id}/edit`}>
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                        <DeleteButton id={city.id} deleteAction={deleteCity} itemName={city.city_name} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    No cities found. Click &quot;Add City&quot; to get started.
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
