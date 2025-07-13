import { connectDB } from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await connectDB();
    console.log('DB connected for GET');

    const count = await Transaction.countDocuments();

    if (count === 0) {
      console.log('Seeding dummy transactions...');
      const now = new Date();
      const lastMonth = new Date(now);
      lastMonth.setMonth(now.getMonth() - 1);

      const dummyTransactions = [
        {
          amount: 25000,
          description: 'Monthly Salary',
          date: new Date(now.getFullYear(), now.getMonth(), 1),
          category: 'Salary',
          type: 'income',
        },
        {
          amount: 1500,
          description: 'Groceries',
          date: new Date(now.getFullYear(), now.getMonth(), 3),
          category: 'Food',
          type: 'expense',
        },
        {
          amount: 800,
          description: 'Metro Recharge',
          date: new Date(now.getFullYear(), now.getMonth(), 8),
          category: 'Transport',
          type: 'expense',
        },
        {
          amount: 2000,
          description: 'Zomato Order',
          date: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 13),
          category: 'Food',
          type: 'expense',
        },
        {
          amount: 18000,
          description: 'Freelance Project',
          date: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 2),
          category: 'Work',
          type: 'income',
        },
      ];

      await Transaction.insertMany(dummyTransactions);
      console.log('Dummy data seeded');
    }

    const data = await Transaction.find().sort({ date: -1 });
    console.log('Transactions fetched:', data.length);
    return NextResponse.json(data);
  } catch (error) {
    console.error('GET /api/transactions error:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { amount, description, date, category, type } = body;

    if (amount === undefined || !date || !category || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!['income', 'expense'].includes(type)) {
      return NextResponse.json({ error: 'Invalid transaction type' }, { status: 400 });
    }

    if (isNaN(Date.parse(date))) {
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
    }

    const newTx = await Transaction.create({
      amount,
      description: description || '',
      date,
      category,
      type,
    });

    return NextResponse.json(newTx, { status: 201 });
  } catch (error) {
    console.error('POST /api/transactions error:', error);
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const id = req.nextUrl.searchParams.get('id');

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid or missing transaction ID' }, { status: 400 });
    }

    const deletedTx = await Transaction.findByIdAndDelete(id);
    if (!deletedTx) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('DELETE /api/transactions error:', error);
    return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();
    const id = req.nextUrl.searchParams.get('id');

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid or missing transaction ID' }, { status: 400 });
    }

    const updates = await req.json();

    if (updates.type && !['income', 'expense'].includes(updates.type)) {
      return NextResponse.json({ error: 'Invalid transaction type' }, { status: 400 });
    }

    if (updates.date && isNaN(Date.parse(updates.date))) {
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
    }

    const allowedFields = ['amount', 'description', 'date', 'category', 'type'];
    const sanitizedUpdates: any = {};
    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        sanitizedUpdates[field] = updates[field];
      }
    }

    const tx = await Transaction.findByIdAndUpdate(id, sanitizedUpdates, { new: true });
    if (!tx) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    return NextResponse.json(tx);
  } catch (error) {
    console.error('PATCH /api/transactions error:', error);
    return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 });
  }
}
