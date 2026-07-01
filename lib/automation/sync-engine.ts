import { createServiceRoleClient } from '@/lib/supabase/server';
import { SUPPORTED_LANGUAGES } from './translation-engine';

/**
 * Trigger this hook whenever a primary English document is updated or refreshed.
 * It queues the document to be translated/synced across all supported regional languages.
 */
export async function queueParentForTranslationSync(tableName: string, parentId: string) {
  const supabase = await createServiceRoleClient();

  const jobs = SUPPORTED_LANGUAGES.map(lang => ({
    source_table: tableName,
    source_id: parentId,
    target_language: lang.code,
    status: 'pending'
  }));

  const { error } = await supabase
    .from('translation_jobs')
    .insert(jobs);

  if (error) {
    throw new Error(`Failed to queue translation sync: ${error.message}`);
  }
}
