/*
  # Add User Profile Fields and Followers

  1. New Fields
    - Add address to users table
    
  2. New Tables
    - followers
      - follower_id (uuid, references users)
      - following_id (uuid, references users)
      - created_at (timestamptz)
      - PRIMARY KEY (follower_id, following_id)

  3. Security
    - Enable RLS on followers table
    - Add policies for authenticated users
*/

-- Add address field to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT;

-- Create followers table
CREATE TABLE IF NOT EXISTS followers (
  follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (follower_id, following_id)
);

-- Enable Row Level Security
ALTER TABLE followers ENABLE ROW LEVEL SECURITY;

-- Followers Policies
CREATE POLICY "Anyone can view followers"
  ON followers FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can follow others"
  ON followers FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow"
  ON followers FOR DELETE
  USING (auth.uid() = follower_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_followers_following ON followers(following_id);
CREATE INDEX IF NOT EXISTS idx_followers_follower ON followers(follower_id);