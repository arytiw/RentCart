// package com.GroupProject.OrderService.Dto;

// import java.util.List;

// public class OrderRequest {
//     private List<String> itemIds;
//     private String address;
    
//     public OrderRequest() {
//     }

//     public OrderRequest(List<String> itemIds, String address) {
//         this.itemIds = itemIds;
//         this.address = address;
//     }

//     public List<String> getItemIds() {
//         return itemIds;
//     }

//     public void setItemIds(List<String> itemIds) {
//         this.itemIds = itemIds;
//     }

//     public String getAddress() {
//         return address;
//     }

//     public void setAddress(String address) {
//         this.address = address;
//     }

// }



package com.GroupProject.OrderService.Dto;

import java.util.List;

public class OrderRequest {
    private List<String> itemIds;
    private String address;
    private String couponCode;   // New: optional
    private String paymentMode;  // New: required

    public OrderRequest() {
    }

    public OrderRequest(List<String> itemIds, String address, String couponCode, String paymentMode) {
        this.itemIds = itemIds;
        this.address = address;
        this.couponCode = couponCode;
        this.paymentMode = paymentMode;
    }

    public List<String> getItemIds() {
        return itemIds;
    }

    public void setItemIds(List<String> itemIds) {
        this.itemIds = itemIds;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCouponCode() {
        return couponCode;
    }

    public void setCouponCode(String couponCode) {
        this.couponCode = couponCode;
    }

    public String getPaymentMode() {
        return paymentMode;
    }

    public void setPaymentMode(String paymentMode) {
        this.paymentMode = paymentMode;
    }
}
