"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
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
          <CarouselContent slot="5" className="-ml-2 sm:-ml-4">
            {stories.map((story) => (
              <CarouselItem 
                key={story.id} 
                className="pl-2 sm:pl-4 basis-[calc(100%/2.2)] sm:basis-[calc(100%/3.5)] md:basis-[calc(100%/4.5)] lg:basis-[calc(100%/5)]"
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