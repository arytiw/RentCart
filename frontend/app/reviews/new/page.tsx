'use client';

import axios from "axios";
import { toast } from "react-hot-toast";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { useUser } from '@/app/providers/UserProvider';
import Container from '@/app/components/Container';
import Input from "@/app/components/inputs/Input";
import Heading from "@/app/components/Heading";
import Button from "@/app/components/Button";

const AddReviewPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token, user: currentUser } = useUser();
  
  // Get review details from URL params
  const itemId = searchParams?.get('itemId') || '';
  const itemTitle = searchParams?.get('itemTitle') || '';
  const orderId = searchParams?.get('orderId') || '';
  
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

    if (!currentUser || !token) {
      toast.error("Please login to submit a review");
      router.push('/auth/login');
      return;
    }

    setIsLoading(true);

    const reviewData = {
      itemId,
      rating,
      comment: data.comment,
      orderId: orderId || undefined,
    };

    try {
      await axios.post("/api/reviews", reviewData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      toast.success("Review submitted successfully!");
      reset();
      setRating(0);
      router.push(`/items/${itemId}`);
    } catch (error: any) {
      console.error("Error submitting review:", error);
      
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Failed to submit review. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!itemId || !itemTitle) {
    return (
      <Container>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Review Request</h1>
            <p className="text-gray-600 mb-6">Missing required review information.</p>
            <Button
              label="Go Back"
              onClick={() => router.back()}
            />
          </div>
        </div>
      </Container>
    );
  }

  if (!currentUser || !token) {
    return (
      <Container>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h1>
            <p className="text-gray-600 mb-6">Please log in to submit a review.</p>
            <Button
              label="Go to Login"
              onClick={() => router.push('/auth/login')}
            />
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
              Write a Review
            </h1>
            <p className="text-gray-600">
              Share your experience with "{itemTitle}"
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Heading
                title="Rating"
                subtitle="How would you rate this item?"
              />
              <div className="flex gap-2 mt-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-3xl transition-colors ${
                      star <= rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-sm text-gray-600 mt-2">
                  You rated this item {rating} star{rating !== 1 ? 's' : ''}
                </p>
              )}
            </div>

            <div>
              <Heading
                title="Review"
                subtitle="Tell others about your experience"
              />
              <textarea
                {...register("comment", {
                  required: "Please write a review comment",
                  minLength: {
                    value: 10,
                    message: "Review must be at least 10 characters long"
                  }
                })}
                disabled={isLoading}
                placeholder="Share your thoughts about this item..."
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-70 disabled:cursor-not-allowed mt-4"
              />
              {errors.comment && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.comment.message as string}
                </p>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Review Guidelines</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Be honest and constructive in your feedback</li>
                <li>• Focus on the item's condition, functionality, and value</li>
                <li>• Avoid personal information or inappropriate content</li>
                <li>• Help other users make informed decisions</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <Button
                label="Cancel"
                onClick={() => router.back()}
                outline
              />
              <Button
                label={isLoading ? "Submitting..." : "Submit Review"}
                onClick={() => {}}
                disabled={isLoading || rating === 0}
              />
            </div>
          </form>
        </div>
      </div>
    </Container>
  );
};

export default AddReviewPage;
