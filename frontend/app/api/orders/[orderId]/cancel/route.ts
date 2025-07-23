import { NextRequest, NextResponse } from 'next/server';

const ORDER_SERVICE_URL = 'http://localhost:9092';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization header required' }, { status: 401 });
    }

    console.log('Cancelling order:', params.orderId);

    const response = await fetch(`${ORDER_SERVICE_URL}/orders/${params.orderId}/cancel`, {
      method: 'PATCH',
      headers: {
        'Authorization': authHeader,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OrderService error:', errorData);
      return NextResponse.json(
        { error: errorData.error || errorData.message || 'Failed to cancel order' },
        { status: response.status }
      );
    }

    const orderData = await response.json();
    console.log('Order cancelled successfully:', orderData);
    return NextResponse.json(orderData);

  } catch (error) {
    console.error('Error cancelling order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 