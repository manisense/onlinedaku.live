'use client';

import { useCallback, memo } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { FaBold, FaItalic, FaListUl, FaListOl, 
         FaQuoteRight, FaImage, FaLink, FaHeading, FaCode } from 'react-icons/fa';

interface BlogEditorProps {
  initialContent: string;
  onChange: (content: string) => void;
}

function BlogEditor({ initialContent, onChange }: BlogEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const setLink = useCallback(() => {
    if (!editor) return;
    
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) return;

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor) return;
    
    const url = window.prompt('Image URL');
    
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  const EditorButton = ({ 
    onClick, 
    isActive = false, 
    title 
  }: { 
    onClick: () => void; 
    isActive?: boolean;
    title: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`p-2 rounded hover:bg-gray-200 ${isActive ? 'bg-gray-200' : ''}`}
      title={title}
    >
      {title === 'Bold' && <FaBold />}
      {title === 'Italic' && <FaItalic />}
      {title === 'Heading' && <FaHeading />}
      {title === 'Bullet List' && <FaListUl />}
      {title === 'Ordered List' && <FaListOl />}
      {title === 'Quote' && <FaQuoteRight />}
      {title === 'Code Block' && <FaCode />}
      {title === 'Add Link' && <FaLink />}
      {title === 'Add Image' && <FaImage />}
    </button>
  );

  return (
    <div className="border rounded-md">
      <div className="bg-gray-50 p-2 border-b flex flex-wrap items-center gap-1">
        <EditorButton 
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Bold"
        />
        <EditorButton 
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Italic"
        />
        <EditorButton 
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          title="Heading"
        />
        <EditorButton 
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Bullet List"
        />
        <EditorButton 
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Ordered List"
        />
        <EditorButton 
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          title="Quote"
        />
        <EditorButton 
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive('codeBlock')}
          title="Code Block"
        />
        <EditorButton 
          onClick={setLink}
          isActive={editor.isActive('link')}
          title="Add Link"
        />
        <EditorButton 
          onClick={addImage}
          title="Add Image"
        />
      </div>
      <EditorContent editor={editor} className="prose max-w-none p-4 min-h-[300px]" />
    </div>
  );
}

// Wrap the component with memo for better performance
export default memo(BlogEditor);
