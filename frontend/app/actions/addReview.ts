import axios from 'axios';
import { Review } from '@/app/types';

interface AddReviewData {
  itemId: string;
  userId: string;
  comment: string;
  rating: number;
}

const addReview = async (reviewData: AddReviewData): Promise<Review> => {
  try {
    const reviewPayload = {
      ...reviewData,
      timestamp: Date.now()
    };
    
    const response = await axios.post('http://localhost:9095/api/reviews', reviewPayload);
    return response.data;
  } catch (error) {
    console.error('Error adding review:', error);
    throw error;
  }
};

export default addReview; 