package com.RentCart.AuthService.Config;

import java.util.Date;

import javax.crypto.SecretKey;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JWTProvider {

    private static final Logger logger = LoggerFactory.getLogger(JWTProvider.class);

    // Secure key for HS512 (512-bit)
    private static final SecretKey SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS512);

    public String generateToken(String username) {
        logger.info("Generating JWT token for user: {}", username);
        String token = Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // 1 hour
                .signWith(SECRET_KEY, SignatureAlgorithm.HS512)
                .compact();
        logger.debug("Generated token: {}", token);
        return token;
    }

    public String getUsernameFromToken(String token) {
        logger.info("Extracting username from token");
        try {
            String username = Jwts.parserBuilder()
                    .setSigningKey(SECRET_KEY)
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
            logger.debug("Extracted username: {}", username);
            return username;
        } catch (JwtException e) {
            logger.error("Error extracting username from token: {}", e.getMessage());
            throw e;
        }
    }

    public boolean validateToken(String token) {
        logger.info("Validating JWT token");
        try {
            Jwts.parserBuilder().setSigningKey(SECRET_KEY).build().parseClaimsJws(token);
            logger.debug("Token is valid");
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            logger.warn("Invalid token: {}", e.getMessage());
            return false;
        }
    }
}
