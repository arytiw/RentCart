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

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class OrderRequest {
    private static final Logger logger = LoggerFactory.getLogger(OrderRequest.class);

    private List<String> itemIds;
    private String address;
    private String couponCode;   // optional
    private String paymentMode;  // required

    public OrderRequest() {
        logger.debug("OrderRequest: Default constructor called");
    }

    public OrderRequest(List<String> itemIds, String address, String couponCode, String paymentMode) {
        this.itemIds = itemIds;
        this.address = address;
        this.couponCode = couponCode;
        this.paymentMode = paymentMode;
        logger.debug("OrderRequest: Parameterized constructor called with itemIds: {}, address: {}, couponCode: {}, paymentMode: {}",
            itemIds, address, couponCode, paymentMode);
    }

    public List<String> getItemIds() {
        logger.debug("getItemIds called, returning: {}", itemIds);
        return itemIds;
    }

    public void setItemIds(List<String> itemIds) {
        logger.debug("setItemIds called with: {}", itemIds);
        this.itemIds = itemIds;
    }

    public String getAddress() {
        logger.debug("getAddress called, returning: {}", address);
        return address;
    }

    public void setAddress(String address) {
        logger.debug("setAddress called with: {}", address);
        this.address = address;
    }

    public String getCouponCode() {
        logger.debug("getCouponCode called, returning: {}", couponCode);
        return couponCode;
    }

    public void setCouponCode(String couponCode) {
        logger.debug("setCouponCode called with: {}", couponCode);
        this.couponCode = couponCode;
    }

    public String getPaymentMode() {
        logger.debug("getPaymentMode called, returning: {}", paymentMode);
        return paymentMode;
    }

    public void setPaymentMode(String paymentMode) {
        logger.debug("setPaymentMode called with: {}", paymentMode);
        this.paymentMode = paymentMode;
    }
}
