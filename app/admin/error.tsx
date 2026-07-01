'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('[Admin Error Boundary]:', error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <Card className="max-w-md w-full p-8 flex flex-col items-center text-center space-y-4 shadow-xl border-red-100">
        <div className="w-16 h-16 bg-red-50 text-red-500 flex items-center justify-center rounded-full mb-2">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-charcoal">Something went wrong!</h2>
        <p className="text-gray-500 text-sm">
          An unexpected error occurred in the workspace. The technical team has been notified.
        </p>
        
        <div className="bg-gray-50 p-3 rounded text-left text-xs font-mono text-gray-600 w-full overflow-x-auto border border-gray-100">
          {error.message || 'Unknown error'}
        </div>

        <Button 
          onClick={() => reset()}
          className="mt-4 bg-charcoal text-white hover:bg-black font-medium w-full flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" /> Try again
        </Button>
      </Card>
    </div>
  );
}
