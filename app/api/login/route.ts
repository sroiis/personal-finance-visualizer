import { NextRequest, NextResponse } from 'next/server';
import { signToken } from '@/lib/auth';


export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  // hardcoded credentials
  if (username !== 'admin' || password !== 'password') {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = signToken({ username });
  const res = NextResponse.json({ success: true, msg: 'Logged in successfully' });
  res.cookies.set('token',  token,{ httpOnly: true,
  maxAge: 3600, // 1 hour
  path: '/',
  secure: process.env.NODE_ENV === 'production', // true on Vercel
  sameSite: 'strict',});
  return res;
  
}
