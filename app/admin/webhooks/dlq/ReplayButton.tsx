'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ReplayButton({ logId }: { logId: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleReplay = async () => {
    setStatus('loading');
    try {
      const res = await fetch('/api/webhooks/replay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ log_id: logId }),
      });

      if (!res.ok) throw new Error('Replay failed');
      
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleReplay}
      disabled={status !== 'idle'}
      className="text-xs h-7"
    >
      {status === 'idle' && <><RefreshCw className="w-3 h-3 mr-1" /> Replay</>}
      {status === 'loading' && <><RefreshCw className="w-3 h-3 mr-1 animate-spin" /> Queuing</>}
      {status === 'success' && <><CheckCircle2 className="w-3 h-3 mr-1 text-emerald-500" /> Queued</>}
      {status === 'error' && <><AlertCircle className="w-3 h-3 mr-1 text-red-500" /> Failed</>}
    </Button>
  );
}
