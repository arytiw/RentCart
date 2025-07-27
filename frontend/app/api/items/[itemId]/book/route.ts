import { NextRequest, NextResponse } from 'next/server';

const ITEM_SERVICE_URL = 'http://localhost:9091';

export async function PUT(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const { itemId } = params;
    const body = await request.json();
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization header required' }, { status: 401 });
    }

    console.log(`Marking item ${itemId} as booked:`, body);

    const response = await fetch(`${ITEM_SERVICE_URL}/items/${itemId}/book`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('ItemService error:', errorData);
      return NextResponse.json(
        { error: errorData.error || errorData.message || 'Failed to update item booking status' },
        { status: response.status }
      );
    }

    const updatedItem = await response.json();
    console.log('Item booking status updated successfully:', updatedItem);
    return NextResponse.json(updatedItem);

  } catch (error) {
    console.error('Error updating item booking status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
