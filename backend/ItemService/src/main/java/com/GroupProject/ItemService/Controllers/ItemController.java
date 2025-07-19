package com.GroupProject.ItemService.Controllers;

import java.util.List;

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

    @Autowired
    private ItemRepository itemRepo;

    @PostMapping
    public Item addItem(@RequestBody Item item, @RequestHeader("X-USER-ID") String userId) {
        item.setUserId(userId); // Injecting from frontend header
        return itemRepo.save(item);
    }

    @GetMapping
    public List<Item> getAllItems() {
        return itemRepo.findAll();
    }

    @GetMapping("/type/{type}")
    public List<Item> getItemsByType(@PathVariable ItemType type) {
        return itemRepo.findByType(type);
    }

    @GetMapping("/category/{category}")
    public List<Item> getItemsByCategory(@PathVariable String category) {
        return itemRepo.findByCategoryIgnoreCase(category);
    }

    @GetMapping("/user/{userId}")
    public List<Item> getItemsByUser(@PathVariable String userId) {
        return itemRepo.findByUserId(userId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable String id) {
        if (itemRepo.existsById(id)) {
            itemRepo.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Item> getItemById(@PathVariable String id) {
        return itemRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    public List<Item> searchItems(@RequestParam String query) {
        return itemRepo.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(query, query);
    }

    @GetMapping("/filter")
    public List<Item> filterItems(
            @RequestParam double minPrice,
            @RequestParam double maxPrice,
            @RequestParam(required = false) String location
    ) {
        if (location != null && !location.isEmpty()) {
            return itemRepo.findByPriceBetweenAndLocationIgnoreCase(minPrice, maxPrice, location);
        } else {
            return itemRepo.findByPriceBetween(minPrice, maxPrice);
        }
    }



}
