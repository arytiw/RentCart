package com.GroupProject.Review.Service;


import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.GroupProject.Review.Entity.Review;
import com.GroupProject.Review.Repository.ReviewRepository;

@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Override
    public Review addReview(Review review) {
        // Validate required fields
        if (review.getItemId() == null || review.getItemId().trim().isEmpty()) {
            throw new IllegalArgumentException("Item ID is required");
        }
        if (review.getUserId() == null || review.getUserId().trim().isEmpty()) {
            throw new IllegalArgumentException("User ID is required");
        }
        if (review.getRating() < 1 || review.getRating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }
        if (review.getComment() == null || review.getComment().trim().isEmpty()) {
            throw new IllegalArgumentException("Comment is required");
        }
        
        // Set timestamp if not provided
        if (review.getTimestamp() == 0) {
            review.setTimestamp(System.currentTimeMillis());
        }
        
        // Set default userName if not provided
        if (review.getUserName() == null || review.getUserName().trim().isEmpty()) {
            review.setUserName("Anonymous");
        }
        
        return reviewRepository.save(review);
    }

    @Override
    public Review getReviewById(String id) {
        Optional<Review> review = reviewRepository.findById(id);
        return review.orElse(null);
    }

    @Override
    public List<Review> getReviewsByItemId(String itemId) {
        return reviewRepository.findByItemId(itemId);
    }

    @Override
    public List<Review> getReviewsByUserId(String userId) {
        return reviewRepository.findByUserId(userId);
    }

    @Override
    public List<Review> getReviewsByItemIdAndUserId(String itemId, String userId) {
        return reviewRepository.findByItemIdAndUserId(itemId, userId);
    }

    @Override
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    @Override
    public void deleteReview(String id) {
        reviewRepository.deleteById(id);
    }
}
