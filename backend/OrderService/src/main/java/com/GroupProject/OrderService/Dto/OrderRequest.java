package com.GroupProject.OrderService.Dto;

import java.time.LocalDate;
import java.util.List;

public class OrderRequest {
    private List<String> itemIds;
    private String address;
    private String couponCode;   // New: optional
    private String paymentMode;  // New: required
    private String transactionId; // New: Razorpay payment ID
    
    // Rental-specific fields
    private LocalDate startDate;
    private LocalDate endDate;
    private int rentalDays;
    private double dailyRate;
    private double securityDeposit;
    private String itemTitle;
    private String ownerEmail;
    private String renterEmail;
    private String notes;

    public OrderRequest() {
    }

    public OrderRequest(List<String> itemIds, String address, String couponCode, String paymentMode) {
        this.itemIds = itemIds;
        this.address = address;
        this.couponCode = couponCode;
        this.paymentMode = paymentMode;
    }

    // Rental constructor
    public OrderRequest(List<String> itemIds, String address, LocalDate startDate, LocalDate endDate, 
                       double dailyRate, double securityDeposit, String itemTitle, String ownerEmail, 
                       String renterEmail, String notes) {
        this.itemIds = itemIds;
        this.address = address;
        this.startDate = startDate;
        this.endDate = endDate;
        this.dailyRate = dailyRate;
        this.securityDeposit = securityDeposit;
        this.itemTitle = itemTitle;
        this.ownerEmail = ownerEmail;
        this.renterEmail = renterEmail;
        this.notes = notes;
        this.paymentMode = "ONLINE";
        this.rentalDays = (int) java.time.temporal.ChronoUnit.DAYS.between(startDate, endDate);
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

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public int getRentalDays() {
        return rentalDays;
    }

    public void setRentalDays(int rentalDays) {
        this.rentalDays = rentalDays;
    }

    public double getDailyRate() {
        return dailyRate;
    }

    public void setDailyRate(double dailyRate) {
        this.dailyRate = dailyRate;
    }

    public double getSecurityDeposit() {
        return securityDeposit;
    }

    public void setSecurityDeposit(double securityDeposit) {
        this.securityDeposit = securityDeposit;
    }

    public String getItemTitle() {
        return itemTitle;
    }

    public void setItemTitle(String itemTitle) {
        this.itemTitle = itemTitle;
    }

    public String getOwnerEmail() {
        return ownerEmail;
    }

    public void setOwnerEmail(String ownerEmail) {
        this.ownerEmail = ownerEmail;
    }

    public String getRenterEmail() {
        return renterEmail;
    }

    public void setRenterEmail(String renterEmail) {
        this.renterEmail = renterEmail;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
