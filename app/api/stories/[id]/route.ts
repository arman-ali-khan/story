import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { query } from "@/lib/db";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const stories = await query(
      `SELECT s.*, u.name as author_name, u.image as author_image,
       COUNT(DISTINCT l.user_id) as likes_count,
       COUNT(DISTINCT b.user_id) as bookmarks_count,
       AVG(r.rating) as average_rating
       FROM stories s
       LEFT JOIN users u ON s.author_id = u.id
       LEFT JOIN likes l ON s.id = l.story_id
       LEFT JOIN bookmarks b ON s.id = b.story_id
       LEFT JOIN reviews r ON s.id = r.story_id
       WHERE s.id = ?
       GROUP BY s.id`,
      [params.id]
    ) as any[];

    if (!stories.length) {
      return NextResponse.json(
        { error: 'Story not found' },
        { status: 404 }
      );
    }

    // Get chapters
    const chapters = await query(
      'SELECT * FROM chapters WHERE story_id = ? ORDER BY created_at ASC',
      [params.id]
    );

    const story = stories[0];
    story.chapters = chapters;

    return NextResponse.json(story);
  } catch (error) {
    console.error('Error fetching story:', error);
    return NextResponse.json(
      { error: 'Failed to fetch story' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { title, description, coverImage, genre, language, isPremium, status } = await req.json();

    // Check if user is the author
    const stories = await query(
      'SELECT author_id FROM stories WHERE id = ?',
      [params.id]
    ) as any[];

    if (!stories.length || stories[0].author_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await query(
      `UPDATE stories 
       SET title = ?, description = ?, cover_image = ?, genre = ?, 
           language = ?, is_premium = ?, status = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [title, description, coverImage, genre, language, isPremium, status, params.id]
    );

    const updatedStories = await query(
      'SELECT * FROM stories WHERE id = ?',
      [params.id]
    ) as any[];

    return NextResponse.json(updatedStories[0]);
  } catch (error) {
    console.error('Error updating story:', error);
    return NextResponse.json(
      { error: 'Failed to update story' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is the author
    const stories = await query(
      'SELECT author_id FROM stories WHERE id = ?',
      [params.id]
    ) as any[];

    if (!stories.length || stories[0].author_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await query('DELETE FROM stories WHERE id = ?', [params.id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting story:', error);
    return NextResponse.json(
      { error: 'Failed to delete story' },
      { status: 500 }
    );
  }
}