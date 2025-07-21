package com.GroupProject.OrderService.Dto;

public class RazorpayRequestDTO {
    private Double amount;
    private String currency;
    private String receipt;
    private Boolean payment_capture;

    // Getters and setters
    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getReceipt() {
        return receipt;
    }

    public void setReceipt(String receipt) {
        this.receipt = receipt;
    }

    public Boolean getPayment_capture() {
        return payment_capture;
    }

    public void setPayment_capture(Boolean payment_capture) {
        this.payment_capture = payment_capture;
    }
}
