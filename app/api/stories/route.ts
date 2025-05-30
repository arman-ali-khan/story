import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { query } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const genre = searchParams.get('genre');
    const status = searchParams.get('status');
    const authorId = searchParams.get('authorId');
    const language = searchParams.get('language');

    let sql = `
      SELECT s.*, u.name as author_name, u.image as author_image,
      COUNT(DISTINCT l.user_id) as likes_count,
      COUNT(DISTINCT b.user_id) as bookmarks_count,
      COUNT(DISTINCT c.id) as chapters_count,
      AVG(r.rating) as average_rating
      FROM stories s
      LEFT JOIN users u ON s.author_id = u.id
      LEFT JOIN likes l ON s.id = l.story_id
      LEFT JOIN bookmarks b ON s.id = b.story_id
      LEFT JOIN chapters c ON s.id = c.story_id
      LEFT JOIN reviews r ON s.id = r.story_id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (genre) {
      sql += ' AND s.genre = ?';
      params.push(genre);
    }

    if (status) {
      sql += ' AND s.status = ?';
      params.push(status);
    }

    if (authorId) {
      sql += ' AND s.author_id = ?';
      params.push(authorId);
    }

    if (language) {
      sql += ' AND s.language = ?';
      params.push(language);
    }

    sql += ' GROUP BY s.id ORDER BY s.created_at DESC';

    const stories = await query(sql, params);
    
    return NextResponse.json(stories);
  } catch (error) {
    console.error('Error fetching stories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stories' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { title, description, coverImage, genre, language = 'bn', isPremium = false } = await req.json();

    if (!title || !description || !genre) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const storyId = uuidv4();
    await query(
      `INSERT INTO stories (id, title, description, cover_image, author_id, genre, language, is_premium)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [storyId, title, description, coverImage, session.user.id, genre, language, isPremium]
    );

    const stories = await query(
      'SELECT * FROM stories WHERE id = ?',
      [storyId]
    ) as any[];

    return NextResponse.json(stories[0], { status: 201 });
  } catch (error) {
    console.error('Error creating story:', error);
    return NextResponse.json(
      { error: 'Failed to create story' },
      { status: 500 }
    );
  }
}