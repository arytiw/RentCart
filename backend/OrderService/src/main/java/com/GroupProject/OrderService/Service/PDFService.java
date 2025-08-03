package com.GroupProject.OrderService.Service;

import com.GroupProject.OrderService.Entity.Item;
import com.GroupProject.OrderService.Entity.OrderEntity;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.Color;
import com.itextpdf.kernel.colors.DeviceRgb;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.client.RestTemplate;
import com.GroupProject.OrderService.Service.RazorpayService;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Service
public class PDFService {

    private static final Logger logger = LoggerFactory.getLogger(PDFService.class);
    
    // Define custom colors
    private static final Color PRIMARY_COLOR = new DeviceRgb(59, 130, 246); // Blue
    private static final Color SECONDARY_COLOR = new DeviceRgb(249, 250, 251); // Light Gray
    private static final Color SUCCESS_COLOR = new DeviceRgb(34, 197, 94); // Green

    @Autowired
    private com.GroupProject.OrderService.Repository.ItemRepository itemRepository;

    @Autowired
    private RazorpayService razorpayService;

    public byte[] generateReceiptPDF(OrderEntity order, List<Item> items, String customerName, String customerEmail) {
        try {
            // Validate inputs
            if (order == null) {
                throw new IllegalArgumentException("Order cannot be null");
            }
            if (items == null || items.isEmpty()) {
                throw new IllegalArgumentException("Items list cannot be null or empty");
            }
            
            // Debug logging for transaction ID
            logger.info("PDF Generation - Order ID: {}, Transaction ID: '{}', Transaction ID null: {}, Transaction ID empty: {}", 
                order.getOrderId(), 
                order.getTransactionId(), 
                order.getTransactionId() == null,
                order.getTransactionId() != null && order.getTransactionId().isEmpty());
            
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            // Create fonts
            PdfFont titleFont = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);
            PdfFont normalFont = PdfFontFactory.createFont(StandardFonts.HELVETICA);
            PdfFont boldFont = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);

            // Header with enhanced styling
            Paragraph header = new Paragraph("RENTCART")
                .setFont(titleFont)
                .setFontSize(28)
                .setFontColor(PRIMARY_COLOR);
            document.add(header);
            
            Paragraph tagline = new Paragraph("Your Trusted Rental Partner")
                .setFont(normalFont)
                .setFontSize(12)
                .setFontColor(ColorConstants.GRAY);
            document.add(tagline);
            
            Paragraph receiptTitle = new Paragraph("INVOICE RECEIPT")
                .setFont(titleFont)
                .setFontSize(18)
                .setFontColor(ColorConstants.BLACK);
            document.add(receiptTitle);

            // Order Status Banner
            Table statusTable = new Table(1);
            String statusText = "✓ ORDER CONFIRMED";
            if ("CANCELLED".equalsIgnoreCase(order.getStatus())) {
                statusText = "✗ ORDER CANCELLED";
            }
            
            Cell statusCell = new Cell()
                .add(new Paragraph(statusText).setFont(boldFont).setFontSize(14))
                .setBackgroundColor(SUCCESS_COLOR)
                .setFontColor(ColorConstants.WHITE);
            statusTable.addCell(statusCell);
            document.add(statusTable);

            // Customer Information Section
            Paragraph customerInfoTitle = new Paragraph("CUSTOMER INFORMATION")
                .setFont(boldFont)
                .setFontSize(14)
                .setFontColor(PRIMARY_COLOR);
            document.add(customerInfoTitle);

