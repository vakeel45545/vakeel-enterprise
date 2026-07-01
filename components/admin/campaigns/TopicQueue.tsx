import { CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function TopicQueue({ topics }: { topics: any[] }) {
  if (!topics || topics.length === 0) {
    return <div className="p-8 text-center text-gray-500">No topics in this campaign yet.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold border-b border-gray-100">
          <tr>
            <th className="px-5 py-3 w-16">#</th>
            <th className="px-5 py-3">Topic</th>
            <th className="px-5 py-3">Status</th>
            <th className="px-5 py-3">Score</th>
            <th className="px-5 py-3">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {topics.map((topic, index) => (
            <tr key={topic.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-5 py-3 text-gray-400 font-mono">{index + 1}</td>
              <td className="px-5 py-3 font-medium text-charcoal">{topic.topic}</td>
              <td className="px-5 py-3">
                <StatusBadge status={topic.status} />
                {topic.retries > 0 && <span className="ml-2 text-[10px] text-red-500 font-bold">Retry {topic.retries}</span>}
              </td>
              <td className="px-5 py-3">
                {topic.quality_score ? (
                  <span className={`font-bold ${topic.quality_score >= 80 ? 'text-emerald-600' : topic.quality_score >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                    {topic.quality_score}
                  </span>
                ) : '—'}
              </td>
              <td className="px-5 py-3">
                {topic.status === 'completed' && topic.content_type ? (
                  <EditLink topic={topic} />
                ) : topic.status === 'failed' ? (
                  <button className="text-red-600 hover:underline font-bold text-xs">
                    Retry Now
                  </button>
                ) : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, any> = {
    pending: { color: 'bg-gray-100 text-gray-600', icon: Clock },
    processing: { color: 'bg-blue-100 text-blue-700', icon: Clock },
    completed: { color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
    needs_review: { color: 'bg-amber-100 text-amber-700', icon: AlertCircle },
    failed: { color: 'bg-red-100 text-red-700', icon: XCircle },
    dead_letter: { color: 'bg-gray-800 text-white', icon: XCircle },
  };

  const config = map[status] || map.pending;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${config.color}`}>
      <Icon className="w-3 h-3" />
      {status.replace('_', ' ')}
    </span>
  );
}

function EditLink({ topic }: { topic: any }) {
  const map: Record<string, { key: string; path: string }> = {
    blog: { key: 'blog_id', path: 'blogs' },
    service: { key: 'service_id', path: 'services' },
    industry: { key: 'industry_id', path: 'industries' },
    city: { key: 'city_id', path: 'cities' },
    faq: { key: 'faq_id', path: 'faqs' },
    page: { key: 'page_id', path: 'pages' },
  };

  const config = map[topic.content_type] || map.blog;
  const targetId = topic[config.key];

  if (!targetId) return <span className="text-gray-400 text-xs">—</span>;

  return (
    <Link href={`/admin/${config.path}/${targetId}/edit`} className="text-violet-600 hover:underline font-bold text-xs">
      View {topic.content_type}
    </Link>
  );
}
