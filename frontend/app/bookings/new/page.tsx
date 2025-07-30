'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { format } from 'date-fns';
import { useUser } from '@/app/providers/UserProvider';
import Container from '@/app/components/Container';
import Button from '@/app/components/Button';
import Heading from '@/app/components/Heading';

interface BookingData {
  startDate: string;
  endDate: string;
  totalDays: number;
  totalAmount: number;
  notes?: string;
}

interface CompletedBooking {
  id: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  paymentId: string;
  orderId: string;
  notes?: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const BookingPage = () => {
  const { token, user, refreshUser } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get booking details from URL params
  const itemId = searchParams?.get('itemId') || '';
  const itemTitle = searchParams?.get('itemTitle') || '';
  const dailyRate = Number(searchParams?.get('dailyRate')) || 0;
  const ownerEmail = searchParams?.get('ownerEmail') || '';
  const securityDeposit = Number(searchParams?.get('securityDeposit')) || 0;
  
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  const [isLoading, setIsLoading] = useState(false);
  const [bookingData, setBookingData] = useState<BookingData>({
    startDate: '',
    endDate: '',
    totalDays: 0,
    totalAmount: 0,
    notes: ''
  });
  const [completedBooking, setCompletedBooking] = useState<CompletedBooking | null>(null);
  const [paymentStep, setPaymentStep] = useState<'details' | 'processing' | 'success'>('details');

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (bookingData.startDate && bookingData.endDate) {
      const start = new Date(bookingData.startDate);
      const end = new Date(bookingData.endDate);
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 0) {
        const totalAmount = (diffDays * dailyRate) + securityDeposit;
        setBookingData(prev => ({
          ...prev,
          totalDays: diffDays,
          totalAmount
        }));
      }
    }
  }, [bookingData.startDate, bookingData.endDate, dailyRate, securityDeposit]);

  const handleBookingSubmit = async () => {
    if (!user || !token) {
      toast.error('Please login to make a booking');
      router.push('/auth/login');
      return;
    }

    if (!bookingData.startDate || !bookingData.endDate) {
      toast.error('Please select booking dates');
      return;
    }

    if (bookingData.totalDays <= 0) {
      toast.error('Please select valid dates');
      return;
    }

    setIsLoading(true);
    
    try {
      // Create payment order
      const orderResponse = await axios.post('/api/payment/create-order', {
        amount: bookingData.totalAmount,
        currency: 'INR',
        itemId,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        notes: bookingData.notes
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const { orderId, amount } = orderResponse.data;

      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount,
        currency: 'INR',
        name: 'RentCart',
        description: `Booking for ${itemTitle}`,
        order_id: orderId,
        handler: async (response: any) => {
          try {
            // Verify payment
            const verifyResponse = await axios.post('/api/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              itemId,
              startDate: bookingData.startDate,
              endDate: bookingData.endDate,
              totalAmount: bookingData.totalAmount,
              notes: bookingData.notes
            }, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });

            const booking = verifyResponse.data;
            setCompletedBooking({
              id: booking.id,
              startDate: bookingData.startDate,
              endDate: bookingData.endDate,
              totalAmount: bookingData.totalAmount,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              notes: bookingData.notes
            });

            setStep('success');
            toast.success('Booking confirmed successfully!');
            await refreshUser();
          } catch (error) {
            console.error('Payment verification failed:', error);
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: `${user.firstName} ${user.lastName}`,
          email: user.emailId,
          contact: user.phoneNumber
        },
        notes: {
          itemId,
          itemTitle,
          startDate: bookingData.startDate,
          endDate: bookingData.endDate
        },
        theme: {
          color: '#ea580c'
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
            toast.error('Payment cancelled');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to create booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!itemId || !itemTitle || !dailyRate) {
    return (
      <Container>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Booking Request</h1>
            <p className="text-gray-600 mb-6">Missing required booking information.</p>
            <Button
              label="Go Back"
              onClick={() => router.back()}
            />
          </div>
        </div>
      </Container>
    );
  }

  if (step === 'success' && completedBooking) {
    return (
      <Container>
        <div className="max-w-2xl mx-auto py-8">
          <div className="bg-white rounded-lg border border-gray-200 shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Booking Confirmed!
              </h1>
              <p className="text-gray-600">
                Your booking has been successfully confirmed.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Booking Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Item:</span>
                  <span className="font-medium">{itemTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking ID:</span>
                  <span className="font-medium">{completedBooking.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment ID:</span>
                  <span className="font-medium">{completedBooking.paymentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Check-in:</span>
                  <span className="font-medium">{format(new Date(completedBooking.startDate), 'PPP')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Check-out:</span>
                  <span className="font-medium">{format(new Date(completedBooking.endDate), 'PPP')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Days:</span>
                  <span className="font-medium">{Math.ceil((new Date(completedBooking.endDate).getTime() - new Date(completedBooking.startDate).getTime()) / (1000 * 60 * 60 * 24))} days</span>
                </div>
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total Amount:</span>
                  <span>₹{completedBooking.totalAmount}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                label="View Bookings"
                onClick={() => router.push('/bookings')}
              />
              <Button
                label="Go Home"
                onClick={() => router.push('/')}
                outline
              />
            </div>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="max-w-2xl mx-auto py-8">
        <div className="bg-white rounded-lg border border-gray-200 shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Book Your Item
            </h1>
            <p className="text-gray-600">
              Complete your booking for {itemTitle}
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Item Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Item:</span>
                  <span className="font-medium">{itemTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Daily Rate:</span>
                  <span className="font-medium">₹{dailyRate}</span>
                </div>
                {securityDeposit > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Security Deposit:</span>
                    <span className="font-medium">₹{securityDeposit}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={bookingData.startDate}
                onChange={(e) => setBookingData(prev => ({ ...prev, startDate: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={bookingData.endDate}
                onChange={(e) => setBookingData(prev => ({ ...prev, endDate: e.target.value }))}
                min={bookingData.startDate || new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={bookingData.notes}
                onChange={(e) => setBookingData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any special requirements or notes..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {bookingData.totalDays > 0 && (
              <div className="bg-orange-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Booking Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>₹{dailyRate} × {bookingData.totalDays} days</span>
                    <span>₹{dailyRate * bookingData.totalDays}</span>
                  </div>
                  {securityDeposit > 0 && (
                    <div className="flex justify-between">
                      <span>Security Deposit</span>
                      <span>₹{securityDeposit}</span>
                    </div>
                  )}
                  <hr className="my-2" />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>₹{bookingData.totalAmount}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <Button
                label="Cancel"
                onClick={() => router.back()}
                outline
              />
              <Button
                label={isLoading ? "Processing..." : "Confirm Booking"}
                onClick={handleBookingSubmit}
                disabled={isLoading || !bookingData.startDate || !bookingData.endDate || bookingData.totalDays <= 0}
              />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default BookingPage;
