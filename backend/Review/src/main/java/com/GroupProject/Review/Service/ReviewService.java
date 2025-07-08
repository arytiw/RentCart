package com.GroupProject.Review.Service;
import com.GroupProject.Review.Entity.Review;

import java.util.List;

public interface ReviewService {
    Review addReview(Review review);
    Review getReviewById(String id);
    List<Review> getReviewsByItemId(String itemId);
    List<Review> getReviewsByUserId(String userId);
    
    List<Review> getAllReviews();
    void deleteReview(String id);
}