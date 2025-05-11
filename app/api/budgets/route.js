import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Budget from '@/models/Budget';

export async function GET(req) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const month = searchParams.get('month') || new Date().toISOString().slice(0, 7);

    const startDate = new Date(month + '-01');
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

    const budgets = await Budget.find({
      userId: session.user.email,
      month: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort({ category: 1 });

    return NextResponse.json({ budgets });
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { category, amount, month, notes } = body;

    if (!category || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if budget already exists for this category and month
    const existingBudget = await Budget.findOne({
      userId: session.user.email,
      category,
      month: new Date(month || new Date().toISOString().slice(0, 7) + '-01')
    });

    if (existingBudget) {
      // Update existing budget
      existingBudget.amount = parseFloat(amount);
      if (notes) existingBudget.notes = notes;
      await existingBudget.save();
      return NextResponse.json(existingBudget);
    }

    // Create new budget
    const budget = await Budget.create({
      userId: session.user.email,
      category,
      amount: parseFloat(amount),
      month: new Date(month || new Date().toISOString().slice(0, 7) + '-01'),
      notes: notes || ''
    });

    return NextResponse.json(budget, { status: 201 });
  } catch (error) {
    console.error('Error creating budget:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 