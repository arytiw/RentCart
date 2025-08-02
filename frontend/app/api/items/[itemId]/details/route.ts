import { NextRequest, NextResponse } from 'next/server';
import { buildUrl, apiClient, API_CONFIG } from '../../../../config/api';

export async function GET(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const { itemId } = params;
    
    if (!itemId) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 }
      );
    }

    console.log('Fetching item details for ID:', itemId);

    const url = buildUrl('ITEM_SERVICE', API_CONFIG.ENDPOINTS.ITEM_BY_ID(itemId));
    const item = await apiClient.get(url);
    
    console.log('Item details fetched successfully:', item);
    return NextResponse.json(item);

  } catch (error: any) {
    console.error('Error fetching item details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch item details' },
      { status: 500 }
    );
  }
} 