'use client';

import { useCallback, memo, useEffect } from 'react';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Underline from '@tiptap/extension-underline';
import CharacterCount from '@tiptap/extension-character-count';
import HardBreak from '@tiptap/extension-hard-break';
import { EnsureVisibleCursor, SmoothTyping, BetterEnterHandling } from './CustomExtensions';
import { 
  FaBold, FaItalic, FaUnderline, FaListUl, FaListOl,  
  FaQuoteRight, FaCode, FaLink, FaUnlink, FaImage, 
  FaAlignLeft, FaAlignCenter, FaAlignRight, FaAlignJustify,
  FaTable, FaEye
} from 'react-icons/fa';
import { RxDividerHorizontal } from 'react-icons/rx';

interface BlogEditorProps {
  initialContent: string;
  onChange: (content: string) => void;
}

function BlogEditor({ initialContent, onChange }: BlogEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        paragraph: {
          HTMLAttributes: {
            class: 'my-2',
          }
        },
      }),
      Underline,
      Placeholder.configure({
        placeholder: 'Start writing your amazing content here...',
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Image.configure({
        allowBase64: true,
        inline: true,
      }),
      Link.configure({
        openOnClick: false,
        linkOnPaste: true,
        HTMLAttributes: {
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
      CharacterCount,
      HardBreak.extend({
        addKeyboardShortcuts() {
          return {
            Enter: () => this.editor.commands.setHardBreak(),
          }
        }
      }),
      EnsureVisibleCursor,
      SmoothTyping,
      BetterEnterHandling,
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose-editor focus:outline-none',
        spellcheck: 'true',
      },
    },
  });

  // Update editor content when initialContent changes (e.g., when loading a blog post)
  useEffect(() => {
    if (editor && initialContent !== editor.getHTML()) {
      console.log('BlogEditor: Updating editor content from prop');
      editor.commands.setContent(initialContent);
    }
  }, [editor, initialContent]);

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

  const unsetLink = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().extendMarkRange('link').unsetLink().run();
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor) return;
    
    const url = window.prompt('Image URL');
    
    if (url) {
      editor.chain().focus().setImage({ src: url, alt: 'Image' }).run();
    }
  }, [editor]);

  const insertTable = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }, [editor]);

  const previewContent = useCallback(() => {
    if (!editor) return;
    const content = editor.getHTML();
    // Open a new window to preview the content
    const previewWindow = window.open('', '_blank');
    if (previewWindow) {
      previewWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Blog Preview</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              body {
                font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
              }
              img {
                max-width: 100%;
                height: auto;
              }
              h1, h2, h3, h4, h5, h6 {
                margin-top: 1.5em;
                margin-bottom: 0.5em;
                font-weight: 600;
                line-height: 1.25;
              }
              h1 { font-size: 2em; }
              h2 { font-size: 1.5em; }
              h3 { font-size: 1.25em; }
              p { margin: 1em 0; }
              blockquote {
                border-left: 4px solid #ddd;
                padding-left: 1em;
                margin-left: 0;
                color: #666;
              }
              pre {
                background: #f5f5f5;
                padding: 1em;
                border-radius: 4px;
                overflow-x: auto;
              }
              code {
                background: #f5f5f5;
                padding: 0.2em 0.4em;
                border-radius: 3px;
              }
              table {
                border-collapse: collapse;
                width: 100%;
                margin: 1em 0;
              }
              th, td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
              }
              th {
                background-color: #f2f2f2;
              }
            </style>
          </head>
          <body>
            <div class="content">
              ${content}
            </div>
          </body>
        </html>
      `);
      previewWindow.document.close();
    }
  }, [editor]);

  // Character count calculations
  const getCharacterCount = () => {
    if (!editor) return 0;
    
    // Use a safer method to get character count if the extension is available
    const text = editor.getText();
    return text.length;
  };
  
  const getWordCount = () => {
    if (!editor) return 0;
    
    const text = editor.getText();
    return text.split(/\s+/).filter(word => word.length > 0).length;
  };

  if (!editor) {
    return null;
  }

  const EditorButton = ({ 
    onClick, 
    isActive = false, 
    title,
    icon
  }: { 
    onClick: () => void; 
    isActive?: boolean;
    title: string;
    icon: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`p-2 rounded hover:bg-gray-200 ${isActive ? 'bg-gray-200 text-indigo-600' : ''}`}
      title={title}
    >
      {icon}
    </button>
  );

  return (
    <div className="border rounded-md overflow-hidden">
      {/* Main Toolbar */}
      <div className="bg-gray-50 p-2 border-b flex flex-wrap items-center gap-1">
        <div className="flex items-center gap-1 mr-2">
          <EditorButton 
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            title="Bold"
            icon={<FaBold />}
          />
          <EditorButton 
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            title="Italic"
            icon={<FaItalic />}
          />
          <EditorButton 
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
            title="Underline"
            icon={<FaUnderline />}
          />
        </div>

        <div className="border-l border-gray-300 h-6 mx-1"></div>

        <div className="flex items-center gap-1 mr-2">
          <EditorButton 
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
            title="Heading 1"
            icon={<span className="font-bold text-sm">H1</span>}
          />
          <EditorButton 
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
            title="Heading 2"
            icon={<span className="font-bold text-sm">H2</span>}
          />
          <EditorButton 
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive('heading', { level: 3 })}
            title="Heading 3"
            icon={<span className="font-bold text-sm">H3</span>}
          />
        </div>

        <div className="border-l border-gray-300 h-6 mx-1"></div>

        <div className="flex items-center gap-1 mr-2">
          <EditorButton 
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            title="Bullet List"
            icon={<FaListUl />}
          />
          <EditorButton 
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            title="Ordered List"
            icon={<FaListOl />}
          />
        </div>

        <div className="border-l border-gray-300 h-6 mx-1"></div>

        <div className="flex items-center gap-1 mr-2">
          <EditorButton 
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            isActive={editor.isActive({ textAlign: 'left' })}
            title="Align Left"
            icon={<FaAlignLeft />}
          />
          <EditorButton 
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            isActive={editor.isActive({ textAlign: 'center' })}
            title="Align Center"
            icon={<FaAlignCenter />}
          />
          <EditorButton 
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            isActive={editor.isActive({ textAlign: 'right' })}
            title="Align Right"
            icon={<FaAlignRight />}
          />
          <EditorButton 
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            isActive={editor.isActive({ textAlign: 'justify' })}
            title="Justify"
            icon={<FaAlignJustify />}
          />
        </div>

        <div className="border-l border-gray-300 h-6 mx-1"></div>

        <div className="flex items-center gap-1 mr-2">
          <EditorButton 
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            title="Quote"
            icon={<FaQuoteRight />}
          />
          <EditorButton 
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            isActive={editor.isActive('codeBlock')}
            title="Code Block"
            icon={<FaCode />}
          />
          <EditorButton 
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Horizontal Rule"
            icon={<RxDividerHorizontal />}
          />
        </div>

        <div className="border-l border-gray-300 h-6 mx-1"></div>

        <div className="flex items-center gap-1 mr-2">
          <EditorButton 
            onClick={setLink}
            isActive={editor.isActive('link')}
            title="Add Link"
            icon={<FaLink />}
          />
          <EditorButton 
            onClick={unsetLink}
            title="Remove Link"
            icon={<FaUnlink />}
          />
          <EditorButton 
            onClick={addImage}
            title="Add Image"
            icon={<FaImage />}
          />
          <EditorButton 
            onClick={insertTable}
            title="Insert Table"
            icon={<FaTable />}
          />
        </div>

        <div className="ml-auto">
          <EditorButton 
            onClick={previewContent}
            title="Preview"
            icon={<FaEye />}
          />
        </div>
      </div>

      {/* Bubble Menu */}
      {editor && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <div className="flex bg-white shadow-lg rounded-md border border-gray-200 p-1">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-1 rounded ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
            >
              <FaBold size={12} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-1 rounded ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
            >
              <FaItalic size={12} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`p-1 rounded ${editor.isActive('underline') ? 'bg-gray-200' : ''}`}
            >
              <FaUnderline size={12} />
            </button>
            <button
              onClick={setLink}
              className={`p-1 rounded ${editor.isActive('link') ? 'bg-gray-200' : ''}`}
            >
              <FaLink size={12} />
            </button>
            <button
              onClick={unsetLink}
              className="p-1 rounded"
              disabled={!editor.isActive('link')}
            >
              <FaUnlink size={12} />
            </button>
          </div>
        </BubbleMenu>
      )}

      {/* Editor Content */}
      <EditorContent 
        editor={editor} 
        className="prose text-white prose-indigo max-w-none p-4 min-h-[400px] focus:outline-none editor-content" 
      />
      
      {/* Table Controls Menu (shown when cursor is in a table) */}
      {editor && editor.isActive('table') && (
        <div className="bg-gray-50 p-2 border-t flex gap-2">
          <button
            onClick={() => editor.chain().focus().addColumnBefore().run()}
            className="px-2 py-1 text-xs bg-white border rounded hover:bg-gray-100"
          >
            Add Column Before
          </button>
          <button
            onClick={() => editor.chain().focus().addColumnAfter().run()}
            className="px-2 py-1 text-xs bg-white border rounded hover:bg-gray-100"
          >
            Add Column After
          </button>
          <button
            onClick={() => editor.chain().focus().deleteColumn().run()}
            className="px-2 py-1 text-xs bg-white border rounded hover:bg-gray-100"
          >
            Delete Column
          </button>
          <button
            onClick={() => editor.chain().focus().addRowBefore().run()}
            className="px-2 py-1 text-xs bg-white border rounded hover:bg-gray-100"
          >
            Add Row Before
          </button>
          <button
            onClick={() => editor.chain().focus().addRowAfter().run()}
            className="px-2 py-1 text-xs bg-white border rounded hover:bg-gray-100"
          >
            Add Row After
          </button>
          <button
            onClick={() => editor.chain().focus().deleteRow().run()}
            className="px-2 py-1 text-xs bg-white border rounded hover:bg-gray-100"
          >
            Delete Row
          </button>
          <button
            onClick={() => editor.chain().focus().deleteTable().run()}
            className="px-2 py-1 text-xs bg-white border rounded hover:bg-gray-100"
          >
            Delete Table
          </button>
        </div>
      )}

      {/* Character count */}
      <div className="bg-gray-50 p-2 border-t text-xs text-gray-500">
        {getCharacterCount()} characters
        {' · '}
        {getWordCount()} words
      </div>
    </div>
  );
}

// Wrap the component with memo for better performance
export default memo(BlogEditor);
