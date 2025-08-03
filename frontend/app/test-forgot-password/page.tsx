'use client';

import { useState } from 'react';
import { buildUrl, API_CONFIG } from '../config/api';

export default function TestForgotPassword() {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      const url = buildUrl('AUTH_SERVICE', '/auth/users');
      console.log('Testing connection to:', url);
      
      const response = await fetch(url);
      const data = await response.text();
      
      setResult({
        status: response.status,
        ok: response.ok,
        data: data
      });
    } catch (error: any) {
      setResult({
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const testForgotPassword = async () => {
    if (!email) {
      alert('Please enter an email');
      return;
    }

    setLoading(true);
    try {
      const url = buildUrl('AUTH_SERVICE', API_CONFIG.ENDPOINTS.FORGOT_PASSWORD);
      console.log('Testing forgot password with URL:', url);
      console.log('Payload:', { email });
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.text();
      
      setResult({
        status: response.status,
        ok: response.ok,
        data: data,
        url: url
      });
    } catch (error: any) {
      setResult({
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Forgot Password Test</h1>
        
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Connection</h2>
          <button
            onClick={testConnection}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test AuthService Connection'}
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Forgot Password</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email to test:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter email to test"
              />
            </div>
            <button
              onClick={testForgotPassword}
              disabled={loading || !email}
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Forgot Password'}
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Result</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Quick Navigation</h2>
          <div className="space-x-4">
            <a
              href="/forgot-password"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Forgot Password Page
            </a>
            <a
              href="/login"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Login Page
            </a>
            <a
              href="/"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 