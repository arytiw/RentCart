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
    private boolean available = true;

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

}
