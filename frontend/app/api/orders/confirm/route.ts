import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const ORDER_SERVICE_URL = 'http://localhost:9092';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get('authorization');
    const userEmail = request.headers.get('x-user-email');

    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization header required' }, { status: 401 });
    }

    if (!userEmail) {
      return NextResponse.json({ error: 'User email required' }, { status: 401 });
    }

    console.log('Confirming order with data:', body);

    // Determine if this is a rental order based on the presence of rental-specific fields
    const isRentalOrder = body.orderRequest && body.orderRequest.startDate;
    
    const endpoint = isRentalOrder ? '/orders/confirm-rental' : '/orders/confirm';
    
    const response = await axios.post(`${ORDER_SERVICE_URL}${endpoint}`, body, {
      headers: {
        'Authorization': authHeader,
        'X-USER-EMAIL': userEmail,
        'Content-Type': 'application/json'
      }
    });

    console.log('Order confirmed successfully:', response.data);
    return NextResponse.json(response.data);

  } catch (error: any) {
    console.error('Error confirming order:', error);
    return NextResponse.json(
      { error: error.response?.data?.error || 'Failed to confirm order' },
      { status: error.response?.status || 500 }
    );
  }
} 