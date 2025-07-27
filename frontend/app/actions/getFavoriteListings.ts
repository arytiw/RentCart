export default async function getFavoriteListings() {
  try {
    const res = await fetch('/api/favorites/listings', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch favorite listings');
    const listings = await res.json();
    return listings;
  } catch (error: any) {
    console.error('Error fetching favorite listings:', error);
    return [];
  }
}
