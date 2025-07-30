'use client';

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import Container from '@/app/components/Container';
import Button from '@/app/components/Button';
import { useUser } from '@/app/providers/UserProvider';

const ChangePasswordPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    if (!user?.emailId) {
      const errorMessage = 'User email not found. Please log in again.';
      setMessage(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
      return;
    }
    
    if (newPassword !== confirmPassword) {
      const errorMessage = 'New passwords do not match.';
      setMessage(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
      return;
    }
    
    try {
      const res = await fetch('/api/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: user.emailId, 
          oldPassword, 
          newPassword, 
          confirmPassword 
        }),
      });
      
      const data = await res.json();
      setMessage(data.message);
      
      if (res.ok) {
        toast.success('Password changed successfully!');
        // Clear form
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        // Redirect after a short delay
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        toast.error(data.message || 'Failed to change password');
      }
    } catch (err) {
      const errorMessage = 'Something went wrong.';
      setMessage(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Container>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-6">Please log in to change your password.</p>
            <Link 
              href="/auth/login"
              className="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 transition-colors"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg border border-gray-200 shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Change Password
              </h1>
              <p className="text-gray-600 text-base">
                Update your account password
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  id="oldPassword"
                  placeholder="Enter current password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              
              <Button 
                label={loading ? 'Changing...' : 'Change Password'} 
                onClick={() => {}}
                disabled={loading}
              />
              
              {message && (
                <div className={`text-center text-sm p-3 rounded-md ${
                  message.includes('successfully') || message.includes('success') 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {message}
                </div>
              )}
            </form>

            <div className="text-center mt-6">
              <Link 
                href="/dashboard"
                className="text-orange-600 hover:text-orange-700 text-sm font-medium hover:underline transition-colors duration-200"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ChangePasswordPage;
