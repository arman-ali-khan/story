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

interface ToolbarPosition {
  top: number;
  left: number;
}

const FloatingToolbar = ({ onInsertImage, visible, position }: { onInsertImage: () => void; visible: boolean; position: ToolbarPosition }) => {
  if (!visible) return null;
  
  return (
    <div 
      className="fixed transform flex gap-2 bg-background border rounded-lg p-2 shadow-lg transition-opacity duration-200 z-50"
      style={{ 
        top: `${position.top}px`,
        left: `${position.left}px`
      }}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={onInsertImage}
        title="Insert Image"
      >
        <Image className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default function Editor({ content, onChange }: EditorProps) {
  const [showFloatingToolbar, setShowFloatingToolbar] = useState(false);
  const [floatingToolbarPosition, setFloatingToolbarPosition] = useState<ToolbarPosition>({ top: 0, left: 0 });
  const editorRef = useRef<HTMLDivElement>(null);
  const editorInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const MediumEditor = require("medium-editor");
      if (editorRef.current && !editorInstanceRef.current) {
        editorInstanceRef.current = new MediumEditor(editorRef.current, {
          toolbar: {
            buttons: [
              "bold",
              "italic",
              "underline",
              "anchor",
              "h2",
              "h3",
              "quote",
              "orderedlist",
              "unorderedlist",
            ],
          },
          placeholder: {
            text: "Write your story...",
          },
        });

        // Save content on change
        editorInstanceRef.current.subscribe("editableInput", () => {
          const newContent = editorInstanceRef.current.getContent();
          onChange(newContent);
        });

        // Handle cursor position changes
        editorRef.current.addEventListener('keyup', handleKeyUp);
        editorRef.current.addEventListener('mouseup', handleCursorPosition);
        editorRef.current.addEventListener('input', handleCursorPosition);
        document.addEventListener('selectionchange', handleSelectionChange);
      }
    }

    return () => {
      if (editorInstanceRef.current) {
        if (editorRef.current) {
          editorRef.current.removeEventListener('keyup', handleKeyUp);
          editorRef.current.removeEventListener('mouseup', handleCursorPosition);
          editorRef.current.removeEventListener('input', handleCursorPosition);
        }
        document.removeEventListener('selectionchange', handleSelectionChange);
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
    if (e.key === 'Enter') {
      handleCursorPosition();
    }
  };

  const handleSelectionChange = () => {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    if (!range.collapsed) {
      // Text is selected
      const rect = range.getBoundingClientRect();
      const editorRect = editorRef.current?.getBoundingClientRect();
      
      if (editorRect) {
        setFloatingToolbarPosition({
          top: rect.top + window.scrollY - 40, // Position above selection
          left: rect.left + (rect.width / 2) // Center horizontally
        });
        setShowFloatingToolbar(true);
      }
    } else {
      handleCursorPosition(); // Check for empty lines when no selection
    }
  };

  const handleCursorPosition = () => {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const startContainer = range.startContainer;
    
    // Check if we're at the start of a new line or empty paragraph
    const isNewLine = startContainer.nodeType === Node.TEXT_NODE && 
      (startContainer.textContent?.length === 0 || 
       range.startOffset === 0 ||
       startContainer.textContent?.charAt(range.startOffset - 1) === '\n');

    // Also check for empty paragraphs
    const isEmptyParagraph = startContainer.nodeType === Node.ELEMENT_NODE &&
      (startContainer as Element).tagName === 'P' &&
      (!startContainer.textContent || startContainer.textContent.trim() === '');

    if (isNewLine || isEmptyParagraph) {
      const rect = range.getBoundingClientRect();
      const editorRect = editorRef.current?.getBoundingClientRect();
      
      if (editorRect) {
        setFloatingToolbarPosition({
          top: rect.top + window.scrollY,
          left: editorRect.left - 40 // Position to the left of the cursor
        });
        setShowFloatingToolbar(true);
      }
    } else {
      setShowFloatingToolbar(false);
    }
  };

  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = document.createElement("img");
          img.src = e.target?.result as string;
          img.className = "max-w-full h-auto my-4";
          
          if (editorInstanceRef.current) {
            const selection = window.getSelection();
            if (selection && selection.rangeCount) {
              const range = selection.getRangeAt(0);
              range.deleteContents();
              range.insertNode(img);
              // Move cursor after image
              range.setStartAfter(img);
              range.setEndAfter(img);
              selection.removeAllRanges();
              selection.addRange(range);
            }
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  return (
    <>
      <FloatingToolbar 
        onInsertImage={handleImageUpload} 
        visible={showFloatingToolbar} 
        position={floatingToolbarPosition}
      />
      <div 
        ref={editorRef}
        className="min-h-[500px] border rounded-lg p-4 prose dark:prose-invert max-w-none focus:outline-none"
        style={{ position: 'relative' }}
      />
    </>
  );
}
