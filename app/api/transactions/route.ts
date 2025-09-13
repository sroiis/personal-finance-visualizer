import { connectDB } from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { verifyToken } from '@/lib/auth';

// Simple JWT check
function checkAuth(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token || !verifyToken(token)) throw new Error('Unauthorized');
}

export async function GET(req: NextRequest) {
  try {
    checkAuth(req); // Protect API
    await connectDB();

    const data = await Transaction.find().sort({ date: -1 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    checkAuth(req); // Protect API
    await connectDB();
    const body = await req.json();
    const { amount, description, date, category, type } = body;

    if (!amount || !date || !category || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
      
    }

    const newTx = await Transaction.create({ amount, description, date, category, type });
    return NextResponse.json(newTx, { status: 201 });
  } catch {
   
    return NextResponse.json({ error: 'Unauthorized or failed' }, { status: 401 });
    
  }
}

export async function DELETE(req: NextRequest) {
  try {
    checkAuth(req);
    await connectDB();
    const id = req.nextUrl.searchParams.get('id');

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid or missing transaction ID' }, { status: 400 });
    }

    const deletedTx = await Transaction.findByIdAndDelete(id);
    if (!deletedTx) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Unauthorized or failed' }, { status: 401 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    checkAuth(req);
    await connectDB();
    const id = req.nextUrl.searchParams.get('id');
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid or missing transaction ID' }, { status: 400 });
    }

    const updates = await req.json();
    const allowedFields = ['amount', 'description', 'date', 'category', 'type'];
    const sanitizedUpdates: any = {};

    for (const field of allowedFields) {
      if (updates[field] !== undefined) sanitizedUpdates[field] = updates[field];
    }

    const tx = await Transaction.findByIdAndUpdate(id, sanitizedUpdates, { new: true });
    if (!tx) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    return NextResponse.json(tx);
  } catch {
    return NextResponse.json({ error: 'Unauthorized or failed' }, { status: 401 });
  }
}
