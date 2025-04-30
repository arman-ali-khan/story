import express from 'express';
import { query } from '../../lib/db';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Create user
router.post('/', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user exists
    const existingUsers = await query(
      'SELECT id FROM users WHERE email = ?',
      [email.toLowerCase().trim()]
    ) as any[];

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    const userId = uuidv4();

    await query(
      `INSERT INTO users (id, name, email, password, role, created_at) 
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [userId, name.trim(), email.toLowerCase().trim(), hashedPassword, 'reader']
    );

    const users = await query(
      'SELECT id, name, email, role FROM users WHERE id = ?',
      [userId]
    ) as any[];

    res.status(201).json(users[0]);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const users = await query(
      'SELECT id, name, email, role FROM users WHERE id = ?',
      [id]
    ) as any[];

    if (!users.length) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(users[0]);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    await query(
      'UPDATE users SET name = ?, email = ? WHERE id = ?',
      [name, email, id]
    );

    const users = await query(
      'SELECT id, name, email, role FROM users WHERE id = ?',
      [id]
    ) as any[];

    res.json(users[0]);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM users WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

export default router;