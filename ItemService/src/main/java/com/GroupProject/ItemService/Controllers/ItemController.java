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
import org.springframework.web.bind.annotation.PutMapping;
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
    public ResponseEntity<Item> addItem(@RequestBody Item item, @RequestHeader("X-USER-ID") String userId) {
        try {
            item.setUserId(userId);
            logger.info("Adding item: {} by user: {}", item.getTitle(), userId);
            
            // Set default values if not provided
            if (item.getType() == null) {
                item.setType(ItemType.RENT); // Default to RENT
            }
            if (item.getAvailable() == null) {
                item.setAvailable(true);
            }
            if (item.getRating() == 0.0) {
                item.setRating(0.0);
            }
            if (item.getSecurityDeposit() == 0.0) {
                item.setSecurityDeposit(0.0);
            }
            
            Item savedItem = itemRepo.save(item);
            logger.info("Item saved successfully with ID: {}", savedItem.getId());
            return ResponseEntity.ok(savedItem);
        } catch (Exception e) {
            logger.error("Error adding item: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<Item>> getAllItems() {
        try {
            logger.info("Fetching all items");
            List<Item> items = itemRepo.findAll();
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            logger.error("Error fetching items: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<Item>> getItemsByType(@PathVariable ItemType type) {
        try {
            logger.info("Fetching items by type: {}", type);
            List<Item> items = itemRepo.findByType(type);
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            logger.error("Error fetching items by type: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Item>> getItemsByCategory(@PathVariable String category) {
        try {
            logger.info("Fetching items by category: {}", category);
            List<Item> items = itemRepo.findByCategoryIgnoreCase(category);
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            logger.error("Error fetching items by category: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Item>> getItemsByUser(@PathVariable String userId) {
        try {
            logger.info("Fetching items posted by user: {}", userId);
            List<Item> items = itemRepo.findByUserId(userId);
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            logger.error("Error fetching items by user: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/available")
    public ResponseEntity<List<Item>> getAvailableItems() {
        try {
            logger.info("Fetching available items");
            List<Item> items = itemRepo.findByAvailableTrue();
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            logger.error("Error fetching available items: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Item> updateItem(@PathVariable String id, @RequestBody Item item, @RequestHeader("X-USER-ID") String userId) {
        try {
            logger.info("Updating item: {} by user: {}", id, userId);
            
            var existingItemOpt = itemRepo.findById(id);
            if (existingItemOpt.isEmpty()) {
                logger.warn("Item with id {} not found for update", id);
                return ResponseEntity.notFound().build();
            }
            
            Item existingItem = existingItemOpt.get();
            
            // Check if user owns the item
            if (!existingItem.getUserId().equals(userId)) {
                logger.warn("User {} not authorized to update item {}", userId, id);
                return ResponseEntity.status(403).build();
            }
            
            // Update fields
            if (item.getTitle() != null) existingItem.setTitle(item.getTitle());
            if (item.getDescription() != null) existingItem.setDescription(item.getDescription());
            if (item.getPrice() > 0) existingItem.setPrice(item.getPrice());
            if (item.getCategory() != null) existingItem.setCategory(item.getCategory());
            if (item.getLocation() != null) existingItem.setLocation(item.getLocation());
            if (item.getImages() != null) existingItem.setImages(item.getImages());
            if (item.getFeatures() != null) existingItem.setFeatures(item.getFeatures());
            if (item.getUsagePolicy() != null) existingItem.setUsagePolicy(item.getUsagePolicy());
            if (item.getSecurityDeposit() >= 0) existingItem.setSecurityDeposit(item.getSecurityDeposit());
            if (item.getAvailable() != null) existingItem.setAvailable(item.getAvailable());
            
            Item updatedItem = itemRepo.save(existingItem);
            logger.info("Item updated successfully: {}", id);
            return ResponseEntity.ok(updatedItem);
            
        } catch (Exception e) {
            logger.error("Error updating item: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable String id, @RequestHeader("X-USER-ID") String userId) {
        try {
            logger.info("Attempting to delete item with id: {} by user: {}", id, userId);
            
            var itemOpt = itemRepo.findById(id);
            if (itemOpt.isEmpty()) {
                logger.warn("Item with id {} not found for deletion", id);
                return ResponseEntity.notFound().build();
            }
            
            Item item = itemOpt.get();
            
            // Check if user owns the item
            if (!item.getUserId().equals(userId)) {
                logger.warn("User {} not authorized to delete item {}", userId, id);
                return ResponseEntity.status(403).build();
            }
            
            itemRepo.deleteById(id);
            logger.info("Item with id {} deleted successfully", id);
            return ResponseEntity.noContent().build();
            
        } catch (Exception e) {
            logger.error("Error deleting item: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Item> getItemById(@PathVariable String id) {
        try {
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
        } catch (Exception e) {
            logger.error("Error fetching item by id: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Item>> searchItems(@RequestParam String query) {
        try {
            logger.info("Searching items with query: {}", query);
            List<Item> items = itemRepo.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(query, query);
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            logger.error("Error searching items: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/filter")
    public ResponseEntity<List<Item>> filterItems(
            @RequestParam double minPrice,
            @RequestParam double maxPrice,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) ItemType type
    ) {
        try {
            logger.info("Filtering items from price {} to {} in location: {} category: {} type: {}", 
                       minPrice, maxPrice, location, category, type);
            
            List<Item> items;
            if (location != null && !location.isEmpty() && category != null && !category.isEmpty() && type != null) {
                items = itemRepo.findByPriceBetweenAndLocationIgnoreCaseAndCategoryIgnoreCaseAndType(minPrice, maxPrice, location, category, type);
            } else if (location != null && !location.isEmpty() && category != null && !category.isEmpty()) {
                items = itemRepo.findByPriceBetweenAndLocationIgnoreCaseAndCategoryIgnoreCase(minPrice, maxPrice, location, category);
            } else if (location != null && !location.isEmpty() && type != null) {
                items = itemRepo.findByPriceBetweenAndLocationIgnoreCaseAndType(minPrice, maxPrice, location, type);
            } else if (category != null && !category.isEmpty() && type != null) {
                items = itemRepo.findByPriceBetweenAndCategoryIgnoreCaseAndType(minPrice, maxPrice, category, type);
            } else if (location != null && !location.isEmpty()) {
                items = itemRepo.findByPriceBetweenAndLocationIgnoreCase(minPrice, maxPrice, location);
            } else if (category != null && !category.isEmpty()) {
                items = itemRepo.findByPriceBetweenAndCategoryIgnoreCase(minPrice, maxPrice, category);
            } else if (type != null) {
                items = itemRepo.findByPriceBetweenAndType(minPrice, maxPrice, type);
            } else {
                items = itemRepo.findByPriceBetween(minPrice, maxPrice);
            }
            
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            logger.error("Error filtering items: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}