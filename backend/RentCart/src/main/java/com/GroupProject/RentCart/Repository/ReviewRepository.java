package com.GroupProject.RentCart.Repository;

import com.GroupProject.RentCart.Entity.Review;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends MongoRepository<Review, String> {

    List<Review> findByItemId(String itemId);
    
    List<Review> findByUserId(String userId);
    
    // Optional: sort by timestamp descending
    List<Review> findByItemIdOrderByTimestampDesc(String itemId);
}
