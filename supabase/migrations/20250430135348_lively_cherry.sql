/*
  # Add Stories Schema

  1. New Tables
    - stories
      - id (uuid, primary key)
      - title (text)
      - description (text)
      - cover_image (text)
      - author_id (uuid, references users)
      - genre (text)
      - language (text)
      - is_premium (boolean)
      - status (text)
      - created_at (timestamptz)
      - updated_at (timestamptz)
    
    - chapters
      - id (uuid, primary key)
      - story_id (uuid, references stories)
      - title (text)
      - content (text)
      - is_premium (boolean)
      - created_at (timestamptz)
      - updated_at (timestamptz)
    
    - likes
      - story_id (uuid, references stories)
      - user_id (uuid, references users)
      - created_at (timestamptz)
      - PRIMARY KEY (story_id, user_id)
    
    - bookmarks
      - story_id (uuid, references stories)
      - user_id (uuid, references users)
      - created_at (timestamptz)
      - PRIMARY KEY (story_id, user_id)
    
    - reviews
      - id (uuid, primary key)
      - story_id (uuid, references stories)
      - user_id (uuid, references users)
      - rating (integer)
      - content (text)
      - created_at (timestamptz)
      - updated_at (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create stories table
CREATE TABLE IF NOT EXISTS stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  cover_image TEXT,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  genre TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'bn',
  is_premium BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create chapters table
CREATE TABLE IF NOT EXISTS chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_premium BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create likes table
CREATE TABLE IF NOT EXISTS likes (
  story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (story_id, user_id)
);

-- Create bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
  story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (story_id, user_id)
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Stories Policies
CREATE POLICY "Anyone can read published stories"
  ON stories FOR SELECT
  USING (status = 'published');

CREATE POLICY "Authors can manage their own stories"
  ON stories FOR ALL
  USING (auth.uid() = author_id);

-- Chapters Policies
CREATE POLICY "Anyone can read non-premium chapters"
  ON chapters FOR SELECT
  USING (
    NOT is_premium AND 
    EXISTS (
      SELECT 1 FROM stories 
      WHERE id = chapters.story_id 
      AND status = 'published'
    )
  );

CREATE POLICY "Premium users can read premium chapters"
  ON chapters FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM stories 
      WHERE id = chapters.story_id 
      AND status = 'published'
    )
  );

CREATE POLICY "Authors can manage their chapters"
  ON chapters FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM stories 
      WHERE id = chapters.story_id 
      AND author_id = auth.uid()
    )
  );

-- Likes Policies
CREATE POLICY "Authenticated users can like stories"
  ON likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their likes"
  ON likes FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view likes"
  ON likes FOR SELECT
  USING (true);

-- Bookmarks Policies
CREATE POLICY "Authenticated users can bookmark stories"
  ON bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their bookmarks"
  ON bookmarks FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own bookmarks"
  ON bookmarks FOR SELECT
  USING (auth.uid() = user_id);

-- Reviews Policies
CREATE POLICY "Authenticated users can create reviews"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
  ON reviews FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
  ON reviews FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can read reviews"
  ON reviews FOR SELECT
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_stories_author ON stories(author_id);
CREATE INDEX IF NOT EXISTS idx_stories_genre ON stories(genre);
CREATE INDEX IF NOT EXISTS idx_stories_language ON stories(language);
CREATE INDEX IF NOT EXISTS idx_stories_status ON stories(status);
CREATE INDEX IF NOT EXISTS idx_chapters_story ON chapters(story_id);
CREATE INDEX IF NOT EXISTS idx_likes_story ON likes(story_id);
CREATE INDEX IF NOT EXISTS idx_likes_user ON likes(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_story ON bookmarks(story_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_story ON reviews(story_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);