import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import User from '@/models/User';
import connectDB from '@/lib/mongodb';
import crypto from 'crypto';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { oldPassword, newPassword } = await req.json();
    if (!oldPassword || !newPassword) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }
    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    if (!user.password) {
      return NextResponse.json({ error: 'Password change not allowed for Google users' }, { status: 400 });
    }
    const oldHash = crypto.createHash('sha256').update(oldPassword).digest('hex');
    if (user.password !== oldHash) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
    }
    const newHash = crypto.createHash('sha256').update(newPassword).digest('hex');
    user.password = newHash;
    await user.save();
    return NextResponse.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password update error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
} 