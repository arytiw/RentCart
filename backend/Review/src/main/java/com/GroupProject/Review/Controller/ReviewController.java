package com.GroupProject.Review.Controller;


import com.GroupProject.Review.Entity.Review;
import com.GroupProject.Review.Service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {
	@GetMapping("/greet")
    public String home() {
        return "Hello World";
    }
    @Autowired
    private ReviewService reviewService;

    @PostMapping
    public Review addReview(@RequestBody Review review) {
        return reviewService.addReview(review);
    }

    @GetMapping("/{id}")
    public Review getReviewById(@PathVariable String id) {
        return reviewService.getReviewById(id); // May return null (Spring converts to 404 if configured)
    }

    @GetMapping("/item/{itemId}")
    public List<Review> getReviewsByItemId(@PathVariable String itemId) {
        return reviewService.getReviewsByItemId(itemId);
    }

    @GetMapping("/user/{userId}")
    public List<Review> getReviewsByUserId(@PathVariable String userId) {
        return reviewService.getReviewsByUserId(userId);
    }

    @GetMapping
    public List<Review> getAllReviews() {
        return reviewService.getAllReviews();
    }

    @DeleteMapping("/{id}")
    public String deleteReview(@PathVariable String id) {
        reviewService.deleteReview(id);
        return "Review deleted successfully.";
    }
}

