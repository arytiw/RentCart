import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { buildUrl, apiClient, API_CONFIG } from "@/app/config/api";

interface IParams {
  listingId?: string;
}

export async function DELETE(
  request: Request, 
  { params }: { params: IParams }
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { listingId } = params;

    if (!listingId || typeof listingId !== 'string') {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    // Delete item through ItemService
    const url = buildUrl('ITEM_SERVICE', API_CONFIG.ENDPOINTS.ITEM_BY_ID(listingId));
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      return NextResponse.json({ error: 'No authentication token' }, { status: 401 });
    }

    const result = await apiClient.delete(url, {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error deleting listing:', error);
    return NextResponse.json(
      { error: 'Failed to delete listing' },
      { status: 500 }
    );
  }
}
