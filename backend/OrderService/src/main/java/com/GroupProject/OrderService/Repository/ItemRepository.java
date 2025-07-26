// package com.GroupProject.OrderService.Repository;

// import org.springframework.data.mongodb.repository.MongoRepository;

// import com.GroupProject.OrderService.Entity.Item;

// public interface ItemRepository extends MongoRepository<Item, String> {
// }


package com.GroupProject.OrderService.Repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.GroupProject.OrderService.Entity.Item;

@Repository
public interface ItemRepository extends MongoRepository<Item, String> {

    // Optional: find items uploaded by a specific user (e.g., seller)
    List<Item> findByUserId(String userId);

    // Optional: find items by category
    List<Item> findByCategory(String category);

    // Optional: search by price range
    List<Item> findByPriceBetween(double minPrice, double maxPrice);

    // Optional: search by title containing keyword (case-insensitive)
    List<Item> findByTitleContainingIgnoreCase(String keyword);
}
