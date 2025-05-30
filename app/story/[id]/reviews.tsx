"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";

// Temporary mock data
const mockReviews = [
  {
    id: "1",
    user: {
      name: "Priya Sharma",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    },
    rating: 5,
    content: "Absolutely loved this story! The characters are so well developed.",
    date: "2024-03-20",
  },
  {
    id: "2",
    user: {
      name: "Amit Roy",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amit",
    },
    rating: 4,
    content: "Great plot twists, but the ending felt a bit rushed.",
    date: "2024-03-19",
  },
];

interface ReviewsProps {
  storyId: string;
}

export function Reviews({ storyId }: ReviewsProps) {
  const [newReview, setNewReview] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);

  const handleSubmitReview = () => {
    // Handle review submission
    console.log({ rating: selectedRating, content: newReview });
    setNewReview("");
    setSelectedRating(0);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Reviews</h2>

      {/* Write Review */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              onClick={() => setSelectedRating(rating)}
              className="focus:outline-none"
            >
              <Star
                className={`h-6 w-6 ${
                  rating <= selectedRating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
        <Textarea
          placeholder="Write your review..."
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
          className="min-h-[100px]"
        />
        <Button
          onClick={handleSubmitReview}
          disabled={!selectedRating || !newReview.trim()}
        >
          Submit Review
        </Button>
      </div>

      {/* Review List */}
      <div className="space-y-6">
        {mockReviews.map((review) => (
          <div key={review.id} className="border-b pb-6">
            <div className="flex items-start gap-4">
              <Avatar>
                <AvatarImage src={review.user.image} />
                <AvatarFallback>{review.user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{review.user.name}</h4>
                  <span className="text-sm text-muted-foreground">
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="mt-2 text-muted-foreground">{review.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
