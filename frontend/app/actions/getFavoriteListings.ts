import getCurrentUser from "./getCurrentUser";

export default async function getFavoriteListings() {
  try {
    // Get current user's favoriteIds
    const currentUser = await getCurrentUser();
    let favoriteIds: string[] = currentUser?.favoriteIds || [];
    
    // Also get favorites from localStorage (client-side)
    if (typeof window !== 'undefined') {
      const storedFavorites = localStorage.getItem('favorites');
      if (storedFavorites) {
        try {
          const localFavorites = JSON.parse(storedFavorites);
          // Combine user favorites with local favorites
          favoriteIds = Array.from(new Set([...favoriteIds, ...localFavorites]));
        } catch (error) {
          console.error('Error parsing localStorage favorites:', error);
        }
      }
    }
    
    if (favoriteIds.length === 0) {
      return [];
    }

    // Get all listings and filter by favorites
    const res = await fetch('/api/listings', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch listings');
    const allListings = await res.json();
    
    // Filter listings that are in user's favorites
    const favoriteListings = allListings.filter((listing: any) => 
      favoriteIds.includes(listing.id)
    );
    
    return favoriteListings;
  } catch (error: any) {
    console.error('Error fetching favorite listings:', error);
    return [];
  }
}
