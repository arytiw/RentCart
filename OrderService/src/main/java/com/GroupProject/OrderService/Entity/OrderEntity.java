// package com.GroupProject.OrderService.Entity;

// import java.time.LocalDateTime;
// import java.util.List;

// import org.springframework.data.annotation.Id;
// import org.springframework.data.mongodb.core.mapping.Document;

// @Document(collection = "orders")
// public class OrderEntity {

//     @Id
//     private String id;

//     private String userId;
//     private String address;
//     private List<String> itemIds;
//     private double totalAmount;
//     private LocalDateTime orderDate;
//     private String status;

//     public OrderEntity() {
//     }

//     public OrderEntity(String id, String userId, String address, List<String> itemIds,
//                        double totalAmount, LocalDateTime orderDate, String status) {
//         this.id = id;
//         this.userId = userId;
//         this.address = address;
//         this.itemIds = itemIds;
//         this.totalAmount = totalAmount;
//         this.orderDate = orderDate;
//         this.status = status;
//     }

//     public String getId() {
//         return id;
//     }

//     public void setId(String id) {
//         this.id = id;
//     }

//     public String getUserId() {
//         return userId;
//     }

//     public void setUserId(String userId) {
//         this.userId = userId;
//     }

//     public String getAddress() {
//         return address;
//     }

//     public void setAddress(String address) {
//         this.address = address;
//     }

//     public List<String> getItemIds() {
//         return itemIds;
//     }

//     public void setItemIds(List<String> itemIds) {
//         this.itemIds = itemIds;
//     }

//     public double getTotalAmount() {
//         return totalAmount;
//     }

//     public void setTotalAmount(double totalAmount) {
//         this.totalAmount = totalAmount;
//     }

//     public LocalDateTime getOrderDate() {
//         return orderDate;
//     }

//     public void setOrderDate(LocalDateTime orderDate) {
//         this.orderDate = orderDate;
//     }

//     public String getStatus() {
//         return status;
//     }

//     public void setStatus(String status) {
//         this.status = status;
//     }

//     @Override
//     public String toString() {
//         return "OrderEntity [id=" + id + ", userId=" + userId + ", address=" + address + ", itemIds=" + itemIds +
//                ", totalAmount=" + totalAmount + ", orderDate=" + orderDate + ", status=" + status + "]";
//     }
// }

package com.GroupProject.OrderService.Entity;

import java.time.LocalDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "orders")
public class OrderEntity {

    private static final Logger logger = LoggerFactory.getLogger(OrderEntity.class);

    @Id
    private String id;

    private String orderId; // ✅ NEW
    private String userId;
    private String address;
    private List<String> itemIds;
    private double totalAmount;
    private LocalDateTime orderDate;
    private LocalDateTime estimatedDeliveryDate;
    private String status;
    private String paymentMode;
    private String paymentStatus;
    private String couponCode; // ✅ NEW

    public OrderEntity() {
        logger.debug("OrderEntity: Default constructor called");
    }

    public OrderEntity(String id, String orderId, String userId, String address, List<String> itemIds,
                       double totalAmount, LocalDateTime orderDate, LocalDateTime estimatedDeliveryDate,
                       String status, String paymentMode, String paymentStatus, String couponCode) {
        this.id = id;
        this.orderId = orderId;
        this.userId = userId;
        this.address = address;
        this.itemIds = itemIds;
        this.totalAmount = totalAmount;
        this.orderDate = orderDate;
        this.estimatedDeliveryDate = estimatedDeliveryDate;
        this.status = status;
        this.paymentMode = paymentMode;
        this.paymentStatus = paymentStatus;
        this.couponCode = couponCode;
        logger.debug("OrderEntity: Parameterized constructor called with id={}, orderId={}, userId={}, totalAmount={}, status={}, paymentMode={}",
                id, orderId, userId, totalAmount, status, paymentMode);
    }

    public String getId() {
        logger.debug("getId called, returning: {}", id);
        return id;
    }

    public void setId(String id) {
        logger.debug("setId called with: {}", id);
        this.id = id;
    }

    public String getOrderId() {
        logger.debug("getOrderId called, returning: {}", orderId);
        return orderId;
    }

    public void setOrderId(String orderId) {
        logger.debug("setOrderId called with: {}", orderId);
        this.orderId = orderId;
    }

    public String getUserId() {
        logger.debug("getUserId called, returning: {}", userId);
        return userId;
    }

    public void setUserId(String userId) {
        logger.debug("setUserId called with: {}", userId);
        this.userId = userId;
    }

    public String getAddress() {
        logger.debug("getAddress called, returning: {}", address);
        return address;
    }

    public void setAddress(String address) {
        logger.debug("setAddress called with: {}", address);
        this.address = address;
    }

    public List<String> getItemIds() {
        logger.debug("getItemIds called, returning: {}", itemIds);
        return itemIds;
    }

    public void setItemIds(List<String> itemIds) {
        logger.debug("setItemIds called with: {}", itemIds);
        this.itemIds = itemIds;
    }

    public double getTotalAmount() {
        logger.debug("getTotalAmount called, returning: {}", totalAmount);
        return totalAmount;
    }

    public void setTotalAmount(double totalAmount) {
        logger.debug("setTotalAmount called with: {}", totalAmount);
        this.totalAmount = totalAmount;
    }

    public LocalDateTime getOrderDate() {
        logger.debug("getOrderDate called, returning: {}", orderDate);
        return orderDate;
    }

    public void setOrderDate(LocalDateTime orderDate) {
        logger.debug("setOrderDate called with: {}", orderDate);
        this.orderDate = orderDate;
    }

    public LocalDateTime getEstimatedDeliveryDate() {
        logger.debug("getEstimatedDeliveryDate called, returning: {}", estimatedDeliveryDate);
        return estimatedDeliveryDate;
    }

    public void setEstimatedDeliveryDate(LocalDateTime estimatedDeliveryDate) {
        logger.debug("setEstimatedDeliveryDate called with: {}", estimatedDeliveryDate);
        this.estimatedDeliveryDate = estimatedDeliveryDate;
    }

    public String getStatus() {
        logger.debug("getStatus called, returning: {}", status);
        return status;
    }

    public void setStatus(String status) {
        logger.debug("setStatus called with: {}", status);
        this.status = status;
    }

    public String getPaymentMode() {
        logger.debug("getPaymentMode called, returning: {}", paymentMode);
        return paymentMode;
    }

    public void setPaymentMode(String paymentMode) {
        logger.debug("setPaymentMode called with: {}", paymentMode);
        this.paymentMode = paymentMode;
    }

    public String getPaymentStatus() {
        logger.debug("getPaymentStatus called, returning: {}", paymentStatus);
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        logger.debug("setPaymentStatus called with: {}", paymentStatus);
        this.paymentStatus = paymentStatus;
    }

    public String getCouponCode() {
        logger.debug("getCouponCode called, returning: {}", couponCode);
        return couponCode;
    }

    public void setCouponCode(String couponCode) {
        logger.debug("setCouponCode called with: {}", couponCode);
        this.couponCode = couponCode;
    }

    @Override
    public String toString() {
        return "OrderEntity [id=" + id + ", orderId=" + orderId + ", userId=" + userId + ", address=" + address +
               ", itemIds=" + itemIds + ", totalAmount=" + totalAmount + ", orderDate=" + orderDate +
               ", estimatedDeliveryDate=" + estimatedDeliveryDate + ", status=" + status +
               ", paymentMode=" + paymentMode + ", paymentStatus=" + paymentStatus + ", couponCode=" + couponCode + "]";
    }
}

