package com.GroupProject.Review.Repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.GroupProject.Review.Entity.Review;

@Repository
public interface ReviewRepository extends MongoRepository<Review, String> {

    List<Review> findByItemId(String itemId);
    
    List<Review> findByUserId(String userId);
    
    //List<Review> findByItemIdOrderByTimestampDesc(String itemId);
}

