import { hash, compare } from 'bcryptjs';
import { query } from '@/lib/db';

export async function createUser(name: string, email: string, password: string) {
  try {
    // Check if user exists
    const existingUsers = await query(
      'SELECT id FROM users WHERE email = ?',
      [email.toLowerCase().trim()]
    ) as any[];

    if (existingUsers.length > 0) {
      throw new Error('Email already registered');
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user
    const result = await query(
      `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'reader')`,
      [name.trim(), email.toLowerCase().trim(), hashedPassword]
    );

    return { success: true };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function verifyCredentials(email: string, password: string) {
  try {
    const users = await query(
      'SELECT * FROM users WHERE email = ?',
      [email.toLowerCase().trim()]
    ) as any[];

    const user = users[0];

    if (!user) {
      throw new Error('No user found with this email');
    }

    const isValid = await compare(password, user.password);

    if (!isValid) {
      throw new Error('Invalid password');
    }

    // Don't send password in response
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error('Error verifying credentials:', error);
    throw error;
  }
}