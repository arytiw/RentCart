package com.GroupProject.Review.Service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.GroupProject.Review.Entity.Review;

public interface ReviewService {

    Logger logger = LoggerFactory.getLogger(ReviewService.class);

    Review addReview(Review review);

    Review getReviewById(String id);

    List<Review> getReviewsByItemId(String itemId);

    List<Review> getReviewsByUserId(String userId);

    List<Review> getAllReviews();

    void deleteReview(String id);
}
