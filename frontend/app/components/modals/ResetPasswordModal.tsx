import React, { useState } from 'react';
import Modal from './Modal';
import Button from '../Button';
import { useRouter } from 'next/navigation';

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: string;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({ isOpen, onClose, token }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword, confirmPassword }),
      });
      const data = await res.json();
      setMessage(data.message);
      if (res.ok) {
        setTimeout(() => {
          onClose();
          router.push('/'); // Redirect to home or change to '/login' if you have a login page
        }, 1500);
      }
    } catch (err) {
      setMessage('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const bodyContent = (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="password"
        placeholder="New password"
        value={newPassword}
        onChange={e => setNewPassword(e.target.value)}
        required
        className="border p-2 rounded"
      />
      <input
        type="password"
        placeholder="Confirm new password"
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
        required
        className="border p-2 rounded"
      />
      <Button label={loading ? 'Resetting...' : 'Reset Password'} onClick={() => {}} disabled={loading} />
      {message && <div className="text-center text-sm mt-2">{message}</div>}
    </form>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onClose}
      title="Reset Password"
      body={bodyContent}
      actionLabel="Close"
    />
  );
};

export default ResetPasswordModal; 