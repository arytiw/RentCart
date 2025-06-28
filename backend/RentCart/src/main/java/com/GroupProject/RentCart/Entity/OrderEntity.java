package com.GroupProject.RentCart.Entity;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "orders")
public class OrderEntity {

    @Id
    private String id;

    private String userId;
    private String address;
    private List<String> itemIds;
    private double totalAmount;
    private LocalDateTime orderDate;
    private String status;

    public OrderEntity() {
    }

    public OrderEntity(String id, String userId, String address, List<String> itemIds,
                       double totalAmount, LocalDateTime orderDate, String status) {
        this.id = id;
        this.userId = userId;
        this.address = address;
        this.itemIds = itemIds;
        this.totalAmount = totalAmount;
        this.orderDate = orderDate;
        this.status = status;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public List<String> getItemIds() {
        return itemIds;
    }

    public void setItemIds(List<String> itemIds) {
        this.itemIds = itemIds;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return "OrderEntity [id=" + id + ", userId=" + userId + ", address=" + address + ", itemIds=" + itemIds +
               ", totalAmount=" + totalAmount + ", orderDate=" + orderDate + ", status=" + status + "]";
    }
}
