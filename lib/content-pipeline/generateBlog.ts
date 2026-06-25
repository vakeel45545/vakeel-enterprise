import { createServiceRoleClient } from '@/lib/supabase/server';
import { generateBlogSEO } from '@/lib/seo/generateMetadata';

interface BlogGenerationParams {
  topic: string;
  category: string;
  authorId?: string;
}

export async function generateAutomatedBlog(params: BlogGenerationParams) {
  const supabase = createServiceRoleClient();
  
  // 1. Generate core content using Gemini (simplified wrapper assumption)
  // In a real implementation, you'd call an internal AI service or the Gemini API directly
  // const contentResult = await generateContentFromTopic(params.topic);
  
  // Placeholder generation logic:
  const title = `Complete Guide to ${params.topic}`;
  const slug = params.topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const content = `<h1>${title}</h1><p>Automated blog content about ${params.topic} goes here...</p>`;
  const meta_title = `${title} | Vaakil.com`;
  const meta_description = `Learn everything you need to know about ${params.topic} in our comprehensive legal and compliance guide.`;
  const tags = [params.category.toLowerCase(), 'legal', 'guide'];
  
  // 2. Insert as a draft first
  const blogData = {
    title,
    slug,
    category: params.category,
    content,
    meta_title,
    meta_description,
    tags,
    reading_time: 5,
    author_id: params.authorId || null,
    status: 'draft',
  };

  const { data: newBlog, error } = await supabase
    .from('blogs')
    .insert([blogData])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create automated blog: ${error.message}`);
  }

  return newBlog;
}
