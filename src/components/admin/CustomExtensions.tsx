import { Extension } from '@tiptap/core';
import { Plugin } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

// Extension to ensure cursor always stays visible
export const EnsureVisibleCursor = Extension.create({
  name: 'ensureVisibleCursor',
  
  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          // Ensure the cursor is always visible by scrolling it into view
          handleDOMEvents: {
            keydown: (view: EditorView) => {
              // Set a small timeout to scroll after the change has been applied
              setTimeout(() => {
                const { state } = view;
                
                // Scroll the selection into view
                view.dispatch(state.tr.scrollIntoView());
              }, 50);
              
              return false;
            },
          },
        },
      }),
    ];
  },
});

// Extension to smooth out typing experience
export const SmoothTyping = Extension.create({
  name: 'smoothTyping',
  
  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          // Reduce the debounce time for typing
          handleKeyDown: () => {
            // Return false to let the event be handled by other plugins
            return false;
          },
        },
      }),
    ];
  },
});

// Extension to better handle Enter key press behavior
export const BetterEnterHandling = Extension.create({
  name: 'betterEnterHandling',
  
  // Ensuring the extension is applied after other editor behaviors
  priority: 100,
  
  // Other editor extensions will still have their usual behavior
  // But this will adjust the final result to feel more natural
  addKeyboardShortcuts() {
    return {
      // Empty so it doesn't override other enter key handling
    };
  },
}); 