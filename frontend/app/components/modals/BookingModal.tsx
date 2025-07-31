'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { format } from 'date-fns';
import { useUser } from '@/app/providers/UserProvider';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: string;
  itemTitle: string;
  dailyRate: number;
  ownerEmail: string;
  currentUser: any;
  securityDeposit?: number;
}

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

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  itemId,
  itemTitle,
  dailyRate,
  ownerEmail,
  currentUser,
  securityDeposit = 0
}) => {
  const { token, user, refreshUser } = useUser(); // Get token, user, and refreshUser from UserProvider context
  const router = useRouter();
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
  }, [bookingData.startDate, bookingData.endDate, dailyRate]);

  const validateDates = (): boolean => {
    if (!bookingData.startDate || !bookingData.endDate) {
      toast.error('Please select both start and end dates');
      return false;
    }

    const start = new Date(bookingData.startDate);
    const end = new Date(bookingData.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      toast.error('Start date cannot be in the past');
      return false;
    }

    if (end <= start) {
      toast.error('End date must be after start date');
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (step === 'details') {
      if (validateDates()) {
        setStep('payment');
      }
    }
  };

  const handleBack = () => {
    if (step === 'payment') {
      setStep('details');
    }
  };

  // Function to validate token with AuthService
  const validateToken = async (token: string) => {
    try {
      const response = await axios.post('http://localhost:8081/auth/validate', {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.status === 200;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  };

  const sendBookingEmails = async (orderData: any, renterEmail: string) => {
    try {
      // Get renter name from multiple sources
      let renterName = currentUser?.firstName || currentUser?.name;
      if (!renterName) {
        try {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            renterName = parsedUser.firstName || parsedUser.username || parsedUser.name;
          }
        } catch (e) {
          console.error('Error parsing stored user for email:', e);
        }
      }
      if (!renterName) {
        renterName = renterEmail?.split('@')[0] || 'User';
      }

      await axios.post('/api/booking/send-emails', {
        renterEmail: renterEmail,
        ownerEmail: ownerEmail,
        bookingDetails: {
          itemTitle,
          startDate: bookingData.startDate,
          endDate: bookingData.endDate,
          totalAmount: bookingData.totalAmount,
          paymentId: orderData.paymentId,
          orderId: orderData.id,
          renterName: renterName,
          notes: bookingData.notes
        }
      });
      console.log('Booking emails sent successfully');
    } catch (error) {
      console.error('Failed to send booking emails:', error);
    }
  };

  const handlePayment = async () => {
    if (!validateDates()) return;

    setIsLoading(true);
    setPaymentStep('processing');

    try {
      // Debug: Log what we have
      console.log('=== BOOKING MODAL DEBUG ===');
      console.log('currentUser:', currentUser);
      console.log('token from UserProvider:', token ? token.substring(0, 20) + '...' : 'No token from context');
      console.log('localStorage authToken:', localStorage.getItem('authToken'));
      console.log('localStorage token:', localStorage.getItem('token'));
      console.log('localStorage access_token:', localStorage.getItem('access_token'));
      console.log('localStorage jwt:', localStorage.getItem('jwt'));
      console.log('All localStorage keys:', Object.keys(localStorage));
      console.log('localStorage user:', localStorage.getItem('user'));
      
      // Check authentication - try multiple sources
      const authToken = token || // Use token from UserProvider context first
                       localStorage.getItem('authToken') || 
                       localStorage.getItem('token') || 
                       localStorage.getItem('accessToken') ||
                       localStorage.getItem('access_token') ||
                       localStorage.getItem('jwt');
      
      console.log('Resolved authToken:', authToken ? 'Present' : 'Missing');
      
      // Try to get user email from multiple sources
      let userEmail = user?.email || 
                      user?.emailId ||
                      currentUser?.email || 
                      currentUser?.emailId;
      
      console.log('userEmail from currentUser:', userEmail);
      
      // If currentUser is not available, try to get from localStorage
      if (!userEmail) {
        try {
          const storedUser = localStorage.getItem('user');
          console.log('storedUser raw:', storedUser);
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            console.log('parsedUser:', parsedUser);
            userEmail = parsedUser.email || parsedUser.emailId;
            console.log('userEmail from parsed user:', userEmail);
          }
        } catch (e) {
          console.error('Error parsing stored user:', e);
        }
        
        // Fallback to direct localStorage values
        if (!userEmail) {
          userEmail = localStorage.getItem('userEmail') ||
                     localStorage.getItem('email');
          console.log('userEmail from direct localStorage:', userEmail);
        }
      }
      
      console.log('Final resolved userEmail:', userEmail);
      console.log('Final resolved authToken:', authToken ? authToken.substring(0, 20) + '...' : 'No token');
      console.log('User from context:', user);
      console.log('CurrentUser prop:', currentUser);
      
      // Fallback: if still no email but user is clearly logged in (visible in UI)
      // This is a temporary fix until we identify the localStorage issue
      if (!userEmail && typeof window !== 'undefined') {
        // Check if navbar shows user email (indicating user is logged in)
        const navbarUserMenu = document.querySelector('[data-testid="user-menu"]') || 
                              document.querySelector('.user-email') ||
                              document.querySelector('[title*="@"]');
        if (navbarUserMenu) {
          const emailMatch = navbarUserMenu.textContent?.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
          if (emailMatch) {
            userEmail = emailMatch[0];
            console.log('Fallback: extracted email from UI:', userEmail);
          }
        }
      }
      
      console.log('===========================');

      // More flexible authentication check - if we have an auth token OR user email, proceed
      if (!authToken && !userEmail) {
        toast.error('Please login to continue booking');
        setIsLoading(false);
        setPaymentStep('details');
        return;
      }

      if (!authToken) {
        toast.error('Authentication token missing. Please login again.');
        setIsLoading(false);
        setPaymentStep('details');
        return;
      }

      // Validate the token with AuthService
      let isTokenValid = await validateToken(authToken);
      if (!isTokenValid) {
        // Try to refresh user data first
        console.log('Token validation failed, attempting to refresh user data...');
        await refreshUser();
        
        // Get the updated token
        const updatedToken = token || localStorage.getItem('authToken');
        if (updatedToken && updatedToken !== authToken) {
          console.log('Got updated token, validating again...');
          isTokenValid = await validateToken(updatedToken);
        }
        
        if (!isTokenValid) {
          toast.error('Authentication token is invalid or expired. Please login again.');
          setIsLoading(false);
          setPaymentStep('details');
          return;
        }
      }

      if (!userEmail) {
        toast.error('User email not found. Please try logging in again.');
        setIsLoading(false);
        setPaymentStep('details');
        return;
      }

      // Create order with backend
      const orderData = {
        itemId,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        totalAmount: Number(bookingData.totalAmount),
        dailyRate: Number(dailyRate),
        securityDeposit: Number(securityDeposit),
        itemTitle: itemTitle,
        ownerEmail: ownerEmail,
        notes: bookingData.notes
      };

      console.log('Sending order data to backend:', orderData);
      console.log('Type check - dailyRate:', typeof orderData.dailyRate, 'value:', orderData.dailyRate);
      console.log('Type check - securityDeposit:', typeof orderData.securityDeposit, 'value:', orderData.securityDeposit);
      console.log('Type check - totalAmount:', typeof orderData.totalAmount, 'value:', orderData.totalAmount);

      let orderResponse;
      try {
        orderResponse = await axios.post('/api/orders/create', orderData, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'X-USER-EMAIL': userEmail
        }
      });
      console.log('Order creation response:', orderResponse.data);
      } catch (error: any) {
        console.error('Order creation error:', error);
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        throw new Error(`Payment initiation failed: ${error.response?.data?.error || error.message}`);
      }

      if (!orderResponse.data.success && !orderResponse.data.razorpay) {
        throw new Error(orderResponse.data.message || orderResponse.data.error || 'Failed to create order');
      }

      // Get Razorpay order details
      const razorpayOrder = orderResponse.data.razorpay;
      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_0TV00DG1iL8ZEz';
      
      // Check if this is a mock order (starts with rzp_test_ and has timestamp)
      const isMockOrder = razorpayOrder.id.startsWith('rzp_test_') && 
                         razorpayOrder.id.match(/rzp_test_\d{13}/);
      
      console.log('Razorpay order details:', razorpayOrder);
      console.log('Is mock order:', isMockOrder);
      
      if (isMockOrder) {
        // Test mode - simulate payment success
            console.log('Test mode: Simulating payment success');
            
            // Create mock payment response for test mode
            const mockPaymentResponse = {
              razorpay_order_id: razorpayOrder.id,
              razorpay_payment_id: 'pay_test_' + Date.now(),
              razorpay_signature: 'test_signature_' + Date.now()
            };
            
            // Confirm payment with backend
            const confirmResponse = await axios.post('/api/orders/confirm', {
          orderRequest: {
            itemIds: [itemId],
            address: "Delivery address will be provided by owner", // Add default address
            startDate: bookingData.startDate,
            endDate: bookingData.endDate,
            dailyRate: Number(dailyRate),
            securityDeposit: Number(securityDeposit),
            itemTitle: itemTitle,
            ownerEmail: ownerEmail,
            notes: bookingData.notes
          },
              razorpayOrderId: mockPaymentResponse.razorpay_order_id,
              razorpayPaymentId: mockPaymentResponse.razorpay_payment_id,
              razorpaySignature: mockPaymentResponse.razorpay_signature,
              orderId: orderResponse.data.orderId,
            }, {
              headers: {
                'Authorization': `Bearer ${authToken}`,
                'X-USER-EMAIL': userEmail
              }
            });

            console.log('Payment confirmation response:', confirmResponse.data);

            if (confirmResponse.data.order) {
              const orderData = confirmResponse.data.order;
              setCompletedBooking(orderData);
              
              // Store rental details in localStorage for review page
              const rentalDetails = {
                startDate: bookingData.startDate,
                endDate: bookingData.endDate,
                dailyRate: dailyRate,
                securityDeposit: securityDeposit,
                itemTitle: itemTitle,
                notes: bookingData.notes
              };
              localStorage.setItem(`rental_${orderData.orderId}`, JSON.stringify(rentalDetails));
              
              // Mark item as booked
              await axios.put(`/api/items/${itemId}/book`, {
                booked: true,
                bookedBy: userEmail,
                bookingStartDate: bookingData.startDate,
                bookingEndDate: bookingData.endDate,
              }, {
                headers: {
                  'Authorization': `Bearer ${authToken}`
                }
              });

              // Send booking confirmation emails
              await sendBookingEmails(orderData, userEmail);

              setPaymentStep('success');
              toast.success("🧪 Test Payment Successful! Booking confirmed.");
            } else {
              toast.error("Payment verification failed");
          }
        } else {
      // Real Razorpay order - proceed with normal flow
      console.log('Real Razorpay order: Using actual Razorpay checkout');
      
      // Get user name from multiple sources for real Razorpay
      let userName = currentUser?.firstName || currentUser?.name;
      if (!userName) {
        try {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            userName = parsedUser.firstName || parsedUser.username || parsedUser.name;
          }
        } catch (e) {
          console.error('Error parsing stored user for name:', e);
        }
      }
      if (!userName) {
        userName = userEmail?.split('@')[0] || "User";
      }
      
      const options = {
        key: razorpayKey,
        amount: Number(razorpayOrder.amount),
        currency: razorpayOrder.currency,
        name: "RentCart",
        description: `Booking for ${itemTitle}`,
        order_id: razorpayOrder.id,
        handler: async function (response: any) {
          try {
            console.log('Razorpay payment response:', response);
            
            // Confirm payment with backend
            const confirmResponse = await axios.post('/api/orders/confirm', {
                orderRequest: {
                  itemIds: [itemId],
                  address: "Delivery address will be provided by owner", // Add default address
                  startDate: bookingData.startDate,
                  endDate: bookingData.endDate,
                  dailyRate: Number(dailyRate),
                  securityDeposit: Number(securityDeposit),
                  itemTitle: itemTitle,
                  ownerEmail: ownerEmail,
                  notes: bookingData.notes
                },
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              orderId: orderResponse.data.orderId,
            }, {
              headers: {
                'Authorization': `Bearer ${authToken}`,
                'X-USER-EMAIL': userEmail
              }
            });

            console.log('Payment confirmation response:', confirmResponse.data);

            if (confirmResponse.data.order) {
              const orderData = confirmResponse.data.order;
              setCompletedBooking(orderData);
              
              // Store rental details in localStorage for review page
              const rentalDetails = {
                startDate: bookingData.startDate,
                endDate: bookingData.endDate,
                dailyRate: dailyRate,
                securityDeposit: securityDeposit,
                itemTitle: itemTitle,
                notes: bookingData.notes
              };
              localStorage.setItem(`rental_${orderData.orderId}`, JSON.stringify(rentalDetails));
              
              // Mark item as booked
              await axios.put(`/api/items/${itemId}/book`, {
                booked: true,
                bookedBy: userEmail,
                bookingStartDate: bookingData.startDate,
                bookingEndDate: bookingData.endDate,
              }, {
                headers: {
                  'Authorization': `Bearer ${authToken}`
                }
              });

              // Send booking confirmation emails
              await sendBookingEmails(orderData, userEmail);

              setPaymentStep('success');
              toast.success("Booking confirmed! Check your email for details.");
            } else {
              toast.error("Payment verification failed");
            }
          } catch (error) {
            console.error('Payment confirmation error:', error);
            toast.error("Payment confirmation failed");
          } finally {
            setIsLoading(false);
          }
        },
        prefill: {
          name: userName,
          email: userEmail,
        },
        theme: {
          color: "#3B82F6",
        },
        modal: {
          ondismiss: function() {
            setIsLoading(false);
            setPaymentStep('details');
            toast.error("Payment cancelled. You can try again.");
          }
        }
      };

      // Load Razorpay and open payment modal
      if (typeof window !== 'undefined' && window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        toast.error('Payment gateway not loaded. Please refresh and try again.');
        setIsLoading(false);
        setPaymentStep('details');
        }
      }

    } catch (error: any) {
      console.error('Payment initiation error:', error);
      toast.error(error.response?.data?.message || 'Failed to initiate payment');
      setIsLoading(false);
      setPaymentStep('details');
    }
  };

  const handleClose = () => {
    setStep('details');
    setPaymentStep('details');
    setCompletedBooking(null);
    setBookingData({
      startDate: '',
      endDate: '',
      totalDays: 0,
      totalAmount: 0,
      notes: ''
    });
    onClose();
  };

  const handleGoToDashboard = () => {
    handleClose();
    router.push('/dashboard');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">
              {step === 'details' ? 'Book Item' : 
               step === 'payment' ? 'Payment' : 'Booking Confirmed'}
            </h2>
            <button
              onClick={handleClose}
              className="text-white hover:text-gray-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>
          <p className="text-blue-100 mt-2 text-sm">
            {itemTitle}
          </p>
        </div>

        <div className="p-6">
          {/* Step 1: Booking Details */}
          {step === 'details' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={bookingData.startDate}
                  onChange={(e) => setBookingData(prev => ({ ...prev, startDate: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={bookingData.notes}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Validate textarea content for notes
                    if (value.trim()) {
                      const textareaRegex = /^[a-zA-Z][a-zA-Z0-9\s.,!?'-]*$/;
                      if (!textareaRegex.test(value.trim())) {
                        // Don't update if validation fails
                        return;
                      }
                    }
                    setBookingData(prev => ({ ...prev, notes: value }));
                  }}
                  placeholder="Any special requirements or notes..."
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              {bookingData.totalDays > 0 && (
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-lg border border-blue-100">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{bookingData.totalDays}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Daily Rate:</span>
                      <span className="font-medium">₹{dailyRate.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rental Amount:</span>
                      <span className="font-medium">₹{(bookingData.totalDays * dailyRate).toLocaleString()}</span>
                    </div>
                    {securityDeposit > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Security Deposit:</span>
                        <span className="font-medium">₹{securityDeposit.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span>Total Amount:</span>
                      <span className="text-blue-600">₹{bookingData.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleNext}
                disabled={!bookingData.startDate || !bookingData.endDate || bookingData.totalDays <= 0}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Proceed to Payment
              </button>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 'payment' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-lg border border-blue-100">
                <h3 className="font-semibold text-gray-800 mb-3">Booking Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Item:</span>
                    <span className="font-medium">{itemTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{bookingData.totalDays}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dates:</span>
                    <span className="font-medium">
                      {format(new Date(bookingData.startDate), 'MMM dd')} - {format(new Date(bookingData.endDate), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rental Amount:</span>
                    <span className="font-medium">₹{(bookingData.totalDays * dailyRate).toLocaleString()}</span>
                  </div>
                  {securityDeposit > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Security Deposit:</span>
                      <span className="font-medium">₹{securityDeposit.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total Amount:</span>
                    <span className="text-blue-600">₹{bookingData.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {paymentStep === 'processing' && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Processing payment...</p>
                </div>
              )}

              {paymentStep === 'details' && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                      <p className="text-sm text-gray-700">
                        Secure payment powered by Razorpay
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={handleBack}
                      className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handlePayment}
                      disabled={isLoading}
                      className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-green-700 hover:to-blue-700 transition-all disabled:opacity-50"
                    >
                      {isLoading ? 'Processing...' : 'Pay Now'}
                    </button>
                  </div>
                </div>
              )}

              {paymentStep === 'success' && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-green-600 mb-2">Payment Successful!</h3>
                  <p className="text-gray-600 mb-6">
                    Your booking has been confirmed. You will receive an email confirmation shortly.
                  </p>
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        handleClose();
                        if (completedBooking?.orderId) {
                          router.push(`/review/${completedBooking.orderId}`);
                        } else {
                          router.push('/dashboard');
                        }
                      }}
                      className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-green-700 hover:to-blue-700 transition-all"
                    >
                      Write a Review
                    </button>
                    <button
                      onClick={handleGoToDashboard}
                      className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                      Go to Dashboard
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