            Table customerTable = new Table(2);
            customerTable.addCell(createStyledCell("Customer Name:", boldFont, true));
            customerTable.addCell(createStyledCell(customerName != null ? customerName : "N/A", normalFont, false));
            customerTable.addCell(createStyledCell("Email:", boldFont, true));
            customerTable.addCell(createStyledCell(customerEmail != null ? customerEmail : "N/A", normalFont, false));
            customerTable.addCell(createStyledCell("Order Date:", boldFont, true));
            customerTable.addCell(createStyledCell(order.getOrderDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")), normalFont, false));
            customerTable.addCell(createStyledCell("Order ID:", boldFont, true));
            customerTable.addCell(createStyledCell(order.getOrderId(), normalFont, false));
            customerTable.addCell(createStyledCell("Delivery Address:", boldFont, true));
            customerTable.addCell(createStyledCell(order.getAddress(), normalFont, false));
            document.add(customerTable);

            // Order Details Section
            Paragraph orderDetailsTitle = new Paragraph("ORDER DETAILS")
                .setFont(boldFont)
                .setFontSize(14)
                .setFontColor(PRIMARY_COLOR);
            document.add(orderDetailsTitle);

            Table itemsTable = new Table(4);
            // Table headers with enhanced styling
            itemsTable.addCell(createHeaderCell("Item", boldFont));
            itemsTable.addCell(createHeaderCell("Type", boldFont));
            itemsTable.addCell(createHeaderCell("Quantity", boldFont));
            itemsTable.addCell(createHeaderCell("Price (₹)", boldFont));
            // Add items
            for (Item item : items) {
                itemsTable.addCell(createStyledCell(item.getTitle(), normalFont, false));
                itemsTable.addCell(createStyledCell(item.getCategory() != null ? item.getCategory() : "RENT", normalFont, false));
                itemsTable.addCell(createStyledCell("1", normalFont, false));
                itemsTable.addCell(createStyledCell(String.format("%.2f", item.getPrice()), normalFont, false));
            }
            document.add(itemsTable);

            // Payment Information Section
            Paragraph paymentInfoTitle = new Paragraph("PAYMENT INFORMATION")
                .setFont(boldFont)
                .setFontSize(14)
                .setFontColor(PRIMARY_COLOR);
            document.add(paymentInfoTitle);

            Table paymentTable = new Table(2);
            paymentTable.addCell(createStyledCell("Payment Method:", boldFont, true));
            paymentTable.addCell(createStyledCell(order.getPaymentMode(), normalFont, false));
            paymentTable.addCell(createStyledCell("Payment Status:", boldFont, true));
            paymentTable.addCell(createStyledCell(order.getPaymentStatus(), normalFont, false));
            
            // Transaction ID - Make it prominent with special styling
            logger.info("Processing transaction ID in payment section - Transaction ID: '{}'", order.getTransactionId());
            if (order.getTransactionId() != null && !order.getTransactionId().isEmpty()) {
                logger.info("Adding transaction ID to payment table: {}", order.getTransactionId());
                paymentTable.addCell(createStyledCell("Transaction ID:", boldFont, true));
                Cell transactionCell = new Cell().add(new Paragraph(order.getTransactionId()).setFont(boldFont).setFontSize(11));
                transactionCell.setBackgroundColor(new DeviceRgb(255, 255, 224)); // Light yellow background
                paymentTable.addCell(transactionCell);
            } else {
                logger.warn("Transaction ID is null or empty, skipping payment table section");
            }
            
            if (order.getCouponCode() != null && !order.getCouponCode().isEmpty()) {
                paymentTable.addCell(createStyledCell("Coupon Applied:", boldFont, true));
                paymentTable.addCell(createStyledCell(order.getCouponCode(), normalFont, false));
            }
            paymentTable.addCell(createStyledCell("Total Amount:", boldFont, true));
            paymentTable.addCell(createStyledCell("₹" + String.format("%.2f", order.getTotalAmount()), boldFont, false));
            document.add(paymentTable);

            // Transaction ID Section - Make it stand out with additional details
            logger.info("Processing transaction ID in dedicated section - Transaction ID: '{}'", order.getTransactionId());
            if (order.getTransactionId() != null && !order.getTransactionId().isEmpty()) {
                logger.info("Adding dedicated transaction ID section: {}", order.getTransactionId());
                Paragraph transactionTitle = new Paragraph("PAYMENT REFERENCE")
                    .setFont(boldFont)
                    .setFontSize(14)
                    .setFontColor(PRIMARY_COLOR);
                document.add(transactionTitle);

                // Try to fetch additional transaction details from Razorpay
                logger.info("Fetching transaction details from Razorpay for: {}", order.getTransactionId());
                Map<String, Object> transactionDetails = razorpayService.getTransactionDetails(order.getTransactionId());
                
                Table transactionTable = new Table(2);
                transactionTable.addCell(createStyledCell("Razorpay Transaction ID:", boldFont, true));
                Cell transactionCell = new Cell().add(new Paragraph(order.getTransactionId()).setFont(boldFont).setFontSize(12));
                transactionCell.setBackgroundColor(new DeviceRgb(255, 255, 224)); // Light yellow background
                transactionTable.addCell(transactionCell);
                
                // Add additional transaction details if available
                if (transactionDetails != null) {
                    if (transactionDetails.containsKey("method")) {
                        transactionTable.addCell(createStyledCell("Payment Method:", boldFont, true));
                        transactionTable.addCell(createStyledCell(String.valueOf(transactionDetails.get("method")).toUpperCase(), normalFont, false));
                    }
                    if (transactionDetails.containsKey("status")) {
                        transactionTable.addCell(createStyledCell("Transaction Status:", boldFont, true));
                        transactionTable.addCell(createStyledCell(String.valueOf(transactionDetails.get("status")).toUpperCase(), normalFont, false));
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
                            
                            transactionTable.addCell(createStyledCell("Transaction Time:", boldFont, true));
                            transactionTable.addCell(createStyledCell(transactionTimeStr, normalFont, false));
                        } catch (Exception e) {
                            logger.warn("Could not format transaction time: {}", e.getMessage());
                            // Skip adding transaction time if there's an error
                        }
                    }
                }
                
                document.add(transactionTable);
            }

            // Contact Provider Section
            Paragraph contactProviderTitle = new Paragraph("CONTACT PROVIDER")
                .setFont(boldFont)
                .setFontSize(14)
                .setFontColor(PRIMARY_COLOR);
            document.add(contactProviderTitle);

            String sellerPhoneNumber = getSellerPhoneNumber(order.getItemIds());
            Table contactTable = new Table(2);
            contactTable.addCell(createStyledCell("Provider Phone:", boldFont, true));
            if (sellerPhoneNumber != null && !sellerPhoneNumber.isEmpty()) {
                contactTable.addCell(createStyledCell(sellerPhoneNumber, normalFont, false));
            } else {
                contactTable.addCell(createStyledCell("Contact through RentCart support", normalFont, false));
            }
            document.add(contactTable);

            // Footer with enhanced styling
            Paragraph footer = new Paragraph("Thank you for choosing RentCart!\nFor any queries, please contact us at support@rentcart.com\nThis is a computer-generated receipt. No signature required.")
                .setFont(normalFont)
                .setFontSize(10)
                .setFontColor(ColorConstants.GRAY);
            document.add(footer);

            document.close();
            return baos.toByteArray();

        } catch (Exception e) {
            logger.error("Error generating receipt PDF: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to generate receipt PDF", e);
        }
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

    private Cell createStyledCell(String text, PdfFont font, boolean isHeader) {
        Cell cell = new Cell().add(new Paragraph(text).setFont(font));
        if (isHeader) {
            cell.setBackgroundColor(SECONDARY_COLOR);
        }
        return cell;
    }

    private Cell createHeaderCell(String text, PdfFont font) {
        Cell cell = new Cell().add(new Paragraph(text).setFont(font).setFontSize(12));
        cell.setBackgroundColor(PRIMARY_COLOR);
        cell.setFontColor(ColorConstants.WHITE);
        return cell;
    }

    private Cell createCell(String text, PdfFont font, boolean isHeader) {
        Cell cell = new Cell().add(new Paragraph(text).setFont(font));
        if (isHeader) {
            cell.setBackgroundColor(ColorConstants.LIGHT_GRAY);
        }
        return cell;
    }
} 