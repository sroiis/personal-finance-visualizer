// app/api/budgets/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Budget from '@/models/Budget';
import { connectDB } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';

// Auth check helper
async function checkAuth(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) return false;

    const verified = await verifyToken(token);
    return !!verified;
  } catch (err) {
    console.error('JWT verification failed:', err);
    return false;
  }
}

// JSON response helper
function jsonResponse(data: any, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*', // adjust if needed
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}

// POST /budgets - create or update budgets
export async function POST(req: NextRequest) {
  if (!(await checkAuth(req))) {
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }

  await connectDB();

  try {
    const budgets = await req.json(); // expected: array of { category, amount, month }

    if (!Array.isArray(budgets)) {
      return jsonResponse({ error: 'Expected an array of budgets' }, 400);
    }

    const ops = budgets.map((b: any) => {
      if (!b.category || !b.amount || !b.month) {
        throw new Error('Missing required budget fields');
      }
      return {
        updateOne: {
          filter: { month: b.month, category: b.category },
          update: { $set: { amount: b.amount } },
          upsert: true,
        },
      };
    });

    await Budget.bulkWrite(ops);
    return jsonResponse({ success: true, budgets }, 201);
  } catch (err) {
    console.error('POST /budgets error:', err);
    return jsonResponse({ error: 'Budget save failed', details: err instanceof Error ? err.message : err }, 500);
  }
}

// GET /budgets?month=YYYY-MM - fetch budgets for a month
export async function GET(req: NextRequest) {
  if (!(await checkAuth(req))) {
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }

  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const month = searchParams.get('month');

    if (!month) {
      return jsonResponse({ error: 'Month query missing' }, 400);
    }

    const data = await Budget.find({ month });
    return jsonResponse(data);
  } catch (err) {
    console.error('GET /budgets error:', err);
    return jsonResponse({ error: 'Failed to fetch budgets', details: err instanceof Error ? err.message : err }, 500);
  }
}
