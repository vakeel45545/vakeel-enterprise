// import { Fragment } from 'react';
// import { createClient } from '@/lib/supabase/server';
// import { Card } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Plus, Edit } from 'lucide-react';
// import Link from 'next/link';
// import { deleteNavigation } from '../actions';
// import { DeleteButton } from '@/components/admin/DeleteButton';

// export default async function AdminNavigationPage() {
//   const supabase = await createClient();

//   const { data: navigation } = await supabase
//     .from('navigation')
//     .select('*')
//     .order('order', { ascending: true });

//   // Build tree structure
//   const topLevel = navigation?.filter(n => !n.parent_id) || [];
//   const children = navigation?.filter(n => n.parent_id) || [];

//   return (
//     <div>
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
//         <div>
//           <h1 className="text-3xl font-display font-bold text-charcoal tracking-tight">Navigation Management</h1>
//           <p className="text-gray-500 mt-1">Manage navbar items, mega menu structure, and footer links.</p>
//         </div>
//         <Link href="/admin/navigation/new">
//           <Button className="bg-sage hover:bg-emerald-700 text-white shadow-md">
//             <Plus className="w-4 h-4 mr-2" /> Add Nav Item
//           </Button>
//         </Link>
//       </div>

//       <Card className="border-gray-200 shadow-sm overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm text-left">
//             <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold border-b border-gray-100">
//               <tr>
//                 <th className="px-6 py-4">Title</th>
//                 <th className="px-6 py-4">Slug / URL</th>
//                 <th className="px-6 py-4">Type</th>
//                 <th className="px-6 py-4">Order</th>
//                 <th className="px-6 py-4 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {topLevel.map((item) => (
//                 <Fragment key={item.id}>
//                   <tr className="bg-white hover:bg-gray-50/50 transition-colors">
//                     <td className="px-6 py-4 font-bold text-charcoal">{item.title}</td>
//                     <td className="px-6 py-4 text-gray-500 font-mono text-xs">{item.slug}</td>
//                     <td className="px-6 py-4">
//                       <span className="px-3 py-1 bg-charcoal/5 text-charcoal text-xs font-bold rounded-full">
//                         {item.featured ? 'Featured' : 'Standard'}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 text-gray-500">{item.order}</td>
//                     <td className="px-6 py-4 text-right">
//                       <div className="flex justify-end gap-2">
//                         <Link href={`/admin/navigation/${item.id}/edit`}>
//                           <Button variant="outline" size="icon" className="w-8 h-8 rounded-lg border-gray-200 text-gray-500 hover:text-amber hover:border-amber/30 hover:bg-amber/10">
//                             <Edit className="w-4 h-4" />
//                           </Button>
//                         </Link>
//                         <DeleteButton id={item.id} deleteAction={deleteNavigation} itemName={item.title} />
//                       </div>
//                     </td>
//                   </tr>
//                   {/* Children */}
//                   {children.filter(c => c.parent_id === item.id).map((child) => (
//                     <tr key={child.id} className="bg-gray-50/30 hover:bg-gray-50 transition-colors">
//                       <td className="px-6 py-3 pl-12 text-gray-600 text-sm">↳ {child.title}</td>
//                       <td className="px-6 py-3 text-gray-400 font-mono text-xs">{child.slug}</td>
//                       <td className="px-6 py-3">
//                         <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded-full">Child</span>
//                       </td>
//                       <td className="px-6 py-3 text-gray-400">{child.order}</td>
//                       <td className="px-6 py-3 text-right">
//                         <div className="flex justify-end gap-2">
//                           <Link href={`/admin/navigation/${child.id}/edit`}>
//                             <Button variant="outline" size="icon" className="w-7 h-7 rounded-lg border-gray-200 text-gray-400 hover:text-amber hover:border-amber/30 hover:bg-amber/10">
//                               <Edit className="w-3 h-3" />
//                             </Button>
//                           </Link>
//                           <DeleteButton id={child.id} deleteAction={deleteNavigation} itemName={child.title} />
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </Fragment>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </Card>
//     </div>
//   );
// }

