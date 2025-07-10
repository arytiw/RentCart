package com.RentCart.AuthService.Entity;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "userCredentials")

public class UserCredentials {
	@Id
	private String id;
	private String username;
	private String emailId;
	private String password;

	public UserCredentials(String id, String username, String emailId, String password) {
		super();
		this.id = id;
		this.username = username;
		this.emailId = emailId;
		this.password = password;
	}

	public UserCredentials() {
		super();
		// TODO Auto-generated constructor stub
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getEmailId() {
		return emailId;
	}

	public void setEmailId(String emailId) {
		this.emailId = emailId;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	@Override
	public String toString() {
		return "UserCredentials [id=" + id + ", username=" + username + ", emailId=" + emailId + ", password="
				+ password + "]";
	}

}
