import { buildUrl, apiClient, API_CONFIG } from '../config/api';

export default async function getOrders() {
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      console.warn('No authentication token found');
      return [];
    }

    // Use the correct endpoint for user orders
    const url = buildUrl('ORDER_SERVICE', API_CONFIG.ENDPOINTS.ORDERS_USER);
    const orders = await apiClient.get(url, {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return orders;
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    return [];
  }
} 