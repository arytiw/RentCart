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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.GroupProject.OrderService.Entity.Item;
import com.GroupProject.OrderService.Repository.ItemRepository;

@RestController
@RequestMapping("/items")
public class ItemController {

    private final ItemRepository itemRepository;

    public ItemController(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    // Get all items
    @GetMapping
    public ResponseEntity<List<Item>> getAllItems() {
        List<Item> items = itemRepository.findAll();
        return ResponseEntity.ok(items);
    }

    // Get item by ID
    @GetMapping("/{id}")
    public ResponseEntity<Item> getItemById(@PathVariable String id) {
        return itemRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Add item (Admin only - optionally)
    @PostMapping
    public ResponseEntity<Item> addItem(@RequestBody Item item) {
        Item savedItem = itemRepository.save(item);
        return ResponseEntity.ok(savedItem);
    }

    // Update item (Admin only - optionally)
    @PutMapping("/{id}")
    public ResponseEntity<Item> updateItem(@PathVariable String id, @RequestBody Item updatedItem) {
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

    // Delete item (Admin only - optionally)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable String id) {
        if (itemRepository.existsById(id)) {
            itemRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
