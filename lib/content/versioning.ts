import { createClient } from '@/lib/supabase/server';

/**
 * Creates a version snapshot of a content record before it gets updated.
 * This should be called in server actions right before updating the content table.
 */
export async function createContentRevision(
  tableName: string, 
  recordId: string, 
  authorId?: string
): Promise<void> {
  const supabase = await createClient();

  // 1. Fetch current state
  const { data: currentRecord } = await supabase
    .from(tableName)
    .select('*')
    .eq('id', recordId)
    .single();

  if (!currentRecord) return; // Nothing to version

  // 2. Determine author if not provided
  let finalAuthorId = authorId;
  if (!finalAuthorId) {
    const { data: { user } } = await supabase.auth.getUser();
    finalAuthorId = user?.id;
  }

  // 3. Save snapshot
  await supabase.from('content_revisions').insert([{
    table_name: tableName,
    record_id: recordId,
    author_id: finalAuthorId || null,
    snapshot: currentRecord
  }]);
}

/**
 * Fetch all revisions for a specific content record.
 */
export async function getContentRevisions(tableName: string, recordId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('content_revisions')
    .select('*')
    .eq('table_name', tableName)
    .eq('record_id', recordId)
    .order('created_at', { ascending: false });
    
  return data || [];
}
