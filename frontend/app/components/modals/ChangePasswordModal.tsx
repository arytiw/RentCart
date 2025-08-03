import React, { useState } from 'react';
import Modal from './Modal';
import Button from '../Button';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose, email }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    if (!email) {
      setMessage('User email not found. Please log in again.');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, oldPassword, newPassword, confirmPassword }),
      });
      const data = await res.json();
      setMessage(data.message);
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
        placeholder="Old password"
        value={oldPassword}
        onChange={e => setOldPassword(e.target.value)}
        required
        className="border p-2 rounded"
      />
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
      <Button label={loading ? 'Changing...' : 'Change Password'} onClick={() => {}} disabled={loading} />
      {message && <div className="text-center text-sm mt-2">{message}</div>}
    </form>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onClose}
      title="Change Password"
      body={bodyContent}
      actionLabel="Close"
    />
  );
};

export default ChangePasswordModal; 