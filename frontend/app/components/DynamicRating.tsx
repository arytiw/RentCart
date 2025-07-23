"use client";

import { useState, useEffect } from 'react';
import getAverageRating from '@/app/actions/getAverageRating';

interface DynamicRatingProps {
  itemId: string;
}

const DynamicRating: React.FC<DynamicRatingProps> = ({ itemId }) => {
  const [averageRating, setAverageRating] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAverageRating();
  }, [itemId]);

  const fetchAverageRating = async () => {
    try {
      const rating = await getAverageRating(itemId);
      setAverageRating(rating);
    } catch (error) {
      console.error('Error fetching average rating:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-1">
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <span>{averageRating.toFixed(1)}</span>
      <span>/5</span>
      <span>⭐</span>
    </div>
  );
};

export default DynamicRating; 