import { createServiceRoleClient } from '@/lib/supabase/server';
import { generateText } from '@/lib/ai/gemini';

export const SUPPORTED_LANGUAGES = [
  { code: 'hi', name: 'Hindi' },
  { code: 'mr', name: 'Marathi' },
  { code: 'ta', name: 'Tamil' },
  { code: 'gu', name: 'Gujarati' }
];

export async function processTranslationJob(jobId: string) {
  const supabase = await createServiceRoleClient();

  // 1. Fetch Job
  const { data: job } = await supabase
    .from('translation_jobs')
    .select('*')
    .eq('id', jobId)
    .single();

  if (!job) throw new Error('Job not found');

  try {
    await supabase.from('translation_jobs').update({ status: 'processing' }).eq('id', jobId);

    // 2. Fetch Source Content
    const { data: source } = await supabase
      .from(job.source_table)
      .select('*')
      .eq('id', job.source_id)
      .single();

    if (!source) throw new Error('Source content not found');

    const languageName = SUPPORTED_LANGUAGES.find(l => l.code === job.target_language)?.name || job.target_language;

    // 3. Translate Text Fields (Meta & Content)
    const prompt = `You are an expert ${languageName} translator.
Translate the following English content into ${languageName}. 
CRITICAL RULE: You MUST perfectly preserve all HTML tags (like <h2>, <p>, <ul>, <li>, <strong>, <a>). Do not remove or change any HTML structure, only translate the text inside the tags.

Title: ${source.title || source.custom_title}
Meta Title: ${source.meta_title || ''}
Meta Description: ${source.meta_description || ''}

Content:
${source.content}

Return a strictly valid JSON object:
{
  "title": "Translated Title",
  "meta_title": "Translated Meta Title",
  "meta_description": "Translated Meta Description",
  "content": "Translated HTML Content"
}`;

    const rawTranslation = await generateText(prompt, { responseMimeType: 'application/json' });
    const translation = JSON.parse(rawTranslation);

    // 4. Construct Insert Payload
    const targetSlug = source.slug ? `${source.slug}-${job.target_language}` : undefined;
    
    const insertData: any = {
      ...source, // copy category, thumbnail, etc.
      id: undefined, // remove source UUID
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      language: job.target_language,
      parent_id: source.id,
      status: 'published' // assuming we publish translations automatically
    };

    if (source.title) insertData.title = translation.title;
    if (source.custom_title) insertData.custom_title = translation.title;
    if (source.meta_title) insertData.meta_title = translation.meta_title;
    if (source.meta_description) insertData.meta_description = translation.meta_description;
    if (source.content) insertData.content = translation.content;
    if (targetSlug) insertData.slug = targetSlug;

    // 5. Upsert Translation (Check if child already exists)
    const { data: existingChild } = await supabase
      .from(job.source_table)
      .select('id')
      .eq('parent_id', source.id)
      .eq('language', job.target_language)
      .maybeSingle();

    if (existingChild) {
      await supabase.from(job.source_table).update(insertData).eq('id', existingChild.id);
    } else {
      await supabase.from(job.source_table).insert([insertData]);
    }

    // 6. Mark Job Completed
    await supabase.from('translation_jobs').update({ status: 'completed' }).eq('id', jobId);

  } catch (err: any) {
    await supabase.from('translation_jobs').update({ status: 'failed', error_message: err.message }).eq('id', jobId);
    throw err;
  }
}
