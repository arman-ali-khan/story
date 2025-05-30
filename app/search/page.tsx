"use client";

import { useState } from "react";
import { StoryCard } from "@/components/story-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search as SearchIcon, SlidersHorizontal } from "lucide-react";

// Temporary mock data
const mockStories = [
  {
    id: "1",
    title: "The Hidden Moon",
    coverImage: "https://images.unsplash.com/photo-1744315900478-fa44dc6a4e89",
    author: "Rahul Das",
    category: "Fiction",
    genre: "Mystery",
    tags: ["supernatural", "thriller"],
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
    author: "Priya Sharma",
    category: "Poetry",
    genre: "Romance",
    tags: ["love", "nature"],
    createdAt: "2024-02-15",
    chapters: [
      { id: "ch1", title: "Prologue" },
      { id: "ch2", title: "The Journey Begins" },
    ]
  },
  // Add more mock stories...
];

const authors = ["Rahul Das", "Priya Sharma", "Amit Roy", "Sanjana Gupta"];
const categories = ["Fiction", "Non-Fiction", "Poetry", "Drama"];
const genres = ["Romance", "Mystery", "Horror", "Thriller", "Fantasy"];
const tags = ["supernatural", "thriller", "love", "nature", "adventure", "drama"];

interface Filters {
  authors: string[];
  categories: string[];
  genres: string[];
  tags: string[];
  year: string;
  month: string;
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Filters>({
    authors: [],
    categories: [],
    genres: [],
    tags: [],
    year: "any",
    month: "any",
  });

  const years = Array.from({ length: 5 }, (_, i) => 
    (new Date().getFullYear() - i).toString()
  );
  
  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const toggleFilter = (type: keyof Filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter(item => item !== value)
        : [...prev[type], value]
    }));
  };

  const clearFilters = () => {
    setFilters({
      authors: [],
      categories: [],
      genres: [],
      tags: [],
      year: "any",
      month: "any",
    });
  };

  const filteredStories = mockStories.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         story.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesAuthor = filters.authors.length === 0 || filters.authors.includes(story.author);
    const matchesCategory = filters.categories.length === 0 || filters.categories.includes(story.category);
    const matchesGenre = filters.genres.length === 0 || filters.genres.includes(story.genre);
    const matchesTags = filters.tags.length === 0 || story.tags.some(tag => filters.tags.includes(tag));
    
    const storyDate = new Date(story.createdAt);
    const matchesYear = filters.year === "any" || storyDate.getFullYear().toString() === filters.year;
    const matchesMonth = filters.month === "any" || (storyDate.getMonth() + 1).toString().padStart(2, '0') === filters.month;

    return matchesSearch && matchesAuthor && matchesCategory && matchesGenre && matchesTags && matchesYear && matchesMonth;
  });

  const activeFiltersCount = Object.values(filters).flat().filter(Boolean).length;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search stories by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[300px] sm:w-[540px]">
              <SheetHeader>
                <SheetTitle>Search Filters</SheetTitle>
              </SheetHeader>
              <div className="grid gap-6 py-4">
                {/* Date Filters */}
                <div className="grid gap-2">
                  <h3 className="font-medium">Date</h3>
                  <div className="flex gap-2">
                    <Select
                      value={filters.year}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, year: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any Year</SelectItem>
                        {years.map(year => (
                          <SelectItem key={year} value={year}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={filters.month}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, month: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any Month</SelectItem>
                        {months.map(month => (
                          <SelectItem key={month.value} value={month.value}>
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Authors */}
                <div className="grid gap-2">
                  <h3 className="font-medium">Authors</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {authors.map(author => (
                      <div key={author} className="flex items-center space-x-2">
                        <Checkbox
                          id={`author-${author}`}
                          checked={filters.authors.includes(author)}
                          onCheckedChange={() => toggleFilter('authors', author)}
                        />
                        <label htmlFor={`author-${author}`} className="text-sm">
                          {author}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                <div className="grid gap-2">
                  <h3 className="font-medium">Categories</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map(category => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category}`}
                          checked={filters.categories.includes(category)}
                          onCheckedChange={() => toggleFilter('categories', category)}
                        />
                        <label htmlFor={`category-${category}`} className="text-sm">
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Genres */}
                <div className="grid gap-2">
                  <h3 className="font-medium">Genres</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {genres.map(genre => (
                      <div key={genre} className="flex items-center space-x-2">
                        <Checkbox
                          id={`genre-${genre}`}
                          checked={filters.genres.includes(genre)}
                          onCheckedChange={() => toggleFilter('genres', genre)}
                        />
                        <label htmlFor={`genre-${genre}`} className="text-sm">
                          {genre}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className="grid gap-2">
                  <h3 className="font-medium">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <Badge
                        key={tag}
                        variant={filters.tags.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleFilter('tags', tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="mt-4"
                >
                  Clear All Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {filters.authors.map(author => (
            <Badge
              key={author}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => toggleFilter('authors', author)}
            >
              {author} ×
            </Badge>
          ))}
          {filters.categories.map(category => (
            <Badge
              key={category}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => toggleFilter('categories', category)}
            >
              {category} ×
            </Badge>
          ))}
          {filters.genres.map(genre => (
            <Badge
              key={genre}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => toggleFilter('genres', genre)}
            >
              {genre} ×
            </Badge>
          ))}
          {filters.tags.map(tag => (
            <Badge
              key={tag}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => toggleFilter('tags', tag)}
            >
              {tag} ×
            </Badge>
          ))}
          {filters.year !== "any" && (
            <Badge
              variant="secondary"
              className="cursor-pointer"
              onClick={() => setFilters(prev => ({ ...prev, year: "any" }))}
            >
              {filters.year} ×
            </Badge>
          )}
          {filters.month !== "any" && (
            <Badge
              variant="secondary"
              className="cursor-pointer"
              onClick={() => setFilters(prev => ({ ...prev, month: "any" }))}
            >
              {months.find(m => m.value === filters.month)?.label} ×
            </Badge>
          )}
        </div>
      )}

      {/* Search Results */}
      <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        {filteredStories.map((story) => (
          <div key={story.id} className="flex flex-col">
            <StoryCard
              id={story.id}
              title={story.title}
              coverImage={story.coverImage}
              chapters={story.chapters}
            />
            <div className="mt-2 px-1">
              <div className="text-sm text-muted-foreground">{story.author}</div>
              <div className="flex flex-wrap gap-1 mt-1">
                <Badge variant="outline" className="text-xs">
                  {story.category}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {story.genre}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredStories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No stories found matching your criteria</p>
        </div>
      )}
    </div>
  );
}