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
import org.springframework.web.bind.annotation.RestController;

import com.RentCart.AuthService.Config.JWTProvider;
import com.RentCart.AuthService.Entity.UserCredentials;
import com.RentCart.AuthService.Services.AuthenticationS;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
@Validated
@CrossOrigin(origins = "*")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthenticationS service;

    @Autowired
    private JWTProvider jwtProvider;

    @Autowired
    private PasswordEncoder passwordEncoder;

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
}