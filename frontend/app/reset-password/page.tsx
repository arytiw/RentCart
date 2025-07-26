'use client';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import ResetPasswordModal from '../components/modals/ResetPasswordModal';

const ResetPasswordPage = () => {
  const searchParams = useSearchParams();
  const token = searchParams?.get('token') || '';
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (token) setOpen(true);
  }, [token]);

  return (
    <div>
      <ResetPasswordModal isOpen={open} onClose={() => setOpen(false)} token={token} />
      {!token && <div className="text-center mt-10">Invalid or missing token.</div>}
    </div>
  );
};

export default ResetPasswordPage; 