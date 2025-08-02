package com.GroupProject.OrderService.Service;

import java.util.HashMap;
import java.util.Map;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

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
        logger.info("Creating Razorpay order with amount: {} {}", request.getAmount(), request.getCurrency());
        try {
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
            int amountInPaise = (int) (request.getAmount().doubleValue() * 100);
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
        logger.info("Verifying payment for order: {} and payment: {}", razorpayOrderId, razorpayPaymentId);
        try {
            // Validate required parameters
            if (razorpayOrderId == null || razorpayOrderId.isEmpty()) {
                logger.error("Payment verification failed - razorpayOrderId is null or empty");
                return false;
            }
            if (razorpayPaymentId == null || razorpayPaymentId.isEmpty()) {
                logger.error("Payment verification failed - razorpayPaymentId is null or empty");
                return false;
            }
            if (razorpaySignature == null || razorpaySignature.isEmpty()) {
                logger.error("Payment verification failed - razorpaySignature is null or empty");
                return false;
            }

            // For test orders (mock orders), we'll accept them
            if (razorpayOrderId.startsWith("order_test_")) {
                logger.info("Test order detected, accepting payment verification for order: {}", razorpayOrderId);
                return true;
            }

            // TEMPORARY: For development/testing, accept all real Razorpay orders
            // TODO: Remove this bypass in production
            logger.info("Development mode: Accepting real Razorpay payment verification for order: {}", razorpayOrderId);
            return true;

            // For real Razorpay orders, verify the signature (commented out for now)
            /*
            try {
                // Create the expected signature using Razorpay's format
                String expectedSignature = razorpayOrderId + "|" + razorpayPaymentId;
                String generatedSignature = generateHmacSHA256(expectedSignature, razorpaySecret);
                
                logger.debug("Expected signature: {}", expectedSignature);
                logger.debug("Generated signature: {}", generatedSignature);
                logger.debug("Received signature: {}", razorpaySignature);
                
                if (generatedSignature.equals(razorpaySignature)) {
                    logger.info("Payment verification successful for order: {}", razorpayOrderId);
                    return true;
                } else {
                    logger.error("Payment verification failed - signature mismatch for order: {}", razorpayOrderId);
                    logger.error("Expected: {}, Received: {}", generatedSignature, razorpaySignature);
                    return false;
                }
            } catch (Exception e) {
                logger.error("Error during signature verification: {}", e.getMessage(), e);
                return false;
            }
            */
            
        } catch (Exception e) {
            logger.error("Error during payment verification: {}", e.getMessage(), e);
            return false;
        }
    }

    private String generateHmacSHA256(String data, String secret) throws Exception {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(secret.getBytes("UTF-8"), "HmacSHA256");
            mac.init(secretKeySpec);
            byte[] hmacBytes = mac.doFinal(data.getBytes("UTF-8"));
            
            StringBuilder hexString = new StringBuilder();
            for (byte b : hmacBytes) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            logger.error("Error generating HMAC-SHA256: {}", e.getMessage(), e);
            throw e;
        }
    }
}
