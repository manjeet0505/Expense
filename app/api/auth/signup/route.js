import { NextResponse } from 'next/server';
import crypto from 'crypto';
import User from '@/models/User';
import connectDB from '@/lib/mongodb';

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();
    console.log('Signup Step: Received body', { name, email });

    if (!name || !email || !password) {
      console.error('Signup Error: Missing fields', { name, email, password });
      return NextResponse.json(
        { error: 'Please fill in all fields' },
        { status: 400 }
      );
    }

    try {
      await connectDB();
      console.log('Signup Step: Connected to MongoDB');
    } catch (err) {
      console.error('Signup Error: MongoDB connection failed', err);
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    // Check if user already exists
    let existingUser;
    try {
      existingUser = await User.findOne({ email });
      console.log('Signup Step: Existing user check', { existingUser });
    } catch (err) {
      console.error('Signup Error: User findOne failed', err);
      return NextResponse.json(
        { error: 'User lookup failed' },
        { status: 500 }
      );
    }

    if (existingUser) {
      console.error('Signup Error: User already exists', { email });
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = crypto
      .createHash('sha256')
      .update(password)
      .digest('hex');

    console.log('Signup Debug:', { name, email, hashedPassword });

    // Create new user
    let user;
    try {
      user = await User.create({
        name,
        email,
        password: hashedPassword,
      });
      console.log('Signup Step: User created', { user });
    } catch (err) {
      console.error('Signup Error: User creation failed', err);
      return NextResponse.json(
        { error: 'User creation failed' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error (outer catch):', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
} 