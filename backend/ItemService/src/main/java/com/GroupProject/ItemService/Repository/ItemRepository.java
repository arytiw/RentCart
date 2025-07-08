package com.GroupProject.ItemService.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.GroupProject.ItemService.Entity.Item;


@Repository
public interface ItemRepository extends MongoRepository<Item, String> {
   
}
