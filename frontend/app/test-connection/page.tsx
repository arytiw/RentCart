'use client';

import { useState } from 'react';

export default function TestConnection() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testItemService = async () => {
    setLoading(true);
    try {
      console.log('Testing ItemService connection...');
      const response = await fetch('http://localhost:9091/items');
      const data = await response.json();
      
      console.log('ItemService response:', data);
      
      setResult({
        success: response.ok,
        status: response.status,
        data: data,
        count: Array.isArray(data) ? data.length : 0
      });
    } catch (error: any) {
      console.error('Error testing ItemService:', error);
      setResult({
        success: false,
        error: error.message
      });
    }
    setLoading(false);
  };

  const testApiRoute = async () => {
    setLoading(true);
    try {
      console.log('Testing API route...');
      const response = await fetch('/api/items');
      const data = await response.json();
      
      console.log('API route response:', data);
      
      setResult({
        success: response.ok,
        status: response.status,
        data: data,
        count: Array.isArray(data) ? data.length : 0
      });
    } catch (error: any) {
      console.error('Error testing API route:', error);
      setResult({
        success: false,
        error: error.message
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Connection Test</h1>
        
        <div className="grid gap-4 mb-8">
          <button
            onClick={testItemService}
            disabled={loading}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            Test ItemService Direct
          </button>

          <button
            onClick={testApiRoute}
            disabled={loading}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 disabled:opacity-50"
          >
            Test API Route
          </button>
        </div>

        {result && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Test Result</h2>
            <div className="space-y-2">
              <p><strong>Success:</strong> {result.success ? '✅ Yes' : '❌ No'}</p>
              {result.status && <p><strong>Status:</strong> {result.status}</p>}
              {result.count !== undefined && <p><strong>Items found:</strong> {result.count}</p>}
              {result.error && (
                <p className="text-red-600"><strong>Error:</strong> {result.error}</p>
              )}
              {result.data && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-blue-600">View Response Data</summary>
                  <pre className="text-xs bg-gray-100 p-4 mt-2 rounded overflow-auto max-h-96">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 