'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/app/providers/UserProvider';

interface AuthCheckProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function AuthCheck({ children, redirectTo = '/login' }: AuthCheckProps) {
  const { user, token, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Wait for UserProvider to finish loading
    if (isLoading) {
      return;
    }

    // Simple check: if user is logged in, proceed; if not, redirect
    const isLoggedIn = user && token;

    if (!isLoggedIn) {
      console.log('AuthCheck: User not logged in, redirecting to:', redirectTo);
      router.push(redirectTo);
    } else {
      console.log('AuthCheck: User is logged in, proceeding');
    }
  }, [user, token, isLoading, router, redirectTo]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If user is not logged in, don't render children (will redirect)
  if (!user || !token) {
    return null;
  }

  // If user is logged in, render children
  return <>{children}</>;
} 