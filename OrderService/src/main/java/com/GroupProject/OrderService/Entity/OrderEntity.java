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

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "orders")
public class OrderEntity {

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

    public OrderEntity() {}

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
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public List<String> getItemIds() { return itemIds; }
    public void setItemIds(List<String> itemIds) { this.itemIds = itemIds; }

    public double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }

    public LocalDateTime getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDateTime orderDate) { this.orderDate = orderDate; }

    public LocalDateTime getEstimatedDeliveryDate() { return estimatedDeliveryDate; }
    public void setEstimatedDeliveryDate(LocalDateTime estimatedDeliveryDate) {
        this.estimatedDeliveryDate = estimatedDeliveryDate;
    }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPaymentMode() { return paymentMode; }
    public void setPaymentMode(String paymentMode) { this.paymentMode = paymentMode; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getCouponCode() { return couponCode; }
    public void setCouponCode(String couponCode) { this.couponCode = couponCode; }

    @Override
    public String toString() {
        return "OrderEntity [id=" + id + ", orderId=" + orderId + ", userId=" + userId + ", address=" + address +
               ", itemIds=" + itemIds + ", totalAmount=" + totalAmount + ", orderDate=" + orderDate +
               ", estimatedDeliveryDate=" + estimatedDeliveryDate + ", status=" + status +
               ", paymentMode=" + paymentMode + ", paymentStatus=" + paymentStatus + ", couponCode=" + couponCode + "]";
    }
}

