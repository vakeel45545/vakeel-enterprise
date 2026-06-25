'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
  Minus,
  Code
} from 'lucide-react';
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { marked } from 'marked';

export interface RichTextEditorHandle {
  setContent: (html: string) => void;
  insertAtCursor: (text: string) => void;
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
    // Try to parse markdown if the content doesn't look like an HTML string already.
    // This allows AI-generated markdown to be converted cleanly.
    const isHtml = /<\/?[a-z][\s\S]*>/i.test(defaultValue);
    const initialContent = isHtml ? defaultValue : marked.parse(defaultValue, { async: false }) as string;
    
    const [content, setContent] = useState(initialContent);

    const editor = useEditor({
      extensions: [
        StarterKit,
        Underline,
        Link.configure({
          openOnClick: false,
          HTMLAttributes: {
            class: 'text-sage font-semibold hover:text-emerald-700 underline',
          },
        }),
        Image.configure({
          HTMLAttributes: {
            class: 'rounded-xl border border-gray-200 shadow-sm max-w-full h-auto my-4',
          },
        }),
        Placeholder.configure({
          placeholder,
          emptyEditorClass: 'cursor-text before:content-[attr(data-placeholder)] before:absolute before:text-gray-400 before:pointer-events-none',
        }),
      ],
      content: initialContent,
      editorProps: {
        attributes: {
          class: 'prose prose-sm sm:prose-base lg:prose-lg focus:outline-none min-h-[250px] p-4 text-charcoal',
        },
        handlePaste: (view, event) => {
          const text = event.clipboardData?.getData('text/plain');
          const html = event.clipboardData?.getData('text/html');
          
          // If there's no HTML format but there is plain text, check if it's markdown
          if (text && !html) {
            // Check if text looks like markdown (headings, lists, bold)
            const isMarkdown = /^#|^-|\*\*|__|^\d+\.|^>|```/m.test(text);
            if (isMarkdown) {
              event.preventDefault();
              const parsedHtml = marked.parse(text, { async: false }) as string;
              // Use TipTap's insertContent command to gracefully merge the HTML into the editor
              editor?.commands.insertContent(parsedHtml);
              return true;
            }
          }
          return false;
        },
      },
      onUpdate: ({ editor }) => {
        const html = editor.getHTML();
        setContent(html);
        onContentChange?.(html);
      },
    });

    // Expose imperative API to parent (AI Studio)
    useImperativeHandle(ref, () => ({
      setContent: (html: string) => {
        if (!editor) return;
        // Parse markdown if needed
        const isHtmlContent = /<\/?[a-z][\s\S]*>/i.test(html);
        const finalContent = isHtmlContent ? html : marked.parse(html, { async: false }) as string;
        editor.commands.setContent(finalContent, { emitUpdate: true });
        setContent(finalContent);
        onContentChange?.(finalContent);
      },
      insertAtCursor: (text: string) => {
        if (!editor) return;
        editor.commands.insertContent(text);
      },
      getContent: () => {
        return editor?.getHTML() ?? '';
      },
    }), [editor, onContentChange]);

    if (!editor) {
      return null;
    }

    const addImage = () => {
      if (onOpenImagePicker) {
        onOpenImagePicker();
      } else {
        const url = window.prompt('URL');
        if (url) {
          editor.chain().focus().setImage({ src: url }).run();
        }
      }
    };

