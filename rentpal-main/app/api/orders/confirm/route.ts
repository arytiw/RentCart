import { NextRequest, NextResponse } from 'next/server';

const ORDER_SERVICE_URL = 'http://localhost:9092';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization header required' }, { status: 401 });
    }

    console.log('Confirming order with payment verification:', body);

    // Use the new confirm-with-details endpoint that accepts both order request and payment details
    const response = await fetch(`${ORDER_SERVICE_URL}/orders/confirm-with-details`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OrderService error:', errorData);
      return NextResponse.json(
        { error: errorData.error || errorData.message || 'Failed to confirm order' },
        { status: response.status }
      );
    }

    const orderData = await response.json();
    console.log('Order confirmed successfully:', orderData);
    return NextResponse.json(orderData);

  } catch (error) {
    console.error('Error confirming order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 