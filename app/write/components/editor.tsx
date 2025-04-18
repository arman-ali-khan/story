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
      ['table'],
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
    'table'
  ];

  if (!mounted) {
    return (
      <div className="min-h-[500px] border rounded-lg p-4 prose dark:prose-invert max-w-none text-lg">
        Loading editor...
      </div>
    );
  }

  return (
    <div className="min-h-[500px] border rounded-lg prose dark:prose-invert max-w-none">
      <ReactQuill
        theme="bubble"
        value={content}
        onChange={onChange}
        modules={modules}
        formats={formats}
        className="min-h-[500px] focus:outline-none text-lg [&_.ql-editor]:text-lg"
      />
    </div>
  );
}
