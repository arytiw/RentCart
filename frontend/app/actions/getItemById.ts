import { buildUrl, apiClient, API_CONFIG } from '../config/api';

export default async function getItemById(itemId: string) {
  try {
    const url = buildUrl('ITEM_SERVICE', API_CONFIG.ENDPOINTS.ITEM_BY_ID(itemId));
    const item = await apiClient.get(url);
    
    // Transform item to match the expected format for the frontend
    return {
      id: item.id,
      title: item.title,
      description: item.description,
      imageSrc: item.images && item.images.length > 0 ? item.images[0] : '/images/placeholder.jpg',
      locationValue: item.location || '',
      category: item.category,
      itemCount: 1, // Default to 1 for now
      price: item.price,
      userId: item.userId,
      createdAt: item.createdAt,
      type: item.type,
      available: item.available,
      rating: item.rating,
      securityDeposit: item.securityDeposit,
      usagePolicy: item.usagePolicy,
      features: item.features || [],
      stockQuantity: item.stockQuantity,
      quantity: item.quantity || 1
    };
  } catch (error: any) {
    console.error("Error fetching item:", error);
    throw new Error('Failed to fetch item');
  }
} 