// package com.GroupProject.OrderService.Controller;

// import java.util.List;

// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import com.GroupProject.OrderService.Entity.Item;
// import com.GroupProject.OrderService.Repository.ItemRepository;

// @RestController
// @RequestMapping("/items")
// public class ItemController {

//     private final ItemRepository itemRepository;

//     public ItemController(ItemRepository itemRepository) {
//         this.itemRepository = itemRepository;
//     }

//     // Get all items
//     @GetMapping
//     public ResponseEntity<List<Item>> getAllItems() {
//         List<Item> items = itemRepository.findAll();
//         return ResponseEntity.ok(items);
//     }

//     // Get item by ID
//     @GetMapping("/{id}")
//     public ResponseEntity<Item> getItemById(@PathVariable String id) {
//         return itemRepository.findById(id)
//                 .map(ResponseEntity::ok)
//                 .orElse(ResponseEntity.notFound().build());
//     }

//     // Optionally: Add item (Admin only)
//     @PostMapping
//     public ResponseEntity<Item> addItem(@RequestBody Item item) {
//         Item savedItem = itemRepository.save(item);
//         return ResponseEntity.ok(savedItem);
//     }

//     // Optionally: Update item (Admin only)
//     @PutMapping("/{id}")
//     public ResponseEntity<Item> updateItem(@PathVariable String id, @RequestBody Item updatedItem) {
//         return itemRepository.findById(id).map(existingItem -> {
//             existingItem.setName(updatedItem.getName());
//             existingItem.setPrice(updatedItem.getPrice());
//             // add more fields as needed
//             return ResponseEntity.ok(itemRepository.save(existingItem));
//         }).orElse(ResponseEntity.notFound().build());
//     }

//     // Optionally: Delete item (Admin only)
//     @DeleteMapping("/{id}")
//     public ResponseEntity<Void> deleteItem(@PathVariable String id) {
//         if (itemRepository.existsById(id)) {
//             itemRepository.deleteById(id);
//             return ResponseEntity.noContent().build();
//         } else {
//             return ResponseEntity.notFound().build();
//         }
//     }
// }


package com.GroupProject.OrderService.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.GroupProject.OrderService.Entity.Item;
import com.GroupProject.OrderService.Repository.ItemRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/items")
public class ItemController {

    private static final Logger logger = LoggerFactory.getLogger(ItemController.class);
    private final ItemRepository itemRepository;

    public ItemController(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    // Get all items
    @GetMapping
    public ResponseEntity<List<Item>> getAllItems() {
        logger.info("Received request to fetch all items");
        List<Item> items = itemRepository.findAll();
        return ResponseEntity.ok(items);
    }

    // Get item by ID
    @GetMapping("/{id}")
    public ResponseEntity<Item> getItemById(@PathVariable String id) {
        logger.info("Received request to fetch item by ID: {}", id);
        return itemRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Add item (Admin only - optionally)
    @PostMapping
    public ResponseEntity<Item> addItem(@RequestBody Item item) {
        logger.info("Received request to add a new item");
        // Set default stockQuantity if not provided
        if (item.getStockQuantity() == 0) {
            item.setStockQuantity(1);
        }
        Item savedItem = itemRepository.save(item);
        return ResponseEntity.ok(savedItem);
    }

    // Update item (Admin only - optionally)
    @PutMapping("/{id}")
    public ResponseEntity<Item> updateItem(@PathVariable String id, @RequestBody Item updatedItem) {
        logger.info("Received request to update item with ID: {}", id);
        return itemRepository.findById(id).map(existingItem -> {
            existingItem.setTitle(updatedItem.getTitle());
            existingItem.setDescription(updatedItem.getDescription());
            existingItem.setPrice(updatedItem.getPrice());
            existingItem.setCategory(updatedItem.getCategory());
            existingItem.setImageUrl(updatedItem.getImageUrl());
            existingItem.setStockQuantity(updatedItem.getStockQuantity());
            existingItem.setUserId(updatedItem.getUserId());
            return ResponseEntity.ok(itemRepository.save(existingItem));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Update stock quantity (Admin only - optionally)
    @PatchMapping("/{id}/quantity")
    public ResponseEntity<Item> updateStockQuantity(@PathVariable String id, @RequestBody int stockQuantity) {
        logger.info("Received request to update stock quantity for item ID: {}", id);
        return itemRepository.findById(id).map(existingItem -> {
            existingItem.setStockQuantity(stockQuantity);
            return ResponseEntity.ok(itemRepository.save(existingItem));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Delete item (Admin only - optionally)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable String id) {
        logger.info("Received request to delete item with ID: {}", id);
        if (itemRepository.existsById(id)) {
            itemRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
