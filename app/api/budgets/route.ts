// app/api/budgets/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Budget from '@/models/Budget';
import { connectDB } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';

async function checkAuth(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) return false;
  const verified = verifyToken(token);
  return !!verified;
}

export async function POST(req: NextRequest) {
  if (!(await checkAuth(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();
  try {
    const budgets = await req.json(); // array of { category, amount, month }

    const ops = budgets.map((b: any) => ({
      updateOne: {
        filter: { month: b.month, category: b.category },
        update: { $set: { amount: b.amount } },
        upsert: true,
      },
    }));

    await Budget.bulkWrite(ops);
    return NextResponse.json({ success: true, budgets });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Budget save failed', details: err }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  if (!(await checkAuth(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();
  const { searchParams } = new URL(req.url);
  const month = searchParams.get('month');

  if (!month)
    return NextResponse.json({ error: 'Month query missing' }, { status: 400 });

  const data = await Budget.find({ month });
  return NextResponse.json(data);
}
