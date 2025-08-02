import { buildUrl, apiClient, API_CONFIG } from "@/app/config/api";

interface IParams {
  listingId?: string;
}

export default async function getListingById(
  params: IParams
) {
  try {
    const { listingId } = params;

    if (!listingId) {
      return null;
    }

    // Get item from ItemService
    const url = buildUrl('ITEM_SERVICE', API_CONFIG.ENDPOINTS.ITEM_BY_ID(listingId));
    
    const item = await apiClient.get(url);

    if (!item) {
      return null;
    }

    // Transform item to listing format for compatibility
    return {
      id: item.id,
      title: item.title,
      description: item.description,
      imageSrc: item.imageSrc || item.imageUrl || '',
      createdAt: item.createdAt || new Date().toISOString(),
      category: item.category || item.itemType,
      roomCount: item.roomCount || 1,
      bathroomCount: item.bathroomCount || 1,
      guestCount: item.guestCount || 1,
      locationValue: item.location || item.address || '',
      userId: item.userId || item.ownerEmail,
      price: item.price || item.dailyRate || 0,
      user: {
        id: item.userId || item.ownerEmail,
        name: item.ownerName || 'Owner',
        email: item.ownerEmail || item.userId,
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: item.updatedAt || new Date().toISOString(),
        emailVerified: null,
      }
    };
  } catch (error: any) {
    console.error('Error fetching listing:', error);
    return null;
  }
}
