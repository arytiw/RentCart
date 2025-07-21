package com.GroupProject.Review.Controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.GroupProject.Review.Entity.Review;
import com.GroupProject.Review.Exception.ResourceNotFound;
import com.GroupProject.Review.Service.ReviewService;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, allowCredentials = "true")
public class ReviewController {

    private static final Logger logger = LoggerFactory.getLogger(ReviewController.class);

    @Autowired
    private ReviewService reviewService;

    @GetMapping("/greet")
    public String home() {
        logger.info("Greet endpoint hit");
        return "Jai Shree Ram Please run hoja.";
    }

    @PostMapping
    public Review addReview(@RequestBody Review review) {
        logger.info("Attempting to add review: {}", review);
        if (review == null) {
            logger.error("Review data is null");
            throw new ResourceNotFound("Review data cannot be null.");
        }
        Review savedReview = reviewService.addReview(review);
        logger.info("Review saved successfully with ID: {}", savedReview.getId());
        return savedReview;
    }

    @GetMapping("/{id}")
    public Review getReviewById(@PathVariable String id) {
        logger.info("Fetching review by ID: {}", id);
        Review review = reviewService.getReviewById(id);
        if (review == null) {
            logger.warn("Review not found for ID: {}", id);
            throw new ResourceNotFound("Review with ID " + id + " not found.");
        }
        return review;
    }

    @GetMapping("/item/{itemId}")
    public List<Review> getReviewsByItemId(@PathVariable String itemId) {
        logger.info("Fetching reviews by Item ID: {}", itemId);
        List<Review> reviews = reviewService.getReviewsByItemId(itemId);
        if (reviews == null || reviews.isEmpty()) {
            logger.warn("No reviews found for item ID: {}", itemId);
            throw new ResourceNotFound("No reviews found for item ID " + itemId);
        }
        return reviews;
    }

    @GetMapping("/user/{userId}")
    public List<Review> getReviewsByUserId(@PathVariable String userId) {
        logger.info("Fetching reviews by User ID: {}", userId);
        List<Review> reviews = reviewService.getReviewsByUserId(userId);
        if (reviews == null || reviews.isEmpty()) {
            logger.warn("No reviews found for user ID: {}", userId);
            throw new ResourceNotFound("No reviews found for user ID " + userId);
        }
        return reviews;
    }

@GetMapping("/item/{itemId}/average-rating")
public double getAverageRatingByItemId(@PathVariable String itemId) {
    logger.info("Calculating average rating for item ID: {}", itemId);
    
    List<Review> reviews = reviewService.getReviewsByItemId(itemId);
    
    if (reviews == null || reviews.isEmpty()) {
        logger.warn("No reviews found for item ID: {}", itemId);
        throw new ResourceNotFound("No reviews found for item ID " + itemId);
    }

    double totalRating = 0.0;
    for (Review review : reviews) {
        totalRating += review.getRating(); // Assuming Review has a getRating() method
    }

    double averageRating = totalRating / reviews.size();
    logger.info("Total reviews: {}, Total rating: {}, Average rating: {}", reviews.size(), totalRating, averageRating);

    return averageRating;
}

    @GetMapping
    public List<Review> getAllReviews() {
        logger.info("Fetching all reviews");
        List<Review> reviews = reviewService.getAllReviews();
        if (reviews == null || reviews.isEmpty()) {
            logger.warn("No reviews found");
            throw new ResourceNotFound("No reviews found.");
        }
        return reviews;
    }

    @DeleteMapping("/{id}")
    public String deleteReview(@PathVariable String id) {
        logger.info("Deleting review with ID: {}", id);
        Review review = reviewService.getReviewById(id);
            if (review == null) {
            logger.warn("Cannot delete. Review not found for ID: {}", id);
            throw new ResourceNotFound("Cannot delete. Review with ID " + id + " not found.");
        }
        reviewService.deleteReview(id);
        logger.info("Review with ID {} deleted successfully", id);
        return "Review deleted successfully.";
    }
}
