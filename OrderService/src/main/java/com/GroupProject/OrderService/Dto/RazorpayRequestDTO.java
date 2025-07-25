package com.GroupProject.OrderService.Dto;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class RazorpayRequestDTO {
    private static final Logger logger = LoggerFactory.getLogger(RazorpayRequestDTO.class);

    private Double amount;
    private String currency;
    private String receipt;
    private Boolean payment_capture;

    public RazorpayRequestDTO() {
        logger.debug("RazorpayRequestDTO: Default constructor called");
    }

    public RazorpayRequestDTO(Double amount, String currency, String receipt, Boolean payment_capture) {
        this.amount = amount;
        this.currency = currency;
        this.receipt = receipt;
        this.payment_capture = payment_capture;
        logger.debug("RazorpayRequestDTO: Parameterized constructor called with amount: {}, currency: {}, receipt: {}, payment_capture: {}",
                amount, currency, receipt, payment_capture);
    }

    public Double getAmount() {
        logger.debug("getAmount called, returning: {}", amount);
        return amount;
    }

    public void setAmount(Double amount) {
        logger.debug("setAmount called with: {}", amount);
        this.amount = amount;
    }

    public String getCurrency() {
        logger.debug("getCurrency called, returning: {}", currency);
        return currency;
    }

    public void setCurrency(String currency) {
        logger.debug("setCurrency called with: {}", currency);
        this.currency = currency;
    }

    public String getReceipt() {
        logger.debug("getReceipt called, returning: {}", receipt);
        return receipt;
    }

    public void setReceipt(String receipt) {
        logger.debug("setReceipt called with: {}", receipt);
        this.receipt = receipt;
    }

    public Boolean getPayment_capture() {
        logger.debug("getPayment_capture called, returning: {}", payment_capture);
        return payment_capture;
    }

    public void setPayment_capture(Boolean payment_capture) {
        logger.debug("setPayment_capture called with: {}", payment_capture);
        this.payment_capture = payment_capture;
    }
}
