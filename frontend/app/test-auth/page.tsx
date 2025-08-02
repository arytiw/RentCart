'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/app/providers/UserProvider';
import getCurrentUser from '@/app/actions/getCurrentUser';

export default function TestAuth() {
  const { user, token, isLoading } = useUser();
  const [localAuth, setLocalAuth] = useState<any>(null);
  const [testResult, setTestResult] = useState<any>(null);

  useEffect(() => {
    // Check localStorage
    const localToken = localStorage.getItem('authToken');
    const localUser = localStorage.getItem('user');
    
    setLocalAuth({
      token: localToken,
      user: localUser ? JSON.parse(localUser) : null
    });
  }, []);

  const testAuth = async () => {
    try {
      const localToken = localStorage.getItem('authToken');
      const result = await getCurrentUser(localToken || '');
      setTestResult({
        success: !!result,
        user: result,
        error: null
      });
    } catch (error: any) {
      setTestResult({
        success: false,
        user: null,
        error: error.message
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Authentication Test</h1>
        
        <div className="grid gap-6">
          {/* UserProvider State */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">UserProvider State</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
              <p><strong>Token:</strong> {token ? '✅ Exists' : '❌ Missing'}</p>
              <p><strong>User:</strong> {user ? '✅ Exists' : '❌ Missing'}</p>
              {user && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-blue-600">User Details</summary>
                  <pre className="text-xs bg-gray-100 p-2 mt-1 rounded">
                    {JSON.stringify(user, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          </div>

          {/* LocalStorage State */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">LocalStorage State</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Token:</strong> {localAuth?.token ? '✅ Exists' : '❌ Missing'}</p>
              <p><strong>User:</strong> {localAuth?.user ? '✅ Exists' : '❌ Missing'}</p>
              {localAuth?.user && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-blue-600">Local User Details</summary>
                  <pre className="text-xs bg-gray-100 p-2 mt-1 rounded">
                    {JSON.stringify(localAuth.user, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          </div>

          {/* Test Authentication */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Test Authentication</h2>
            <button
              onClick={testAuth}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Test getCurrentUser
            </button>
            
            {testResult && (
              <div className="mt-4">
                <p><strong>Result:</strong> {testResult.success ? '✅ Success' : '❌ Failed'}</p>
                {testResult.error && (
                  <p className="text-red-600"><strong>Error:</strong> {testResult.error}</p>
                )}
                {testResult.user && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-blue-600">Test User Details</summary>
                    <pre className="text-xs bg-gray-100 p-2 mt-1 rounded">
                      {JSON.stringify(testResult.user, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            )}
          </div>

          {/* Navigation */}
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
                href="/login"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Login
              </a>
              <a
                href="/test-connection"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Test Connections
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 