import axios from 'axios';

const getAverageRating = async (itemId: string): Promise<number> => {
  try {
    const response = await axios.get(`http://localhost:9095/api/reviews/item/${itemId}/average-rating`);
    return response.data;
  } catch (error) {
    console.error('Error fetching average rating:', error);
    return 0;
  }
};

export default getAverageRating; 