package com.GroupProject.OrderService.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

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

    @Autowired
    private JavaMailSender mailSender;

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

            double totalAmount = 0.0;
            for (Item item : foundItems) {
                if ("sell".equalsIgnoreCase(item.getType())) {
                    // For sell, use the listed price directly
                    totalAmount += item.getPrice();
                } else {
                    // For rent, you can add your calculation logic here (e.g., price * days *
                    // quantity)
                    totalAmount += item.getPrice(); // Default logic, update as needed
                }
            }
            logger.info("Total amount before discount: {}", totalAmount);

            double finalAmount = applyDiscount(totalAmount, couponCode);
            logger.info("Final amount after discount: {}", finalAmount);

            return finalAmount;

        } catch (Exception e) {
            logger.error("Error calculating total amount: {}", e.getMessage(), e);
            throw new RuntimeException("Error calculating total amount: " + e.getMessage(), e);
        }
    }

    public double calculateRentalAmount(OrderRequest request) {
        try {
            logger.info("Calculating rental amount for rental request");

            if (request.getStartDate() == null || request.getEndDate() == null) {
                throw new RuntimeException("Start date and end date are required for rental calculation");
            }

            if (request.getDailyRate() <= 0) {
                throw new RuntimeException("Daily rate must be greater than 0");
            }

            // Calculate rental days from dates
            int rentalDays = (int) java.time.temporal.ChronoUnit.DAYS.between(request.getStartDate(),
                    request.getEndDate());
            if (rentalDays <= 0) {
                throw new RuntimeException("Rental period must be at least 1 day");
            }

            double dailyRate = request.getDailyRate();
            double securityDeposit = request.getSecurityDeposit();

            double rentalAmount = rentalDays * dailyRate;
            double totalAmount = rentalAmount + securityDeposit;

            logger.info("Rental calculation: {} days × {} = {} + {} deposit = {}",
                    rentalDays, dailyRate, rentalAmount, securityDeposit, totalAmount);

            return totalAmount;

        } catch (Exception e) {
            logger.error("Error calculating rental amount: {}", e.getMessage(), e);
            throw new RuntimeException("Error calculating rental amount: " + e.getMessage(), e);
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
        sendOrderConfirmationEmail(savedOrder, foundItems);
        return savedOrder;
    }

    public OrderEntity placeRentalOrder(OrderRequest request, String userId) {
        logger.info("Placing rental order for user: {}", userId);

        // Calculate rental amount
        double totalAmount = calculateRentalAmount(request);

        OrderEntity order = new OrderEntity();
        order.setOrderId(UUID.randomUUID().toString());
        order.setUserId(userId);
        order.setAddress(request.getAddress());
        order.setItemIds(request.getItemIds());
        order.setTotalAmount(totalAmount);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("PLACED");
        order.setPaymentMode("ONLINE");
        order.setPaymentStatus("PAID");

        // Store rental-specific information in order metadata
        order.setCouponCode("RENTAL"); // Mark as rental order

        OrderEntity savedOrder = orderRepository.save(order);
        String orderId = savedOrder.getId() != null ? savedOrder.getId() : savedOrder.getOrderId();
        logger.info("Rental order placed successfully with ID: {}", orderId);

        // Send rental confirmation emails
        sendRentalConfirmationEmail(savedOrder, request);
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
        logger.info("Fetching order with ID: {}", orderId);
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public List<OrderEntity> getAllOrders() {
        logger.info("Fetching all orders");
        return orderRepository.findAll();
    }

    public OrderEntity getOrderById(String id) {
        logger.info("Fetching order by ID: {}", id);
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + id));
    }

    public OrderEntity updateOrder(String id, OrderRequest request) {
        logger.info("Updating order with ID: {}", id);
        OrderEntity existingOrder = getOrderById(id);
        existingOrder.setAddress(request.getAddress());
        existingOrder.setItemIds(request.getItemIds());
        existingOrder.setPaymentMode(request.getPaymentMode());
        existingOrder.setCouponCode(request.getCouponCode());
        return orderRepository.save(existingOrder);
    }

    public void deleteOrder(String id) {
        logger.info("Deleting order with ID: {}", id);
        orderRepository.deleteById(id);
    }

    public List<OrderEntity> getOrdersByUserId(String userId) {
        logger.info("Fetching orders for user ID: {}", userId);
        return orderRepository.findByUserId(userId);
    }

    public OrderEntity cancelOrder(String orderId) {
        logger.info("Cancelling order with ID: {}", orderId);
        OrderEntity order = getOrder(orderId);
        order.setStatus("CANCELLED");
        String actualOrderId = order.getId() != null ? order.getId() : order.getOrderId();
        logger.info("Order with ID {} cancelled", actualOrderId);
        return orderRepository.save(order);
    }

    public OrderEntity save(OrderEntity order) {
        logger.info("Saving order with ID: {}", order.getId());
        return orderRepository.save(order);
    }

    private double applyDiscount(double totalAmount, String couponCode) {
        if (couponCode != null && couponCode.equalsIgnoreCase("SAVE10")) {
            return totalAmount * 0.9;
        }
        return totalAmount;
    }

    private String getUserEmailFromAuthService(String userId) {
        try {
            // If userId looks like an email, use it directly
            if (userId != null && userId.contains("@")) {
                return userId;
            }

            // Try to fetch from AuthService
            RestTemplate restTemplate = new RestTemplate();
            String url = "http://localhost:8081/auth/user?email=" + userId;
            Map response = restTemplate.getForObject(url, Map.class);
            if (response != null && response.containsKey("emailId")) {
                return (String) response.get("emailId");
            }
        } catch (Exception e) {
            logger.error("Failed to fetch user email from AuthService: {}", e.getMessage());
        }

        // If userId is already an email, return it
        if (userId != null && userId.contains("@")) {
            return userId;
        }

        // Return null instead of invalid userId to prevent email sending errors
        logger.warn("Could not determine valid email for userId: {}", userId);
        return null;
    }

    private void sendOrderConfirmationEmail(OrderEntity order, List<Item> items) {
        try {
            String recipientEmail = getUserEmailFromAuthService(order.getUserId());

            // Only send email if we have a valid email address
            if (recipientEmail == null || !recipientEmail.contains("@")) {
                logger.warn("Skipping order confirmation email - no valid email address for user: {}",
                        order.getUserId());
                return;
            }

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("vedantsalvi2353@gmail.com");
            message.setTo(recipientEmail);
            message.setSubject("Order Confirmed: " + order.getOrderId());
            StringBuilder sb = new StringBuilder();
            sb.append("Your order has been confirmed!\n\n");
            sb.append("Order ID: ").append(order.getOrderId()).append("\n");
            sb.append("Address: ").append(order.getAddress()).append("\n");
            sb.append("Total Amount: Rs ").append(order.getTotalAmount()).append("\n");
            sb.append("Items:\n");
            for (Item item : items) {
                sb.append("- ").append(item.getTitle()).append(" (Qty: 1)").append("\n");
            }
            message.setText(sb.toString());
            mailSender.send(message);
            logger.info("Order confirmation email sent successfully to: {}", recipientEmail);
        } catch (Exception e) {
            logger.error("Failed to send order confirmation email: {}", e.getMessage());
        }
    }

    private void sendRentalConfirmationEmail(OrderEntity order, OrderRequest request) {
        try {
            // Validate email addresses before sending
            if (request.getRenterEmail() == null || !request.getRenterEmail().contains("@")) {
                logger.warn("Skipping renter email - invalid email address: {}", request.getRenterEmail());
            } else {
                // Send email to renter
                SimpleMailMessage renterMessage = new SimpleMailMessage();
                renterMessage.setFrom("vedantsalvi2353@gmail.com");
                renterMessage.setTo(request.getRenterEmail());
                renterMessage.setSubject("Rental Confirmed: " + request.getItemTitle());
                StringBuilder renterSb = new StringBuilder();
                renterSb.append("Your rental has been confirmed!\n\n");
                renterSb.append("Order ID: ").append(order.getOrderId()).append("\n");
                renterSb.append("Item: ").append(request.getItemTitle()).append("\n");
                renterSb.append("Rental Period: ").append(request.getStartDate()).append(" to ")
                        .append(request.getEndDate()).append("\n");
                renterSb.append("Daily Rate: Rs ").append(request.getDailyRate()).append("\n");
                renterSb.append("Security Deposit: Rs ").append(request.getSecurityDeposit()).append("\n");
                renterSb.append("Total Amount: Rs ").append(order.getTotalAmount()).append("\n");
                if (request.getNotes() != null && !request.getNotes().isEmpty()) {
                    renterSb.append("Notes: ").append(request.getNotes()).append("\n");
                }
                renterMessage.setText(renterSb.toString());
                mailSender.send(renterMessage);
                logger.info("Rental confirmation email sent to renter: {}", request.getRenterEmail());
            }

            if (request.getOwnerEmail() == null || !request.getOwnerEmail().contains("@")) {
                logger.warn("Skipping owner email - invalid email address: {}", request.getOwnerEmail());
            } else {
                // Send email to owner
                SimpleMailMessage ownerMessage = new SimpleMailMessage();
                ownerMessage.setFrom("vedantsalvi2353@gmail.com");
                ownerMessage.setTo(request.getOwnerEmail());
                ownerMessage.setSubject("Item Rented: " + request.getItemTitle());
                StringBuilder ownerSb = new StringBuilder();
                ownerSb.append("Your item has been rented!\n\n");
                ownerSb.append("Item: ").append(request.getItemTitle()).append("\n");
                ownerSb.append("Rented by: ").append(request.getRenterEmail()).append("\n");
                ownerSb.append("Rental Period: ").append(request.getStartDate()).append(" to ")
                        .append(request.getEndDate()).append("\n");
                ownerSb.append("Daily Rate: Rs ").append(request.getDailyRate()).append("\n");
                ownerSb.append("Security Deposit: Rs ").append(request.getSecurityDeposit()).append("\n");
                ownerSb.append("Total Amount: Rs ").append(order.getTotalAmount()).append("\n");
                if (request.getNotes() != null && !request.getNotes().isEmpty()) {
                    ownerSb.append("Renter Notes: ").append(request.getNotes()).append("\n");
                }
                ownerMessage.setText(ownerSb.toString());
                mailSender.send(ownerMessage);
                logger.info("Rental confirmation email sent to owner: {}", request.getOwnerEmail());
            }

            logger.info("Rental confirmation emails processed successfully");
        } catch (Exception e) {
            logger.error("Failed to send rental confirmation emails: {}", e.getMessage());
        }
    }
}
