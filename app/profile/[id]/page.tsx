"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StoryCard } from "@/components/story-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Story {
  id: string;
  title: string;
  coverImage: string;
  createdAt: string;
  likes: number;
  views: number;
}

interface Profile {
  id: string;
  name: string;
  bio: string;
  address: string;
  image: string;
  followersCount: number;
  isFollowing: boolean;
  stories: Story[];
}

export default function ProfilePage() {
  const { id } = useParams();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [sortBy, setSortBy] = useState<"newest" | "popular">("newest");
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/users/${id}`);
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load profile",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!profile) return;

    setFollowLoading(true);
    try {
      const response = await fetch(`/api/users/${profile.id}/follow`, {
        method: profile.isFollowing ? "DELETE" : "POST",
      });

      if (!response.ok) throw new Error();

      setProfile({
        ...profile,
        isFollowing: !profile.isFollowing,
        followersCount: profile.isFollowing
          ? profile.followersCount - 1
          : profile.followersCount + 1,
      });

      toast({
        title: profile.isFollowing ? "Unfollowed" : "Following",
        description: profile.isFollowing
          ? `You unfollowed ${profile.name}`
          : `You are now following ${profile.name}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update follow status",
      });
    } finally {
      setFollowLoading(false);
    }
  };

  const sortedStories = profile?.stories.sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return b.views - a.views;
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-32 bg-muted rounded-lg mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Profile not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6 mb-8">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <Avatar className="w-32 h-32">
            <AvatarImage src={profile.image} />
            <AvatarFallback>{profile.name[0]}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold">{profile.name}</h1>
                <p className="text-muted-foreground">{profile.address}</p>
              </div>
              <Button
                onClick={handleFollow}
                disabled={followLoading}
                variant={profile.isFollowing ? "outline" : "default"}
              >
                {profile.isFollowing ? "Following" : "Follow"}
              </Button>
            </div>
            
            <p className="mb-4">{profile.bio}</p>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div>
                <span className="font-semibold text-foreground">
                  {profile.followersCount}
                </span>{" "}
                followers
              </div>
              <div>
                <span className="font-semibold text-foreground">
                  {profile.stories.length}
                </span>{" "}
                stories
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Stories</h2>
        <Select value={sortBy} onValueChange={(value: "newest" | "popular") => setSortBy(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        {sortedStories?.map((story) => (
          <StoryCard
            key={story.id}
            id={story.id}
            title={story.title}
            coverImage={story.coverImage}
          />
        ))}
      </div>

      {sortedStories?.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No stories yet
        </div>
      )}
    </div>
  );
}