export default async function getUserItems(userEmail: string) {
  try {
    const res = await fetch(`http://localhost:9091/items/user/${encodeURIComponent(userEmail)}`, { 
      cache: 'no-store' 
    });
    
    if (!res.ok) {
      if (res.status === 404) {
        return []; // Return empty array if no items found
      }
      throw new Error('Failed to fetch user items');
    }
    
    const items = await res.json();
    
    // Transform items to match the expected format for the frontend
    return items.map((item: any) => ({
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
      features: item.features || []
    }));
  } catch (error: any) {
    console.error("Error fetching user items:", error);
    return []; // Return empty array on error
  }
} 