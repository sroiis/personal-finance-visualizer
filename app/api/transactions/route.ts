import { connectDB } from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectDB();
    const data = await Transaction.find().sort({ date: -1 }); // optional: sort by latest
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const { amount, description, date, category } = body;

    // Validation
    if (!amount || !date || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newTx = await Transaction.create({
      amount,
      description: description || '',
      date,
      category,
    });

    return NextResponse.json(newTx, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const id = req.nextUrl.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing transaction ID' }, { status: 400 });
    }

    await Transaction.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();
    const id = req.nextUrl.searchParams.get('id');
    const updates = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Missing transaction ID' }, { status: 400 });
    }

    const tx = await Transaction.findByIdAndUpdate(id, updates, { new: true });
    return NextResponse.json(tx);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 });
  }
}
