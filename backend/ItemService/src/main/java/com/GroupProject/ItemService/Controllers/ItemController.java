package com.GroupProject.ItemService.Controllers;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.GroupProject.ItemService.Entity.Item;
import com.GroupProject.ItemService.Entity.ItemType;
import com.GroupProject.ItemService.Repository.ItemRepository;



@RestController
@RequestMapping("/items")
public class ItemController {

    private static final Logger logger = LoggerFactory.getLogger(ItemController.class);

    @Autowired
    private ItemRepository itemRepo;

    @PostMapping
    public Item addItem(@RequestBody Item item, @RequestHeader("X-USER-ID") String userId) {
        item.setUserId(userId);
        logger.info("Adding item: {} by user: {}", item.getTitle(), userId);
        return itemRepo.save(item);
    }

    @GetMapping
    public List<Item> getAllItems() {
        logger.info("Fetching all items");
        return itemRepo.findAll();
    }

    @GetMapping("/type/{type}")
    public List<Item> getItemsByType(@PathVariable ItemType type) {
        logger.info("Fetching items by type: {}", type);
        return itemRepo.findByType(type);
    }

    @GetMapping("/category/{category}")
    public List<Item> getItemsByCategory(@PathVariable String category) {
        logger.info("Fetching items by category: {}", category);
        return itemRepo.findByCategoryIgnoreCase(category);
    }

    @GetMapping("/user/{userId}")
    public List<Item> getItemsByUser(@PathVariable String userId) {
        logger.info("Fetching items posted by user: {}", userId);
        return itemRepo.findByUserId(userId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable String id) {
        logger.info("Attempting to delete item with id: {}", id);
        if (itemRepo.existsById(id)) {
            itemRepo.deleteById(id);
            logger.info("Item with id {} deleted successfully", id);
            return ResponseEntity.noContent().build();
        } else {
            logger.warn("Item with id {} not found for deletion", id);
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Item> getItemById(@PathVariable String id) {
        logger.info("Fetching item by id: {}", id);
        return itemRepo.findById(id)
                .map(item -> {
                    logger.info("Item found: {}", item.getTitle());
                    return ResponseEntity.ok(item);
                })
                .orElseGet(() -> {
                    logger.warn("Item with id {} not found", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @GetMapping("/search")
    public List<Item> searchItems(@RequestParam String query) {
        logger.info("Searching items with query: {}", query);
        return itemRepo.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(query, query);
    }

    @GetMapping("/filter")
    public List<Item> filterItems(
            @RequestParam double minPrice,
            @RequestParam double maxPrice,
            @RequestParam(required = false) String location
    ) {
        logger.info("Filtering items from price {} to {} in location: {}", minPrice, maxPrice, location);
        if (location != null && !location.isEmpty()) {
            return itemRepo.findByPriceBetweenAndLocationIgnoreCase(minPrice, maxPrice, location);
        } else {
            return itemRepo.findByPriceBetween(minPrice, maxPrice);
        }
    }
}