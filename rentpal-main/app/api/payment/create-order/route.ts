import { NextRequest, NextResponse } from 'next/server';

const ORDER_SERVICE_URL = 'http://localhost:9091';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization header required' }, { status: 401 });
    }

    console.log('Creating payment order with data:', body);

    const response = await fetch(`${ORDER_SERVICE_URL}/api/payment/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Payment service error:', errorData);
      return NextResponse.json(
        { error: errorData.error || errorData.message || 'Failed to create payment order' },
        { status: response.status }
      );
    }

    const paymentData = await response.json();
    console.log('Payment order created successfully:', paymentData);
    return NextResponse.json(paymentData);

  } catch (error) {
    console.error('Error creating payment order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 