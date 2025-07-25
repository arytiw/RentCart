package com.GroupProject.ItemService.Repository;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.mongodb.repository.MongoRepository;
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
    List<Item> findByCategoryIgnoreCase(String category);
    List<Item> findByUserId(String userId);
    List<Item> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String title, String description);
    List<Item> findByPriceBetween(double minPrice, double maxPrice);
    List<Item> findByPriceBetweenAndLocationIgnoreCase(double minPrice, double maxPrice, String location);
    List<Item> findByAvailableTrue();
    List<Item> findByPriceBetweenAndCategoryIgnoreCase(double minPrice, double maxPrice, String category);
    List<Item> findByPriceBetweenAndType(double minPrice, double maxPrice, ItemType type);
    List<Item> findByPriceBetweenAndLocationIgnoreCaseAndCategoryIgnoreCase(double minPrice, double maxPrice, String location, String category);
    List<Item> findByPriceBetweenAndLocationIgnoreCaseAndType(double minPrice, double maxPrice, String location, ItemType type);
    List<Item> findByPriceBetweenAndCategoryIgnoreCaseAndType(double minPrice, double maxPrice, String category, ItemType type);
    List<Item> findByPriceBetweenAndLocationIgnoreCaseAndCategoryIgnoreCaseAndType(double minPrice, double maxPrice, String location, String category, ItemType type);
}
