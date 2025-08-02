import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get headers to check what authentication info is available
    const authHeader = request.headers.get('authorization');
    const userEmail = request.headers.get('x-user-email');
    const cookies = request.headers.get('cookie');
    
    return NextResponse.json({
      authHeader: authHeader ? 'Present' : 'Missing',
      userEmail: userEmail || 'Not provided',
      cookies: cookies ? 'Present' : 'Missing',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to check auth',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    return NextResponse.json({
      received: {
        localStorage: body.localStorage || {},
        sessionStorage: body.sessionStorage || {},
        userAgent: request.headers.get('user-agent')
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to process debug data',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
