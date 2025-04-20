import Link from "next/link";
import { Star, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

interface ChapterCardProps {
  id: string;
  storyId: string;
  title: string;
  rating: number;
  views: number;
  createdAt: Date;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export function ChapterCard({
  id,
  storyId,
  title,
  rating,
  views,
  createdAt,
  isFavorite,
  onToggleFavorite,
}: ChapterCardProps) {
  return (
    <Card className="hover:bg-accent/50 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <Link
            href={`/story/${storyId}/chapter/${id}`}
            className="flex-1 hover:underline"
          >
            <h3 className="font-semibold">{title}</h3>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorite?.();
            }}
          >
            <Heart
              className={`h-5 w-5 ${
                isFavorite ? "fill-red-500 text-red-500" : ""
              }`}
            />
          </Button>
        </div>
        <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Star className="mr-1 h-4 w-4 text-yellow-400" />
            {rating.toFixed(1)}
          </div>
          <div>{views.toLocaleString()} views</div>
          <div>{formatDistanceToNow(createdAt, { addSuffix: true })}</div>
        </div>
      </CardContent>
    </Card>
  );
}
