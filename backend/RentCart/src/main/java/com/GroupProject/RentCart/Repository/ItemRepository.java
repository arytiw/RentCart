package com.GroupProject.RentCart.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.GroupProject.RentCart.Entity.Item;


@Repository
public interface ItemRepository extends MongoRepository<Item, String> {
    // Add custom queries if needed
}
