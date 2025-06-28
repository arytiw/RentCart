package com.GroupProject.RentCart.Repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.GroupProject.RentCart.Entity.OrderEntity;


public interface OrderRepository extends MongoRepository<OrderEntity, String> {
    List<OrderEntity> findByUserId(String userId);
}
