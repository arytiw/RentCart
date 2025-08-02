'use client';

import { useState } from 'react';
import { useUser } from '@/app/providers/UserProvider';
import axios from 'axios';

export default function TestPayment() {
  const { user, token } = useUser();
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testPaymentFlow = async () => {
    setIsLoading(true);
    setTestResult('Testing payment flow...');

    try {
      // Test 1: Check authentication
      if (!user || !token) {
        setTestResult('❌ User not authenticated');
        return;
      }

      setTestResult('✅ User authenticated\n');

      // Test 2: Create payment order
      const orderData = {
        amount: 10000, // 100 INR in paise
        currency: 'INR',
        receipt: `test_${Date.now()}`,
        notes: {
          itemId: 'test-item',
          startDate: '2024-01-01',
          endDate: '2024-01-02',
          notes: 'Test booking'
        }
      };

      setTestResult(prev => prev + 'Creating payment order...\n');

      const orderResponse = await axios.post('/api/payment/create-order', orderData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-USER-EMAIL': user.emailId || user.email
        }
      });

      setTestResult(prev => prev + `✅ Payment order created: ${JSON.stringify(orderResponse.data, null, 2)}\n`);

      // Test 3: Test order confirmation
      setTestResult(prev => prev + 'Testing order confirmation...\n');

      const confirmData = {
        orderRequest: {
          itemIds: ['test-item'],
          address: "Test address",
          startDate: '2024-01-01',
          endDate: '2024-01-02',
          dailyRate: 100,
          securityDeposit: 50,
          itemTitle: 'Test Item',
          ownerEmail: 'test@example.com',
          notes: 'Test booking'
        },
        razorpayOrderId: orderResponse.data.id,
        razorpayPaymentId: 'test_payment_id',
        razorpaySignature: 'test_signature',
        orderId: orderResponse.data.orderId
      };

      const confirmResponse = await axios.post('/api/orders/confirm', confirmData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-USER-EMAIL': user.emailId || user.email
        }
      });

      setTestResult(prev => prev + `✅ Order confirmation successful: ${JSON.stringify(confirmResponse.data, null, 2)}\n`);

    } catch (error: any) {
      console.error('Payment test error:', error);
      setTestResult(prev => prev + `❌ Error: ${error.response?.data?.error || error.message}\n`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Payment Flow Test</h1>
        
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
          <div className="space-y-2 text-sm">
            <p><strong>User:</strong> {user ? '✅ Logged in' : '❌ Not logged in'}</p>
            <p><strong>Token:</strong> {token ? '✅ Available' : '❌ Missing'}</p>
            <p><strong>Email:</strong> {user?.emailId || user?.email || 'Not available'}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
          <button
            onClick={testPaymentFlow}
            disabled={isLoading || !user || !token}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-300"
          >
            {isLoading ? 'Testing...' : 'Test Payment Flow'}
          </button>
        </div>

        {testResult && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>
            <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto max-h-96">
              {testResult}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
} 