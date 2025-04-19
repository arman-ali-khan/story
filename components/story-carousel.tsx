"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { StoryCard } from "@/components/story-card";

interface Story {
  id: string;
  title: string;
  coverImage: string;
}

interface StoryCarouselProps {
  title: string;
  stories: Story[];
}

export function StoryCarousel({ title, stories }: StoryCarouselProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      <div className="relative">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 sm:-ml-4">
            {stories.map((story) => (
              <CarouselItem 
                key={story.id} 
                className="pl-2 sm:pl-4 basis-[160px] xs:basis-[200px] sm:basis-[250px] md:basis-[300px] lg:basis-[350px]"
              >
                <StoryCard
                  id={story.id}
                  title={story.title}
                  coverImage={story.coverImage}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </div>
    </div>
  );
}