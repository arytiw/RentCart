package com.RentCart.AuthService.Services;

import java.security.SecureRandom;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.RentCart.AuthService.Entity.PasswordResetToken;
import com.RentCart.AuthService.Entity.UserCredentials;
import com.RentCart.AuthService.Repository.PasswordResetTokenRepository;
import com.RentCart.AuthService.Repository.UserCredentialRepository;

@Service
public class PasswordResetService {
    @Autowired
    private PasswordResetTokenRepository tokenRepository;
    @Autowired
    private UserCredentialRepository userRepository;
    @Autowired
    private EmailService emailService;

    private static final long EXPIRATION_TIME = 1000 * 60 * 60; // 1 hour
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10, new SecureRandom());

    public void createAndSendResetToken(String email) {
        Optional<UserCredentials> userOpt = userRepository.findByEmailId(email);
        if (userOpt.isEmpty()) return;
        String token = UUID.randomUUID().toString();
        Date expiry = new Date(System.currentTimeMillis() + EXPIRATION_TIME);
        PasswordResetToken resetToken = new PasswordResetToken(token, email, expiry, false);
        tokenRepository.save(resetToken);
        String resetLink = "http://localhost:3000/reset-password?token=" + token;
        String message = "Click the link to reset your password: " + resetLink;
        emailService.sendEmail(email, "Password Reset Request", message);
    }

    public boolean resetPassword(String token, String newPassword) {
        Optional<PasswordResetToken> tokenOpt = tokenRepository.findByToken(token);
        if (tokenOpt.isEmpty()) return false;
        PasswordResetToken resetToken = tokenOpt.get();
        if (resetToken.isUsed() || resetToken.getExpiryDate().before(new Date())) return false;
        Optional<UserCredentials> userOpt = userRepository.findByEmailId(resetToken.getEmailId());
        if (userOpt.isEmpty()) return false;
        UserCredentials user = userOpt.get();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        resetToken.setUsed(true);
        tokenRepository.save(resetToken);
        return true;
    }

    public boolean changePassword(String email, String oldPassword, String newPassword) {
        if (email == null) return false;
        email = email.toLowerCase();
        Optional<UserCredentials> userOpt = userRepository.findByEmailId(email);
        if (userOpt.isEmpty()) {
            System.out.println("User not found for email: " + email);
            return false;
        }
        UserCredentials user = userOpt.get();
        boolean passwordMatches = passwordEncoder.matches(oldPassword, user.getPassword());
        System.out.println("Password match for user " + email + ": " + passwordMatches);
        if (!passwordMatches) return false;
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return true;
    }
} 