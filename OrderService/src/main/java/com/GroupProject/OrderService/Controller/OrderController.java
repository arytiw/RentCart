package com.GroupProject.OrderService.Controller;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.GroupProject.OrderService.Dto.OrderRequest;
import com.GroupProject.OrderService.Dto.PaymentVerificationDTO;
import com.GroupProject.OrderService.Dto.RazorpayRequestDTO;
import com.GroupProject.OrderService.Entity.OrderEntity;
import com.GroupProject.OrderService.Service.OrderService;
import com.GroupProject.OrderService.Service.RazorpayService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);

    private final OrderService orderService;
    private final RazorpayService razorpayService;

    @Autowired
    private JavaMailSender mailSender;

    public OrderController(OrderService orderService, RazorpayService razorpayService) {
        this.orderService = orderService;
        this.razorpayService = razorpayService;
    }

    @GetMapping("/test")
    public ResponseEntity<Map<String, String>> testEndpoint() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "OrderService is running successfully!");
        response.put("status", "OK");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/test-razorpay")
    public ResponseEntity<?> testRazorpay() {
        try {
            logger.info("Testing Razorpay integration...");
            
            RazorpayRequestDTO testRequest = new RazorpayRequestDTO();
            testRequest.setAmount(100.0);
            testRequest.setCurrency("INR");
            testRequest.setReceipt("test_receipt_" + System.currentTimeMillis());
            testRequest.setPayment_capture(true);
            
            Map<String, Object> response = razorpayService.createRazorpayOrder(testRequest);
            
            Map<String, Object> result = new HashMap<>();
            result.put("message", "Razorpay test successful");
            result.put("razorpayResponse", response);
            
            return ResponseEntity.ok(result);
            
        } catch (Exception e) {
            logger.error("Razorpay test failed: {}", e.getMessage(), e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Razorpay test failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/test-email")
    public ResponseEntity<String> sendTestEmail(@RequestParam String to) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("vedantsalvi2353@gmail.com");
            message.setTo(to);
            message.setSubject("Test Email from RentCart OrderService");
            message.setText("This is a test email. If you received this, your mail setup works!");
            mailSender.send(message);
            return ResponseEntity.ok("Test email sent to " + to);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to send test email: " + e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> initiateOrder(@RequestBody OrderRequest request, Principal principal, HttpServletRequest httpRequest) {
        try {
            String userEmail = httpRequest.getHeader("X-USER-EMAIL");
            String userId = (userEmail != null && !userEmail.isEmpty()) ? userEmail : (principal != null ? principal.getName() : "KartikSaste");
            logger.info("Initiating order for user: {}", userId);

            // 1. Calculate final amount with coupon if any
            double totalAmount = orderService.calculateTotalAmount(request.getItemIds(), request.getCouponCode());
            logger.info("Calculated total amount: {}", totalAmount);

            // 2. Prepare Razorpay Order
            RazorpayRequestDTO razorpayRequest = new RazorpayRequestDTO();
            razorpayRequest.setAmount(totalAmount);
            razorpayRequest.setCurrency("INR");
            razorpayRequest.setReceipt("order_rcptid_" + System.currentTimeMillis());
            razorpayRequest.setPayment_capture(true);

            Map<String, Object> razorpayOrder = razorpayService.createRazorpayOrder(razorpayRequest);

            // 3. Return Razorpay details and original order request for frontend confirmation
            Map<String, Object> response = new HashMap<>();
            response.put("razorpay", razorpayOrder);
            response.put("orderRequest", request);
            response.put("amount", totalAmount);
            response.put("message", "Order initiated successfully. Please complete payment to confirm.");

            logger.info("Order initiated successfully for user: {}", userId);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error initiating order: {}", e.getMessage(), e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to initiate order: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/confirm")
    public ResponseEntity<?> confirmOrder(
        @RequestBody PaymentVerificationDTO paymentVerification,
        Principal principal
    ) {
        try {
            String userId = (principal != null) ? principal.getName() : "KartikSaste";
            logger.info("Confirming order with payment verification for user: {}", userId);

            // Extract order request from the payment verification
            // In a real implementation, you might want to store the order request temporarily
            // or pass it along with the payment verification
            
            // For now, we'll create a basic order request - in production, you should
            // retrieve the original order request that was stored during initiation
            OrderRequest orderRequest = new OrderRequest();
            // Set the order request details - this should come from the stored session or request
            
            OrderEntity order = orderService.placeOrderWithPaymentVerification(
                orderRequest, 
                userId,
                paymentVerification.getRazorpayOrderId(),
                paymentVerification.getRazorpayPaymentId(),
                paymentVerification.getRazorpaySignature()
            );

            Map<String, Object> response = new HashMap<>();
            response.put("order", order);
            response.put("message", "Order confirmed successfully!");
            
            String orderId = order.getId() != null ? order.getId() : order.getOrderId();
            logger.info("Order confirmed successfully for user: {} with order ID: {}", userId, orderId);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error confirming order: {}", e.getMessage(), e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to confirm order: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    // Alternative confirmation endpoint that accepts order request with payment details
    @PostMapping("/confirm-with-details")
    public ResponseEntity<?> confirmOrderWithDetails(
        @RequestBody Map<String, Object> request,
        Principal principal
    ) {
        try {
            String userId = (principal != null) ? principal.getName() : "KartikSaste";
            logger.info("Confirming order with details for user: {}", userId);

            // Extract order request and payment details
            @SuppressWarnings("unchecked")
            Map<String, Object> orderRequestMap = (Map<String, Object>) request.get("orderRequest");
            String razorpayOrderId = (String) request.get("razorpayOrderId");
            String razorpayPaymentId = (String) request.get("razorpayPaymentId");
            String razorpaySignature = (String) request.get("razorpaySignature");

            // Convert map to OrderRequest object
            OrderRequest orderRequest = new OrderRequest();
            orderRequest.setItemIds((List<String>) orderRequestMap.get("itemIds"));
            orderRequest.setAddress((String) orderRequestMap.get("address"));
            orderRequest.setCouponCode((String) orderRequestMap.get("couponCode"));
            orderRequest.setPaymentMode((String) orderRequestMap.get("paymentMode"));

            OrderEntity order = orderService.placeOrderWithPaymentVerification(
                orderRequest, 
                userId,
                razorpayOrderId,
                razorpayPaymentId,
                razorpaySignature
            );

            Map<String, Object> response = new HashMap<>();
            response.put("order", order);
            response.put("message", "Order confirmed successfully!");
            
            String orderId = order.getId() != null ? order.getId() : order.getOrderId();
            logger.info("Order confirmed successfully for user: {} with order ID: {}", userId, orderId);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error confirming order with details: {}", e.getMessage(), e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to confirm order: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @GetMapping
    public ResponseEntity<List<OrderEntity>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderEntity> getOrderById(@PathVariable String orderId) {
        return ResponseEntity.ok(orderService.getOrderById(orderId));
    }

    @GetMapping("/user")
    public ResponseEntity<List<OrderEntity>> getOrdersByUserId(Principal principal) {
        String userId = (principal != null) ? principal.getName() : "KartikSaste";
        return ResponseEntity.ok(orderService.getOrdersByUserId(userId));
    }

    @PatchMapping("/{orderId}/cancel")
    public ResponseEntity<OrderEntity> cancelOrder(@PathVariable String orderId) {
        return ResponseEntity.ok(orderService.cancelOrder(orderId));
    }

    @PatchMapping("/{orderId}/deliver")
    public ResponseEntity<OrderEntity> markOrderAsDelivered(@PathVariable String orderId) {
        OrderEntity order = orderService.getOrder(orderId);
        order.setStatus("DELIVERED");
        return ResponseEntity.ok(orderService.save(order));
    }

    @PutMapping("/{orderId}")
    public ResponseEntity<OrderEntity> updateOrder(@PathVariable String orderId, @RequestBody OrderRequest request) {
        return ResponseEntity.ok(orderService.updateOrder(orderId, request));
    }
}
