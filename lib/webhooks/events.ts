export type WebhookEvent =
  | 'lead.created'
  | 'lead.updated'
  | 'blog.created'
  | 'blog.updated'
  | 'blog.published'
  | 'blog.deleted'
  | 'blog.scheduled'
  | 'media.uploaded'
  | 'seo.generated'
  | 'cron.started'
  | 'cron.completed'
  | 'cron.failed'
  | 'service.updated'
  | 'industry.updated'
  | 'page.updated';

export interface WebhookPayload {
  event: WebhookEvent;
  timestamp: string;
  data: Record<string, unknown>;
}
