'use client';

import { useState, forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { marked } from 'marked';
import { Save, RefreshCw, Wand2, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill-new');
    return function QuillWrapper({ forwardedRef, ...props }: any) {
      return <RQ ref={forwardedRef} {...props} />;
    };
  },
  { ssr: false }
);

export interface RichTextEditorHandle {
  setContent: (html: string) => void;
  insertAtCursor: (text: string) => void;
  insertImage: (url: string, alt?: string) => void;
  getContent: () => string;
}

interface RichTextEditorProps {
  id?: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  onContentChange?: (html: string) => void;
  onOpenImagePicker?: () => void;
}

export const RichTextEditor = forwardRef<RichTextEditorHandle, RichTextEditorProps>(
  function RichTextEditor({ id, name, defaultValue = '', placeholder = 'Write something...', onContentChange, onOpenImagePicker }, ref) {
    const isHtml = /<\/?[a-z][\s\S]*>/i.test(defaultValue);
    const initialContent = isHtml ? defaultValue : marked.parse(defaultValue, { async: false }) as string;
    
    const [content, setContent] = useState(initialContent);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiError, setAiError] = useState('');
    const [showAiMenu, setShowAiMenu] = useState(false);
    
    const quillRef = useRef<any>(null);

    // Autosave & Recovery
    const storageKey = `vakeel_editor_draft_${id || name}`;
    
    useEffect(() => {
      // Check for existing draft on mount if content is empty or default
      if (typeof window !== 'undefined' && (!defaultValue || defaultValue === '<p><br></p>')) {
        const draft = localStorage.getItem(storageKey);
        if (draft && draft !== defaultValue) {
          if (window.confirm('An unsaved draft was found. Would you like to restore it?')) {
            setContent(draft);
            onContentChange?.(draft);
          }
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Debounced autosave
    useEffect(() => {
      if (typeof window === 'undefined') return;
      
      const timer = setTimeout(() => {
        if (content && content !== '<p><br></p>') {
          localStorage.setItem(storageKey, content);
          setLastSaved(new Date());
        }
      }, 3000); // Save after 3s of inactivity
      
      return () => clearTimeout(timer);
    }, [content, storageKey]);

    useImperativeHandle(ref, () => ({
      setContent: (html: string) => {
        const isHtmlContent = /<\/?[a-z][\s\S]*>/i.test(html);
        const finalContent = isHtmlContent ? html : marked.parse(html, { async: false }) as string;
        setContent(finalContent);
        onContentChange?.(finalContent);
      },
      insertAtCursor: (text: string) => {
        if (!quillRef.current) return;
        const editor = quillRef.current.getEditor();
        const range = editor.getSelection();
        const position = range ? range.index : editor.getLength();
        editor.insertText(position, text);
      },
      insertImage: (url: string, alt?: string) => {
        if (!quillRef.current) return;
        const editor = quillRef.current.getEditor();
        const range = editor.getSelection();
        const position = range ? range.index : editor.getLength();
        editor.insertEmbed(position, 'image', url);
        // Quill doesn't natively support alt tags easily via insertEmbed, 
        // but adding it to the DOM immediately after is possible, or we rely on the URL.
        editor.setSelection(position + 1);
      },
      getContent: () => {
        return content;
      },
    }));

    const handleChange = (value: string) => {
      setContent(value);
      onContentChange?.(value);
    };

    const getWordCount = (html: string) => {
      if (typeof window === 'undefined') return 0;
      const text = new DOMParser().parseFromString(html, 'text/html').body.textContent || '';
      return text.trim().split(/\s+/).filter(w => w.length > 0).length;
    };

    const wordCount = getWordCount(content);
    const readingTime = Math.ceil(wordCount / 200);

    const modules = {
      toolbar: {
        container: [
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
          [{ 'font': [] }],
          [{ 'size': ['small', false, 'large', 'huge'] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'script': 'sub'}, { 'script': 'super' }],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
          [{ 'indent': '-1'}, { 'indent': '+1' }],
          [{ 'align': [] }],
          ['link', 'image', 'video'],
          ['clean']
        ],
        handlers: {
          image: function() {
            if (onOpenImagePicker) {
              onOpenImagePicker();
            } else {
              const url = window.prompt('URL');
              if (url && quillRef.current) {
                const editor = quillRef.current.getEditor();
                const range = editor.getSelection();
                const position = range ? range.index : editor.getLength();
                editor.insertEmbed(position, 'image', url);
              }
            }
          }
        }
      }
    };

    const formats = [
      'header', 'font', 'size',
      'bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block',
      'color', 'background',
      'script',
      'list', 'indent',
      'align',
      'link', 'image', 'video'
    ];

    const handleAiAction = async (mode: string) => {
      if (!quillRef.current) return;
      
      const editor = quillRef.current.getEditor();
      const range = editor.getSelection();
      
      if (!range || range.length === 0) {
        setAiError('Please select some text first');
        setTimeout(() => setAiError(''), 3000);
        return;
      }
      
      const textToProcess = editor.getText(range.index, range.length);
      
      setIsAiLoading(true);
      setShowAiMenu(false);
      setAiError('');
      
      try {
        const res = await fetch('/api/ai/rewrite', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: textToProcess, mode })
        });
        
        if (!res.ok) throw new Error('AI request failed');
        const data = await res.json();
        
        if (data.result) {
          // Replace selection with AI output
          editor.deleteText(range.index, range.length);
          editor.insertText(range.index, data.result);
          editor.setSelection(range.index, data.result.length);
        }
      } catch (err) {
        setAiError('AI generation failed. Please try again.');
        setTimeout(() => setAiError(''), 3000);
      } finally {
        setIsAiLoading(false);
      }
    };

    return (
      <div className="w-full border border-gray-200 rounded-xl bg-white overflow-visible focus-within:ring-2 focus-within:ring-sage/20 focus-within:border-sage/50 transition-all flex flex-col relative">
        <input type="hidden" id={id} name={name} value={content} />
        
        {/* AI Assistant Overlay */}
        <div className="absolute top-2 right-2 z-10">
          <div className="relative">
            <Button 
              type="button" 
              onClick={() => setShowAiMenu(!showAiMenu)}
              disabled={isAiLoading}
              className={`h-8 px-3 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all
                ${isAiLoading ? 'bg-violet-100 text-violet-400' : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white shadow-sm'}`}
            >
              {isAiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              {isAiLoading ? 'Thinking...' : 'AI Assistant'}
            </Button>
            
            {showAiMenu && (
              <div className="absolute top-full mt-1 right-0 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-2 border-b border-gray-100">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Select text to:</p>
                </div>
                <button type="button" onClick={() => handleAiAction('rewrite')} className="w-full text-left px-3 py-2 text-sm text-charcoal hover:bg-violet-50 hover:text-violet-700 transition-colors">Rewrite</button>
                <button type="button" onClick={() => handleAiAction('expand')} className="w-full text-left px-3 py-2 text-sm text-charcoal hover:bg-violet-50 hover:text-violet-700 transition-colors">Expand length</button>
                <button type="button" onClick={() => handleAiAction('shorten')} className="w-full text-left px-3 py-2 text-sm text-charcoal hover:bg-violet-50 hover:text-violet-700 transition-colors">Shorten & condense</button>
                <button type="button" onClick={() => handleAiAction('professional')} className="w-full text-left px-3 py-2 text-sm text-charcoal hover:bg-violet-50 hover:text-violet-700 transition-colors">Make it professional</button>
                <button type="button" onClick={() => handleAiAction('simple')} className="w-full text-left px-3 py-2 text-sm text-charcoal hover:bg-violet-50 hover:text-violet-700 transition-colors">Simplify language</button>
              </div>
            )}
            
            {aiError && (
              <div className="absolute top-full mt-1 right-0 bg-red-50 text-red-600 border border-red-100 px-3 py-1.5 rounded-md text-xs whitespace-nowrap flex items-center gap-1.5 shadow-sm animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-3 h-3" /> {aiError}
              </div>
            )}
          </div>
        </div>
        
        <ReactQuill 
          forwardedRef={quillRef}
          theme="snow"
          value={content}
          onChange={handleChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          className="min-h-[250px] text-charcoal bg-white"
        />
        
        {/* SEO & Editor Toolbar Footer */}
        <div className="bg-gray-50 border-t border-gray-200 px-4 py-2 flex justify-between items-center text-xs text-gray-500 font-medium">
          <div className="flex gap-4 items-center">
            <span>{wordCount} words</span>
            <span>•</span>
            <span>{readingTime} min read</span>
            <span>•</span>
            {wordCount > 2000 ? <span className="text-amber-600">Long Form</span> : <span className="text-green-600">Standard Form</span>}
          </div>
          <div className="flex items-center gap-2">
            {lastSaved ? (
              <span className="flex items-center gap-1 text-green-600">
                <Save className="w-3 h-3" /> Autosaved at {lastSaved.toLocaleTimeString()}
              </span>
            ) : (
              <span className="flex items-center gap-1 text-gray-400">
                <RefreshCw className="w-3 h-3" /> Waiting to save...
              </span>
            )}
          </div>
        </div>

        <style jsx global>{`
          .ql-toolbar.ql-snow {
            border: none !important;
            border-bottom: 1px solid #f3f4f6 !important;
            background-color: #f9fafb !important;
            padding: 8px !important;
          }
          .ql-container.ql-snow {
            border: none !important;
          }
          .ql-editor {
            min-height: 250px;
            font-size: 1.125rem;
            line-height: 1.75;
            padding: 1rem;
          }
          .ql-editor img {
            max-width: 100%;
            height: auto;
            border-radius: 0.5rem;
            margin: 1.5rem 0;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
          }
          .ql-editor iframe.ql-video {
            width: 100%;
            aspect-ratio: 16 / 9;
            height: auto;
            border-radius: 0.5rem;
            margin: 1.5rem 0;
          }
          .ql-editor table {
            width: 100%;
            border-collapse: collapse;
            margin: 1.5rem 0;
          }
          .ql-editor table td, .ql-editor table th {
            border: 1px solid #e5e7eb;
            padding: 0.75rem;
          }
        `}</style>
      </div>
    );
  }
);
