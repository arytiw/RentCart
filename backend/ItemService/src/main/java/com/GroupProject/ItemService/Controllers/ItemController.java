package com.GroupProject.ItemService.Controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.GroupProject.ItemService.Entity.Item;
import com.GroupProject.ItemService.Repository.ItemRepository;

@RestController
@RequestMapping("/items")
public class ItemController {

    @Autowired
    private ItemRepository itemRepo;

    @PostMapping
    public Item addItem(@RequestBody Item item) {
        return itemRepo.save(item);
    }

    @GetMapping
    public List<Item> getAllItems() {
        return itemRepo.findAll();
    }
}
