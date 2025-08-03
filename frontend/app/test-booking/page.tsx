'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/app/providers/UserProvider';
import { useRouter } from 'next/navigation';

export default function TestBooking() {
  const { user, token, isLoading } = useUser();
  const router = useRouter();
  const [localAuth, setLocalAuth] = useState<any>(null);

  useEffect(() => {
    // Check localStorage
    const localToken = localStorage.getItem('authToken');
    const localUser = localStorage.getItem('user');
    
    setLocalAuth({
      token: localToken,
      user: localUser ? JSON.parse(localUser) : null
    });
  }, []);

  const testBookingFlow = () => {
    // Simulate the booking flow authentication check
    const localToken = localStorage.getItem('authToken');
    const localUser = localStorage.getItem('user');
    
    console.log('=== Booking Flow Test ===');
    console.log('User from hook:', user);
    console.log('Token from hook:', token);
    console.log('Local token:', localToken);
    console.log('Local user:', localUser);
    
    if (user || token || localToken || localUser) {
      console.log('✅ Authentication found - should proceed to booking');
      alert('Authentication found! Should proceed to booking.');
    } else {
      console.log('❌ No authentication found - should redirect to login');
      alert('No authentication found! Should redirect to login.');
    }
  };

  const goToBooking = () => {
    // Navigate to a test booking page
    router.push('/book/test-item-id');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Booking Flow Test</h1>
        
        <div className="grid gap-6">
          {/* Authentication Status */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
            <div className="space-y-2 text-sm">
              <p><strong>UserProvider Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
              <p><strong>User from Hook:</strong> {user ? '✅ Exists' : '❌ Missing'}</p>
              <p><strong>Token from Hook:</strong> {token ? '✅ Exists' : '❌ Missing'}</p>
              <p><strong>Local Token:</strong> {localAuth?.token ? '✅ Exists' : '❌ Missing'}</p>
              <p><strong>Local User:</strong> {localAuth?.user ? '✅ Exists' : '❌ Missing'}</p>
            </div>
          </div>

          {/* Test Actions */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
            <div className="space-y-4">
              <button
                onClick={testBookingFlow}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Test Booking Flow Authentication
              </button>
              
              <button
                onClick={goToBooking}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Go to Test Booking Page
              </button>
            </div>
          </div>

          {/* Debug Information */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
            <div className="space-y-2 text-sm">
              {user && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-blue-600">User from Hook</summary>
                  <pre className="text-xs bg-gray-100 p-2 mt-1 rounded">
                    {JSON.stringify(user, null, 2)}
                  </pre>
                </details>
              )}
              
              {localAuth?.user && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-blue-600">Local User</summary>
                  <pre className="text-xs bg-gray-100 p-2 mt-1 rounded">
                    {JSON.stringify(localAuth.user, null, 2)}
                  </pre>
                </details>
              )}
            </div>
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
                href="/test-auth"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Test Auth
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 