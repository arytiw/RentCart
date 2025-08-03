import { buildUrl, apiClient, API_CONFIG } from "@/app/config/api";

interface IParams {
  userId?: string;
}

export default async function getMyListedItems(
  params: IParams
) {
  try {
    const { userId } = params;

    // Get token from client-side localStorage
    let token = null;
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('authToken');
    }
    
    if (!token) {
      console.warn('No authentication token found');
      return [];
    }

    // First, get all items listed by the current user
    // We need to get the user's email from the token or pass it as parameter
    const userEmail = userId || 'current-user'; // This should be the actual user email
    const itemsUrl = buildUrl('ITEM_SERVICE', API_CONFIG.ENDPOINTS.USER_ITEMS(userEmail));
    const myItems = await apiClient.get(itemsUrl, {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    // Then, get all orders to find bookings for these items
    const ordersUrl = buildUrl('ORDER_SERVICE', API_CONFIG.ENDPOINTS.ORDERS_USER);
    const allOrders = await apiClient.get(ordersUrl, {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    // Create a map of items with their bookings
    const itemsWithBookings = myItems.map((item: any) => {
      // Find all bookings for this item
      const itemBookings = allOrders.filter((order: any) => 
        order.itemIds?.includes(item.id) || order.itemId === item.id
      );

      return {
        ...item,
        bookings: itemBookings.map((booking: any) => ({
          id: booking.id || booking.orderId,
          renterId: booking.userId || booking.userEmail,
          renterName: booking.userName || 'Unknown User',
          renterEmail: booking.userEmail || booking.userId,
          startDate: booking.startDate,
          endDate: booking.endDate,
          totalPrice: booking.totalAmount || booking.amount,
          status: booking.status || 'CONFIRMED',
          createdAt: booking.createdAt || new Date().toISOString(),
          notes: booking.notes || ''
        }))
      };
    });

    return itemsWithBookings;
  } catch (error) {
    console.error('Error fetching my listed items:', error);
    return [];
  }
} 