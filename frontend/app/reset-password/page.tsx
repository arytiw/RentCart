'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const ResetPasswordRedirect = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get('token') || '';

  useEffect(() => {
    if (token) {
      router.replace(`/auth/reset-password?token=${token}`);
    } else {
      router.replace('/auth/forgot-password');
    }
  }, [token, router]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
};

export default ResetPasswordRedirect; 