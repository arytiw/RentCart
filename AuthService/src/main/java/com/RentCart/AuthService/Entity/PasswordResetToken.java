package com.RentCart.AuthService.Entity;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "passwordResetTokens")
public class PasswordResetToken {
    @Id
    private String id;
    @Indexed(unique = true)
    private String token;
    private String emailId;
    private Date expiryDate;
    private boolean used;

    public PasswordResetToken() {}

    public PasswordResetToken(String token, String emailId, Date expiryDate, boolean used) {
        this.token = token;
        this.emailId = emailId;
        this.expiryDate = expiryDate;
        this.used = used;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getEmailId() { return emailId; }
    public void setEmailId(String emailId) { this.emailId = emailId; }
    public Date getExpiryDate() { return expiryDate; }
    public void setExpiryDate(Date expiryDate) { this.expiryDate = expiryDate; }
    public boolean isUsed() { return used; }
    public void setUsed(boolean used) { this.used = used; }
} 