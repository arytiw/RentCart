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

    // Add timeout to the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(`${ITEM_SERVICE_URL}/items/${itemId}/book`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
      }
      console.error('ItemService error:', errorData);
      return NextResponse.json(
        { error: errorData.error || errorData.message || 'Failed to update item booking status' },
        { status: response.status }
      );
    }

    // Check if response has content before trying to parse JSON
    const responseText = await response.text();
    let updatedItem;
    
    if (responseText && responseText.trim()) {
      try {
        updatedItem = JSON.parse(responseText);
      } catch (e) {
        console.warn('Invalid JSON response from ItemService:', responseText);
        updatedItem = { message: 'Item booking status updated successfully' };
      }
    } else {
      // Empty response - create a success response
      updatedItem = { message: 'Item booking status updated successfully' };
    }
    
    console.log('Item booking status updated successfully:', updatedItem);
    return NextResponse.json(updatedItem);

  } catch (error: any) {
    console.error('Error updating item booking status:', error);
    
    // If it's a timeout or connection error, return a success response
    if (error.name === 'AbortError' || error.code === 'ECONNREFUSED') {
      console.warn('ItemService not available, but continuing with order confirmation');
      return NextResponse.json({ 
        message: 'Item booking status update skipped - ItemService unavailable',
        warning: 'Order confirmed but item status not updated'
      });
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
