import { buildUrl, apiClient, API_CONFIG } from '../config/api';

export default async function getListings() {
  try {
    console.log("Fetching listings from ItemService...");
    const url = buildUrl('ITEM_SERVICE', API_CONFIG.ENDPOINTS.ITEMS);
    console.log("API URL:", url);
    
    // Add cache-busting parameter to prevent caching
    const cacheBuster = Date.now();
    const urlWithCacheBuster = `${url}?_cb=${cacheBuster}`;
    console.log("URL with cache buster:", urlWithCacheBuster);
    
    const items = await apiClient.get(urlWithCacheBuster);
    console.log("Raw items from API:", items);
    
    if (!Array.isArray(items)) {
      console.error("Items is not an array:", items);
      return [];
    }
    
    // Transform items to match the expected format for the frontend
    const transformedItems = items.map((item: any) => ({
      id: item.id,
      title: item.title || 'Untitled Item',
      description: item.description || 'No description available',
      imageSrc: item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/400x400?text=No+Image',
      locationValue: item.location || 'Location not specified',
      category: item.category || 'Uncategorized',
      itemCount: item.quantity || 1,
      price: item.price || 0,
      userId: item.userId || 'Unknown User',
      createdAt: item.createdAt,
      type: item.type || 'RENT',
      available: item.available !== false, // Default to true if not set
      rating: item.rating || 0,
      securityDeposit: item.securityDeposit || 0,
      usagePolicy: item.usagePolicy || '',
      features: item.features || [],
      quantity: item.quantity || 1
    }));
    
    console.log("Transformed items:", transformedItems);
    return transformedItems;
  } catch (error: any) {
    console.error("Error fetching items:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      response: error.response
    });
    // Return empty array instead of throwing error to prevent page crashes
    return [];
  }
}
