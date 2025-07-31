import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const ORDER_SERVICE_URL = 'http://localhost:9092';

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    const userEmail = request.headers.get('x-user-email');

    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization header required' }, { status: 401 });
    }

    const orderId = params.orderId;
    console.log('Fetching order details for orderId:', orderId);

    const response = await axios.get(`${ORDER_SERVICE_URL}/orders/${orderId}`, {
      headers: {
        'Authorization': authHeader,
        'X-USER-EMAIL': userEmail || '',
        'Content-Type': 'application/json'
      }
    });

    console.log('Order details fetched successfully:', response.data);
    return NextResponse.json(response.data);

  } catch (error: any) {
    console.error('Error fetching order details:', error);
    return NextResponse.json(
      { error: error.response?.data?.error || 'Failed to fetch order details' },
      { status: error.response?.status || 500 }
    );
  }
} 