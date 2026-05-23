import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit } from 'lucide-react';
import Link from 'next/link';
import { deleteNavigation } from '../actions';
import { DeleteButton } from '@/components/admin/DeleteButton';

export default async function AdminNavigationPage() {
  const supabase = await createClient();
  
  const { data: navigation } = await supabase
    .from('navigation')
    .select('*')
    .order('order', { ascending: true });

  // Build tree structure
  const topLevel = navigation?.filter(n => !n.parent_id) || [];
  const children = navigation?.filter(n => n.parent_id) || [];

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-charcoal tracking-tight">Navigation Management</h1>
          <p className="text-gray-500 mt-1">Manage navbar items, mega menu structure, and footer links.</p>
        </div>
        <Link href="/admin/navigation/new">
          <Button className="bg-sage hover:bg-emerald-700 text-white shadow-md">
            <Plus className="w-4 h-4 mr-2" /> Add Nav Item
          </Button>
        </Link>
      </div>

      <Card className="border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Slug / URL</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Order</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {topLevel.map((item) => (
                <>
                  <tr key={item.id} className="bg-white hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-charcoal">{item.title}</td>
                    <td className="px-6 py-4 text-gray-500 font-mono text-xs">{item.slug}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-charcoal/5 text-charcoal text-xs font-bold rounded-full">
                        {item.featured ? 'Featured' : 'Standard'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{item.order}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/navigation/${item.id}/edit`}>
                          <Button variant="outline" size="icon" className="w-8 h-8 rounded-lg border-gray-200 text-gray-500 hover:text-amber hover:border-amber/30 hover:bg-amber/10">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <DeleteButton id={item.id} deleteAction={deleteNavigation} itemName={item.title} />
                      </div>
                    </td>
                  </tr>
                  {/* Children */}
                  {children.filter(c => c.parent_id === item.id).map((child) => (
                    <tr key={child.id} className="bg-gray-50/30 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3 pl-12 text-gray-600 text-sm">↳ {child.title}</td>
                      <td className="px-6 py-3 text-gray-400 font-mono text-xs">{child.slug}</td>
                      <td className="px-6 py-3">
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded-full">Child</span>
                      </td>
                      <td className="px-6 py-3 text-gray-400">{child.order}</td>
                      <td className="px-6 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/navigation/${child.id}/edit`}>
                            <Button variant="outline" size="icon" className="w-7 h-7 rounded-lg border-gray-200 text-gray-400 hover:text-amber hover:border-amber/30 hover:bg-amber/10">
                              <Edit className="w-3 h-3" />
                            </Button>
                          </Link>
                          <DeleteButton id={child.id} deleteAction={deleteNavigation} itemName={child.title} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
