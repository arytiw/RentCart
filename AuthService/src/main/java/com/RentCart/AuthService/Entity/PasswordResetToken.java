package com.RentCart.AuthService.Entity;

import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "passwordResetTokens")
public class PasswordResetToken {

    private static final Logger logger = LoggerFactory.getLogger(PasswordResetToken.class);

    @Id
    private String id;

    @Indexed(unique = true)
    private String token;

    private String emailId;

    private Date expiryDate;

    private boolean used;

    public PasswordResetToken() {
        logger.debug("Creating empty PasswordResetToken object");
    }

    public PasswordResetToken(String token, String emailId, Date expiryDate, boolean used) {
        logger.info("Creating PasswordResetToken with token: {}, emailId: {}, expiryDate: {}, used: {}", token, emailId, expiryDate, used);
        this.token = token;
        this.emailId = emailId;
        this.expiryDate = expiryDate;
        this.used = used;
    }

    public String getId() {
        logger.debug("Getting id: {}", id);
        return id;
    }

    public void setId(String id) {
        logger.info("Setting id: {}", id);
        this.id = id;
    }

    public String getToken() {
        logger.debug("Getting token: {}", token);
        return token;
    }

    public void setToken(String token) {
        logger.info("Setting token: {}", token);
        this.token = token;
    }

    public String getEmailId() {
        logger.debug("Getting emailId: {}", emailId);
        return emailId;
    }

    public void setEmailId(String emailId) {
        logger.info("Setting emailId: {}", emailId);
        this.emailId = emailId;
    }

    public Date getExpiryDate() {
        logger.debug("Getting expiryDate: {}", expiryDate);
        return expiryDate;
    }

    public void setExpiryDate(Date expiryDate) {
        logger.info("Setting expiryDate: {}", expiryDate);
        this.expiryDate = expiryDate;
    }

    public boolean isUsed() {
        logger.debug("Getting used flag: {}", used);
        return used;
    }

    public void setUsed(boolean used) {
        logger.info("Setting used flag: {}", used);
        this.used = used;
    }

    @Override
    public String toString() {
        String result = "PasswordResetToken [id=" + id + ", token=" + token + ", emailId=" + emailId +
                ", expiryDate=" + expiryDate + ", used=" + used + "]";
        logger.debug("Converting PasswordResetToken to String: {}", result);
        return result;
    }
}
