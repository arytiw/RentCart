'use client';

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import Container from '@/app/components/Container';
import Button from '@/app/components/Button';
import Heading from '@/app/components/Heading';

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await res.json();
      
      if (res.status === 404 && data.message === 'Email ID is not registered.') {
        setMessage('This email is not registered.');
        toast.error('This email is not registered.');
      } else if (res.ok) {
        setMessage(data.message);
        toast.success('Password reset link sent to your email!');
      } else {
        setMessage(data.message || 'Something went wrong.');
        toast.error(data.message || 'Something went wrong.');
      }
    } catch (err) {
      const errorMessage = 'Something went wrong.';
      setMessage(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg border border-gray-200 shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Forgot Password
              </h1>
              <p className="text-gray-600 text-base">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              
              <Button 
                label={loading ? 'Sending...' : 'Send Reset Link'} 
                onClick={() => {}}
                disabled={loading}
              />
              
              {message && (
                <div className={`text-center text-sm p-3 rounded-md ${
                  message.includes('sent') || message.includes('success') 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {message}
                </div>
              )}
            </form>

            <div className="text-center mt-6">
              <Link 
                href="/auth/login"
                className="text-orange-600 hover:text-orange-700 text-sm font-medium hover:underline transition-colors duration-200"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ForgotPasswordPage;
