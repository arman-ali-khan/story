"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Volume2, Sun, Type, Music, Menu, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Temporary mock data - replace with actual data fetching
const mockStory = {
  id: "1",
  title: "The Hidden Moon",
  currentChapter: {
    id: "ch1",
    title: "The Beginning",
    content: `<h1>Chapter 1: The Beginning</h1>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>`
  },
  chapters: [
    { id: "ch1", title: "The Beginning", views: 1200, rating: 4.5 },
    { id: "ch2", title: "Unexpected Turn", views: 980, rating: 4.2 },
    { id: "ch3", title: "Revelations", views: 850, rating: 4.7 },
  ]
};

export default function ChapterPage() {
  const router = useRouter();
  const [fontSize, setFontSize] = useState(16);
  const [brightness, setBrightness] = useState(100);
  const [volume, setVolume] = useState(50);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentChapterIndex = mockStory.chapters.findIndex(
    (chapter) => chapter.id === mockStory.currentChapter.id
  );

  const prevChapter = mockStory.chapters[currentChapterIndex - 1];
  const nextChapter = mockStory.chapters[currentChapterIndex + 1];

  const handleFontSizeChange = (value: number[]) => {
    setFontSize(value[0]);
  };

  const handleBrightnessChange = (value: number[]) => {
    setBrightness(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    if (audioRef.current) {
      audioRef.current.volume = value[0] / 100;
    }
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const navigateToChapter = (chapterId: string) => {
    router.push(`/story/${mockStory.id}/chapter/${chapterId}`);
  };

  return (
    <div className="min-h-screen flex">
      {/* Chapters Sidebar (Desktop) */}
      <div className="hidden lg:block w-80 border-r bg-background">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Chapters</h2>
        </div>
        <div className="p-2">
          {mockStory.chapters.map((chapter) => (
            <button
              key={chapter.id}
              onClick={() => navigateToChapter(chapter.id)}
              className={`w-full text-left p-3 rounded-md transition-colors ${
                chapter.id === mockStory.currentChapter.id
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent/50"
              }`}
            >
              <div className="font-medium">{chapter.title}</div>
              <div className="text-sm text-muted-foreground mt-1">
                {chapter.views.toLocaleString()} views • Rating: {chapter.rating.toFixed(1)}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Chapter title bar */}
        <div className="sticky top-0 z-10 bg-background border-b">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Chapters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4 space-y-2">
                    {mockStory.chapters.map((chapter) => (
                      <Button
                        key={chapter.id}
                        variant={chapter.id === mockStory.currentChapter.id ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => navigateToChapter(chapter.id)}
                      >
                        <div className="text-left">
                          <div>{chapter.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {chapter.views.toLocaleString()} views • Rating: {chapter.rating.toFixed(1)}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
              <h1 className="text-xl font-semibold">{mockStory.currentChapter.title}</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMusic}
              >
                <Music className={isPlaying ? "text-primary" : ""} />
              </Button>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Type className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Reading Settings</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4 space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Type className="h-4 w-4" />
                        <span className="text-sm">Font Size</span>
                      </div>
                      <Slider
                        value={[fontSize]}
                        min={12}
                        max={24}
                        step={1}
                        onValueChange={handleFontSizeChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Sun className="h-4 w-4" />
                        <span className="text-sm">Brightness</span>
                      </div>
                      <Slider
                        value={[brightness]}
                        min={50}
                        max={100}
                        step={1}
                        onValueChange={handleBrightnessChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Volume2 className="h-4 w-4" />
                        <span className="text-sm">Music Volume</span>
                      </div>
                      <Slider
                        value={[volume]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={handleVolumeChange}
                      />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Main Content */}
          <Card className="max-w-3xl mx-auto p-6">
            <div 
              className="prose dark:prose-invert max-w-none"
              style={{ 
                fontSize: `${fontSize}px`,
                filter: `brightness(${brightness}%)` 
              }}
              dangerouslySetInnerHTML={{ __html: mockStory.currentChapter.content }}
            />

            {/* Chapter Navigation */}
            <div className="mt-8 flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => prevChapter && navigateToChapter(prevChapter.id)}
                disabled={!prevChapter}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous Chapter
              </Button>
              <Button
                variant="outline"
                onClick={() => nextChapter && navigateToChapter(nextChapter.id)}
                disabled={!nextChapter}
              >
                Next Chapter
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Background Music Audio Element */}
      <audio
        ref={audioRef}
        loop
        src="https://example.com/background-music.mp3"
        className="hidden"
      />
    </div>
  );
}