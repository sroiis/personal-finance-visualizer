import { connectDB } from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { verifyToken } from '@/lib/auth';

async function checkAuth(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) return false;

  try {
    const verified = await verifyToken(token); // await if async
    return !!verified;
  } catch (err) {
    console.error('JWT verification failed:', err);
    return false;
  }
}

export async function GET(req: NextRequest) {
  if (!(await checkAuth(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();
  const data = await Transaction.find().sort({ date: -1 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  if (!(await checkAuth(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();
  const body = await req.json();
  const { amount, description, date, category, type } = body;

  if (!amount || !date || !category || !type) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const newTx = await Transaction.create({ amount, description, date, category, type });
  return NextResponse.json(newTx, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  if (!(await checkAuth(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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
}

export async function PATCH(req: NextRequest) {
  if (!(await checkAuth(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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
}
