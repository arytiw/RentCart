package com.RentCart.AuthService.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.RentCart.AuthService.Config.JWTProvider;
import com.RentCart.AuthService.Entity.UserCredentials;
import com.RentCart.AuthService.Services.AuthenticationS;
import com.RentCart.AuthService.Services.PasswordResetService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
@Validated
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {org.springframework.web.bind.annotation.RequestMethod.GET, org.springframework.web.bind.annotation.RequestMethod.POST, org.springframework.web.bind.annotation.RequestMethod.PUT, org.springframework.web.bind.annotation.RequestMethod.DELETE, org.springframework.web.bind.annotation.RequestMethod.OPTIONS})
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthenticationS service;

    @Autowired
    private JWTProvider jwtProvider;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private PasswordResetService passwordResetService;

    @PostMapping("/register")
    public ResponseEntity<?> addNewUser(@Valid @RequestBody UserCredentials user) {
        logger.info("Register attempt for email: {}", user.getEmailId());

        if (service.getUserByEmailId(user.getEmailId()) != null) {
            logger.warn("Registration failed: Email already registered - {}", user.getEmailId());
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already registered.");
        }

        String message = service.saveUser(user);
        logger.info("User registered successfully: {}", user.getEmailId());
        return ResponseEntity.status(HttpStatus.CREATED).body(message);
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserCredentials>> getAllUser() {
        logger.info("Fetching all users");
        return ResponseEntity.ok(service.getAllUser());
    }

    @GetMapping("/user")
    public ResponseEntity<?> getUserByEmail(@RequestParam String email) {
        logger.info("Fetching user by email: {}", email);
        try {
            UserCredentials user = service.getUserByEmailId(email);
            if (user != null) {
                Map<String, Object> userData = new HashMap<>();
                userData.put("username", user.getUsername());
                userData.put("emailId", user.getEmailId());
                userData.put("firstName", user.getFirstName());
                userData.put("lastName", user.getLastName());
                userData.put("phoneNumber", user.getPhoneNumber());
                userData.put("gender", user.getGender());
                userData.put("dateOfBirth", user.getDateOfBirth());
                
                logger.info("User found: {}", email);
                return ResponseEntity.ok(userData);
            } else {
                logger.warn("User not found: {}", email);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
        } catch (Exception e) {
            logger.error("Error fetching user by email: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching user");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody UserCredentials loginUser) {
        logger.info("Login attempt for email: {}", loginUser.getEmailId());

        UserCredentials user = service.getUserByEmailId(loginUser.getEmailId());

        if (user != null && passwordEncoder.matches(loginUser.getPassword(), user.getPassword())) {
            String token = jwtProvider.generateToken(user.getEmailId());
            logger.info("Login successful for user: {}", user.getEmailId());
            return ResponseEntity.ok(token);
        }

        logger.warn("Login failed for user: {}", loginUser.getEmailId());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }

    @PostMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String authHeader) {
        logger.info("Token validation request");
        logger.info("Auth header: {}", authHeader);
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            logger.warn("Invalid authorization header");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid authorization header");
        }

        String token = authHeader.substring(7); // Remove "Bearer " prefix
        logger.info("Extracted token: {}", token.substring(0, Math.min(20, token.length())) + "...");
        
        try {
            String emailId = jwtProvider.getUsernameFromToken(token);
            logger.info("Extracted emailId from token: {}", emailId);
            
            if (emailId != null && jwtProvider.validateToken(token)) {
                logger.info("Token is valid, looking up user");
                UserCredentials user = service.getUserByEmailId(emailId);
                if (user != null) {
                    Map<String, Object> userData = new HashMap<>();
                    userData.put("username", user.getUsername());
                    userData.put("emailId", user.getEmailId());
                    userData.put("firstName", user.getFirstName());
                    userData.put("lastName", user.getLastName());
                    userData.put("phoneNumber", user.getPhoneNumber());
                    userData.put("gender", user.getGender());
                    userData.put("dateOfBirth", user.getDateOfBirth());
                    
                    logger.info("Token validation successful for user: {}", emailId);
                    return ResponseEntity.ok(userData);
                }
            }
        } catch (Exception e) {
            logger.error("Token validation error: {}", e.getMessage());
        }
        
        logger.warn("Token validation failed");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        // Check if user exists before sending reset link
        if (service.getUserByEmailId(email) == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Email ID is not registered.");
        }
        passwordResetService.createAndSendResetToken(email);
        return ResponseEntity.ok("Password reset link sent to your email if it exists in our system.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("newPassword");
        String confirmPassword = request.get("confirmPassword");
        if (!newPassword.equals(confirmPassword)) {
            return ResponseEntity.badRequest().body("Passwords do not match.");
        }
        boolean result = passwordResetService.resetPassword(token, newPassword);
        if (result) {
            return ResponseEntity.ok("Password reset successful.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired token.");
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String oldPassword = request.get("oldPassword");
        String newPassword = request.get("newPassword");
        String confirmPassword = request.get("confirmPassword");
        if (!newPassword.equals(confirmPassword)) {
            return ResponseEntity.badRequest().body("Passwords do not match.");
        }
        boolean result = passwordResetService.changePassword(email, oldPassword, newPassword);
        if (result) {
            return ResponseEntity.ok("Password changed successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid old password or user not found.");
        }
    }
}