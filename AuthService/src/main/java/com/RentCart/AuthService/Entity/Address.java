package com.RentCart.AuthService.Entity;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.validation.constraints.NotBlank;

public class Address {

    private static final Logger logger = LoggerFactory.getLogger(Address.class);

    @NotBlank(message = "Address Line 1 is required")
    private String addressLine1;

    @NotBlank(message = "Address Line 2 is required")
    private String addressLine2;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "State is required")
    private String state;

    @NotBlank(message = "Country is required")
    private String country;

    @NotBlank(message = "Postal Code is required")
    private String postalCode;

    public Address(@NotBlank(message = "Address Line 1 is required") String addressLine1,
                   @NotBlank(message = "Address Line 2 is required") String addressLine2,
                   @NotBlank(message = "City is required") String city,
                   @NotBlank(message = "State is required") String state,
                   @NotBlank(message = "Country is required") String country,
                   @NotBlank(message = "Postal Code is required") String postalCode) {
        logger.info("Creating Address with values: {}, {}, {}, {}, {}, {}", 
                    addressLine1, addressLine2, city, state, country, postalCode);
        this.addressLine1 = addressLine1;
        this.addressLine2 = addressLine2;
        this.city = city;
        this.state = state;
        this.country = country;
        this.postalCode = postalCode;
    }

    public Address() {
        logger.debug("Creating empty Address object");
    }

    public String getAddressLine1() {
        logger.debug("Getting addressLine1: {}", addressLine1);
        return addressLine1;
    }

    public void setAddressLine1(String addressLine1) {
        logger.info("Setting addressLine1: {}", addressLine1);
        this.addressLine1 = addressLine1;
    }

    public String getAddressLine2() {
        logger.debug("Getting addressLine2: {}", addressLine2);
        return addressLine2;
    }

    public void setAddressLine2(String addressLine2) {
        logger.info("Setting addressLine2: {}", addressLine2);
        this.addressLine2 = addressLine2;
    }

    public String getCity() {
        logger.debug("Getting city: {}", city);
        return city;
    }

    public void setCity(String city) {
        logger.info("Setting city: {}", city);
        this.city = city;
    }

    public String getState() {
        logger.debug("Getting state: {}", state);
        return state;
    }

    public void setState(String state) {
        logger.info("Setting state: {}", state);
        this.state = state;
    }

    public String getCountry() {
        logger.debug("Getting country: {}", country);
        return country;
    }

    public void setCountry(String country) {
        logger.info("Setting country: {}", country);
        this.country = country;
    }

    public String getPostalCode() {
        logger.debug("Getting postalCode: {}", postalCode);
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        logger.info("Setting postalCode: {}", postalCode);
        this.postalCode = postalCode;
    }

    @Override
    public String toString() {
        String result = "Address [addressLine1=" + addressLine1 + ", addressLine2=" + addressLine2 + ", city=" + city
                + ", state=" + state + ", country=" + country + ", postalCode=" + postalCode + "]";
        logger.debug("Converting Address to String: {}", result);
        return result;
    }
}
