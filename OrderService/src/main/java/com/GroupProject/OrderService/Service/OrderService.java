package com.GroupProject.OrderService.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.GroupProject.OrderService.Dto.OrderRequest;
import com.GroupProject.OrderService.Entity.Item;
import com.GroupProject.OrderService.Entity.OrderEntity;
import com.GroupProject.OrderService.Repository.ItemRepository;
import com.GroupProject.OrderService.Repository.OrderRepository;

@Service
public class OrderService {

    private static final Logger logger = LoggerFactory.getLogger(OrderService.class);

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private RazorpayService razorpayService;

    public double calculateTotalAmount(List<String> itemIds, String couponCode) {
        try {
            logger.info("Calculating total amount for itemIds: {}", itemIds);
            
            if (itemIds == null || itemIds.isEmpty()) {
                throw new RuntimeException("Item IDs list cannot be null or empty");
            }
            
            List<Item> foundItems = itemRepository.findAllById(itemIds);
            logger.info("Found {} items out of {} requested", foundItems.size(), itemIds.size());
            
            if (foundItems.size() != itemIds.size()) {
                logger.error("Some items not found. Requested: {}, Found: {}", itemIds.size(), foundItems.size());
                throw new RuntimeException("One or more item IDs are invalid.");
            }
            
            double totalAmount = foundItems.stream().mapToDouble(Item::getPrice).sum();
            logger.info("Total amount before discount: {}", totalAmount);
            
            double finalAmount = applyDiscount(totalAmount, couponCode);
            logger.info("Final amount after discount: {}", finalAmount);
            
            return finalAmount;
            
        } catch (Exception e) {
            logger.error("Error calculating total amount: {}", e.getMessage(), e);
            throw new RuntimeException("Error calculating total amount: " + e.getMessage(), e);
        }
    }

    public OrderEntity placeConfirmedOrder(OrderRequest request, String userId) {
        logger.info("Placing confirmed order for user: {}", userId);
        
        List<Item> foundItems = itemRepository.findAllById(request.getItemIds());
        if (foundItems.size() != request.getItemIds().size()) {
            throw new RuntimeException("One or more item IDs are invalid.");
        }

        double totalAmount = calculateTotalAmount(request.getItemIds(), request.getCouponCode());

        OrderEntity order = new OrderEntity();
        order.setOrderId(UUID.randomUUID().toString());
        order.setUserId(userId);
        order.setAddress(request.getAddress());
        order.setItemIds(request.getItemIds());
        order.setTotalAmount(totalAmount);
        order.setOrderDate(LocalDateTime.now());
        order.setEstimatedDeliveryDate(LocalDateTime.now().plusDays(5));
        order.setStatus("PLACED");
        order.setPaymentMode(request.getPaymentMode());
        order.setPaymentStatus("PAID");
        order.setCouponCode(request.getCouponCode());

        OrderEntity savedOrder = orderRepository.save(order);
        String orderId = savedOrder.getId() != null ? savedOrder.getId() : savedOrder.getOrderId();
        logger.info("Order placed successfully with ID: {}", orderId);
        return savedOrder;
    }

    public OrderEntity placeOrderWithPaymentVerification(OrderRequest request, String userId, 
                                                        String razorpayOrderId, String razorpayPaymentId, String razorpaySignature) {
        logger.info("Placing order with payment verification for user: {}", userId);
        
        // Verify payment first
        boolean paymentVerified = razorpayService.verifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature);
        
        if (!paymentVerified) {
            logger.error("Payment verification failed for order: {}", razorpayOrderId);
            throw new RuntimeException("Payment verification failed");
        }
        
        // If payment is verified, place the order
        return placeConfirmedOrder(request, userId);
    }

    public OrderEntity getOrder(String orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public List<OrderEntity> getAllOrders() {
        return orderRepository.findAll();
    }

    public OrderEntity getOrderById(String id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + id));
    }

    public OrderEntity updateOrder(String id, OrderRequest request) {
        OrderEntity existingOrder = getOrderById(id);
        existingOrder.setAddress(request.getAddress());
        existingOrder.setItemIds(request.getItemIds());
        existingOrder.setPaymentMode(request.getPaymentMode());
        existingOrder.setCouponCode(request.getCouponCode());
        return orderRepository.save(existingOrder);
    }

    public void deleteOrder(String id) {
        orderRepository.deleteById(id);
    }

    public List<OrderEntity> getOrdersByUserId(String userId) {
        return orderRepository.findByUserId(userId);
    }

    public OrderEntity cancelOrder(String orderId) {
        OrderEntity order = getOrder(orderId);
        order.setStatus("CANCELLED");
        String actualOrderId = order.getId() != null ? order.getId() : order.getOrderId();
        logger.info("Order with ID {} cancelled", actualOrderId);
        return orderRepository.save(order);
    }

    private double applyDiscount(double totalAmount, String couponCode) {
        if (couponCode != null && couponCode.equalsIgnoreCase("SAVE10")) {
            return totalAmount * 0.9;
        }
        return totalAmount;
    }
}
