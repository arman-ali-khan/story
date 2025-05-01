import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { query } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const followerId = session.user.id;
    const followingId = params.id;

    // Check if already following
    const existing = await query(
      'SELECT 1 FROM followers WHERE follower_id = ? AND following_id = ?',
      [followerId, followingId]
    ) as any[];

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Already following" },
        { status: 400 }
      );
    }

    await query(
      'INSERT INTO followers (follower_id, following_id) VALUES (?, ?)',
      [followerId, followingId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Follow error:", error);
    return NextResponse.json(
      { error: "Failed to follow user" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const followerId = session.user.id;
    const followingId = params.id;

    await query(
      'DELETE FROM followers WHERE follower_id = ? AND following_id = ?',
      [followerId, followingId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unfollow error:", error);
    return NextResponse.json(
      { error: "Failed to unfollow user" },
      { status: 500 }
    );
  }
}