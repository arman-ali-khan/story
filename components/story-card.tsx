"use client";

import Link from "next/link";
import { Bookmark } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface StoryCardProps {
  id: string;
  title: string;
  coverImage: string;
  isBookmarked?: boolean;
  onBookmark?: () => void;
}

export function StoryCard({ id, title, coverImage, isBookmarked, onBookmark }: StoryCardProps) {
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
      <Link href={`/story/${id}`} className="block h-full">
        <div className="relative aspect-[3/4] sm:aspect-[350/400] overflow-hidden h-full">
          <img
            src={coverImage || "/placeholder-cover.jpg"}
            alt={title}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
            <h3 className="text-white font-semibold text-sm sm:text-base line-clamp-2">{title}</h3>
          </div>
        </div>
      </Link>
    </Card>
  );
}
