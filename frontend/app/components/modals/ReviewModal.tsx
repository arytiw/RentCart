"use client";

import axios from "axios";
import { toast } from "react-hot-toast";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useUser } from '@/app/providers/UserProvider';

import Modal from "./Modal";
import Input from "../inputs/Input";
import Heading from "../Heading";
import Button from "../Button";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: string;
  itemTitle: string;
  orderId?: string;
  currentUser?: any;
  onReviewSubmitted?: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  itemId,
  itemTitle,
  orderId,
  currentUser: propCurrentUser,
  onReviewSubmitted,
}) => {
  const router = useRouter();
  const { token, user: contextUser } = useUser();
  const currentUser = propCurrentUser || contextUser;
  const [isLoading, setIsLoading] = useState(false);
  const [rating, setRating] = useState(0);

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

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setIsLoading(true);

    try {
      const authToken = token || localStorage.getItem('authToken');
      if (!authToken) {
        toast.error("Please login to submit a review");
        setIsLoading(false);
        return;
      }

      const reviewRequest = {
        itemId,
        rating,
        comment: data.comment,
        orderId: orderId || null,
        userId: currentUser?.email || currentUser?.emailId,
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
      onClose();
      
      // Call callback if provided
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
      
      // Refresh the page to show new review
      router.refresh();

    } catch (error: any) {
      console.error('Review submission error:', error);
      toast.error(error.response?.data?.error || "Failed to submit review");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setRating(0);
    onClose();
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
              className={`text-2xl transition-colors ${
                star <= rating ? 'text-yellow-500' : 'text-gray-300'
              } hover:text-yellow-400`}
              disabled={isLoading}
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

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading 
        title="Leave a Review" 
        subtitle={`Share your experience with "${itemTitle}"`} 
      />
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="text-sm text-gray-600 mb-2">Rating this item:</div>
        <div className="font-medium text-gray-800">{itemTitle}</div>
        {orderId && (
          <div className="text-sm text-gray-500 mt-1">Order ID: {orderId}</div>
        )}
      </div>
      
      <StarRating />
      
      <Input
        id="comment"
        label="Your Review (Optional)"
        type="textarea"
        placeholder="Share your experience with this item..."
        disabled={isLoading}
        register={register}
        errors={errors}
        rows={4}
        noValidation={false}
      />
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <div className="text-sm text-gray-500 text-center">
        Your review will help other users make informed decisions.
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={isOpen}
      title="Review Item"
      actionLabel="Submit Review"
      onClose={handleClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
      secondaryActionLabel="Cancel"
      secondaryAction={handleClose}
    />
  );
};

export default ReviewModal;
