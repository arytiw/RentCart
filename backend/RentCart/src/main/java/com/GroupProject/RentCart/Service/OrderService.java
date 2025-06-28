package com.GroupProject.RentCart.Service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.GroupProject.RentCart.Entity.Item;
import com.GroupProject.RentCart.Entity.OrderEntity;
import com.GroupProject.RentCart.Exception.OrderNotFoundException;
import com.GroupProject.RentCart.Repository.ItemRepository;
import com.GroupProject.RentCart.Repository.OrderRepository;

@Service
public class OrderService {

    @Autowired
    private ItemRepository itemRepository;

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public OrderEntity createOrder(List<String> itemIds, String userId, String address) {
        // 1. Validate that all itemIds exist
        List<Item> foundItems = itemRepository.findAllById(itemIds);

        if (foundItems.size() != itemIds.size()) {
            throw new RuntimeException("One or more item IDs are invalid.");
        }

        // 2. Calculate totalAmount from item prices
        double totalAmount = foundItems.stream().mapToDouble(Item::getPrice).sum();

        // 3. Build and save order
        OrderEntity order = new OrderEntity();
        order.setUserId(userId);
        order.setItemIds(itemIds);
        order.setAddress(address);
        order.setTotalAmount(totalAmount);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("PLACED");

        return orderRepository.save(order);
    }

    public List<OrderEntity> getOrdersByUserId(String userId) {
        return orderRepository.findByUserId(userId);
    }

    public OrderEntity getOrderById(String id) {
        return orderRepository.findById(id)
            .orElseThrow(() -> new OrderNotFoundException("Order not found with ID: " + id));
    }
}
