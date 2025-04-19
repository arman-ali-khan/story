import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, PenLine, Heart } from "lucide-react";
import { StoryCarousel } from "@/components/story-carousel";

// Temporary mock data - replace with actual data fetching
const mockStories = [
  {
    id: "1",
    title: "The Hidden Moon",
    coverImage: "https://images.unsplash.com/photo-1744315900478-fa44dc6a4e89?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8",
  },
  {
    id: "2",
    title: "River of Dreams",
    coverImage: "https://images.unsplash.com/photo-1744424705160-b12b262cda22?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8",
  },
  {
    id: "3",
    title: "The Last Sunset",
    coverImage: "https://images.unsplash.com/photo-1744762561513-6691932920fb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxNXx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "4",
    title: "Mountain Tales",
    coverImage: "https://images.unsplash.com/photo-1744140390489-fc279d403107?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0fHx8ZW58MHx8fHx8",
  },
  {
    id: "5",
    title: "Ocean Whispers",
    coverImage: "https://images.unsplash.com/photo-1744360817731-c02ab9b95854?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw3fHx8ZW58MHx8fHx8",
  },
];

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-16">
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          Share Your Stories with the World
        </h1>
        <p className="text-lg text-muted-foreground">
          A platform for Bengali writers and readers to connect through stories,
          novels, and poems. Start your journey today.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/explore">
            <Button size="lg" variant="default">
              <BookOpen className="mr-2 h-5 w-5" />
              Start Reading
            </Button>
          </Link>
          <Link href="/write">
            <Button size="lg" variant="outline">
              <PenLine className="mr-2 h-5 w-5" />
              Start Writing
            </Button>
          </Link>
        </div>
      </div>

      <StoryCarousel title="Popular Stories" stories={mockStories} />
      <StoryCarousel title="Latest Updates" stories={mockStories} />

      <div className="mt-24 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col items-center text-center space-y-4">
          <BookOpen className="h-12 w-12" />
          <h3 className="text-xl font-semibold">Rich Story Library</h3>
          <p className="text-muted-foreground">
            Explore thousands of stories across multiple genres, from romance to
            mystery.
          </p>
        </div>
        <div className="flex flex-col items-center text-center space-y-4">
          <PenLine className="h-12 w-12" />
          <h3 className="text-xl font-semibold">Write & Share</h3>
          <p className="text-muted-foreground">
            Create and publish your stories with our easy-to-use editor. Reach
            readers worldwide.
          </p>
        </div>
        <div className="flex flex-col items-center text-center space-y-4">
          <Heart className="h-12 w-12" />
          <h3 className="text-xl font-semibold">Engage & Connect</h3>
          <p className="text-muted-foreground">
            Like, comment, and bookmark your favorite stories. Connect with other
            readers and writers.
          </p>
        </div>
      </div>
    </div>
  );
}
