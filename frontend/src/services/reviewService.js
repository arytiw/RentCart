/**
 * Review Service for RentCart
 * Handles all API calls to the Review microservice
 */

const REVIEW_API_BASE_URL = 'http://localhost:9090/api/reviews';

class ReviewService {
  /**
   * Test connection to review service
   */
  async testConnection() {
    try {
      const response = await fetch(`${REVIEW_API_BASE_URL}/greet`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.text();
    } catch (error) {
      console.error('Error testing connection:', error);
      throw error;
    }
  }

  /**
   * Add a new review
   * @param {Object} reviewData - Review data object
   * @param {string} reviewData.itemId - ID of the item being reviewed
   * @param {string} reviewData.userId - ID of the user writing the review
   * @param {string} reviewData.comment - Review comment
   * @param {number} reviewData.rating - Rating (1-5)
   */
  async addReview(reviewData) {
    try {
      const review = {
        ...reviewData,
        timestamp: Date.now()
      };

      const response = await fetch(`${REVIEW_API_BASE_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(review)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  }

  /**
   * Get review by ID
   * @param {string} reviewId - Review ID
   */
  async getReviewById(reviewId) {
    try {
      const response = await fetch(`${REVIEW_API_BASE_URL}/${reviewId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching review by ID:', error);
      throw error;
    }
  }

  /**
   * Get all reviews for a specific item
   * @param {string} itemId - Item ID
   */
  async getReviewsByItemId(itemId) {
    try {
      const response = await fetch(`${REVIEW_API_BASE_URL}/item/${itemId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching reviews by item ID:', error);
      throw error;
    }
  }

  /**
   * Get all reviews by a specific user
   * @param {string} userId - User ID
   */
  async getReviewsByUserId(userId) {
    try {
      const response = await fetch(`${REVIEW_API_BASE_URL}/user/${userId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching reviews by user ID:', error);
      throw error;
    }
  }

  /**
   * Get all reviews
   */
  async getAllReviews() {
    try {
      const response = await fetch(`${REVIEW_API_BASE_URL}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching all reviews:', error);
      throw error;
    }
  }

  /**
   * Delete a review
   * @param {string} reviewId - Review ID to delete
   */
  async deleteReview(reviewId) {
    try {
      const response = await fetch(`${REVIEW_API_BASE_URL}/${reviewId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.text();
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  }

  /**
   * Calculate average rating for an item
   * @param {string} itemId - Item ID
   */
  async getAverageRating(itemId) {
    try {
      const reviews = await this.getReviewsByItemId(itemId);
      if (!reviews || reviews.length === 0) {
        return 0;
      }

      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      return (totalRating / reviews.length).toFixed(1);
    } catch (error) {
      console.error('Error calculating average rating:', error);
      return 0;
    }
  }

  /**
   * Format timestamp to readable date
   * @param {number} timestamp - Unix timestamp
   */
  formatDate(timestamp) {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Validate review data
   * @param {Object} reviewData - Review data to validate
   */
  validateReviewData(reviewData) {
    const errors = [];

    if (!reviewData.itemId) {
      errors.push('Item ID is required');
    }

    if (!reviewData.userId) {
      errors.push('User ID is required');
    }

    if (!reviewData.comment || reviewData.comment.trim().length === 0) {
      errors.push('Comment is required');
    }

    if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
      errors.push('Rating must be between 1 and 5');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Create and export a singleton instance
const reviewService = new ReviewService();
export default reviewService;