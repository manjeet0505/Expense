import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import User from '@/models/User';
import connectDB from '@/lib/mongodb';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { name, image } = await req.json();
    await connectDB();
    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { name, image },
      { new: true }
    );
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Profile updated', user });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
} 