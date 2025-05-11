import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Fetch last 5 transactions
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        date: 'desc'
      },
      take: 5,
      include: {
        category: true
      }
    });

    // Format transactions for response
    const formattedTransactions = transactions.map(t => ({
      id: t.id,
      type: t.type,
      amount: t.amount,
      description: t.description,
      date: t.date,
      category: t.category?.name || 'Uncategorized'
    }));

    return new NextResponse(
      JSON.stringify(formattedTransactions),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching recent transactions:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch recent transactions' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
} 