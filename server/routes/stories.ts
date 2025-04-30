import express from 'express';
import { query } from '../../lib/db';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Create story
router.post('/', async (req, res) => {
  try {
    const { title, description, authorId, genre, language = 'bn', isPremium = false } = req.body;
    const storyId = uuidv4();

    await query(
      `INSERT INTO stories (id, title, description, author_id, genre, language, is_premium, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [storyId, title, description, authorId, genre, language, isPremium]
    );

    const stories = await query(
      'SELECT * FROM stories WHERE id = ?',
      [storyId]
    ) as any[];

    res.status(201).json(stories[0]);
  } catch (error) {
    console.error('Create story error:', error);
    res.status(500).json({ error: 'Failed to create story' });
  }
});

// Get story by ID with chapters
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const stories = await query(
      `SELECT s.*, u.name as author_name 
       FROM stories s
       LEFT JOIN users u ON s.author_id = u.id
       WHERE s.id = ?`,
      [id]
    ) as any[];

    if (!stories.length) {
      return res.status(404).json({ error: 'Story not found' });
    }

    const chapters = await query(
      'SELECT * FROM chapters WHERE story_id = ? ORDER BY created_at ASC',
      [id]
    ) as any[];

    const story = stories[0];
    story.chapters = chapters;

    res.json(story);
  } catch (error) {
    console.error('Get story error:', error);
    res.status(500).json({ error: 'Failed to get story' });
  }
});

// Add chapter to story
router.post('/:id/chapters', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, isPremium = false } = req.body;
    const chapterId = uuidv4();

    await query(
      `INSERT INTO chapters (id, story_id, title, content, is_premium, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [chapterId, id, title, content, isPremium]
    );

    const chapters = await query(
      'SELECT * FROM chapters WHERE id = ?',
      [chapterId]
    ) as any[];

    res.status(201).json(chapters[0]);
  } catch (error) {
    console.error('Create chapter error:', error);
    res.status(500).json({ error: 'Failed to create chapter' });
  }
});

// Update story
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, genre, language, isPremium, status } = req.body;

    await query(
      `UPDATE stories 
       SET title = ?, description = ?, genre = ?, 
           language = ?, is_premium = ?, status = ?, updated_at = NOW()
       WHERE id = ?`,
      [title, description, genre, language, isPremium, status, id]
    );

    const stories = await query(
      'SELECT * FROM stories WHERE id = ?',
      [id]
    ) as any[];

    res.json(stories[0]);
  } catch (error) {
    console.error('Update story error:', error);
    res.status(500).json({ error: 'Failed to update story' });
  }
});

// Delete story
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM stories WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete story error:', error);
    res.status(500).json({ error: 'Failed to delete story' });
  }
});

export default router;