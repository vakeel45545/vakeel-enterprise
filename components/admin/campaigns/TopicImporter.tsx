'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function TopicImporter({ onImport }: { onImport: (topics: string[]) => void }) {
  const [text, setText] = useState('');

  const handleImport = () => {
    // Simple line-by-line parsing
    const topics = text
      .split('\n')
      .map(t => t.trim())
      .filter(t => t.length > 0);
      
    if (topics.length > 0) {
      onImport(topics);
      setText('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-4">
        <label className="block text-sm font-bold text-charcoal mb-2">
          Paste Topics (One per line)
        </label>
        <textarea
          className="w-full h-32 p-3 border border-gray-200 rounded-lg text-sm"
          placeholder="Private Limited Company Registration&#10;Trademark Registration Process&#10;GST Filing for Startups"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="flex justify-between items-center mt-3">
          <span className="text-xs text-gray-500">
            {text.split('\n').filter(t => t.trim().length > 0).length} topics found
          </span>
          <Button 
            onClick={handleImport} 
            disabled={text.trim().length === 0}
            className="bg-charcoal text-white"
          >
            Import Topics
          </Button>
        </div>
      </div>
    </div>
  );
}
