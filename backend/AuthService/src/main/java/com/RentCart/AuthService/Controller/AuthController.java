package com.RentCart.AuthService.Controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

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
            String token = jwtProvider.generateToken(user.getUsername());
            logger.info("Login successful for user: {}", user.getEmailId());
            return ResponseEntity.ok(token);
        }

        logger.warn("Login failed for user: {}", loginUser.getEmailId());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }
}
