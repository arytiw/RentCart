package com.GroupProject.Review.Service;
import java.util.List;

import com.GroupProject.Review.Entity.Review;

public interface ReviewService {
    Review addReview(Review review);
    Review getReviewById(String id);
    List<Review> getReviewsByItemId(String itemId);
    List<Review> getReviewsByUserId(String userId);
    List<Review> getReviewsByItemIdAndUserId(String itemId, String userId);
    
    List<Review> getAllReviews();
    void deleteReview(String id);
}