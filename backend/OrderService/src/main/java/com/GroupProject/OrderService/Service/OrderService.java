package com.GroupProject.OrderService.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import jakarta.mail.internet.MimeMessage;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.GroupProject.OrderService.Dto.OrderRequest;
import com.GroupProject.OrderService.Entity.Item;
import com.GroupProject.OrderService.Entity.OrderEntity;
import com.GroupProject.OrderService.Repository.ItemRepository;
import com.GroupProject.OrderService.Repository.OrderRepository;
import org.springframework.core.io.ByteArrayResource;

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

    @Autowired
    private PDFService pdfService;

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
            int rentalDays = (int) java.time.temporal.ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate());
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
        order.setTransactionId(request.getTransactionId()); // Set transaction ID from request
        logger.info("Setting transaction ID in placeConfirmedOrder: '{}', Request transaction ID: '{}'", 
            order.getTransactionId(), request.getTransactionId());

        OrderEntity savedOrder = orderRepository.save(order);
        String orderId = savedOrder.getId() != null ? savedOrder.getId() : savedOrder.getOrderId();
        logger.info("Order placed successfully with ID: {}, Saved transaction ID: '{}'", orderId, savedOrder.getTransactionId());
        
        // Send email with PDF receipt
        sendOrderConfirmationEmailWithReceipt(savedOrder, foundItems);
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
        order.setTransactionId(request.getTransactionId()); // Set transaction ID
        logger.info("Setting transaction ID in placeRentalOrder: '{}', Request transaction ID: '{}'", 
            order.getTransactionId(), request.getTransactionId());
        
        OrderEntity savedOrder = orderRepository.save(order);
        String orderId = savedOrder.getId() != null ? savedOrder.getId() : savedOrder.getOrderId();
        logger.info("Rental order placed successfully with ID: {}, Saved transaction ID: '{}'", orderId, savedOrder.getTransactionId());
        
        // Get items for PDF generation
        List<Item> foundItems = itemRepository.findAllById(request.getItemIds());
        
        // Send rental confirmation emails
        sendRentalConfirmationEmail(savedOrder, request);
        
        // Send PDF receipt
        sendOrderConfirmationEmailWithReceipt(savedOrder, foundItems);
        
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
        
        // Set the transaction ID from Razorpay payment ID
        request.setTransactionId(razorpayPaymentId);
        logger.info("Setting transaction ID from Razorpay: {}", razorpayPaymentId);
        
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

    public ItemRepository getItemRepository() {
        return itemRepository;
    }

    private double applyDiscount(double totalAmount, String couponCode) {
        if (couponCode != null && couponCode.equalsIgnoreCase("SAVE10")) {
            return totalAmount * 0.9;
        }
        return totalAmount;
    }

    public String getUserEmailFromAuthService(String userId) {
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
                logger.warn("Skipping order confirmation email - no valid email address for user: {}", order.getUserId());
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

    private void sendOrderConfirmationEmailWithReceipt(OrderEntity order, List<Item> items) {
        try {
            logger.info("sendOrderConfirmationEmailWithReceipt - Order ID: {}, Transaction ID: '{}'", 
                order.getOrderId(), order.getTransactionId());
            
            String recipientEmail = getUserEmailFromAuthService(order.getUserId());
            String customerName = getUserNameFromAuthService(order.getUserId());
            
            // Only send email if we have a valid email address
            if (recipientEmail == null || !recipientEmail.contains("@")) {
                logger.warn("Skipping order confirmation email with receipt - no valid email address for user: {}", order.getUserId());
                return;
            }
            
            // Generate PDF receipt
            logger.info("Calling PDF generation with order transaction ID: '{}'", order.getTransactionId());
            byte[] pdfBytes = pdfService.generateReceiptPDF(order, items, customerName, recipientEmail);
            
            // Create enhanced email body with transaction details
            String emailBody = createOrderConfirmationEmailBody(order, customerName);
            
            // Send email with PDF attachment
            sendEmailWithAttachment(recipientEmail, "Order Confirmed: " + order.getOrderId(), 
                emailBody, 
                pdfBytes, "receipt_" + order.getOrderId() + ".pdf");
            
            logger.info("Order confirmation email with receipt sent successfully to: {}", recipientEmail);
        } catch (Exception e) {
            logger.error("Failed to send order confirmation email with receipt: {}", e.getMessage(), e);
            // Don't throw exception to prevent order failure due to email issues
        }
    }

    private String createOrderConfirmationEmailBody(OrderEntity order, String customerName) {
        StringBuilder emailBody = new StringBuilder();
        
        emailBody.append("Dear ").append(customerName != null ? customerName : "Valued Customer").append(",\n\n");
        emailBody.append("Thank you for your order! Your order has been successfully confirmed and is being processed.\n\n");
        
        emailBody.append("📋 ORDER DETAILS:\n");
        emailBody.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
        emailBody.append("Order ID: ").append(order.getOrderId()).append("\n");
        emailBody.append("Order Date: ").append(order.getOrderDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"))).append("\n");
        emailBody.append("Total Amount: ₹").append(String.format("%.2f", order.getTotalAmount())).append("\n");
        emailBody.append("Payment Method: ").append(order.getPaymentMode()).append("\n");
        emailBody.append("Payment Status: ").append(order.getPaymentStatus()).append("\n");
        
        // Add transaction ID if available - Make it prominent
        if (order.getTransactionId() != null && !order.getTransactionId().isEmpty()) {
            emailBody.append("Transaction ID: ").append(order.getTransactionId()).append(" (Razorpay)").append("\n");
        }
        
        if (order.getCouponCode() != null && !order.getCouponCode().isEmpty()) {
            emailBody.append("Coupon Applied: ").append(order.getCouponCode()).append("\n");
        }
        
        emailBody.append("Delivery Address: ").append(order.getAddress()).append("\n\n");
        
        // Add dedicated transaction ID section if available
        if (order.getTransactionId() != null && !order.getTransactionId().isEmpty()) {
            emailBody.append("💳 PAYMENT REFERENCE:\n");
            emailBody.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
            emailBody.append("Razorpay Transaction ID: ").append(order.getTransactionId()).append("\n");
            
            // Try to fetch additional transaction details
            try {
                Map<String, Object> transactionDetails = razorpayService.getTransactionDetails(order.getTransactionId());
                if (transactionDetails != null) {
                    if (transactionDetails.containsKey("method")) {
                        emailBody.append("Payment Method: ").append(String.valueOf(transactionDetails.get("method")).toUpperCase()).append("\n");
                    }
                    if (transactionDetails.containsKey("status")) {
                        emailBody.append("Transaction Status: ").append(String.valueOf(transactionDetails.get("status")).toUpperCase()).append("\n");
                    }
                    if (transactionDetails.containsKey("created_at")) {
                        Object createdAt = transactionDetails.get("created_at");
                        String transactionTimeStr;
                        
                        try {
                            if (createdAt instanceof Long) {
                                // Handle Unix timestamp
                                long timestamp = (Long) createdAt;
                                java.time.LocalDateTime transactionTime = java.time.LocalDateTime.ofEpochSecond(timestamp, 0, java.time.ZoneOffset.UTC);
                                transactionTimeStr = transactionTime.format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss"));
                            } else if (createdAt instanceof String) {
                                // Handle date string - try to parse as timestamp first, then as date string
                                String createdAtStr = (String) createdAt;
                                try {
                                    long timestamp = Long.parseLong(createdAtStr);
                                    java.time.LocalDateTime transactionTime = java.time.LocalDateTime.ofEpochSecond(timestamp, 0, java.time.ZoneOffset.UTC);
                                    transactionTimeStr = transactionTime.format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss"));
                                } catch (NumberFormatException e) {
                                    // If it's not a timestamp, use the string as is
                                    transactionTimeStr = createdAtStr;
                                }
                            } else {
                                transactionTimeStr = String.valueOf(createdAt);
                            }
                            
                            emailBody.append("Transaction Time: ").append(transactionTimeStr).append("\n");
                        } catch (Exception e) {
                            logger.warn("Could not format transaction time: {}", e.getMessage());
                            // Skip adding transaction time if there's an error
                        }
                    }
                }
            } catch (Exception e) {
                logger.warn("Could not fetch additional transaction details: {}", e.getMessage());
            }
            
            emailBody.append("(Keep this for payment verification and support)\n\n");
        }
        
        emailBody.append("📎 ATTACHMENT:\n");
        emailBody.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
        emailBody.append("A detailed receipt has been attached to this email for your records.\n\n");
        
        // Get seller's phone number and add Contact Provider section
        String sellerPhoneNumber = getSellerPhoneNumber(order.getItemIds());
        emailBody.append("📞 CONTACT PROVIDER:\n");
        emailBody.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
        if (sellerPhoneNumber != null && !sellerPhoneNumber.isEmpty()) {
            emailBody.append("Provider Phone: ").append(sellerPhoneNumber).append("\n");
        } else {
            emailBody.append("Provider Phone: Contact through RentCart support\n");
        }
        emailBody.append("For any queries, please contact us at support@rentcart.com\n\n");
        
        emailBody.append("Thank you for choosing RentCart!\n");
        emailBody.append("Best regards,\n");
        emailBody.append("The RentCart Team");
        
        return emailBody.toString();
    }

    private String getSellerPhoneNumber(List<String> itemIds) {
        try {
            if (itemIds == null || itemIds.isEmpty()) {
                logger.warn("ItemIds is null or empty");
                return null;
            }
            
            logger.info("Getting seller phone number for itemIds: {}", itemIds);
            
            // Get the first item to find the seller
            Item firstItem = itemRepository.findById(itemIds.get(0)).orElse(null);
            if (firstItem == null) {
                logger.warn("Could not find item to get seller phone number for itemId: {}", itemIds.get(0));
                return null;
            }
            
            String sellerUserId = firstItem.getUserId();
            logger.info("Found seller userId: {}", sellerUserId);
            
            if (sellerUserId == null || sellerUserId.isEmpty()) {
                logger.warn("Item has no seller userId");
                return null;
            }
            
            // Fetch seller's phone number from AuthService
            RestTemplate restTemplate = new RestTemplate();
            String url = "http://localhost:8081/auth/user?email=" + sellerUserId;
            logger.info("Calling AuthService URL: {}", url);
            
            Map response = restTemplate.getForObject(url, Map.class);
            logger.info("AuthService response: {}", response);
            
            if (response != null && response.containsKey("phoneNumber")) {
                String phoneNumber = (String) response.get("phoneNumber");
                logger.info("Retrieved seller phone number: {}", phoneNumber);
                return phoneNumber;
            } else {
                logger.warn("Could not retrieve seller phone number from AuthService. Response: {}", response);
                return null;
            }
        } catch (Exception e) {
            logger.error("Error fetching seller phone number: {}", e.getMessage(), e);
            return null;
        }
    }

    private void sendEmailWithAttachment(String to, String subject, String body, byte[] attachment, String filename) {
        try {
            // Validate email address
            if (to == null || !to.contains("@")) {
                logger.warn("Invalid email address: {}", to);
                return;
            }
            
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            
            helper.setFrom("vedantsalvi2353@gmail.com");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body);
            
            // Attach the PDF
            helper.addAttachment(filename, new ByteArrayResource(attachment));
            
            mailSender.send(message);
            logger.info("Email with PDF attachment sent successfully to: {}", to);
        } catch (Exception e) {
            logger.error("Failed to send email with attachment: {}", e.getMessage(), e);
            // Don't throw exception to prevent order failure due to email issues
        }
    }

    public String getUserNameFromAuthService(String userId) {
        try {
            // If userId looks like an email, extract name from it
            if (userId != null && userId.contains("@")) {
                String email = userId;
                String name = email.substring(0, email.indexOf("@"));
                return name.substring(0, 1).toUpperCase() + name.substring(1);
            }
            
            // Try to fetch from AuthService
            RestTemplate restTemplate = new RestTemplate();
            String url = "http://localhost:8081/auth/user?email=" + userId;
            Map response = restTemplate.getForObject(url, Map.class);
            if (response != null && response.containsKey("firstName")) {
                String firstName = (String) response.get("firstName");
                String lastName = (String) response.get("lastName");
                if (lastName != null && !lastName.isEmpty()) {
                    return firstName + " " + lastName;
                }
                return firstName;
            }
        } catch (Exception e) {
            logger.error("Failed to fetch user name from AuthService: {}", e.getMessage());
        }
        
        // Return default name
        return "Customer";
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
                renterSb.append("Rental Period: ").append(request.getStartDate()).append(" to ").append(request.getEndDate()).append("\n");
                renterSb.append("Daily Rate: Rs ").append(request.getDailyRate()).append("\n");
                renterSb.append("Security Deposit: Rs ").append(request.getSecurityDeposit()).append("\n");
                renterSb.append("Total Amount: Rs ").append(order.getTotalAmount()).append("\n");
                if (order.getTransactionId() != null && !order.getTransactionId().isEmpty()) {
                    renterSb.append("Transaction ID: ").append(order.getTransactionId()).append("\n");
                }
                if (request.getNotes() != null && !request.getNotes().isEmpty()) {
                    renterSb.append("Notes: ").append(request.getNotes()).append("\n");
                }
                
                // Add Contact Provider section
                String sellerPhoneNumber = getSellerPhoneNumber(order.getItemIds());
                renterSb.append("\n📞 CONTACT PROVIDER:\n");
                renterSb.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
                if (sellerPhoneNumber != null && !sellerPhoneNumber.isEmpty()) {
                    renterSb.append("Provider Phone: ").append(sellerPhoneNumber).append("\n");
                } else {
                    renterSb.append("Provider Phone: Contact through RentCart support\n");
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
                ownerSb.append("Rental Period: ").append(request.getStartDate()).append(" to ").append(request.getEndDate()).append("\n");
                ownerSb.append("Daily Rate: Rs ").append(request.getDailyRate()).append("\n");
                ownerSb.append("Security Deposit: Rs ").append(request.getSecurityDeposit()).append("\n");
                ownerSb.append("Total Amount: Rs ").append(order.getTotalAmount()).append("\n");
                if (order.getTransactionId() != null && !order.getTransactionId().isEmpty()) {
                    ownerSb.append("Transaction ID: ").append(order.getTransactionId()).append("\n");
                }
                if (request.getNotes() != null && !request.getNotes().isEmpty()) {
                    ownerSb.append("Renter Notes: ").append(request.getNotes()).append("\n");
                }
                
                // Add Contact Renter section
                ownerSb.append("\n📞 CONTACT RENTER:\n");
                ownerSb.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
                ownerSb.append("Renter Email: ").append(request.getRenterEmail()).append("\n");
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