    const setLink = () => {
      const previousUrl = editor.getAttributes('link').href;
      const url = window.prompt('URL', previousUrl);
      
      // cancelled
      if (url === null) {
        return;
      }

      // empty
      if (url === '') {
        editor.chain().focus().extendMarkRange('link').unsetLink().run();
        return;
      }

      // update link
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    return (
      <div className="w-full border border-gray-200 rounded-xl bg-white overflow-hidden focus-within:ring-2 focus-within:ring-sage/20 focus-within:border-sage/50 transition-all">
        {/* Hidden input to pass data to standard form submissions */}
        <input type="hidden" id={id} name={name} value={content} />
        
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1 border-b border-gray-100 bg-gray-50/80 p-2">
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleBold().run()} 
            isActive={editor.isActive('bold')} 
            icon={<Bold className="w-4 h-4" />} 
            title="Bold"
          />
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleItalic().run()} 
            isActive={editor.isActive('italic')} 
            icon={<Italic className="w-4 h-4" />} 
            title="Italic"
          />
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleUnderline().run()} 
            isActive={editor.isActive('underline')} 
            icon={<UnderlineIcon className="w-4 h-4" />} 
            title="Underline"
          />
          
          <div className="w-px h-4 bg-gray-300 mx-1" />

          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} 
            isActive={editor.isActive('heading', { level: 1 })} 
            icon={<Heading1 className="w-4 h-4" />} 
            title="Heading 1"
          />
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
            isActive={editor.isActive('heading', { level: 2 })} 
            icon={<Heading2 className="w-4 h-4" />} 
            title="Heading 2"
          />
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} 
            isActive={editor.isActive('heading', { level: 3 })} 
            icon={<Heading3 className="w-4 h-4" />} 
            title="Heading 3"
          />

          <div className="w-px h-4 bg-gray-300 mx-1" />

          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleBulletList().run()} 
            isActive={editor.isActive('bulletList')} 
            icon={<List className="w-4 h-4" />} 
            title="Bullet List"
          />
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleOrderedList().run()} 
            isActive={editor.isActive('orderedList')} 
            icon={<ListOrdered className="w-4 h-4" />} 
            title="Numbered List"
          />
          
          <div className="w-px h-4 bg-gray-300 mx-1" />
          
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleBlockquote().run()} 
            isActive={editor.isActive('blockquote')} 
            icon={<Quote className="w-4 h-4" />} 
            title="Blockquote"
          />
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleCodeBlock().run()} 
            isActive={editor.isActive('codeBlock')} 
            icon={<Code className="w-4 h-4" />} 
            title="Code Block"
          />
          <ToolbarButton 
            onClick={() => editor.chain().focus().setHorizontalRule().run()} 
            isActive={false} 
            icon={<Minus className="w-4 h-4" />} 
            title="Horizontal Rule"
          />

          <div className="w-px h-4 bg-gray-300 mx-1" />

          <ToolbarButton 
            onClick={setLink} 
            isActive={editor.isActive('link')} 
            icon={<LinkIcon className="w-4 h-4" />} 
            title="Link"
          />
          <ToolbarButton 
            onClick={addImage} 
            isActive={editor.isActive('image')} 
            icon={<ImageIcon className="w-4 h-4" />} 
            title="Image"
          />

          <div className="flex-1" />

          <ToolbarButton 
            onClick={() => editor.chain().focus().undo().run()} 
            disabled={!editor.can().undo()}
            isActive={false} 
            icon={<Undo className="w-4 h-4" />} 
            title="Undo"
          />
          <ToolbarButton 
            onClick={() => editor.chain().focus().redo().run()} 
            disabled={!editor.can().redo()}
            isActive={false} 
            icon={<Redo className="w-4 h-4" />} 
            title="Redo"
          />
        </div>

        {/* Editor Content Area */}
        <div className="cursor-text bg-white" onClick={() => editor.chain().focus().run()}>
          <EditorContent editor={editor} className="min-h-[250px]" />
        </div>
      </div>
    );
  }
);

function ToolbarButton({ 
  onClick, 
  isActive, 
  icon, 
  title, 
  disabled = false 
}: { 
  onClick: () => void, 
  isActive: boolean, 
  icon: React.ReactNode, 
  title: string,
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded-md transition-colors flex items-center justify-center ${
        isActive 
          ? 'bg-sage/15 text-sage' 
          : 'text-gray-500 hover:text-charcoal hover:bg-gray-100'
      } ${disabled ? 'opacity-50 cursor-not-allowed hover:bg-transparent hover:text-gray-500' : ''}`}
    >
      {icon}
    </button>
  );
}
