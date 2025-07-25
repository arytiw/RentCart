package com.GroupProject.Review.Service;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.GroupProject.Review.Entity.Review;
import com.GroupProject.Review.Repository.ReviewRepository;

@Service
public class ReviewServiceImpl implements ReviewService {

    private static final Logger logger = LoggerFactory.getLogger(ReviewServiceImpl.class);

    @Autowired
    private ReviewRepository reviewRepository;

    @Override
    public Review addReview(Review review) {
        logger.info("Adding review: {}", review);
        Review savedReview = reviewRepository.save(review);
        logger.info("Review added with ID: {}", savedReview.getId());
        return savedReview;
    }

    @Override
    public Review getReviewById(String id) {
        logger.info("Fetching review by ID: {}", id);
        Optional<Review> review = reviewRepository.findById(id);
        if (review.isPresent()) {
            logger.info("Review found: {}", review.get());
        } else {
            logger.warn("Review not found with ID: {}", id);
        }
        return review.orElse(null);
    }

    @Override
    public List<Review> getReviewsByItemId(String itemId) {
        logger.info("Fetching reviews by Item ID: {}", itemId);
        return reviewRepository.findByItemId(itemId);
    }

    @Override
    public List<Review> getReviewsByUserId(String userId) {
        logger.info("Fetching reviews by User ID: {}", userId);
        return reviewRepository.findByUserId(userId);
    }

    @Override
    public List<Review> getAllReviews() {
        logger.info("Fetching all reviews");
        return reviewRepository.findAll();
    }

    @Override
    public void deleteReview(String id) {
        logger.info("Deleting review with ID: {}", id);
        reviewRepository.deleteById(id);
        logger.info("Review deleted with ID: {}", id);
    }
}
