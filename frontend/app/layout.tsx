// @ts-nocheck
import { Nunito } from 'next/font/google'

import Navbar from '@/app/components/navbar/Navbar';
import LoginModal from '@/app/components/modals/LoginModal';
import RegisterModal from '@/app/components/modals/RegisterModal';
import SearchModal from '@/app/components/modals/SearchModal';
import RentModal from '@/app/components/modals/RentModal';
import BookingModal from '@/app/components/modals/BookingModal';

import ToasterProvider from '@/app/providers/ToasterProvider';
import { UserProvider } from '@/app/providers/UserProvider';

import './globals.css'
import ClientOnly from './components/ClientOnly';
import Footer from '@/app/components/footer/footer';

export const metadata = {
  title: 'RentCart',
  description: 'Rent your stuff',
}

const font = Nunito({ 
  subsets: ['latin'], 
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className='bg-white'>
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </head>
      <body className={font.className}>
        <UserProvider>
          <ClientOnly>
            <ToasterProvider />
            <LoginModal />
            <RegisterModal />
            <SearchModal />
            <RentModal />
            <BookingModal />
            <Navbar />
          </ClientOnly>
          <div className="pb-20 pt-28">
            {children}
          </div>
          <Footer />
        </UserProvider>
      </body>
    </html>
  )
}
