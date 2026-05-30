// import { createClient } from '@/lib/supabase/server';
// import { notFound } from 'next/navigation';
// import PageSectionBuilder from '@/components/admin/PageSectionBuilder';

// export const dynamic = 'force-dynamic';

// // interface EditPageProps {
// //   params: { id: string };
// // }
// interface EditPageProps {
//   params: Promise<{ id: string }>;
// }

// // export default async function EditPagePage({ params }: EditPageProps) {
// //   const supabase = await createClient();

// //   const [{ data: page, error: pageError }, { data: sections }] = await Promise.all([
// //     supabase.from('pages').select('*').eq('id', params.id).single(),
// //     supabase
// //       .from('page_sections')
// //       .select('*')
// //       .eq('page_id', params.id)
// //       .order('order_index', { ascending: true }),
// //   ]);

// export default async function EditPagePage({ params }: EditPageProps) {
//   const { id } = await params;  // add await
//   const supabase = await createClient();

//   const [{ data: page, error: pageError }, { data: sections }] = await Promise.all([
//     supabase.from('pages').select('*').eq('id', id).single(),
//     supabase
//       .from('page_sections')
//       .select('*')
//       .eq('page_id', id)
//       .order('order_index', { ascending: true }),
//   ]);
//   // rest stays the same

//   if (pageError || !page) notFound();

//   return (
//     <PageSectionBuilder
//       pageId={page.id}
//       pageTitle={page.title}
//       pageSlug={page.slug}
//       initialSections={sections ?? []}
//     />
//   );
// }

import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import PageSectionBuilder from '@/components/admin/PageSectionBuilder';

export const dynamic = 'force-dynamic';

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPagePage({ params }: EditPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: page, error: pageError }, { data: sections }] = await Promise.all([
    supabase.from('pages').select('*').eq('id', id).single(),
    supabase
      .from('page_sections')
      .select('*')
      .eq('page_id', id)
      .order('order_index', { ascending: true }),
  ]);

  if (pageError || !page) notFound();

  return (
    <PageSectionBuilder
      pageId={page.id}
      pageTitle={page.title}
      pageSlug={page.slug}
      initialSections={(sections ?? []) as any}
    />
  );
}