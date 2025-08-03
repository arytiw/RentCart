// app/providers.tsx
'use client';

import { UserProvider } from '@/app/providers/UserProvider';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <Toaster position="top-right" />
      {children}
    </UserProvider>
  );
}
