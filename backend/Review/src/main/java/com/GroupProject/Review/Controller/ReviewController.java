package com.GroupProject.Review.Controller;

import java.util.List;

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
@CrossOrigin(origins = "*")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping("/greet")
    public String home() {
        return "Hello World";
    }

    @PostMapping
    public Review addReview(@RequestBody Review review) {
        if (review == null) {
            throw new ResourceNotFound("Review data cannot be null.");
        }
        return reviewService.addReview(review);
    }

    @GetMapping("/{id}")
    public Review getReviewById(@PathVariable String id) {
        Review review = reviewService.getReviewById(id);
        if (review == null) {
            throw new ResourceNotFound("Review with ID " + id + " not found.");
        }
        return review;
    }

    @GetMapping("/item/{itemId}")
    public List<Review> getReviewsByItemId(@PathVariable String itemId) {
        List<Review> reviews = reviewService.getReviewsByItemId(itemId);
        if (reviews == null || reviews.isEmpty()) {
            throw new ResourceNotFound("No reviews found for item ID " + itemId);
        }
        return reviews;
    }

    @GetMapping("/user/{userId}")
    public List<Review> getReviewsByUserId(@PathVariable String userId) {
        List<Review> reviews = reviewService.getReviewsByUserId(userId);
        if (reviews == null || reviews.isEmpty()) {
            throw new ResourceNotFound("No reviews found for user ID " + userId);
        }
        return reviews;
    }

    @GetMapping
    public List<Review> getAllReviews() {
        List<Review> reviews = reviewService.getAllReviews();
        if (reviews == null || reviews.isEmpty()) {
            throw new ResourceNotFound("No reviews found.");
        }
        return reviews;
    }

    @DeleteMapping("/{id}")
    public String deleteReview(@PathVariable String id) {
        Review review = reviewService.getReviewById(id);
        if (review == null) {
            throw new ResourceNotFound("Cannot delete. Review with ID " + id + " not found.");
        }
        reviewService.deleteReview(id);
        return "Review deleted successfully.";
    }
}
