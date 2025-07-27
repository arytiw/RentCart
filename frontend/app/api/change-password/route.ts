import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { email, oldPassword, newPassword, confirmPassword } = await req.json();
  const res = await fetch('http://localhost:8081/auth/change-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, oldPassword, newPassword, confirmPassword }),
  });
  const data = await res.text();
  return NextResponse.json({ message: data }, { status: res.status });
} 