package com.GroupProject.ItemService.Entity;

import java.time.LocalDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.index.TextIndexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@EqualsAndHashCode
@RequiredArgsConstructor
@Document(collection = "items")
public class Item {

    private static final Logger logger = LoggerFactory.getLogger(Item.class);

    @Id
    private String id;

    @NotBlank
    @TextIndexed
    @Field("title")
    private String title;

    @NotBlank
    @TextIndexed
    @Field("description")
    private String description;

    @Min(0)
    @Field("price")
    private double price;

    @Min(0)
    @Field("initialPrice")
    private double initialPrice;

    @NotBlank
    @Indexed
    @Field("category")
    private String category;

    @NotNull
    @Field("type")
    private ItemType type; // RENT or SELL

    @Field("features")
    private List<@NotBlank String> features;

    @Field("available")
    private Boolean available = true;

    @NotBlank
    @Indexed
    @Field("userId")
    private String userId; // Owner

    @Field("createdAt")
    private LocalDateTime createdAt = LocalDateTime.now();

    @NotBlank
    @Field("location")
    private String location;

    @Field("images")
    private List<@NotBlank String> images;

    @DecimalMin("0.0")
    @DecimalMax("10.0")
    @Field("rating")
    private double rating = 0.0;

    @Field("usagePolicy")
    private String usagePolicy;

    @Min(0)
    @Field("securityDeposit")
    private double securityDeposit = 0.0;

    public String getId() {
        logger.debug("Getting id: {}", id);
        return id;
    }

    public void setId(String id) {
        logger.info("Setting id: {}", id);
        this.id = id;
    }

    public String getTitle() {
        logger.debug("Getting title: {}", title);
        return title;
    }

    public void setTitle(String title) {
        logger.info("Setting title: {}", title);
        this.title = title;
    }

    public String getDescription() {
        logger.debug("Getting description");
        return description;
    }

    public void setDescription(String description) {
        logger.info("Setting description");
        this.description = description;
    }

    public double getPrice() {
        logger.debug("Getting price: {}", price);
        return price;
    }

    public void setPrice(double price) {
        logger.info("Setting price: {}", price);
        this.price = price;
    }

    public double getInitialPrice() {
        logger.debug("Getting initialPrice: {}", initialPrice);
        return initialPrice;
    }

    public void setInitialPrice(double initialPrice) {
        logger.info("Setting initialPrice: {}", initialPrice);
        this.initialPrice = initialPrice;
    }

    public String getCategory() {
        logger.debug("Getting category: {}", category);
        return category;
    }

    public void setCategory(String category) {
        logger.info("Setting category: {}", category);
        this.category = category;
    }

    public ItemType getType() {
        logger.debug("Getting type: {}", type);
        return type;
    }

    public void setType(ItemType type) {
        logger.info("Setting type: {}", type);
        this.type = type;
    }

    public List<String> getFeatures() {
        logger.debug("Getting features");
        return features;
    }

    public void setFeatures(List<String> features) {
        logger.info("Setting features: {}", features);
        this.features = features;
    }

    public Boolean getAvailable() {
        logger.debug("Getting available: {}", available);
        return available;
    }

    public void setAvailable(Boolean available) {
        logger.info("Setting available: {}", available);
        this.available = available;
    }

    public String getUserId() {
        logger.debug("Getting userId: {}", userId);
        return userId;
    }

    public void setUserId(String userId) {
        logger.info("Setting userId: {}", userId);
        this.userId = userId;
    }

    public LocalDateTime getCreatedAt() {
        logger.debug("Getting createdAt: {}", createdAt);
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        logger.info("Setting createdAt: {}", createdAt);
        this.createdAt = createdAt;
    }

    public String getLocation() {
        logger.debug("Getting location: {}", location);
        return location;
    }

    public void setLocation(String location) {
        logger.info("Setting location: {}", location);
        this.location = location;
    }

    public List<String> getImages() {
        logger.debug("Getting images");
        return images;
    }

    public void setImages(List<String> images) {
        logger.info("Setting images: {}", images);
        this.images = images;
    }

    public double getRating() {
        logger.debug("Getting rating: {}", rating);
        return rating;
    }

    public void setRating(double rating) {
        logger.info("Setting rating: {}", rating);
        this.rating = rating;
    }

    public String getUsagePolicy() {
        logger.debug("Getting usagePolicy");
        return usagePolicy;
    }

    public void setUsagePolicy(String usagePolicy) {
        logger.info("Setting usagePolicy");
        this.usagePolicy = usagePolicy;
    }

    public double getSecurityDeposit() {
        logger.debug("Getting securityDeposit: {}", securityDeposit);
        return securityDeposit;
    }

    public void setSecurityDeposit(double securityDeposit) {
        logger.info("Setting securityDeposit: {}", securityDeposit);
        this.securityDeposit = securityDeposit;
    }
}
