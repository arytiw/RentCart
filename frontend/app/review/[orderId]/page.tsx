"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useUser } from '@/app/providers/UserProvider';
import ClientOnly from '@/app/components/ClientOnly';
import Container from '@/app/components/Container';
import Heading from '@/app/components/Heading';
import Button from '@/app/components/Button';
import Input from '@/app/components/inputs/Input';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';

interface OrderDetails {
  id: string;
  itemIds: string[];
  startDate?: string;
  endDate?: string;
  totalAmount: number;
  paymentId?: string;
  orderId: string;
  itemTitle?: string;
  ownerEmail?: string;
  notes?: string;
  status: string;
  couponCode?: string;
  dailyRate?: number;
  securityDeposit?: number;
}

interface ReviewData {
  itemId: string;
  rating: number;
  comment: string;
  orderId: string;
  userId: string;
  userName: string;
}

const ReviewPage = () => {
  const params = useParams();
  const router = useRouter();
  const { token, user: currentUser } = useUser();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [itemDetails, setItemDetails] = useState<any>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      comment: "",
    },
  });

  const orderId = params.orderId as string;
  console.log('Review page - orderId from params:', orderId);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        console.log('Fetching order details for orderId:', orderId);
        console.log('Current user:', currentUser);
        
        const authToken = token || localStorage.getItem('authToken');
        if (!authToken) {
          toast.error('Please login to access this page');
          router.push('/');
          return;
        }

        // Fetch order details
        const orderResponse = await axios.get(`/api/orders/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'x-user-email': currentUser?.email || currentUser?.emailId || ''
          }
        });

        console.log('Order response:', orderResponse.data);
        const order = orderResponse.data;
        setOrderDetails(order);

        // Fetch item details if we have itemIds
        if (order.itemIds && order.itemIds.length > 0) {
          const itemResponse = await axios.get(`/api/items/${order.itemIds[0]}`);
          setItemDetails(itemResponse.data);
        }

        // Check if this is a rental order and get rental details from localStorage
        if (order.couponCode === 'RENTAL') {
          const rentalDetails = localStorage.getItem(`rental_${orderId}`);
          if (rentalDetails) {
            try {
              const rental = JSON.parse(rentalDetails);
              setOrderDetails(prev => ({
                ...prev,
                startDate: rental.startDate,
                endDate: rental.endDate,
                dailyRate: rental.dailyRate,
                securityDeposit: rental.securityDeposit,
                itemTitle: rental.itemTitle,
                notes: rental.notes
              }));
            } catch (e) {
              console.error('Error parsing rental details:', e);
            }
          }
        }

      } catch (error: any) {
        console.error('Error fetching order details:', error);
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        toast.error('Failed to load order details');
        router.push('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId, token, router]);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!orderDetails || !itemDetails) {
      toast.error("Order or item details not available");
      return;
    }

    setIsSubmitting(true);

    try {
      const authToken = token || localStorage.getItem('authToken');
      if (!authToken) {
        toast.error("Please login to submit a review");
        setIsSubmitting(false);
        return;
      }

      const reviewRequest: ReviewData = {
        itemId: orderDetails.itemIds[0],
        rating,
        comment: data.comment,
        orderId: orderDetails.orderId || orderDetails.id,
        userId: currentUser?.email || currentUser?.emailId || '',
        userName: currentUser?.firstName || currentUser?.name || 'Anonymous',
        timestamp: Date.now(),
      };

      console.log('Submitting review:', reviewRequest);

      const response = await axios.post('/api/reviews', reviewRequest, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        }
      });

      console.log('Review response:', response.data);

      toast.success("Review submitted successfully!");
      reset();
      setRating(0);
      
      // Redirect to dashboard after successful review submission
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);

    } catch (error: any) {
      console.error('Review submission error:', error);
      toast.error(error.response?.data?.error || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = () => {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Rating:</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-3xl transition-colors ${
                star <= rating ? 'text-yellow-500' : 'text-gray-300'
              } hover:text-yellow-400`}
              disabled={isSubmitting}
            >
              ★
            </button>
          ))}
        </div>
        <span className="text-sm text-gray-500">
          {rating > 0 && `${rating}/5`}
        </span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <ClientOnly>
        <Container>
          <div className="max-w-screen-lg mx-auto pt-10">
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading order details...</p>
            </div>
          </div>
        </Container>
      </ClientOnly>
    );
  }

  if (!orderDetails) {
    return (
      <ClientOnly>
        <Container>
          <div className="max-w-screen-lg mx-auto pt-10">
            <div className="text-center py-8">
              <h2 className="text-xl font-bold text-red-600 mb-2">Order Not Found</h2>
              <p className="text-gray-600 mb-4">The order you're looking for doesn't exist or you don't have permission to view it.</p>
              <Button label="Go to Dashboard" onClick={() => router.push('/dashboard')} />
            </div>
          </div>
        </Container>
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <Container>
        <div className="max-w-screen-lg mx-auto pt-10">
          <div className="bg-white rounded-xl shadow-lg p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <Heading 
                title="Payment Successful!" 
                subtitle="Thank you for your purchase. Please share your experience with us."
              />
            </div>

            {/* Order Details */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-lg mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-medium ml-2">{orderDetails.orderId}</span>
                </div>
                {orderDetails.paymentId && (
                  <div>
                    <span className="text-gray-600">Payment ID:</span>
                    <span className="font-medium ml-2">{orderDetails.paymentId}</span>
                  </div>
                )}
                <div>
                  <span className="text-gray-600">Item:</span>
                  <span className="font-medium ml-2">{itemDetails?.title || orderDetails.itemTitle || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-medium ml-2">₹{orderDetails.totalAmount.toLocaleString()}</span>
                </div>
                {orderDetails.startDate && orderDetails.endDate && (
                  <div>
                    <span className="text-gray-600">Rental Period:</span>
                    <span className="font-medium ml-2">
                      {new Date(orderDetails.startDate).toLocaleDateString()} - {new Date(orderDetails.endDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {orderDetails.dailyRate && (
                  <div>
                    <span className="text-gray-600">Daily Rate:</span>
                    <span className="font-medium ml-2">₹{orderDetails.dailyRate.toLocaleString()}</span>
                  </div>
                )}
                {orderDetails.securityDeposit && orderDetails.securityDeposit > 0 && (
                  <div>
                    <span className="text-gray-600">Security Deposit:</span>
                    <span className="font-medium ml-2">₹{orderDetails.securityDeposit.toLocaleString()}</span>
                  </div>
                )}
                <div>
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium ml-2 text-green-600">{orderDetails.status}</span>
                </div>
              </div>
            </div>

            {/* Review Form */}
            <div className="border-t pt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Write a Review</h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-2">Reviewing this item:</div>
                  <div className="font-medium text-gray-800">{itemDetails?.title || orderDetails.itemTitle || 'N/A'}</div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Rating</label>
                  <StarRating />
                </div>
                
                <Input
                  id="comment"
                  label="Your Review (Optional)"
                  type="textarea"
                  placeholder="Share your experience with this item..."
                  disabled={isSubmitting}
                  register={register}
                  errors={errors}
                  rows={4}
                  noValidation={false}
                />
                
                <div className="text-sm text-gray-500">
                  Your review will help other users make informed decisions. Please be honest and constructive.
                </div>
                
                <div className="flex gap-4 pt-4">
                  <Button
                    outline
                    label="Skip Review"
                    onClick={() => router.push('/dashboard')}
                    disabled={isSubmitting}
                  />
                  <Button
                    label="Submit Review"
                    onClick={handleSubmit(onSubmit)}
                    disabled={isSubmitting || rating === 0}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </ClientOnly>
  );
};

export default ReviewPage; 