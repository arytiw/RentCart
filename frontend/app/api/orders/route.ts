import { NextRequest, NextResponse } from 'next/server';
import { buildUrl, apiClient, API_CONFIG } from '../../config/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization header required' }, { status: 401 });
    }

    console.log('Creating order with data:', body);

    const url = buildUrl('ORDER_SERVICE', API_CONFIG.ENDPOINTS.ORDERS);
    const orderData = await apiClient.post(url, body, {
      'Authorization': authHeader,
    });

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

    const url = buildUrl('ORDER_SERVICE', API_CONFIG.ENDPOINTS.ORDERS_USER);
    const response = await fetch(url, {
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