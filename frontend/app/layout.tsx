// @ts-nocheck
import { Nunito } from 'next/font/google'

import Navbar from '@/app/components/navbar/Navbar';
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
      <body className={`${font.className} bg-white`}>
        <UserProvider>
          <ClientOnly>
            <ToasterProvider />
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
