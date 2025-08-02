'use client';

import { useState, useEffect } from 'react';
import ListingCard from "@/app/components/listings/ListingCard";
import EmptyState from "@/app/components/EmptyState";
import { buildUrl, apiClient, API_CONFIG } from '../config/api';
import getCurrentUser from '../actions/getCurrentUser';

interface ItemsClientProps {
  searchParams: {
    category?: string;
    query?: string;
  };
}

export default function ItemsClient({ searchParams }: ItemsClientProps) {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log("Client-side: Fetching listings...");
        const url = buildUrl('ITEM_SERVICE', API_CONFIG.ENDPOINTS.ITEMS);
        console.log("Client-side: URL:", url);
        
        const items = await apiClient.get(url);
        console.log("Client-side: Raw items:", items);
        
        if (!Array.isArray(items)) {
          console.error("Client-side: Items is not an array:", items);
          setListings([]);
          return;
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
          available: item.available !== false,
          rating: item.rating || 0,
          securityDeposit: item.securityDeposit || 0,
          usagePolicy: item.usagePolicy || '',
          features: item.features || [],
          quantity: item.quantity || 1
        }));
        
        console.log("Client-side: Transformed items:", transformedItems);
        setListings(transformedItems);
        
        // Get current user
        try {
          const user = await getCurrentUser();
          setCurrentUser(user);
        } catch (userError) {
          console.log("No user logged in");
        }
        
      } catch (err: any) {
        console.error("Client-side: Error fetching items:", err);
        setError(err.message);
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading items...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Items</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!listings || listings.length === 0) {
    return (
      <>
        <div className="text-center py-20">
          <div className="max-w-md mx-auto">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">No Items Available</h3>
            <p className="text-gray-500 mb-8">There are currently no items available for rent.</p>
            <a
              href="/rent"
              className="bg-alibaba-orange text-white px-8 py-3 rounded-xl font-semibold hover:bg-alibaba-orange-dark transition-colors"
            >
              List Your First Item
            </a>
          </div>
        </div>
        
        {/* Debug Section */}
        <div className="mt-8 p-6 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Debug Information</h3>
          <div className="space-y-2 text-sm">
            <p><strong>Listings:</strong> {listings ? 'Array' : 'null'}</p>
            <p><strong>Listings length:</strong> {listings?.length || 0}</p>
            <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
            <p><strong>Error:</strong> {error || 'None'}</p>
            <p><strong>Current user:</strong> {currentUser ? 'Logged in' : 'Not logged in'}</p>
          </div>
          <div className="mt-4 space-x-4">
            <a
              href="/test-connection"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Test Connections
            </a>
            <a
              href="/debug-items"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Debug Items
            </a>
          </div>
        </div>
      </>
    );
  }

  // Filter items based on search params
  let filteredItems = listings;

  if (searchParams.category) {
    filteredItems = listings.filter((item: any) => 
      item.category === searchParams.category
    );
  }

  if (searchParams.query) {
    const query = searchParams.query.toLowerCase();
    filteredItems = filteredItems.filter((item: any) =>
      item.title?.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query) ||
      item.category?.toLowerCase().includes(query) ||
      item.locationValue?.toLowerCase().includes(query)
    );
  }

  return (
    <>
      {searchParams.category && (
        <div className="mb-6">
          <a
            href="/"
            className="
              inline-flex
              items-center
              gap-2
              text-alibaba-orange 
              hover:text-alibaba-orange-dark 
              font-semibold
              px-4
              py-2
              rounded-lg
              hover:bg-alibaba-orange/10
              transition-all
              duration-200
              border-2
              border-transparent
              hover:border-alibaba-orange/20
            "
          >
            ← Back to all items
          </a>
        </div>
      )}
      
      <div 
        className="
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          md:grid-cols-3 
          lg:grid-cols-4
          xl:grid-cols-5
          2xl:grid-cols-6
          gap-8
          pb-20
        "
      >
        {filteredItems.map((item: any) => (
          <ListingCard
            currentUser={currentUser}
            key={item.id}
            data={{
              ...item,
              imageSrc: item.imageSrc || '/images/placeholder.jpg',
              locationValue: item.locationValue || '',
            }}
          />
        ))}
      </div>
      
      {/* Debug Section */}
      <div className="mt-8 p-6 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Debug Information</h3>
        <div className="space-y-2 text-sm">
          <p><strong>Total items:</strong> {listings.length}</p>
          <p><strong>Filtered items:</strong> {filteredItems.length}</p>
          <p><strong>Category filter:</strong> {searchParams.category || 'None'}</p>
          <p><strong>Query filter:</strong> {searchParams.query || 'None'}</p>
          <p><strong>Current user:</strong> {currentUser ? 'Logged in' : 'Not logged in'}</p>
        </div>
      </div>
    </>
  );
} 