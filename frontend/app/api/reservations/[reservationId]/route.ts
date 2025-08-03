import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { buildUrl, apiClient, API_CONFIG } from "@/app/config/api";

interface IParams {
  reservationId?: string;
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

    const { reservationId } = params;

    if (!reservationId || typeof reservationId !== 'string') {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    // Cancel the order through OrderService
    const url = buildUrl('ORDER_SERVICE', API_CONFIG.ENDPOINTS.CANCEL_ORDER(reservationId));
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      return NextResponse.json({ error: 'No authentication token' }, { status: 401 });
    }

    const result = await apiClient.patch(url, {}, {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error canceling reservation:', error);
    return NextResponse.json(
      { error: 'Failed to cancel reservation' },
      { status: 500 }
    );
  }
}
