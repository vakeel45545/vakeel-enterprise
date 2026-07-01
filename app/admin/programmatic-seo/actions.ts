'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function generateSeoMatrix(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const serviceId = formData.get('service_id') as string;
  const cityIdsRaw = formData.getAll('city_ids') as string[];
  const campaignName = formData.get('campaign_name') as string;

  if (!serviceId || cityIdsRaw.length === 0 || !campaignName) {
    throw new Error('Missing required fields');
  }

  // 1. Fetch Service details
  const { data: service } = await supabase.from('services').select('id, title, slug').eq('id', serviceId).single();
  if (!service) throw new Error('Service not found');

  // 2. Fetch City details
  const { data: cities } = await supabase.from('cities').select('id, name, slug').in('id', cityIdsRaw);
  if (!cities || cities.length === 0) throw new Error('Cities not found');

  // 3. Create Campaign
  const { data: campaign, error: campaignError } = await supabase
    .from('campaigns')
    .insert([{
      name: campaignName,
      description: `Programmatic SEO generation for ${service.title}`,
      author_id: user?.id,
      category: 'Programmatic SEO',
      content_type: 'service_city',
      status: 'active',
      topics_per_run: 5
    }])
    .select()
    .single();

  if (campaignError) throw new Error(campaignError.message);

  // 4. Create Topic Matrix
  const topicInserts = cities.map((city, index) => {
    // The "topic" string serves as the context for the AI
    const topicText = `${service.title} in ${city.name}`;
    return {
      campaign_id: campaign.id,
      topic: topicText,
      status: 'pending',
      content_type: 'service_city',
      sort_order: index,
      service_id: service.id,
      city_id: city.id
    };
  });

  const { error: topicsError } = await supabase
    .from('campaign_topics')
    .insert(topicInserts);

  if (topicsError) throw new Error(topicsError.message);

  // 5. Update total topics
  await supabase
    .from('campaigns')
    .update({ total_topics: topicInserts.length })
    .eq('id', campaign.id);

  revalidatePath('/admin/campaigns');
  redirect(`/admin/campaigns/${campaign.id}`);
}
