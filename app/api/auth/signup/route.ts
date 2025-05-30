import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUsers = await query(
      'SELECT id FROM users WHERE email = ?',
      [email.toLowerCase().trim()]
    ) as any[];

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { success: false, error: "Email already registered" },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const userId = uuidv4();
    await query(
      `INSERT INTO users (id, name, email, password, role, created_at) 
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [userId, name.trim(), email.toLowerCase().trim(), hashedPassword, 'reader']
    );

    // Get the created user
    const users = await query(
      'SELECT id, name, email, role FROM users WHERE id = ?',
      [userId]
    ) as any[];

    const user = users[0];

    return NextResponse.json(
      { 
        success: true, 
        message: "Account created successfully",
        user
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Signup error:", error);
    
    return NextResponse.json(
      { success: false, error: "Failed to create account. Please try again." },
      { status: 500 }
    );
  }
}