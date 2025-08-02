package com.RentCart.AuthService.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
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

        try {
            // Check for existing email
            if (service.getUserByEmailId(user.getEmailId()) != null) {
                logger.warn("Registration failed: Email already registered - {}", user.getEmailId());
                Map<String, Object> errorResponse = new HashMap<>();
                Map<String, String> fieldErrors = new HashMap<>();
                fieldErrors.put("emailId", "Email already registered");
                errorResponse.put("fieldErrors", fieldErrors);
                errorResponse.put("message", "Email already registered");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
            }

            // Check for existing username
            if (service.getUserByUsername(user.getUsername()) != null) {
                logger.warn("Registration failed: Username already taken - {}", user.getUsername());
                Map<String, Object> errorResponse = new HashMap<>();
                Map<String, String> fieldErrors = new HashMap<>();
                fieldErrors.put("username", "Username already taken");
                errorResponse.put("fieldErrors", fieldErrors);
                errorResponse.put("message", "Username already taken");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
            }

            // Check for existing phone number if provided
            if (user.getPhoneNumber() != null && !user.getPhoneNumber().trim().isEmpty()) {
                if (service.getUserByPhoneNumber(user.getPhoneNumber()) != null) {
                    logger.warn("Registration failed: Phone number already registered - {}", user.getPhoneNumber());
                    Map<String, Object> errorResponse = new HashMap<>();
                    Map<String, String> fieldErrors = new HashMap<>();
                    fieldErrors.put("phoneNumber", "Phone number already registered");
                    errorResponse.put("fieldErrors", fieldErrors);
                    errorResponse.put("message", "Phone number already registered");
                    return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
                }
            }

            String message = service.saveUser(user);
            logger.info("User registered successfully: {}", user.getEmailId());
            return ResponseEntity.status(HttpStatus.CREATED).body(message);
            
        } catch (DuplicateKeyException e) {
            logger.error("Duplicate key exception during registration: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            Map<String, String> fieldErrors = new HashMap<>();
            
            if (e.getMessage().contains("emailId")) {
                fieldErrors.put("emailId", "Email already registered");
            } else if (e.getMessage().contains("username")) {
                fieldErrors.put("username", "Username already taken");
            } else if (e.getMessage().contains("phoneNumber")) {
                fieldErrors.put("phoneNumber", "Phone number already registered");
            } else {
                fieldErrors.put("general", "Registration failed due to duplicate data");
            }
            
            errorResponse.put("fieldErrors", fieldErrors);
            errorResponse.put("message", "Registration failed due to duplicate data");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
        } catch (Exception e) {
            logger.error("Unexpected error during registration: {}", e.getMessage(), e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Registration failed. Please try again.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
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

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, Object> errorResponse = new HashMap<>();
        Map<String, String> fieldErrors = new HashMap<>();
        
        ex.getBindingResult().getFieldErrors().forEach(error -> {
            fieldErrors.put(error.getField(), error.getDefaultMessage());
        });
        
        errorResponse.put("fieldErrors", fieldErrors);
        errorResponse.put("message", "Validation failed");
        
        logger.warn("Validation error during registration: {}", fieldErrors);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }
}