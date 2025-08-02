import { NextRequest, NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { buildUrl, apiClient, API_CONFIG } from "@/app/config/api";

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's orders from OrderService (these act as reservations)
    const url = buildUrl('ORDER_SERVICE', API_CONFIG.ENDPOINTS.ORDERS_USER);
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json({ error: 'No authentication token' }, { status: 401 });
    }

    const orders = await apiClient.get(url, {
      'Authorization': authHeader,
      'Content-Type': 'application/json'
    });

    // Transform orders to reservations format for compatibility
    const reservations = orders.map((order: any) => ({
      id: order.id || order.orderId,
      userId: order.userId || order.userEmail,
      listingId: order.itemIds?.[0] || order.itemId,
      startDate: order.startDate,
      endDate: order.endDate,
      totalPrice: order.totalAmount || order.amount,
      createdAt: order.createdAt || new Date().toISOString(),
      status: order.status || 'CONFIRMED',
      listing: {
        id: order.itemIds?.[0] || order.itemId,
        title: order.itemTitle || 'Item',
        price: order.totalAmount || order.amount,
        imageSrc: order.itemImage || '',
        location: order.address || '',
        description: order.notes || ''
      },
      user: {
        id: order.userId || order.userEmail,
        name: order.userName || 'User',
        email: order.userEmail || order.userId
      }
    }));

    return NextResponse.json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reservations' },
      { status: 500 }
    );
  }
}