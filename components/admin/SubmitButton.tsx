'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export function SubmitButton({ 
  children, 
  loadingText = 'Saving...',
  className = ''
}: { 
  children: React.ReactNode;
  loadingText?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <Button 
      type="submit" 
      disabled={pending} 
      className={`bg-sage hover:bg-emerald-700 text-white shadow-md ${className}`}
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
