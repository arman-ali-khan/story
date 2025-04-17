"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Image } from "lucide-react";
import "medium-editor/dist/css/medium-editor.css";
import "medium-editor/dist/css/themes/default.css";

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function Editor({ content, onChange }: EditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const editorInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const MediumEditor = require("medium-editor");

      // Create custom image button extension
      const ImageButtonExtension = MediumEditor.Extension.extend({
        name: 'imageButton',
        
        init: function() {
          this.button = document.createElement('button');
          this.button.classList.add('medium-editor-action');
          this.button.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7m4 2v4h4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 15 4 20m0-5 5 5M21 3h-6v6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
          this.button.title = 'Insert Image';
          
          this.on(this.button, 'click', this.handleClick.bind(this));
        },
        
        getButton: function() {
          return this.button;
        },
        
        handleClick: function(event) {
          event.preventDefault();
          event.stopPropagation();
          
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = 'image/*';
          
          input.onchange = (e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (e) => {
                const img = `<img src="${e.target?.result}" class="max-w-full h-auto my-4" alt="Uploaded image" />`;
                this.base.pasteHTML(img);
              };
              reader.readAsDataURL(file);
            }
          };
          
          input.click();
        }
      });

      if (editorRef.current && !editorInstanceRef.current) {
        editorInstanceRef.current = new MediumEditor(editorRef.current, {
          toolbar: {
            buttons: [
              'bold',
              'italic',
              'underline',
              'anchor',
              'h2',
              'h3',
              'quote',
              'orderedlist',
              'unorderedlist',
              'imageButton'
            ],
            static: true,
            sticky: true,
            align: 'center',
            updateOnEmptySelection: true
          },
          placeholder: {
            text: "Write your story...",
            hideOnClick: false
          },
          extensions: {
            'imageButton': new ImageButtonExtension()
          },
          paste: {
            forcePlainText: false,
            cleanPastedHTML: true,
            cleanAttrs: ['style', 'dir'],
            cleanTags: ['meta', 'script', 'style']
          }
        });

        // Save content on change
        editorInstanceRef.current.subscribe('editableInput', () => {
          if (editorRef.current) {
            const newContent = editorRef.current.innerHTML;
            onChange(newContent);
          }
        });

        // Show toolbar on empty lines and text selection
        editorRef.current.addEventListener('keyup', handleKeyUp);
        editorRef.current.addEventListener('mouseup', handleSelection);
        document.addEventListener('selectionchange', handleSelection);
      }
    }

    return () => {
      if (editorInstanceRef.current) {
        if (editorRef.current) {
          editorRef.current.removeEventListener('keyup', handleKeyUp);
          editorRef.current.removeEventListener('mouseup', handleSelection);
        }
        document.removeEventListener('selectionchange', handleSelection);
        editorInstanceRef.current.destroy();
        editorInstanceRef.current = null;
      }
    };
  }, [onChange]);

  useEffect(() => {
    if (editorRef.current && editorInstanceRef.current) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  const handleKeyUp = (e: KeyboardEvent) => {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const startContainer = range.startContainer;
    
    // Check if we're at the start of a new line or empty paragraph
    const isNewLine = startContainer.nodeType === Node.TEXT_NODE && 
      (startContainer.textContent?.length === 0 || 
       range.startOffset === 0 ||
       startContainer.textContent?.charAt(range.startOffset - 1) === '\n');

    // Check for empty paragraphs
    const isEmptyParagraph = startContainer.nodeType === Node.ELEMENT_NODE &&
      (startContainer as Element).tagName === 'P' &&
      (!startContainer.textContent || startContainer.textContent.trim() === '');

    if ((isNewLine || isEmptyParagraph) && editorInstanceRef.current?.toolbar) {
      editorInstanceRef.current.toolbar.showToolbar();
    }
  };

  const handleSelection = () => {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    if (!range.collapsed && editorInstanceRef.current?.toolbar) {
      editorInstanceRef.current.toolbar.showToolbar();
    }
  };

  return (
    <div 
      ref={editorRef}
      className="min-h-[500px] border rounded-lg p-4 prose dark:prose-invert max-w-none focus:outline-none"
      style={{ position: 'relative' }}
    />
  );
}
