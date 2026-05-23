'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function DeleteButton({ 
  id, 
  deleteAction,
  itemName = 'this item'
}: { 
  id: string;
  deleteAction: (id: string) => Promise<void>;
  itemName?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete ${itemName}? This action cannot be undone.`)) {
      startTransition(async () => {
        try {
          await deleteAction(id);
          router.refresh();
        } catch (error) {
          console.error('Failed to delete:', error);
          alert('Failed to delete item. Please try again.');
        }
      });
    }
  };

  return (
    <Button 
      variant="outline" 
      size="icon" 
      onClick={handleDelete}
      disabled={isPending}
      className="w-8 h-8 rounded-lg border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50"
    >
      {isPending ? <Loader2 className="w-4 h-4 animate-spin text-red-500" /> : <Trash2 className="w-4 h-4" />}
    </Button>
  );
}
