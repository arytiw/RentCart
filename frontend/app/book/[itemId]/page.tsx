'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { format } from 'date-fns';
import { FaShoppingCart, FaCalendarAlt, FaMapMarkerAlt, FaRupeeSign, FaShieldAlt, FaClock, FaUsers, FaCheckCircle } from "react-icons/fa";
import Link from "next/link";

import { useUser } from '@/app/providers/UserProvider';

import Button from "../../components/Button";
import { Range } from "react-date-range";
import Calendar from "../../components/inputs/Calendar";

interface BookingData {
  dateRange: Range;
  totalDays: number;
  totalAmount: number;
  notes?: string;
}

interface ItemDetails {
  id: string;
  title: string;
  description: string;
  price: number;
  securityDeposit: number;
  imageSrc: string;
  location: any;
  ownerEmail: string;
  category: string;
}

const BookPage = () => {
  const params = useParams();
  const router = useRouter();
  const { token, user, isLoading: userProviderLoading } = useUser();
  
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  const [itemDetails, setItemDetails] = useState<ItemDetails | null>(null);
  const [bookingData, setBookingData] = useState<BookingData>({
    dateRange: {
      startDate: undefined,
      endDate: undefined,
      key: 'selection'
    },
    totalDays: 0,
    totalAmount: 0,
    notes: ''
  });
  const [paymentStep, setPaymentStep] = useState<'details' | 'processing' | 'success'>('details');

  const itemId = params.itemId as string;
  
  // Check if current user is the owner of this item
  const isOwner = user && itemDetails && (user.email || user.emailId) === itemDetails.ownerEmail;
  
  // Redirect owners away from booking their own items
  useEffect(() => {
    if (isOwner) {
      toast.error("You cannot book your own item!");
      setTimeout(() => {
        router.back();
      }, 2000);
    }
  }, [isOwner, router]);

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
    if (itemId) {
      fetchItemDetails();
    }
  }, [itemId]);

  const fetchItemDetails = async () => {
    try {
      const response = await axios.get(`/api/items/${itemId}`);
      setItemDetails(response.data);
    } catch (error) {
      console.error('Error fetching item details:', error);
      toast.error('Failed to load item details');
      router.push('/');
    }
  };

  const validateDates = (): boolean => {
    if (!bookingData.dateRange.startDate || !bookingData.dateRange.endDate) {
      toast.error('Please select both start and end dates');
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (bookingData.dateRange.startDate < today) {
      toast.error('Start date cannot be in the past');
      return false;
    }

    if (bookingData.dateRange.endDate <= bookingData.dateRange.startDate) {
      toast.error('End date must be after start date');
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (!validateDates()) {
      return;
    }
    setStep('payment');
  };

  const handleBack = () => {
    setStep('details');
  };

  const handlePayment = async () => {
    toast.error('Payment functionality not implemented in this minimal version');
  };

  if (isAuthLoading || userProviderLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {userProviderLoading ? 'Loading user data...' : 'Checking authentication...'}
          </p>
        </div>
      </div>
    );
  }

  if (!itemDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading item details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[650px]">
          
          {/* Left Side - Item Information */}
          <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-500 to-orange-600 flex-col justify-center items-center text-white p-8 relative overflow-hidden">
            <div className="relative z-10 text-center max-w-sm">
              <div className="flex items-center justify-center gap-3 mb-6">
                <FaShoppingCart size={36} className="text-white" />
                <h1 className="text-3xl font-bold">RentCart</h1>
              </div>
              
              <h2 className="text-xl font-bold mb-4">
                Book Your Perfect Item
              </h2>
              
              <p className="text-sm mb-6 leading-relaxed opacity-90">
                Secure booking with instant confirmation. 
                Get your items delivered right to your doorstep.
              </p>
            </div>
          </div>

          {/* Right Side - Booking Form */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center p-6 lg:p-8 relative max-h-full overflow-y-auto">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center gap-2 mb-6">
              <FaShoppingCart size={28} className="text-orange-500" />
              <h1 className="text-xl font-bold text-gray-900">RentCart</h1>
            </div>

            {/* Form Content */}
            <div className="flex-1 flex flex-col justify-center min-h-0">
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">
                  Complete your booking in just a few steps.
                </p>
                <h2 className="text-2xl font-bold text-gray-900">
                  Book Now
                </h2>
              </div>

              {/* Item Details */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-4">
                  {itemDetails.imageSrc && (
                    <img 
                      src={itemDetails.imageSrc} 
                      alt={itemDetails.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{itemDetails.title}</h3>
                    <p className="text-sm text-gray-600">{itemDetails.category}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <FaRupeeSign className="text-orange-500" size={12} />
                      <span className="text-sm font-medium">{itemDetails.price}/day</span>
                    </div>
                  </div>
                </div>
                {isOwner && (
                  <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                      <p className="text-sm text-blue-700 font-medium">
                        This is your item - you cannot book it
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {step === 'details' && (
                <div className="space-y-6">
                  {isOwner ? (
                    <div className="text-center py-8">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <div className="flex items-center justify-center mb-4">
                          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                            <FaShoppingCart className="text-white text-xl" />
                          </div>
                        </div>
                        <h3 className="text-lg font-semibold text-blue-900 mb-2">
                          This is Your Item
                        </h3>
                        <p className="text-blue-700 mb-4">
                          You cannot book your own item. This prevents self-booking and ensures fair marketplace practices.
                        </p>
                        <Button
                          label="Go Back"
                          onClick={() => router.back()}
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Rental Period
                        </label>
                        <Calendar
                          value={bookingData.dateRange}
                          onChange={(value) => setBookingData(prev => ({ 
                            ...prev, 
                            dateRange: value.selection 
                          }))}
                          disabledDates={[]}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Additional Notes (Optional)
                        </label>
                        <textarea
                          id="notes"
                          value={bookingData.notes}
                          onChange={(e) => setBookingData(prev => ({ ...prev, notes: e.target.value }))}
                          disabled={isLoading}
                          placeholder="Add any special requirements or notes..."
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                        />
                      </div>

                      <div className="flex gap-4 pt-4">
                        <Button
                          outline
                          label="Back"
                          onClick={() => router.back()}
                          disabled={isLoading}
                        />
                        <Button
                          label="Continue to Payment"
                          onClick={handleNext}
                          disabled={isLoading || bookingData.totalDays === 0}
                        />
                      </div>
                    </>
                  )}
                </div>
              )}

              {step === 'payment' && (
                <div className="space-y-6">
                  {isOwner ? (
                    <div className="text-center py-8">
                      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <div className="flex items-center justify-center mb-4">
                          <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                            <FaShoppingCart className="text-white text-xl" />
                          </div>
                        </div>
                        <h3 className="text-lg font-semibold text-red-900 mb-2">
                          Access Denied
                        </h3>
                        <p className="text-red-700 mb-4">
                          You cannot book your own item. Redirecting you back...
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="text-center">
                        <FaCheckCircle className="text-green-500 mx-auto mb-4" size={48} />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Details</h3>
                        <p className="text-gray-600 mb-6">
                          Complete your booking with secure payment
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Item:</span>
                            <span>{itemDetails.title}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Daily Rate:</span>
                            <span>₹{itemDetails.price}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Security Deposit:</span>
                            <span>₹{itemDetails.securityDeposit}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4 pt-4">
                        <Button
                          outline
                          label="Back"
                          onClick={handleBack}
                          disabled={isLoading}
                        />
                        <Button
                          label={isLoading ? "Processing..." : "Pay Now"}
                          onClick={handlePayment}
                          disabled={isLoading}
                        />
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Footer */}
              <div className="text-gray-500 text-center mt-6 font-medium">
                <p className="text-sm">Need help?
                  <Link 
                    href="/support-chat"
                    className="text-orange-600 cursor-pointer hover:text-orange-700 ml-1 font-semibold hover:underline transition-colors duration-200"
                  > 
                    Contact Support
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookPage; 