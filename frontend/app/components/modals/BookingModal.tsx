"use client";

import axios from "axios";
import { toast } from "react-hot-toast";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import useBookingModal from "@/app/hooks/useBookingModal";
import { useUser } from '@/app/providers/UserProvider';

import Modal from "./Modal";
import Input from "../inputs/Input";
import Heading from "../Heading";
import Button from "../Button";

interface BookingModalProps {
  itemId: string;
  itemTitle: string;
  itemPrice: number;
  itemImages: string[];
}

const BookingModal: React.FC<BookingModalProps> = ({
  itemId,
  itemTitle,
  itemPrice,
  itemImages,
}) => {
  const router = useRouter();
  const bookingModal = useBookingModal();
  const { token } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'details' | 'payment'>('details');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      address: "",
      couponCode: "",
      paymentMode: "ONLINE",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (paymentStep === 'details') {
      // Move to payment step
      setPaymentStep('payment');
      return;
    }

    setIsLoading(true);

    try {
      const authToken = token || localStorage.getItem('authToken');

      if (!authToken) {
        toast.error("Please login to book this item");
        setIsLoading(false);
        return;
      }

      // Create order request
      const orderRequest = {
        itemIds: [itemId],
        address: data.address,
        couponCode: data.couponCode || null,
        paymentMode: data.paymentMode,
      };

      console.log('Creating order:', orderRequest);

      // Initiate order with Razorpay
      const orderResponse = await axios.post('/api/orders', orderRequest, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      console.log('Order initiated:', orderResponse.data);

      // Handle Razorpay payment
      if (orderResponse.data.razorpay) {
        console.log('Razorpay order data:', orderResponse.data.razorpay);
        
        const options = {
          key: "rzp_test_sIJfB86OPmS019", // Razorpay test key
          amount: orderResponse.data.razorpay.amount,
          currency: orderResponse.data.razorpay.currency,
          name: "RentCart",
          description: `Booking for ${itemTitle}`,
          order_id: orderResponse.data.razorpay.id,
          handler: async function (response: any) {
            try {
              console.log('Payment successful:', response);
              
              // Confirm order after successful payment with payment verification
              const confirmData = {
                orderRequest: orderRequest,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature
              };
              
              const confirmResponse = await axios.post('/api/orders/confirm', confirmData, {
                headers: {
                  'Authorization': `Bearer ${authToken}`
                }
              });

              console.log('Order confirmed:', confirmResponse.data);
              toast.success("Booking successful! Your order has been confirmed.");
              router.refresh();
              reset();
              setPaymentStep('details');
              bookingModal.onClose();
            } catch (error) {
              console.error('Error confirming order:', error);
              toast.error("Payment successful but order confirmation failed. Please contact support.");
            }
          },
          prefill: {
            name: "User Name", // You can get this from user context
            email: "user@example.com", // You can get this from user context
          },
          modal: {
            ondismiss: function() {
              console.log('Payment modal dismissed');
              toast.info("Payment cancelled. You can try again.");
            }
          },
          theme: {
            color: "#F43F5E",
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        console.error('No Razorpay data in response:', orderResponse.data);
        toast.error("Payment initialization failed. Please try again.");
      }

    } catch (error: any) {
      console.error('Error creating booking:', error);
      
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const actionLabel = useMemo(() => {
    if (paymentStep === 'payment') {
      return "Proceed to Payment";
    }
    return "Continue";
  }, [paymentStep]);

  const secondaryActionLabel = useMemo(() => {
    if (paymentStep === 'payment') {
      return "Back";
    }
    return undefined;
  }, [paymentStep]);

  const onSecondaryAction = () => {
    if (paymentStep === 'payment') {
      setPaymentStep('details');
    }
  };

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="Book this item"
        subtitle={`Rent ${itemTitle} for Rs ${itemPrice} per day`}
      />
      
      <div className="flex flex-col gap-4">
        <Input
          id="address"
          label="Delivery Address"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          placeholder="Enter your complete delivery address"
        />
        
        <Input
          id="couponCode"
          label="Coupon Code (Optional)"
          disabled={isLoading}
          register={register}
          errors={errors}
          placeholder="e.g., SAVE10 for 10% off"
        />
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Order Summary</h3>
        <div className="flex justify-between">
          <span>Item Price:</span>
          <span>Rs {itemPrice}</span>
        </div>
        <div className="flex justify-between">
          <span>Duration:</span>
          <span>1 day</span>
        </div>
        <hr className="my-2" />
        <div className="flex justify-between font-semibold">
          <span>Total:</span>
          <span>Rs {itemPrice}</span>
        </div>
      </div>
    </div>
  );

  if (paymentStep === 'payment') {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Payment Details"
          subtitle="Complete your booking with secure payment"
        />
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Final Order Summary</h3>
          <div className="flex justify-between">
            <span>Item:</span>
            <span>{itemTitle}</span>
          </div>
          <div className="flex justify-between">
            <span>Price:</span>
            <span>Rs {itemPrice}</span>
          </div>
          <div className="flex justify-between">
            <span>Duration:</span>
            <span>1 day</span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between font-semibold">
            <span>Total Amount:</span>
            <span>Rs {itemPrice}</span>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          <p>• You will be redirected to Razorpay for secure payment</p>
          <p>• Payment is processed securely and your data is protected</p>
          <p>• You will receive confirmation once payment is complete</p>
        </div>
      </div>
    );
  }

  return (
    <Modal
      disabled={isLoading}
      isOpen={bookingModal.isOpen}
      title="Book Item"
      actionLabel={actionLabel}
      onSubmit={handleSubmit(onSubmit)}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={onSecondaryAction}
      onClose={bookingModal.onClose}
      body={bodyContent}
    />
  );
};

export default BookingModal; 