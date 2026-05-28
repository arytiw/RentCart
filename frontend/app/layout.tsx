// @ts-nocheck
import { Plus_Jakarta_Sans, Inter } from "next/font/google";

import Navbar from "@/app/components/navbar/Navbar";
import LoginModal from "@/app/components/modals/LoginModal";
import RegisterModal from "@/app/components/modals/RegisterModal";
import SearchModal from "@/app/components/modals/SearchModal";
import RentModal from "@/app/components/modals/RentModal";
import BookingModal from "@/app/components/modals/BookingModal";

import ToasterProvider from "@/app/providers/ToasterProvider";
import { UserProvider } from "@/app/providers/UserProvider";

import "./globals.css";
import ClientOnly from "./components/ClientOnly";
import Footer from "@/app/components/footer/footer";

export const metadata = {
  title: "RentCart — Rent anything. Anytime.",
  description:
    "Premium peer-to-peer rentals. Discover, book, and list quality items with verified owners and instant booking.",
};

// Display: Plus Jakarta Sans (modern, slightly geometric)
const display = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
});

// Body: Inter (neutral, highly readable)
const sans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} bg-cream`}>
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      </head>
      <body className="font-sans bg-cream text-ink antialiased">
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
          <main className="pb-24 pt-24">{children}</main>
          <Footer />
        </UserProvider>
      </body>
    </html>
  );
}
