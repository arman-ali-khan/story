"use client";

import Link from "next/link";
import { Bookmark, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Chapter {
  id: string;
  title: string;
}

interface StoryCardProps {
  id: string;
  title: string;
  coverImage: string;
  chapters?: Chapter[];
  isBookmarked?: boolean;
  onBookmark?: () => void;
}

export function StoryCard({ 
  id, 
  title, 
  coverImage, 
  chapters = [],
  isBookmarked, 
  onBookmark 
}: StoryCardProps) {
  return (
    <Card className="relative group overflow-hidden h-full">
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 hover:bg-black/40"
        onClick={(e) => {
          e.preventDefault();
          onBookmark?.();
        }}
      >
        <Bookmark className={`${isBookmarked ? "fill-current" : "fill-none"} text-white`} />
      </Button>
      
      <div className="relative aspect-[3/4] sm:aspect-[350/400] overflow-hidden">
        <img
          src={coverImage || "/placeholder-cover.jpg"}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
          <Link href={`/story/${id}/chapters`}>
            <h3 className="text-white font-semibold text-sm sm:text-base line-clamp-2 mb-2">
              {title}
            </h3>
          </Link>
          
          {chapters.length > 0 && (
            <ScrollArea className="h-24 w-full rounded-md">
              <div className="space-y-1">
                {chapters.map((chapter) => (
                  <Link
                    key={chapter.id}
                    href={`/story/${id}/chapter/${chapter.id}`}
                    className="flex items-center justify-between text-sm text-white/90 hover:text-white hover:bg-white/10 rounded px-2 py-1 transition-colors"
                  >
                    <span className="line-clamp-1">{chapter.title}</span>
                    <ChevronRight className="h-4 w-4 shrink-0" />
                  </Link>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
    </Card>
  );
}
