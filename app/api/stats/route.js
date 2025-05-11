import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Check for required environment variables
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI is not set');
      return new NextResponse(
        JSON.stringify({ 
          error: 'Database configuration error',
          details: 'MONGODB_URI environment variable is not set'
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check database connection
    try {
      await prisma.$connect();
      console.log('Database connection successful');
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return new NextResponse(
        JSON.stringify({ 
          error: 'Database connection failed',
          details: dbError.message
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session) {
      console.log('No session found');
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('Fetching stats for user:', session.user.id);

    // Get current month's start and end dates
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    console.log('Date range:', { startOfMonth, endOfMonth });

    // Fetch transactions for the current month
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: session.user.id,
        date: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      }
    });

    console.log('Found transactions:', transactions.length);

    // Calculate statistics
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const savings = totalIncome - totalExpenses;

    // Calculate monthly average (last 3 months)
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
    const lastThreeMonthsTransactions = await prisma.transaction.findMany({
      where: {
        userId: session.user.id,
        date: {
          gte: threeMonthsAgo,
          lte: endOfMonth
        }
      }
    });

    console.log('Found last 3 months transactions:', lastThreeMonthsTransactions.length);

    const monthlyExpenses = {};
    lastThreeMonthsTransactions.forEach(t => {
      const month = t.date.toISOString().slice(0, 7); // YYYY-MM
      if (!monthlyExpenses[month]) {
        monthlyExpenses[month] = { income: 0, expense: 0 };
      }
      if (t.type === 'income') {
        monthlyExpenses[month].income += Number(t.amount);
      } else {
        monthlyExpenses[month].expense += Number(t.amount);
      }
    });

    const monthlyAverages = Object.values(monthlyExpenses).map(m => m.income - m.expense);
    const monthlyAverage = monthlyAverages.length > 0
      ? monthlyAverages.reduce((a, b) => a + b, 0) / monthlyAverages.length
      : 0;

    const stats = {
      totalExpenses: totalExpenses.toFixed(2),
      totalIncome: totalIncome.toFixed(2),
      savings: savings.toFixed(2),
      monthlyAverage: monthlyAverage.toFixed(2)
    };

    console.log('Calculated stats:', stats);

    return new NextResponse(
      JSON.stringify(stats),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in stats API:', error);
    return new NextResponse(
      JSON.stringify({ 
        error: 'Failed to fetch statistics',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  } finally {
    await prisma.$disconnect();
  }
} 