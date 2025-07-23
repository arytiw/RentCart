import axios from 'axios';
import { Review } from '@/app/types';

const getReviewsByItemId = async (itemId: string): Promise<Review[]> => {
  try {
    const response = await axios.get(`http://localhost:9095/api/reviews/item/${itemId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
};

export default getReviewsByItemId; 