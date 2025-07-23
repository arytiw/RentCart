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
import Script from "next/script";

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

      // Initiate order with backend to get Razorpay order details
      const orderResponse = await axios.post('/api/orders', orderRequest, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (orderResponse.data.razorpay) {
        const razorpayOrder = orderResponse.data.razorpay;
        const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
        if (!razorpayKey) {
          toast.error("Razorpay key is not set in environment. Please contact support.");
          setIsLoading(false);
          return;
        }
        const userName = (typeof window !== 'undefined' && localStorage.getItem('userName')) || "User";
        const userEmail = (typeof window !== 'undefined' && localStorage.getItem('userEmail')) || "user@example.com";
        const options = {
          key: razorpayKey,
          amount: Number(razorpayOrder.amount),
          currency: razorpayOrder.currency,
          name: "RentCart",
          description: `Booking for ${itemTitle}`,
          order_id: razorpayOrder.id,
          handler: async function (response: any) {
            try {
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
              toast.success("Booking successful! Your order has been confirmed.");
              router.refresh();
              reset();
              setPaymentStep('details');
              bookingModal.onClose();
            } catch (error) {
              toast.error("Payment successful but order confirmation failed. Please contact support.");
            }
          },
          prefill: {
            name: userName,
            email: userEmail,
          },
          modal: {
            ondismiss: function() {
              toast.info("Payment cancelled. You can try again.");
            }
          },
          theme: {
            color: "#F43F5E",
          },
        };
        // Debug log for Razorpay options
        console.log("Razorpay options:", options);
        try {
          if (typeof window !== "undefined" && (window as any).Razorpay) {
            const rzp = new (window as any).Razorpay(options);
            rzp.open();
          } else {
            toast.error("Razorpay SDK not loaded. Please try again.");
          }
        } catch (err) {
          console.error("Error opening Razorpay modal:", err);
          toast.error("Payment failed to start. Please try again.");
        }
      } else {
        toast.error("Payment initialization failed. Please try again.");
      }
    } catch (error: any) {
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
    <>
      {/* Razorpay script is loaded globally in layout.tsx */}
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
    </>
  );
};

export default BookingModal; 