import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { deleteNavigation } from '@/app/admin/actions';
import { Plus, Pencil, Trash2, Eye, EyeOff, GripVertical, Layers } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function NavigationAdminPage() {
  const supabase = await createClient();
  const { data: items, error } = await supabase
    .from('navigation')
    .select('*')
    .order('order', { ascending: true });

  if (error) {
    return (
      <div className="p-8 text-red-600 font-medium">
        Failed to load navigation: {error.message}
      </div>
    );
  }

  const rootItems = (items ?? []).filter((i) => !i.parent_id);
  const childMap = new Map<string, typeof items>();
  (items ?? []).forEach((i) => {
    if (i.parent_id) {
      const arr = childMap.get(i.parent_id) ?? [];
      arr.push(i);
      childMap.set(i.parent_id, arr);
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Navigation</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage navbar items, mega menus, categories, links, and featured cards.
            </p>
          </div>
          <Link
            href="/admin/navigation/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Nav Item
          </Link>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Items', value: items?.length ?? 0 },
            { label: 'Mega Menus', value: items?.filter(i => i.type === 'mega').length ?? 0 },
            { label: 'Visible', value: items?.filter(i => i.visible).length ?? 0 },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-gray-200 rounded-xl px-5 py-4">
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Nav items list */}
        {rootItems.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-16 text-center">
            <Layers className="w-10 h-10 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium mb-2">No navigation items yet</p>
            <p className="text-sm text-gray-400 mb-6">Add your first navbar item to get started.</p>
            <Link
              href="/admin/navigation/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Nav Item
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {rootItems.map((item) => {
              const children = childMap.get(item.id) ?? [];
              const hasMega = item.type === 'mega' && item.mega_menu_data;
              const megaData = hasMega ? item.mega_menu_data as any : null;
              const categoryCount = megaData?.categories?.length ?? 0;
              const linkCount = megaData?.categories?.reduce(
                (acc: number, cat: any) => acc + (cat.links?.length ?? 0), 0
              ) ?? 0;

              return (
                <div key={item.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                  {/* Main item row */}
                  <div className="flex items-center gap-4 px-5 py-4">
                    <GripVertical className="w-4 h-4 text-gray-300 shrink-0" />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-900 text-sm">{item.title}</span>
                        {item.badge && (
                          <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide bg-emerald-100 text-emerald-700 rounded-full">
                            {item.badge}
                          </span>
                        )}
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-full ${item.type === 'mega'
                          ? 'bg-purple-100 text-purple-700'
                          : item.type === 'dropdown'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-600'
                          }`}>
                          {item.type}
                        </span>
                        {!item.visible && (
                          <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide bg-red-100 text-red-600 rounded-full">
                            hidden
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                        <span>Order: {item.order}</span>
                        {(item.slug || item.url) && (
                          <span className="truncate max-w-[200px]">{item.slug || item.url}</span>
                        )}
                        {hasMega && (
                          <span className="text-purple-500">
                            {categoryCount} {categoryCount === 1 ? 'category' : 'categories'} · {linkCount} links
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-gray-300 mr-1">
                        {item.visible ? (
                          <Eye className="w-4 h-4 text-gray-400" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-gray-300" />
                        )}
                      </span>
                      <Link
                        href={`/admin/navigation/${item.id}/edit`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <Pencil className="w-3 h-3" /> Edit
                      </Link>
                      <form
                        action={async () => {
                          'use server';
                          await deleteNavigation(item.id);
                        }}
                      >
                        <button
                          type="submit"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3 h-3" /> Delete
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Mega menu preview */}
                  {hasMega && megaData?.categories?.length > 0 && (
                    <div className="border-t border-gray-100 bg-gray-50 px-5 py-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                        Mega Menu Categories
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {megaData.categories.map((cat: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-2.5 py-1.5">
                            <span className="text-xs font-semibold text-gray-700">{cat.title}</span>
                            <span className="text-[10px] text-gray-400">({cat.links?.length ?? 0} links)</span>
                          </div>
                        ))}
                        {megaData.featured && (
                          <div className="flex items-center gap-1.5 bg-gray-900 text-white rounded-lg px-2.5 py-1.5">
                            <span className="text-xs font-semibold">Featured: {megaData.featured.title}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Children */}
                  {children.length > 0 && (
                    <div className="border-t border-gray-100">
                      {children.map((child) => (
                        <div key={child.id} className="flex items-center gap-4 px-5 py-3 bg-gray-50/60 border-b border-gray-100 last:border-0">
                          <div className="w-4 shrink-0" />
                          <div className="w-3 h-px bg-gray-300 shrink-0" />
                          <span className="text-sm text-gray-700 font-medium flex-1">{child.title}</span>
                          <span className="text-xs text-gray-400">{child.slug || child.url}</span>
                          <Link
                            href={`/admin/navigation/${child.id}/edit`}
                            className="text-xs text-gray-500 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                          >
                            Edit
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}