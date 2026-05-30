import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    // Verify admin session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { pageId, sections } = await req.json();
    if (!pageId || !Array.isArray(sections)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // Step 1: Delete all existing sections for this page
    const { error: deleteError } = await supabase
      .from('page_sections')
      .delete()
      .eq('page_id', pageId);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    // Step 2: Insert all sections fresh (handles new, updated, reordered)
    if (sections.length > 0) {
      const rows = sections.map((s: any, i: number) => ({
        page_id: pageId,
        section_key: s.section_key,
        title: s.title || null,
        subtitle: s.subtitle || null,
        content: s.content ?? {},
        order_index: i,
        visible: s.visible !== false,
        updated_at: new Date().toISOString(),
      }));

      const { error: insertError } = await supabase
        .from('page_sections')
        .insert(rows);

      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Unknown error' }, { status: 500 });
  }
}