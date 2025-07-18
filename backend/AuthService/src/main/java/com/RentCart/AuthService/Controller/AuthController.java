package com.RentCart.AuthService.Controller; 

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.RentCart.AuthService.Config.JWTProvider;
import com.RentCart.AuthService.Entity.UserCredentials;
import com.RentCart.AuthService.Services.AuthenticationS;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
@Validated
public class AuthController {
	
	@Autowired
	private AuthenticationS service;
	
	@Autowired
    private JWTProvider jwtProvider;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	 @PostMapping("/register")
	    public ResponseEntity<?> addNewUser(@Valid @RequestBody UserCredentials user) {
	        String message = service.saveUser(user);
	        return ResponseEntity.ok(message);
	    }

	    @GetMapping("/users")
	    public ResponseEntity<List<UserCredentials>> getAllUser() {
	        return ResponseEntity.ok(service.getAllUser());
	    }

	    @PostMapping("/login")
	    public ResponseEntity<String> login(@RequestBody UserCredentials loginUser) {
	        UserCredentials user = service.getUserByEmailId(loginUser.getEmailId());
	        if (user != null && passwordEncoder.matches(loginUser.getPassword(), user.getPassword())) {
	            return ResponseEntity.ok(jwtProvider.generateToken(user.getUsername()));
	        }
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
	    }
}