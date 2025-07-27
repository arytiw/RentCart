import { buildUrl, apiClient, API_CONFIG } from "@/app/config/api";

interface IParams {
  listingId?: string;
  userId?: string;
  authorId?: string;
}

export default async function getReservations(
  params: IParams
) {
  try {
    const { listingId, userId, authorId } = params;

    // Get all orders from OrderService
    const url = buildUrl('ORDER_SERVICE', API_CONFIG.ENDPOINTS.ORDERS_USER);
    
    // Get token from client-side localStorage
    let token = null;
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('authToken');
    }
    
    if (!token) {
      console.warn('No authentication token found');
      return [];
    }

    const orders = await apiClient.get(url, {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    // Filter orders based on parameters
    let filteredOrders = orders;

    if (listingId) {
      // Filter by specific listing/item
      filteredOrders = orders.filter((order: any) => 
        order.itemIds?.includes(listingId) || order.itemId === listingId
      );
    }

    if (userId) {
      // Filter by user who made the reservation
      filteredOrders = orders.filter((order: any) => 
        order.userId === userId || order.userEmail === userId
      );
    }

    if (authorId) {
      // Filter by author/owner of the listing
      filteredOrders = orders.filter((order: any) => 
        order.ownerEmail === authorId || order.itemOwnerEmail === authorId
      );
    }

    // Transform orders to reservations format for compatibility
    const reservations = filteredOrders.map((order: any) => ({
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

    return reservations;
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return [];
  }
} 