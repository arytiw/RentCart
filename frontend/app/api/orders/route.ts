import { NextRequest, NextResponse } from 'next/server';

const ORDER_SERVICE_URL = 'http://localhost:9092';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization header required' }, { status: 401 });
    }

    console.log('Creating order with data:', body);

    const response = await fetch(`${ORDER_SERVICE_URL}/orders`, {
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
        { error: errorData.error || errorData.message || 'Failed to create order' },
        { status: response.status }
      );
    }

    const orderData = await response.json();
    console.log('Order created successfully:', orderData);
    return NextResponse.json(orderData);

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization header required' }, { status: 401 });
    }

    const response = await fetch(`${ORDER_SERVICE_URL}/orders/user`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OrderService error:', errorData);
      return NextResponse.json(
        { error: errorData.error || errorData.message || 'Failed to fetch orders' },
        { status: response.status }
      );
    }

    const orders = await response.json();
    return NextResponse.json(orders);

  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 