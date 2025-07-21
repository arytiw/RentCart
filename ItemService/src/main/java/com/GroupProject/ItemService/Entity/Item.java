package com.GroupProject.ItemService.Entity;

import java.time.LocalDateTime;
import java.util.List;

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

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public double getInitialPrice() {
        return initialPrice;
    }

    public void setInitialPrice(double initialPrice) {
        this.initialPrice = initialPrice;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public ItemType getType() {
        return type;
    }

    public void setType(ItemType type) {
        this.type = type;
    }

    public List<String> getFeatures() {
        return features;
    }

    public void setFeatures(List<String> features) {
        this.features = features;
    }

    public Boolean getAvailable() {
        return available;
    }

    public void setAvailable(Boolean available) {
        this.available = available;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public List<String> getImages() {
        return images;
    }

    public void setImages(List<String> images) {
        this.images = images;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public String getUsagePolicy() {
        return usagePolicy;
    }

    public void setUsagePolicy(String usagePolicy) {
        this.usagePolicy = usagePolicy;
    }

    public double getSecurityDeposit() {
        return securityDeposit;
    }

    public void setSecurityDeposit(double securityDeposit) {
        this.securityDeposit = securityDeposit;
    }
}
