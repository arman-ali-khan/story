"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Eye, ImageIcon } from "lucide-react";
import Editor from "./components/editor";
import { Checkbox } from "@/components/ui/checkbox";

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

interface StoryDraft {
  title: string;
  description: string;
  selectedCategories: string[];
  chapters: Chapter[];
  coverImage: string | null;
  lastSaved: number;
}

const DRAFT_KEY = 'story_draft';
const SAVE_DELAY = 2000; // 2 seconds

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
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [showChapterInput, setShowChapterInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  // Load draft from local storage
  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      const draft: StoryDraft = JSON.parse(savedDraft);
      setTitle(draft.title);
      setDescription(draft.description);
      setSelectedCategories(draft.selectedCategories);
      setChapters(draft.chapters);
      setCoverImage(draft.coverImage);
    }
  }, []);

  // Save draft function
  const saveDraft = () => {
    const draft: StoryDraft = {
      title,
      description,
      selectedCategories,
      chapters,
      coverImage,
      lastSaved: Date.now(),
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    
    // Show toast only if there are actual changes
    if (title || description || chapters[0].content) {
      toast({
        title: "Draft saved",
        description: "Your story has been automatically saved",
      });
    }
  };

  // Handle content changes with debounce
  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(saveDraft, SAVE_DELAY);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [title, description, selectedCategories, chapters, coverImage]);

  // Handle Ctrl+S keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveDraft();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [title, description, selectedCategories, chapters, coverImage]);

  const addChapter = () => {
    if (!showChapterInput) {
      setShowChapterInput(true);
      return;
    }

    if (!newChapterTitle.trim()) {
      toast({
        variant: "destructive",
        title: "Chapter title required",
        description: "Please enter a title for the new chapter",
      });
      return;
    }

    const newChapter = {
      id: (chapters.length + 1).toString(),
      title: newChapterTitle,
      content: "",
    };
    setChapters([...chapters, newChapter]);
    setActiveChapter(newChapter.id);
    setNewChapterTitle("");
    setShowChapterInput(false);
  };

  const switchChapter = (chapterId: string) => {
    setActiveChapter(chapterId);
  };

  const handleContentChange = (content: string) => {
    setChapters((prev) =>
      prev.map((ch) =>
        ch.id === activeChapter ? { ...ch, content } : ch
      )
    );
  };

  const handlePublish = async () => {
    // Clear draft from local storage
    localStorage.removeItem(DRAFT_KEY);
    
    toast({
      title: "Story published",
      description: "Your story has been published successfully.",
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const currentChapter = chapters.find((ch) => ch.id === activeChapter);

  return (
    <div className="container mx-auto py-8 space-y-6">
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
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of your story (Min 3 or 4 line)"
              className="overflow-hidden min-h-[40px] h-9"
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "0px";
                target.style.height = `${target.scrollHeight}px`;
              }}
            />
          </div>

          <div className="space-y-2">
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
            
            {showChapterInput && (
              <div className="flex items-center gap-2">
                <Input
                  value={newChapterTitle}
                  onChange={(e) => setNewChapterTitle(e.target.value)}
                  placeholder="Enter chapter title"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addChapter();
                    }
                  }}
                />
                <Button onClick={addChapter}>Add</Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowChapterInput(false);
                    setNewChapterTitle("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>

          {!previewMode ? (
            <Editor 
              content={currentChapter?.content || ""} 
              onChange={handleContentChange}
            />
          ) : (
            <div
              className="prose dark:prose-invert max-w-none min-h-[500px] border rounded-lg p-4"
              dangerouslySetInnerHTML={{
                __html: currentChapter?.content || "",
              }}
            />
          )}
        </div>

        <div className="space-y-6">
          <div className="border rounded-lg p-4 space-y-4">
            <Label>Cover Image</Label>
            <div className="relative w-full aspect-[2/1] h-[400px] overflow-hidden rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-800">
              {coverImage ? (
                <img
                  src={coverImage}
                  alt="Cover preview"
                  className="w-[300px] h-[400px] object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">300 x 400 recommended</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden h-[400px]"
              />
              <Button
                variant="ghost"
                className="absolute inset-0 w-full h-[400px] opacity-0 hover:opacity-100 bg-black/50 text-white transition-opacity"
                onClick={() => fileInputRef.current?.click()}
              >
                Change Cover
              </Button>
            </div>
          </div>

          <div className="border rounded-lg p-4 space-y-4">
            <Label>Categories</Label>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={category.value}
                    checked={selectedCategories.includes(category.value)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedCategories([...selectedCategories, category.value]);
                      } else {
                        setSelectedCategories(
                          selectedCategories.filter((cat) => cat !== category.value)
                        );
                      }
                    }}
                  />
                  <Label htmlFor={category.value}>{category.label}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex sticky z-50 top-0 justify-between items-center">
            <div className="space-x-2">
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
        </div>
      </div>
    </div>
  );
}