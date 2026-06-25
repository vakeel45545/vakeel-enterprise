import { createServiceRoleClient } from '@/lib/supabase/server';
import { dispatchWebhook } from '@/lib/webhooks/dispatcher';

export async function publishBlog(blogId: string) {
  const supabase = createServiceRoleClient();
  
  // 1. Get blog details
  const { data: blog, error: fetchError } = await supabase
    .from('blogs')
    .select('*')
    .eq('id', blogId)
    .single();

  if (fetchError || !blog) {
    throw new Error(`Blog not found: ${blogId}`);
  }

  // 2. Publish it
  const { data: updatedBlog, error: updateError } = await supabase
    .from('blogs')
    .update({
      status: 'published',
      published: true,
      published_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', blogId)
    .select()
    .single();

  if (updateError) {
    throw new Error(`Failed to publish blog: ${updateError.message}`);
  }

  // 3. Dispatch webhooks
  await dispatchWebhook('blog.published', updatedBlog);

  // 4. Ping sitemaps / search engines (placeholder for actual implementation)
  // await pingSitemap();

  return updatedBlog;
}
