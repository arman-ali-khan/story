"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.bubble.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function Editor({ content, onChange }: EditorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const modules = {
    toolbar: [
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      ['blockquote', 'code-block'],
      [{ 'align': ['', 'center', 'right', 'justify'] }],
      ['clean']
    ]
  };

  const formats = [
    'size',
    'bold', 'italic', 'underline',
    'list', 'bullet',
    'script',
    'blockquote', 'code-block',
    'align',
  ];

  if (!mounted) {
    return (
      <div className="min-h-[300px] max-h-[600px] overflow-y-auto border rounded-lg p-4 prose dark:prose-invert max-w-none text-lg">
        Loading editor...
      </div>
    );
  }

  return (
    <div className="min-h-[300px] max-h-[600px] border rounded-lg prose dark:prose-invert max-w-none">
      <ReactQuill
        placeholder="Start writing your story..."
        theme="bubble"
        value={content}
        onChange={onChange}
        modules={modules}
        formats={formats}
        className="min-h-[300px] max-h-[600px] overflow-y-auto focus:outline-none text-lg [&_.ql-editor]:text-lg [&_.ql-editor]:min-h-[300px] [&_.ql-editor]:max-h-[600px]"
      />
    </div>
  );
}
