'use client';

import { useState } from 'react';
import { API_CONFIG, buildUrl, apiClient } from '../config/api';

export default function TestServices() {
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const testService = async (serviceName: string, url: string) => {
    try {
      const response = await fetch(url, { method: 'GET' });
      return {
        status: response.status,
        ok: response.ok,
        url: url
      };
    } catch (error: any) {
      return {
        status: 'ERROR',
        ok: false,
        error: error.message,
        url: url
      };
    }
  };

  const testAllServices = async () => {
    setLoading(true);
    const testResults: any = {};

    // Test AuthService
    const authUrl = buildUrl('AUTH_SERVICE', '/auth/users');
    testResults.authService = await testService('AuthService', authUrl);

    // Test ItemService
    const itemUrl = buildUrl('ITEM_SERVICE', '/items');
    testResults.itemService = await testService('ItemService', itemUrl);

    setResults(testResults);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Service Status Test</h1>
        
        <button
          onClick={testAllServices}
          disabled={loading}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 mb-8"
        >
          {loading ? 'Testing...' : 'Test All Services'}
        </button>

        <div className="grid gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Service Configuration</h2>
            <div className="space-y-2 text-sm">
              <p><strong>AuthService:</strong> {API_CONFIG.AUTH_SERVICE}</p>
              <p><strong>ItemService:</strong> {API_CONFIG.ITEM_SERVICE}</p>
            </div>
          </div>

          {Object.keys(results).length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Test Results</h2>
              <div className="space-y-4">
                {Object.entries(results).map(([service, result]: [string, any]) => (
                  <div key={service} className="border-l-4 pl-4" style={{
                    borderColor: result.ok ? '#10B981' : '#EF4444'
                  }}>
                    <h3 className="font-semibold">{service}</h3>
                    <p className="text-sm text-gray-600">URL: {result.url}</p>
                    <p className="text-sm">Status: {result.status}</p>
                    {result.error && (
                      <p className="text-sm text-red-600">Error: {result.error}</p>
                    )}
                    <p className="text-sm font-medium" style={{
                      color: result.ok ? '#10B981' : '#EF4444'
                    }}>
                      {result.ok ? '✅ Running' : '❌ Not Running'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 