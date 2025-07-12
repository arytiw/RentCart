package com.RentCart.AuthService.Repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.RentCart.AuthService.Entity.UserCredentials;

public interface UserCredentialRepository extends MongoRepository<UserCredentials, String > {
	Optional<UserCredentials> findByUsername(String username);
	Optional<UserCredentials> findByEmailId(String emailId);
}
