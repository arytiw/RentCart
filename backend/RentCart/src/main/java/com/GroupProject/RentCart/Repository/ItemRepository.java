package com.GroupProject.RentCart.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.GroupProject.RentCart.Entity.Item;

public interface ItemRepository extends MongoRepository<Item, String> {
}
