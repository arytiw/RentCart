package com.RentCart.AuthService.Entity;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@Document(collection = "userCredentials")
public class UserCredentials {

    private static final Logger logger = LoggerFactory.getLogger(UserCredentials.class);

    @Id
    private String id;

    @NotBlank(message = "Username is required")
    private String username;

    @Pattern(
        regexp = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$",
        message = "Email must be valid"
    )
    @NotBlank(message = "Email is required")
    @Indexed(unique = true)
    private String emailId;

    @NotBlank(message = "Password is required")
    private String password;

    @Indexed(unique = true)
    private String phoneNumber;

    @Pattern(regexp = "^[A-Za-z][A-Za-z\\s]*$", message = "First name must contain only letters and spaces")
    @NotBlank(message = "firstName is required")
    private String firstName;

      @Pattern(
        regexp = "^[A-Za-z][A-Za-z ]{0,29}$",
        message = "Last name must be up to 30 characters, only letters and spaces"
    )
    private String lastName;

    @Pattern(
        regexp = "^(Male|Female|Other)?$",
        message = "Gender must be Male, Female, or Other"
    )
    private String gender;
    private String dateOfBirth;
    private Address address;

    public UserCredentials(String id, String username, String emailId, String password, String phoneNumber,
                            String firstName, String lastName, String gender, String dateOfBirth, Address address) {
        logger.info("Creating UserCredentials with ID: {}, username: {}, emailId: {}", id, username, emailId);
        this.id = id;
        this.username = username;
        this.emailId = emailId;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.firstName = firstName;
        this.lastName = lastName;
        this.gender = gender;
        this.dateOfBirth = dateOfBirth;
        this.address = address;
    }

    public UserCredentials() {
        logger.debug("Creating empty UserCredentials object");
    }

    public String getId() {
        logger.debug("Getting id: {}", id);
        return id;
    }

    public void setId(String id) {
        logger.info("Setting id: {}", id);
        this.id = id;
    }

    public String getUsername() {
        logger.debug("Getting username: {}", username);
        return username;
    }

    public void setUsername(String username) {
        logger.info("Setting username: {}", username);
        this.username = username;
    }

    public String getEmailId() {
        logger.debug("Getting emailId: {}", emailId);
        return emailId;
    }

    public void setEmailId(String emailId) {
        logger.info("Setting emailId: {}", emailId);
        this.emailId = emailId;
    }

    public String getPassword() {
        logger.debug("Getting password");
        return password;
    }

    public void setPassword(String password) {
        logger.info("Setting password (encrypted or raw): {}", password != null ? "[PROTECTED]" : null);
        this.password = password;
    }

    public String getPhoneNumber() {
        logger.debug("Getting phoneNumber: {}", phoneNumber);
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        logger.info("Setting phoneNumber: {}", phoneNumber);
        this.phoneNumber = phoneNumber;
    }

    public String getFirstName() {
        logger.debug("Getting firstName: {}", firstName);
        return firstName;
    }

    public void setFirstName(String firstName) {
        logger.info("Setting firstName: {}", firstName);
        this.firstName = firstName;
    }

    public String getLastName() {
        logger.debug("Getting lastName: {}", lastName);
        return lastName;
    }

    public void setLastName(String lastName) {
        logger.info("Setting lastName: {}", lastName);
        this.lastName = lastName;
    }

    public String getGender() {
        logger.debug("Getting gender: {}", gender);
        return gender;
    }

    public void setGender(String gender) {
        logger.info("Setting gender: {}", gender);
        this.gender = gender;
    }

    public String getDateOfBirth() {
        logger.debug("Getting dateOfBirth: {}", dateOfBirth);
        return dateOfBirth;
    }

    public void setDateOfBirth(String dateOfBirth) {
        logger.info("Setting dateOfBirth: {}", dateOfBirth);
        this.dateOfBirth = dateOfBirth;
    }

    public Address getAddress() {
        logger.debug("Getting address: {}", address);
        return address;
    }

    public void setAddress(Address address) {
        logger.info("Setting address: {}", address);
        this.address = address;
    }

    @Override
    public String toString() {
        String result = "UserCredentials [id=" + id + ", username=" + username + ", emailId=" + emailId +
                ", password=[PROTECTED], phoneNumber=" + phoneNumber + ", firstName=" + firstName +
                ", lastName=" + lastName + ", gender=" + gender + ", dateOfBirth=" + dateOfBirth +
                ", address=" + address + "]";
        logger.debug("Converting UserCredentials to String: {}", result);
        return result;
    }
}
