"use client";

import { Review } from '@/app/types';
import { useState, useEffect } from 'react';
import getReviewsByItemId from '@/app/actions/getReviewsByItemId';
import getAverageRating from '@/app/actions/getAverageRating';
import addReview from '@/app/actions/addReview';
import { SafeUser } from '@/app/types';
import Button from './Button';
import { toast } from 'react-hot-toast';

interface ReviewSectionProps {
  itemId: string;
  currentUser?: SafeUser | null;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({
  itemId,
  currentUser
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [showAddReview, setShowAddReview] = useState(false);
  const [newReview, setNewReview] = useState({
    comment: '',
    rating: 5
  });

  useEffect(() => {
    fetchReviews();
    fetchAverageRating();
  }, [itemId]);

  const fetchReviews = async () => {
    try {
      const reviewsData = await getReviewsByItemId(itemId);
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAverageRating = async () => {
    try {
      const rating = await getAverageRating(itemId);
      setAverageRating(rating);
    } catch (error) {
      console.error('Error fetching average rating:', error);
    }
  };

  const handleAddReview = async () => {
    if (!currentUser) {
      toast.error('Please login to add a review');
      return;
    }

    if (!newReview.comment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    try {
      await addReview({
        itemId,
        userId: currentUser.id,
        comment: newReview.comment,
        rating: newReview.rating
      });

      toast.success('Review added successfully!');
      setNewReview({ comment: '', rating: 5 });
      setShowAddReview(false);
      fetchReviews();
      fetchAverageRating();
    } catch (error) {
      toast.error('Failed to add review');
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return '⭐'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="text-xl font-semibold">Reviews</div>
        <div className="text-neutral-500">Loading reviews...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="text-xl font-semibold">Reviews</div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-medium">{averageRating.toFixed(1)}</span>
          <span className="text-yellow-500">{renderStars(averageRating)}</span>
          <span className="text-neutral-500">({reviews.length} reviews)</span>
        </div>
      </div>

      {currentUser && (
        <div className="flex flex-col gap-4">
          {!showAddReview ? (
            <Button
              label="Add Review"
              onClick={() => setShowAddReview(true)}
              small
            />
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <select
                    value={newReview.rating}
                    onChange={(e) => setNewReview(prev => ({ ...prev, rating: Number(e.target.value) }))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    {[5, 4, 3, 2, 1].map(rating => (
                      <option key={rating} value={rating}>
                        {rating} {rating === 1 ? 'star' : 'stars'}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comment
                  </label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Share your experience with this item..."
                    className="w-full p-2 border border-gray-300 rounded-md h-24 resize-none"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    label="Submit Review"
                    onClick={handleAddReview}
                    small
                  />
                  <Button
                    label="Cancel"
                    onClick={() => {
                      setShowAddReview(false);
                      setNewReview({ comment: '', rating: 5 });
                    }}
                    outline
                    small
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col gap-4">
        {reviews.length === 0 ? (
          <div className="text-neutral-500">No reviews yet. Be the first to review this item!</div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">User {review.userId.slice(-4)}</span>
                  <span className="text-yellow-500">{renderStars(review.rating)}</span>
                </div>
                <span className="text-sm text-neutral-500">
                  {formatDate(review.timestamp)}
                </span>
              </div>
              <p className="text-neutral-700">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewSection; 