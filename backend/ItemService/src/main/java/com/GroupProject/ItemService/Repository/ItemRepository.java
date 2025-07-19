package com.GroupProject.ItemService.Repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.GroupProject.ItemService.Entity.Item;
import com.GroupProject.ItemService.Entity.ItemType;


@Repository
public interface ItemRepository extends MongoRepository<Item, String> {
    List<Item> findByType(ItemType type);
    List<Item> findByCategoryIgnoreCase(String category);
    List<Item> findByUserId(String userId);
    List<Item> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String title, String description);
    List<Item> findByPriceBetween(double minPrice, double maxPrice);
    List<Item> findByPriceBetweenAndLocationIgnoreCase(double minPrice, double maxPrice, String location);

}
