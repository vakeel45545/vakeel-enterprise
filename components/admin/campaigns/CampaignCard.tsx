import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import CampaignProgress from './CampaignProgress';

interface CampaignCardProps {
  campaign: any;
  onRunNow?: (id: string) => void;
  onTogglePause?: (id: string, currentStatus: string) => void;
}

export default function CampaignCard({ campaign, onRunNow, onTogglePause }: CampaignCardProps) {
  const isActive = campaign.status === 'active';
  const isCompleted = campaign.status === 'completed';
  const total = campaign.total_topics || 1;
  const completed = campaign.completed_topics || 0;

  return (
    <Card className="border-gray-200 shadow-sm overflow-hidden flex flex-col">
      <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-gray-200 text-gray-700">
              {campaign.category || 'General'}
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
              isActive ? 'bg-emerald-100 text-emerald-700' : 
              isCompleted ? 'bg-blue-100 text-blue-700' :
              'bg-amber-100 text-amber-700'
            }`}>
              {campaign.status}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-100 text-purple-700">
              {campaign.priority}
            </span>
          </div>
          <h3 className="font-bold text-lg text-charcoal">{campaign.name}</h3>
          <p className="text-xs text-gray-500 flex items-center gap-2 mt-1">
            <Clock className="w-3 h-3" /> {campaign.schedule_preset?.replace('_', ' ') || 'Custom'} 
            • {campaign.topics_per_run} topics/run
          </p>
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col justify-center">
        <CampaignProgress 
          total={total} 
          completed={completed} 
          failed={campaign.failed_topics || 0} 
        />
        
        <div className="grid grid-cols-4 gap-2 mt-4 text-center">
          <div className="bg-emerald-50 rounded p-2">
            <p className="text-emerald-700 font-bold text-lg">{campaign.published_topics || 0}</p>
            <p className="text-[10px] text-emerald-600 uppercase font-semibold flex items-center justify-center gap-1"><CheckCircle2 className="w-3 h-3"/> Pub</p>
          </div>
          <div className="bg-amber-50 rounded p-2">
            <p className="text-amber-700 font-bold text-lg">{(completed - (campaign.published_topics || 0))}</p>
            <p className="text-[10px] text-amber-600 uppercase font-semibold flex items-center justify-center gap-1"><FileText className="w-3 h-3"/> Draft</p>
          </div>
          <div className="bg-blue-50 rounded p-2">
            <p className="text-blue-700 font-bold text-lg">{campaign.review_topics || 0}</p>
            <p className="text-[10px] text-blue-600 uppercase font-semibold flex items-center justify-center gap-1"><AlertCircle className="w-3 h-3"/> Review</p>
          </div>
          <div className="bg-red-50 rounded p-2">
            <p className="text-red-700 font-bold text-lg">{campaign.failed_topics || 0}</p>
            <p className="text-[10px] text-red-600 uppercase font-semibold flex items-center justify-center gap-1"><AlertCircle className="w-3 h-3"/> Fail</p>
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-50/30 border-t border-gray-100 flex items-center justify-between gap-2">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs rounded-lg"
            onClick={() => onTogglePause && onTogglePause(campaign.id, campaign.status)}
            disabled={isCompleted}
          >
            {isActive ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
            {isActive ? 'Pause' : 'Resume'}
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="text-xs bg-violet-600 hover:bg-violet-700 rounded-lg"
            onClick={() => onRunNow && onRunNow(campaign.id)}
            disabled={isCompleted}
          >
            <Play className="w-4 h-4 mr-1" /> Run Now
          </Button>
        </div>
        <Button asChild variant="ghost" size="sm" className="text-xs rounded-lg text-gray-500 hover:text-charcoal">
          <Link href={`/admin/campaigns/${campaign.id}`}>Details →</Link>
        </Button>
      </div>
    </Card>
  );
}
