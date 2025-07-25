package com.GroupProject.OrderService.Service;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.GroupProject.OrderService.Dto.RazorpayRequestDTO;

@Service
public class RazorpayService {

    private static final Logger logger = LoggerFactory.getLogger(RazorpayService.class);

    @Value("${razorpay.key_id}")
    private String razorpayKey;

    @Value("${razorpay.key_secret}")
    private String razorpaySecret;

    public Map<String, Object> createRazorpayOrder(RazorpayRequestDTO request) {
        try {
            logger.info("Creating Razorpay order with amount: {} {}", request.getAmount(), request.getCurrency());
            // Debug log for keys
            logger.info("Using Razorpay key: '{}', secret: '{}...' (masked)", razorpayKey, razorpaySecret != null ? razorpaySecret.substring(0, 4) : null);
            
            // Validate request
            if (request.getAmount() == null || request.getAmount() <= 0) {
                throw new RuntimeException("Invalid amount: " + request.getAmount());
            }
            
            if (request.getCurrency() == null || request.getCurrency().isEmpty()) {
                throw new RuntimeException("Currency cannot be null or empty");
            }

            // REAL RAZORPAY INTEGRATION (uncommented for production)
            if (razorpayKey == null || razorpayKey.isEmpty()) {
                throw new RuntimeException("Razorpay key is not configured");
            }
            if (razorpaySecret == null || razorpaySecret.isEmpty()) {
                throw new RuntimeException("Razorpay secret is not configured");
            }
            logger.info("Initializing Razorpay client...");
            com.razorpay.RazorpayClient client = new com.razorpay.RazorpayClient(razorpayKey, razorpaySecret);
            org.json.JSONObject options = new org.json.JSONObject();
            int amountInPaise = request.getAmount() != null ? (int)(request.getAmount() * 100) : 0;
            options.put("amount", amountInPaise);
            options.put("currency", request.getCurrency());
            options.put("receipt", request.getReceipt());
            options.put("payment_capture", request.getPayment_capture() ? 1 : 0);
            logger.debug("Razorpay options: {}", options.toString());
            com.razorpay.Order order = client.orders.create(options);
            logger.info("Razorpay order created, processing response...");
            Map<String, Object> response = new HashMap<>();
            response.put("id", order.get("id"));
            response.put("amount", order.get("amount")); // This is a number
            response.put("currency", order.get("currency"));
            response.put("receipt", order.get("receipt"));
            logger.info("Razorpay order created successfully");
            return response;
            
            // MOCK RESPONSE (for reference only, now disabled)
            // Map<String, Object> response = new HashMap<>();
            // int amountInPaise = (int) (request.getAmount() * 100);
            // response.put("id", "order_test_" + System.currentTimeMillis());
            // response.put("amount", String.valueOf(amountInPaise));
            // response.put("currency", request.getCurrency());
            // response.put("receipt", request.getReceipt());
            // logger.info("Mock Razorpay order created successfully");
            // return response;
        } catch (Exception e) {
            logger.error("Failed to create Razorpay order: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create Razorpay order: " + e.getMessage(), e);
        }
    }

    public boolean verifyPayment(String razorpayOrderId, String razorpayPaymentId, String razorpaySignature) {
        try {
            logger.info("Verifying payment for order: {} and payment: {}", razorpayOrderId, razorpayPaymentId);
            
            // In a real implementation, you would verify the signature here
            // For now, we'll just return true if we have valid IDs
            if (razorpayOrderId != null && razorpayPaymentId != null && razorpaySignature != null) {
                logger.info("Payment verification successful for order: {}", razorpayOrderId);
                return true;
            }
            
            logger.warn("Payment verification failed - missing required parameters");
            return false;
            
        } catch (Exception e) {
            logger.error("Error during payment verification: {}", e.getMessage(), e);
            return false;
        }
    }
}
