package com.RentCart.AuthService.Repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.RentCart.AuthService.Entity.PasswordResetToken;

public interface PasswordResetTokenRepository extends MongoRepository<PasswordResetToken, String> {
    Optional<PasswordResetToken> findByToken(String token);
    Optional<PasswordResetToken> findByEmailIdAndUsedIsFalse(String emailId);
} 