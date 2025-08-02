'use client';

import { useState, useEffect } from 'react';
import Container from "@/app/components/Container";
import ListingCard from "@/app/components/listings/ListingCard";
import EmptyState from "@/app/components/EmptyState";
import Heading from "@/app/components/Heading";
import { buildUrl, apiClient, API_CONFIG } from '../config/api';

export default function ItemsClientPage() {
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
      <Container>
        <div className="pt-24 pb-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading items...</p>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="pt-24 pb-10">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Items</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600"
            >
              Retry
            </button>
          </div>
        </div>
      </Container>
    );
  }

  if (!listings || listings.length === 0) {
    return (
      <Container>
        <div className="pt-24 pb-10">
          <Heading
            title="No Items Available"
            subtitle="There are currently no items available for rent."
          />
        </div>
        <div className="text-center py-20">
          <div className="max-w-md mx-auto">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Be the first to list an item!</h3>
            <p className="text-gray-500 mb-8">Start earning by listing your items for rent.</p>
            <a
              href="/dashboard"
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
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="pt-24 pb-10">
        <Heading
          title="All Available Items"
          subtitle="Find the perfect item to rent for your needs"
        />
      </div>
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
        {listings.map((item: any) => (
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
          <p><strong>Listings:</strong> {listings ? 'Array' : 'null'}</p>
          <p><strong>Listings length:</strong> {listings?.length || 0}</p>
          <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
          <p><strong>Error:</strong> {error || 'None'}</p>
        </div>
        <details className="mt-4">
          <summary className="cursor-pointer text-blue-600">View Raw Data</summary>
          <pre className="text-xs bg-white p-4 mt-2 rounded overflow-auto max-h-40">
            {JSON.stringify(listings, null, 2)}
          </pre>
        </details>
      </div>
    </Container>
  );
} 