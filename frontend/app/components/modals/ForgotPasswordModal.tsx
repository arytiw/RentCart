import React, { useState } from 'react';
import Modal from './Modal';
import Button from '../Button';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
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
      } else {
        setMessage(data.message);
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
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        className="border p-2 rounded"
      />
      <Button label={loading ? 'Sending...' : 'Send Reset Link'} onClick={() => {}} disabled={loading} />
      {message && <div className="text-center text-sm mt-2">{message}</div>}
    </form>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={() => {}}
      title="Forgot Password"
      body={bodyContent}
      actionLabel="Close"
    />
  );
};

export default ForgotPasswordModal; 