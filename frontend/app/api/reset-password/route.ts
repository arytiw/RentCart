import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { token, newPassword, confirmPassword } = await req.json();
  const res = await fetch('http://localhost:8081/auth/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, newPassword, confirmPassword }),
  });
  const data = await res.text();
  return NextResponse.json({ message: data }, { status: res.status });
} 