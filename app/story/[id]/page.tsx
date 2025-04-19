"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, Bookmark, MessageSquare } from "lucide-react";
import { Reviews } from "./reviews";

// Temporary mock data - replace with actual data fetching
const mockStory = {
  id: "1",
  title: "The Hidden Moon",
  description: "A mesmerizing tale of mystery and romance set in the heart of Bengal. Follow the journey of two souls connected by destiny but separated by circumstances.",
  coverImage: "https://images.unsplash.com/photo-1744315900478-fa44dc6a4e89",
  rating: 4.3,
  reviewCount: 128,
  likes: 456,
  bookmarks: 89,
  followers: 34,
  author: {
    id: "auth1",
    name: "Rahul Das",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    level: "Master Storyteller",
    followers: 1234
  },
  chapters: [
    { id: "ch1", title: "The Beginning" },
    { id: "ch2", title: "Unexpected Turn" },
    { id: "ch3", title: "Revelations" },
  ]
};

export default function StoryPage() {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Chapter Navigation */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Chapters</h3>
              <div className="space-y-2">
                {mockStory.chapters.map((chapter) => (
                  <Link 
                    key={chapter.id}
                    href={`/story/${mockStory.id}/chapter/${chapter.id}`}
                    className="block p-2 hover:bg-accent rounded-md transition-colors"
                  >
                    {chapter.title}
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Story Content */}
          <div className="prose dark:prose-invert max-w-none">
            <h1 className="text-3xl font-bold mb-4">{mockStory.title}</h1>
            <p className="text-muted-foreground">{mockStory.description}</p>
          </div>

          {/* Interaction Stats */}
          <div className="flex items-center gap-6 py-4">
            <Button 
              variant="ghost" 
              className="flex items-center gap-2"
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className={`h-5 w-5 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
              {mockStory.likes}
            </Button>
            <Button 
              variant="ghost" 
              className="flex items-center gap-2"
              onClick={() => setIsBookmarked(!isBookmarked)}
            >
              <Bookmark className={`h-5 w-5 ${isBookmarked ? "fill-current" : ""}`} />
              {mockStory.bookmarks}
            </Button>
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Reviews ({mockStory.reviewCount})
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <Reviews storyId={mockStory.id} />
              </DrawerContent>
            </Drawer>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Cover Image */}
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg border">
            <Image
              src={mockStory.coverImage}
              alt={mockStory.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(mockStory.rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="font-semibold">{mockStory.rating}</span>
            <span className="text-muted-foreground">({mockStory.reviewCount} reviews)</span>
          </div>

          {/* Author Card */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={mockStory.author.image} />
                  <AvatarFallback>{mockStory.author.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{mockStory.author.name}</h3>
                      <Badge variant="secondary" className="mt-1">
                        {mockStory.author.level}
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      variant={isFollowing ? "outline" : "default"}
                      onClick={() => setIsFollowing(!isFollowing)}
                    >
                      {isFollowing ? "Following" : "Follow"}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {mockStory.author.followers.toLocaleString()} followers
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
