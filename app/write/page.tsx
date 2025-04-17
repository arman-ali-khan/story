"use client";

import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
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
import { BookOpen, Save, Eye } from "lucide-react";

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

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      setChapters((prev) =>
        prev.map((ch) =>
          ch.id === activeChapter ? { ...ch, content } : ch
        )
      );
    },
  });

  const addChapter = () => {
    const newChapter = {
      id: (chapters.length + 1).toString(),
      title: `Chapter ${chapters.length + 1}`,
      content: "",
    };
    setChapters([...chapters, newChapter]);
    setActiveChapter(newChapter.id);
    editor?.commands.setContent("");
  };

  const switchChapter = (chapterId: string) => {
    const chapter = chapters.find((ch) => ch.id === chapterId);
    if (chapter) {
      setActiveChapter(chapterId);
      editor?.commands.setContent(chapter.content);
    }
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

          {!previewMode ? (
            <div className="min-h-[500px] border rounded-lg p-4">
              <EditorContent editor={editor} />
            </div>
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