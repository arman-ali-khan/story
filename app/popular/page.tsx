"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { StoryCard } from "@/components/story-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star, TrendingUp, Eye, Clock } from "lucide-react";

// Temporary mock data - replace with actual data fetching
const mockStories = [
  {
    id: "1",
    title: "The Hidden Moon",
    coverImage: "https://images.unsplash.com/photo-1744315900478-fa44dc6a4e89",
    rating: 4.8,
    views: 15000,
    createdAt: "2024-03-01",
    chapters: [
      { id: "ch1", title: "The Beginning" },
      { id: "ch2", title: "Unexpected Turn" },
    ]
  },
  {
    id: "2",
    title: "River of Dreams",
    coverImage: "https://images.unsplash.com/photo-1744424705160-b12b262cda22",
    rating: 4.6,
    views: 12000,
    createdAt: "2024-03-10",
    chapters: [
      { id: "ch1", title: "Prologue" },
      { id: "ch2", title: "The Journey Begins" },
    ]
  },
  {
    id: "3",
    title: "The Last Sunset",
    coverImage: "https://images.unsplash.com/photo-1744762561513-6691932920fb",
    rating: 4.9,
    views: 18000,
    createdAt: "2024-03-15",
    chapters: [
      { id: "ch1", title: "Dawn" },
      { id: "ch2", title: "Dusk" },
    ]
  },
  {
    id: "4",
    title: "Mountain Tales",
    coverImage: "https://images.unsplash.com/photo-1744140390489-fc279d403107",
    rating: 4.7,
    views: 13500,
    createdAt: "2024-03-20",
    chapters: [
      { id: "ch1", title: "The Climb" },
      { id: "ch2", title: "Summit" },
    ]
  },
  {
    id: "5",
    title: "Ocean Whispers",
    coverImage: "https://images.unsplash.com/photo-1744360817731-c02ab9b95854",
    rating: 4.5,
    views: 11000,
    createdAt: "2024-03-25",
    chapters: [
      { id: "ch1", title: "Waves" },
      { id: "ch2", title: "Deep Waters" },
    ]
  },
];

type SortOption = "rating" | "views" | "newest";

export default function PopularPage() {
  const [sortBy, setSortBy] = useState<SortOption>("rating");
  const [timeRange, setTimeRange] = useState("all");

  const getSortedStories = () => {
    let filteredStories = [...mockStories];

    // Apply time range filter
    if (timeRange !== "all") {
      const now = new Date();
      const days = timeRange === "week" ? 7 : timeRange === "month" ? 30 : 365;
      const cutoff = new Date(now.setDate(now.getDate() - days));

      filteredStories = filteredStories.filter(story => 
        new Date(story.createdAt) >= cutoff
      );
    }

    // Apply sorting
    return filteredStories.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "views":
          return b.views - a.views;
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });
  };

  const sortedStories = getSortedStories();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <TrendingUp className="h-8 w-8" />
          Popular Stories
        </h1>

        <div className="flex flex-col sm:flex-row gap-4">
          <Select
            value={timeRange}
            onValueChange={(value) => setTimeRange(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button
              variant={sortBy === "rating" ? "default" : "outline"}
              onClick={() => setSortBy("rating")}
              className="flex-1 sm:flex-none"
            >
              <Star className="mr-2 h-4 w-4" />
              Top Rated
            </Button>
            <Button
              variant={sortBy === "views" ? "default" : "outline"}
              onClick={() => setSortBy("views")}
              className="flex-1 sm:flex-none"
            >
              <Eye className="mr-2 h-4 w-4" />
              Most Viewed
            </Button>
            <Button
              variant={sortBy === "newest" ? "default" : "outline"}
              onClick={() => setSortBy("newest")}
              className="flex-1 sm:flex-none"
            >
              <Clock className="mr-2 h-4 w-4" />
              Newest
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        {sortedStories.map((story) => (
          <div key={story.id} className="flex flex-col">
            <StoryCard
              id={story.id}
              title={story.title}
              coverImage={story.coverImage}
              chapters={story.chapters}
            />
            <div className="mt-2 px-1 flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center">
                <Star className="mr-1 h-4 w-4 text-yellow-400" />
                {story.rating.toFixed(1)}
              </div>
              <div>{story.views.toLocaleString()} views</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}