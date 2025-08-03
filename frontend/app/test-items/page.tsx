'use client';

import { useState, useEffect } from 'react';
import { buildUrl, apiClient, API_CONFIG } from '../config/api';

export default function TestItems() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log("Testing items fetch...");
        const url = buildUrl('ITEM_SERVICE', API_CONFIG.ENDPOINTS.ITEMS);
        console.log("URL:", url);
        
        const response = await apiClient.get(url);
        console.log("Raw response:", response);
        
        if (Array.isArray(response)) {
          setItems(response);
        } else {
          setError("Response is not an array");
        }
        
      } catch (err: any) {
        console.error("Error fetching items:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Items Test</h1>
        
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Status</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
            <p><strong>Error:</strong> {error || 'None'}</p>
            <p><strong>Items count:</strong> {items.length}</p>
          </div>
        </div>

        {loading && (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading items...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-red-600">Error</h2>
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {!loading && !error && items.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Items Found ({items.length})</h2>
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="border p-4 rounded">
                  <h3 className="font-semibold">{item.title || 'Untitled'}</h3>
                  <p className="text-sm text-gray-600">{item.description || 'No description'}</p>
                  <div className="text-sm text-gray-500 mt-2">
                    <p>ID: {item.id}</p>
                    <p>Price: ₹{item.price || 0}</p>
                    <p>Category: {item.category || 'Uncategorized'}</p>
                    <p>Location: {item.location || 'Not specified'}</p>
                    <p>Available: {item.available ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">No Items Found</h2>
            <p className="text-gray-600">No items are currently available in the database.</p>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Quick Navigation</h2>
          <div className="space-x-4">
            <a
              href="/"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Home
            </a>
            <a
              href="/items"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Browse Items
            </a>
            <a
              href="/rent"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Rent Your Stuff
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 