package com.GroupProject.OrderService.Util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.security.Principal;
import java.util.Map;

@Component
public class UserAuthUtil {
    
    private static final Logger logger = LoggerFactory.getLogger(UserAuthUtil.class);
    private static final String AUTH_SERVICE_URL = "http://localhost:8081";
    
    private final RestTemplate restTemplate;
    
    public UserAuthUtil() {
        this.restTemplate = new RestTemplate();
    }
    
    /**
     * Get user email from multiple sources with AuthService validation
     */
    public String getUserEmail(String userEmailHeader, String authToken, Principal principal) {
        // First try to get from header (most reliable)
        if (userEmailHeader != null && !userEmailHeader.isEmpty()) {
            logger.info("Using user email from header: {}", userEmailHeader);
            return userEmailHeader;
        }
        
        // Try to validate token with AuthService
        if (authToken != null && !authToken.isEmpty()) {
            try {
                String email = validateTokenAndGetEmail(authToken);
                if (email != null) {
                    logger.info("Retrieved user email from AuthService: {}", email);
                    return email;
                }
            } catch (Exception e) {
                logger.warn("Failed to validate token with AuthService: {}", e.getMessage());
            }
        }
        
        // Fallback to principal
        if (principal != null && principal.getName() != null) {
            logger.info("Using user email from principal: {}", principal.getName());
            return principal.getName();
        }
        
        // Last resort - log warning and return null to handle gracefully
        logger.warn("Could not determine user email from any source");
        return null;
    }
    
    /**
     * Validate token with AuthService and extract user email
     */
    private String validateTokenAndGetEmail(String token) {
        try {
            // Remove "Bearer " prefix if present
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + token);
            
            HttpEntity<String> entity = new HttpEntity<>(headers);
            
            ResponseEntity<Map> response = restTemplate.exchange(
                AUTH_SERVICE_URL + "/auth/validate",
                HttpMethod.POST,
                entity,
                Map.class
            );
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> userData = response.getBody();
                String email = (String) userData.get("emailId");
                if (email == null) {
                    email = (String) userData.get("email");
                }
                return email;
            }
        } catch (Exception e) {
            logger.error("Error validating token with AuthService: {}", e.getMessage());
        }
        return null;
    }
    
    /**
     * Get user info including name from AuthService
     */
    public Map<String, Object> getUserInfo(String authToken) {
        try {
            // Remove "Bearer " prefix if present
            if (authToken != null && authToken.startsWith("Bearer ")) {
                authToken = authToken.substring(7);
            }
            
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + authToken);
            
            HttpEntity<String> entity = new HttpEntity<>(headers);
            
            ResponseEntity<Map> response = restTemplate.exchange(
                AUTH_SERVICE_URL + "/auth/validate",
                HttpMethod.POST,
                entity,
                Map.class
            );
            
            if (response.getStatusCode().is2xxSuccessful()) {
                return response.getBody();
            }
        } catch (Exception e) {
            logger.error("Error getting user info from AuthService: {}", e.getMessage());
        }
        return null;
    }
}
