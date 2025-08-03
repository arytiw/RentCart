"use client";

import { useEffect, useState } from "react";
import { buildUrl, apiClient, API_CONFIG } from '../config/api';

const DebugItemsPage = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log("API_CONFIG:", API_CONFIG);
        const url = buildUrl('ITEM_SERVICE', API_CONFIG.ENDPOINTS.ITEMS);
        console.log("Fetching from URL:", url);
        
        const response = await fetch(url);
        console.log("Response status:", response.status);
        console.log("Response headers:", response.headers);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Raw items data:", data);
        
        setItems(data);
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
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Debug Items API</h1>
      
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h2 className="text-xl font-semibold mb-2">API Configuration</h2>
        <pre className="text-sm">{JSON.stringify(API_CONFIG, null, 2)}</pre>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Loading items...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <strong>Error:</strong> {error}
        </div>
      )}

      {!loading && !error && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Items ({items.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item: any, index: number) => (
              <div key={item.id || index} className="border p-4 rounded">
                <h3 className="font-bold">{item.title || 'No Title'}</h3>
                <p className="text-sm text-gray-600">{item.description || 'No Description'}</p>
                <p className="text-sm">Price: ₹{item.price || 0}</p>
                <p className="text-sm">Category: {item.category || 'No Category'}</p>
                <p className="text-sm">Available: {item.available ? 'Yes' : 'No'}</p>
                <p className="text-sm">Quantity: {item.quantity || 1}</p>
                <p className="text-sm">User ID: {item.userId || 'No User'}</p>
                <pre className="text-xs mt-2 bg-gray-100 p-2 rounded overflow-auto">
                  {JSON.stringify(item, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">No items found</p>
        </div>
      )}
    </div>
  );
};

export default DebugItemsPage; 