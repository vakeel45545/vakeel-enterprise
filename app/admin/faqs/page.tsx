import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit } from 'lucide-react';
import Link from 'next/link';
import { deleteFaq } from '../actions';
import { DeleteButton } from '@/components/admin/DeleteButton';

export default async function AdminFaqsPage() {
  const supabase = await createClient();
  
  const { data: faqs } = await supabase
    .from('faqs')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-charcoal tracking-tight">FAQ Management</h1>
          <p className="text-gray-500 mt-1">Manage frequently asked questions across services.</p>
        </div>
        <Link href="/admin/faqs/new">
          <Button className="bg-sage hover:bg-emerald-700 text-white shadow-md">
            <Plus className="w-4 h-4 mr-2" /> Add FAQ
          </Button>
        </Link>
      </div>

      <Card className="border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Question</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {faqs && faqs.length > 0 ? (
                faqs.map((faq) => (
                  <tr key={faq.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-charcoal max-w-[400px]">
                      <p className="truncate">{faq.question}</p>
                      <p className="text-xs text-gray-400 mt-1 truncate">{faq.answer}</p>
                    </td>
                    <td className="px-6 py-4">
                      {faq.service_slug ? (
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full">{faq.service_slug}</span>
                      ) : (
                        <span className="px-3 py-1 bg-gray-100 text-gray-500 text-xs font-bold rounded-full">Global</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button asChild variant="outline" size="icon" className="w-8 h-8 rounded-lg border-gray-200 text-gray-500 hover:text-amber hover:border-amber/30 hover:bg-amber/10">
                          <Link href={`/admin/faqs/${faq.id}/edit`}>
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                        <DeleteButton id={faq.id} deleteAction={deleteFaq} itemName="this FAQ" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                    No FAQs found. Click &quot;Add FAQ&quot; to get started.
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
