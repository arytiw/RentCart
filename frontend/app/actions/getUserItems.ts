import { buildUrl, apiClient, API_CONFIG } from '../config/api';

export default async function getUserItems(userEmail: string) {
  try {
    console.log('getUserItems called with email:', userEmail);
    console.log('Email type:', typeof userEmail);
    console.log('Email length:', userEmail?.length);
    
    const url = buildUrl('ITEM_SERVICE', API_CONFIG.ENDPOINTS.USER_ITEMS(encodeURIComponent(userEmail)));
    console.log('Making request to ItemService:', url);
    
    const items = await apiClient.get(url);
    console.log('getUserItems RAW RESPONSE:', items);
    
    if (!Array.isArray(items)) {
      console.error('Expected array but got:', typeof items, items);
      return [];
    }
    
    const mapped = items.map((item: any) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      imageSrc: item.images && item.images.length > 0 ? item.images[0] : '/images/placeholder.jpg',
      locationValue: item.location || '',
      category: item.category,
      itemCount: 1,
      price: item.price,
      userId: item.userId,
      createdAt: item.createdAt,
      type: item.type,
      available: item.available,
      rating: item.rating,
      securityDeposit: item.securityDeposit,
      usagePolicy: item.usagePolicy,
      features: item.features || [],
      quantity: item.quantity || 1
    }));
    console.log('getUserItems MAPPED:', mapped); // Debug log
    return mapped;
  } catch (error: any) {
    console.error("Error fetching user items:", error);
    return [];
  }
} 