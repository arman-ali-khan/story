import express from 'express';
import { query } from '../../lib/db';

const router = express.Router();

// Get user profile
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const profiles = await query(
      `SELECT u.id, u.name, u.email, u.role, u.image, u.bio,
              COUNT(DISTINCT s.id) as stories_count,
              COUNT(DISTINCT l.story_id) as likes_count,
              COUNT(DISTINCT b.story_id) as bookmarks_count
       FROM users u
       LEFT JOIN stories s ON u.id = s.author_id
       LEFT JOIN likes l ON u.id = l.user_id
       LEFT JOIN bookmarks b ON u.id = b.user_id
       WHERE u.id = ?
       GROUP BY u.id`,
      [userId]
    ) as any[];

    if (!profiles.length) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json(profiles[0]);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Update user profile
router.put('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, image, bio } = req.body;

    await query(
      'UPDATE users SET name = ?, image = ?, bio = ? WHERE id = ?',
      [name, image, bio, userId]
    );

    const profiles = await query(
      'SELECT id, name, email, role, image, bio FROM users WHERE id = ?',
      [userId]
    ) as any[];

    res.json(profiles[0]);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;