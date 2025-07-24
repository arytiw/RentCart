export default async function getUserItems(userEmail: string) {
  try {
    const res = await fetch(`http://localhost:9091/items/user/${encodeURIComponent(userEmail)}`, { 
      cache: 'no-store' 
    });
    if (!res.ok) {
      if (res.status === 404) {
        return [];
      }
      throw new Error('Failed to fetch user items');
    }
    const items = await res.json();
    console.log('getUserItems RAW RESPONSE:', items); // Debug log
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
      features: item.features || []
    }));
    console.log('getUserItems MAPPED:', mapped); // Debug log
    return mapped;
  } catch (error: any) {
    console.error("Error fetching user items:", error);
    return [];
  }
} 