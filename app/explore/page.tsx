import { StoryCard } from "@/components/story-card";

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

export default function ExplorePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Explore Stories</h1>
      <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
        {mockStories.map((story) => (
          <StoryCard
            key={story.id}
            id={story.id}
            title={story.title}
            coverImage={story.coverImage}
          />
        ))}
      </div>
    </div>
  );
}