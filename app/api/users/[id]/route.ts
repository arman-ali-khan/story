import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { query } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    const userId = params.id;

    // Get user profile with followers count
    const profiles = await query(
      `SELECT u.id, u.name, u.email, u.bio, u.address, u.image,
              COUNT(DISTINCT f.follower_id) as followers_count,
              EXISTS(
                SELECT 1 FROM followers f2 
                WHERE f2.follower_id = ? AND f2.following_id = u.id
              ) as is_following
       FROM users u
       LEFT JOIN followers f ON u.id = f.following_id
       WHERE u.id = ?
       GROUP BY u.id`,
      [session?.user?.id || null, userId]
    ) as any[];

    if (!profiles.length) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get user's stories with stats
    const stories = await query(
      `SELECT s.*, 
              COUNT(DISTINCT l.user_id) as likes_count,
              COUNT(DISTINCT v.id) as views_count
       FROM stories s
       LEFT JOIN likes l ON s.id = l.story_id
       LEFT JOIN views v ON s.id = v.story_id
       WHERE s.author_id = ?
       GROUP BY s.id
       ORDER BY s.created_at DESC`,
      [userId]
    ) as any[];

    const profile = profiles[0];
    return NextResponse.json({
      ...profile,
      stories: stories.map(story => ({
        id: story.id,
        title: story.title,
        coverImage: story.cover_image,
        createdAt: story.created_at,
        likes: story.likes_count,
        views: story.views_count
      }))
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      { error: "Failed to get profile" },
      { status: 500 }
    );
  }
}