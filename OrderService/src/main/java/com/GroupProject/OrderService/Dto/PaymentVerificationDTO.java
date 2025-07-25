package com.GroupProject.OrderService.Dto;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class PaymentVerificationDTO {
    private static final Logger logger = LoggerFactory.getLogger(PaymentVerificationDTO.class);

    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;

    public PaymentVerificationDTO() {
        logger.debug("PaymentVerificationDTO: Default constructor called");
    }

    public PaymentVerificationDTO(String razorpayOrderId, String razorpayPaymentId, String razorpaySignature) {
        this.razorpayOrderId = razorpayOrderId;
        this.razorpayPaymentId = razorpayPaymentId;
        this.razorpaySignature = razorpaySignature;
        logger.debug("PaymentVerificationDTO: Parameterized constructor called with orderId: {}, paymentId: {}, signature: {}",
            razorpayOrderId, razorpayPaymentId, razorpaySignature);
    }

    public String getRazorpayOrderId() {
        logger.debug("getRazorpayOrderId called, returning: {}", razorpayOrderId);
        return razorpayOrderId;
    }

    public void setRazorpayOrderId(String razorpayOrderId) {
        logger.debug("setRazorpayOrderId called with: {}", razorpayOrderId);
        this.razorpayOrderId = razorpayOrderId;
    }

    public String getRazorpayPaymentId() {
        logger.debug("getRazorpayPaymentId called, returning: {}", razorpayPaymentId);
        return razorpayPaymentId;
    }

    public void setRazorpayPaymentId(String razorpayPaymentId) {
        logger.debug("setRazorpayPaymentId called with: {}", razorpayPaymentId);
        this.razorpayPaymentId = razorpayPaymentId;
    }

    public String getRazorpaySignature() {
        logger.debug("getRazorpaySignature called, returning: {}", razorpaySignature);
        return razorpaySignature;
    }

    public void setRazorpaySignature(String razorpaySignature) {
        logger.debug("setRazorpaySignature called with: {}", razorpaySignature);
        this.razorpaySignature = razorpaySignature;
    }
}
