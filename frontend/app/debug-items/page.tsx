"use client";

import { useState } from 'react';
import { useUser } from '@/app/providers/UserProvider';
import axios from 'axios';

export default function DebugItemsPage() {
  const { token, user: currentUser } = useUser();
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testItemService = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/debug/items');
      const data = await response.json();
      setDebugInfo(data);
    } catch (error) {
      console.error('Debug test failed:', error);
      setDebugInfo({ error: 'Debug test failed', details: error });
    } finally {
      setLoading(false);
    }
  };

  const createTestItem = async () => {
    if (!currentUser?.email || !currentUser?.emailId) {
      alert('No user email found');
      return;
    }

    setLoading(true);
    try {
      const testItem = {
        title: "Debug Test Item",
        description: "This is a test item created for debugging purposes",
        price: 150,
        category: "Electronics",
        location: "Mumbai",
        images: [],
        features: ["Test feature"],
        usagePolicy: "Test usage policy",
        securityDeposit: 50,
        type: "RENT",
        quantity: 1
      };

      const response = await axios.post('/api/items', testItem, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-USER-EMAIL': currentUser.email || currentUser.emailId
        }
      });

      console.log('Test item created:', response.data);
      alert('Test item created successfully!');
    } catch (error: any) {
      console.error('Failed to create test item:', error);
      alert(`Failed to create test item: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Debug Items Page</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Current User Info</h2>
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify(currentUser, null, 2)}
        </pre>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Actions</h2>
        <div className="space-x-4">
          <button
            onClick={testItemService}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test ItemService Connection'}
          </button>
          
          <button
            onClick={createTestItem}
            disabled={loading || !currentUser}
            className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Test Item'}
          </button>
        </div>
      </div>

      {debugInfo && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Debug Results</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 