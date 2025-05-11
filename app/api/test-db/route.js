import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('Database connection successful');

    // Test query
    const userCount = await prisma.user.count();
    console.log('User count:', userCount);

    return new NextResponse(
      JSON.stringify({ 
        status: 'success',
        message: 'Database connection successful',
        userCount
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Database connection error:', error);
    return new NextResponse(
      JSON.stringify({ 
        status: 'error',
        message: 'Database connection failed',
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  } finally {
    await prisma.$disconnect();
  }
} 