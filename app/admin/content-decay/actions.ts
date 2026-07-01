'use server';

import { createClient } from '@/lib/supabase/server';
import { runDecayAnalysis } from '@/lib/automation/freshness-engine';
import { generateCompleteContent } from '@/lib/automation/universal-generator';
import { revalidatePath } from 'next/cache';

export async function runAnalysisAction() {
  const results = await runDecayAnalysis();
  revalidatePath('/admin/content-decay');
  return results;
}

export async function fetchDecayingContent() {
  const supabase = await createClient();
  const allContent = [];

  const tables = ['blogs', 'services', 'pages'];
  
  for (const table of tables) {
    const { data } = await supabase
      .from(table)
      .select('id, title, updated_at, freshness_score, needs_update')
      .eq('status', 'published')
      .order('freshness_score', { ascending: true });
    
    if (data) {
      allContent.push(...data.map(item => ({ ...item, type: table })));
    }
  }

  // Sort by lowest score first
  return allContent.sort((a, b) => a.freshness_score - b.freshness_score);
}

export async function triggerAiRefresh(id: string, tableType: string) {
  const supabase = await createClient();
  
  // 1. Fetch existing content
  const { data: currentRecord } = await supabase
    .from(tableType)
    .select('*')
    .eq('id', id)
    .single();

  if (!currentRecord) throw new Error('Content not found');

  // 2. Map tableType to contentType for AI
  const typeMap: Record<string, string> = {
    blogs: 'blog',
    services: 'service',
    pages: 'page'
  };
  const contentType = typeMap[tableType] || 'blog';

  // 3. Trigger Generator
  const result = await generateCompleteContent({
    keywords: currentRecord.tags || [],
    publishImmediately: false, // Push back to editorial queue
    contentType,
    existingId: currentRecord.id,
    existingContent: currentRecord.content
  });

  if (!result.success) throw new Error(result.error);

  revalidatePath('/admin/content-decay');
  return result;
}
