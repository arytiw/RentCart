// package com.GroupProject.OrderService.Repository;

// import java.util.List;

// import org.springframework.data.mongodb.repository.MongoRepository;

// import com.GroupProject.OrderService.Entity.OrderEntity;


// public interface OrderRepository extends MongoRepository<OrderEntity, String> {
//     List<OrderEntity> findByUserId(String userId);
// }


package com.GroupProject.OrderService.Repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.GroupProject.OrderService.Entity.OrderEntity;

public interface OrderRepository extends MongoRepository<OrderEntity, String> {

    // Existing method
    List<OrderEntity> findByUserId(String userId);

    // Optional: for pagination
    Page<OrderEntity> findByUserId(String userId, Pageable pageable);

    // Optional: fetch by user and status (e.g., all 'DELIVERED' orders of user)
    List<OrderEntity> findByUserIdAndStatus(String userId, String status);

    // Optional: fetch by status (for admin dashboard filtering)
    List<OrderEntity> findByStatus(String status);
}
