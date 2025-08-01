package com.GroupProject.OrderService.Service;

import com.GroupProject.OrderService.Entity.Item;
import com.GroupProject.OrderService.Entity.OrderEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class PDFService {

    private static final Logger logger = LoggerFactory.getLogger(PDFService.class);

    public byte[] generateReceiptPDF(OrderEntity order, List<Item> items, String customerName, String customerEmail) {
        try {
            // For now, generate a simple text-based receipt
            // In production, you would use a proper PDF library like iText or Apache PDFBox
            StringBuilder receipt = new StringBuilder();
            
            // Header
            receipt.append("=".repeat(50)).append("\n");
            receipt.append("           RENTCART RECEIPT\n");
            receipt.append("=".repeat(50)).append("\n\n");
            
            // Customer Information
            receipt.append("CUSTOMER INFORMATION:\n");
            receipt.append("-".repeat(30)).append("\n");
            receipt.append("Customer Name: ").append(customerName != null ? customerName : "N/A").append("\n");
            receipt.append("Email: ").append(customerEmail != null ? customerEmail : "N/A").append("\n");
            receipt.append("Order Date: ").append(order.getOrderDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"))).append("\n");
            receipt.append("Order ID: ").append(order.getOrderId()).append("\n");
            receipt.append("Delivery Address: ").append(order.getAddress()).append("\n\n");
            
            // Order Details
            receipt.append("ORDER DETAILS:\n");
            receipt.append("-".repeat(30)).append("\n");
            receipt.append(String.format("%-30s %-10s %-10s %-10s\n", "Item", "Type", "Quantity", "Price"));
            receipt.append("-".repeat(60)).append("\n");
            
            for (Item item : items) {
                receipt.append(String.format("%-30s %-10s %-10s ₹%-10.2f\n", 
                    item.getTitle(), 
                    item.getCategory() != null ? item.getCategory() : "RENT",
                    "1",
                    item.getPrice()));
            }
            receipt.append("\n");
            
            // Payment Information
            receipt.append("PAYMENT INFORMATION:\n");
            receipt.append("-".repeat(30)).append("\n");
            receipt.append("Payment Method: ").append(order.getPaymentMode()).append("\n");
            receipt.append("Payment Status: ").append(order.getPaymentStatus()).append("\n");
            if (order.getTransactionId() != null) {
                receipt.append("Transaction ID: ").append(order.getTransactionId()).append("\n");
            }
            if (order.getCouponCode() != null && !order.getCouponCode().isEmpty()) {
                receipt.append("Coupon Applied: ").append(order.getCouponCode()).append("\n");
            }
            receipt.append("Total Amount: ₹").append(order.getTotalAmount()).append("\n\n");
            
            // Footer
            receipt.append("=".repeat(50)).append("\n");
            receipt.append("Thank you for choosing RentCart!\n");
            receipt.append("For any queries, please contact us at support@rentcart.com\n");
            receipt.append("=".repeat(50)).append("\n");
            
            return receipt.toString().getBytes(StandardCharsets.UTF_8);
            
        } catch (Exception e) {
            logger.error("Error generating receipt: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to generate receipt", e);
        }
    }
} 