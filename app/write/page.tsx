"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Save, Eye, Image } from "lucide-react";
import "medium-editor/dist/css/medium-editor.css";
import "medium-editor/dist/css/themes/default.css";

const categories = [
  { value: "romance", label: "Romance" },
  { value: "horror", label: "Horror" },
  { value: "mystery", label: "Mystery" },
  { value: "drama", label: "Drama" },
  { value: "poetry", label: "Poetry" },
  { value: "other", label: "Other" },
];

interface Chapter {
  id: string;
  title: string;
  content: string;
}

interface ToolbarPosition {
  top: number;
  left: number;
}

const FloatingToolbar = ({ onInsertImage, visible, position }: { onInsertImage: () => void; visible: boolean; position: ToolbarPosition }) => {
  if (!visible) return null;
  
  return (
    <div 
      className="fixed transform flex flex-col gap-2 bg-background border rounded-lg p-2 shadow-lg transition-opacity duration-200 z-50"
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

export default function WritePage() {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([
    { id: "1", title: "Chapter 1", content: "" },
  ]);
  const [activeChapter, setActiveChapter] = useState<string>("1");
  const [previewMode, setPreviewMode] = useState(false);
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
          const content = editorInstanceRef.current.getContent();
          setChapters((prev) =>
            prev.map((ch) =>
              ch.id === activeChapter ? { ...ch, content } : ch
            )
          );
        });

        // Handle cursor position changes
        editorRef.current.addEventListener('keyup', handleKeyUp);
        editorRef.current.addEventListener('mouseup', handleCursorPosition);
        editorRef.current.addEventListener('input', handleCursorPosition);
      }
    }

    return () => {
      if (editorInstanceRef.current) {
        if (editorRef.current) {
          editorRef.current.removeEventListener('keyup', handleKeyUp);
          editorRef.current.removeEventListener('mouseup', handleCursorPosition);
          editorRef.current.removeEventListener('input', handleCursorPosition);
        }
        editorInstanceRef.current.destroy();
        editorInstanceRef.current = null;
      }
    };
  }, [activeChapter]);

  useEffect(() => {
    if (editorRef.current && editorInstanceRef.current) {
      const currentChapter = chapters.find((ch) => ch.id === activeChapter);
      if (editorRef.current) {
        editorRef.current.innerHTML = currentChapter?.content || "";
      }
    }
  }, [activeChapter, chapters]);

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCursorPosition();
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
          left: Math.max(editorRect.left, rect.left - 40) // Position 40px to the left of cursor
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

  const addChapter = () => {
    const newChapter = {
      id: (chapters.length + 1).toString(),
      title: `Chapter ${chapters.length + 1}`,
      content: "",
    };
    setChapters([...chapters, newChapter]);
    setActiveChapter(newChapter.id);
  };

  const switchChapter = (chapterId: string) => {
    setActiveChapter(chapterId);
  };

  const handlePublish = async () => {
    toast({
      title: "Story published",
      description: "Your story has been published successfully.",
    });
  };

  const handleSaveDraft = async () => {
    toast({
      title: "Draft saved",
      description: "Your story has been saved as a draft.",
    });
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Write Your Story</h1>
        <div className="space-x-2">
          <Button variant="outline" onClick={handleSaveDraft}>
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          <Button variant="outline" onClick={() => setPreviewMode(!previewMode)}>
            <Eye className="mr-2 h-4 w-4" />
            {previewMode ? "Edit" : "Preview"}
          </Button>
          <Button onClick={handlePublish}>
            <BookOpen className="mr-2 h-4 w-4" />
            Publish
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div>
            <Label htmlFor="title">Story Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your story title"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of your story"
            />
          </div>

          <div className="flex space-x-2 overflow-x-auto pb-2">
            {chapters.map((chapter) => (
              <Button
                key={chapter.id}
                variant={activeChapter === chapter.id ? "default" : "outline"}
                onClick={() => switchChapter(chapter.id)}
              >
                {chapter.title}
              </Button>
            ))}
            <Button variant="outline" onClick={addChapter}>
              + Add Chapter
            </Button>
          </div>

          <FloatingToolbar 
            onInsertImage={handleImageUpload} 
            visible={showFloatingToolbar} 
            position={floatingToolbarPosition}
          />

          {!previewMode ? (
            <div 
              ref={editorRef}
              className="min-h-[500px] border rounded-lg p-4 prose dark:prose-invert max-w-none focus:outline-none"
              style={{ position: 'relative' }}
            />
          ) : (
            <div
              className="prose dark:prose-invert max-w-none min-h-[500px] border rounded-lg p-4"
              dangerouslySetInnerHTML={{
                __html: chapters.find((ch) => ch.id === activeChapter)?.content || "",
              }}
            />
          )}
        </div>

        <div className="space-y-4">
          <div>
            <Label>Categories</Label>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={category.value}
                    checked={selectedCategories.includes(category.value)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCategories([...selectedCategories, category.value]);
                      } else {
                        setSelectedCategories(
                          selectedCategories.filter((cat) => cat !== category.value)
                        );
                      }
                    }}
                    className="h-4 w-4"
                  />
                  <Label htmlFor={category.value}>{category.label}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>Language</Label>
            <Select defaultValue="bn">
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bn">Bengali</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">Hindi</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
