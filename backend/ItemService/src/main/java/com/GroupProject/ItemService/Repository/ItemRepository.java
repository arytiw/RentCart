package com.GroupProject.ItemService.Repository;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.GroupProject.ItemService.Entity.Item;
import com.GroupProject.ItemService.Entity.ItemType;

@Repository
public interface ItemRepository extends MongoRepository<Item, String> {

    Logger logger = LoggerFactory.getLogger(ItemRepository.class);

    default void logQuery(String methodName, Object... params) {
        logger.info("Executing repository method: {} with parameters: {}", methodName, params);
    }

    List<Item> findByType(ItemType type);
    
    // Updated to handle multiple categories - find items that contain any of the specified categories
    @Query("{'category': {$in: ?0}}")
    List<Item> findByCategoryIn(List<String> categories);
    
    // Keep the old method for backward compatibility but mark as deprecated
    @Deprecated
    List<Item> findByCategoryIgnoreCase(String category);
    
    List<Item> findByUserId(String userId);
    List<Item> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String title, String description);
    List<Item> findByPriceBetween(double minPrice, double maxPrice);
    List<Item> findByPriceBetweenAndLocationIgnoreCase(double minPrice, double maxPrice, String location);
    List<Item> findByAvailableTrue();
    
    // Updated filter methods to handle multiple categories
    @Query("{'price': {$gte: ?0, $lte: ?1}, 'category': {$in: ?2}}")
    List<Item> findByPriceBetweenAndCategoryIn(double minPrice, double maxPrice, List<String> categories);
    
    List<Item> findByPriceBetweenAndType(double minPrice, double maxPrice, ItemType type);
    
    @Query("{'price': {$gte: ?0, $lte: ?1}, 'location': {$regex: ?2, $options: 'i'}, 'category': {$in: ?3}}")
    List<Item> findByPriceBetweenAndLocationIgnoreCaseAndCategoryIn(double minPrice, double maxPrice, String location, List<String> categories);
    
    List<Item> findByPriceBetweenAndLocationIgnoreCaseAndType(double minPrice, double maxPrice, String location, ItemType type);
    
    @Query("{'price': {$gte: ?0, $lte: ?1}, 'category': {$in: ?2}, 'type': ?3}")
    List<Item> findByPriceBetweenAndCategoryInAndType(double minPrice, double maxPrice, List<String> categories, ItemType type);
    
    @Query("{'price': {$gte: ?0, $lte: ?1}, 'location': {$regex: ?2, $options: 'i'}, 'category': {$in: ?3}, 'type': ?4}")
    List<Item> findByPriceBetweenAndLocationIgnoreCaseAndCategoryInAndType(double minPrice, double maxPrice, String location, List<String> categories, ItemType type);
    
    // Keep deprecated methods for backward compatibility
    @Deprecated
    List<Item> findByPriceBetweenAndCategoryIgnoreCase(double minPrice, double maxPrice, String category);
    @Deprecated
    List<Item> findByPriceBetweenAndLocationIgnoreCaseAndCategoryIgnoreCase(double minPrice, double maxPrice, String location, String category);
    @Deprecated
    List<Item> findByPriceBetweenAndCategoryIgnoreCaseAndType(double minPrice, double maxPrice, String category, ItemType type);
    @Deprecated
    List<Item> findByPriceBetweenAndLocationIgnoreCaseAndCategoryIgnoreCaseAndType(double minPrice, double maxPrice, String location, String category, ItemType type);
}
