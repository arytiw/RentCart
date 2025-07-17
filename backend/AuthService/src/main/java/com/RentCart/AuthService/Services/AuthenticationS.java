package com.RentCart.AuthService.Services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.RentCart.AuthService.Entity.UserCredentials;
import com.RentCart.AuthService.Repository.UserCredentialRepository;

@Service
public class AuthenticationS {
	@Autowired
	private UserCredentialRepository repository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	public String saveUser(UserCredentials credential) {
		
		if (repository.findByEmailId(credential.getEmailId()).isPresent()) {
	        return "Email is already registered!";
	    }
		
		credential.setPassword(passwordEncoder.encode(credential.getPassword()));
		repository.save(credential);
		return "User added to the System Successfully";
	}
	
	public List<UserCredentials> getAllUser() {
	    return repository.findAll();
	}


	public UserCredentials getUserByEmailId(String emailId) {
		return repository.findByEmailId(emailId).orElse(null);
	}
	
	 // ✅ Password match using encoder
    public boolean passwordMatches(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }	
}
