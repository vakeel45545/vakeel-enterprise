'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

// Dynamically import Quill to avoid SSR 'document is not defined' errors
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface BlockEditorProps {
  name: string;
  defaultValue?: string;
  placeholder?: string;
}

export function BlockEditor({ name, defaultValue = '', placeholder = 'Start writing...' }: BlockEditorProps) {
  const [content, setContent] = useState(defaultValue);

  // Sync state if default value changes from outside (like AI generation)
  useEffect(() => {
    setContent(defaultValue);
  }, [defaultValue]);

  const modules = {
    toolbar: [
      [{ 'header': [2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list',
    'link', 'image'
  ];

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm focus-within:border-violet-500 focus-within:ring-1 focus-within:ring-violet-500 transition-all">
      <input type="hidden" name={name} value={content} />
      
      <div className="editor-container text-charcoal">
        <ReactQuill 
          theme="snow"
          value={content}
          onChange={setContent}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          className="min-h-[300px]"
        />
      </div>

      {/* Global CSS overrides for ReactQuill to match Vaakil styling */}
      <style jsx global>{`
        .ql-toolbar.ql-snow {
          border: none !important;
          border-bottom: 1px solid #e5e7eb !important;
          background-color: #f9fafb !important;
          padding: 8px !important;
        }
        .ql-container.ql-snow {
          border: none !important;
        }
        .ql-editor {
          min-height: 300px;
          font-size: 1.125rem;
          line-height: 1.75;
          padding: 1rem;
        }
        .ql-editor p {
          margin-bottom: 1rem;
        }
        .ql-editor h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        .ql-editor h3 {
          font-size: 1.25rem;
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .ql-snow .ql-picker-label {
          font-weight: 600;
          color: #374151;
        }
      `}</style>
    </div>
  );
}
