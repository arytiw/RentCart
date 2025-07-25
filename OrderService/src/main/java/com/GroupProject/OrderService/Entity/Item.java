// package com.GroupProject.OrderService.Entity;

// import org.springframework.data.annotation.Id;
// import org.springframework.data.mongodb.core.mapping.Document;

// @Document(collection = "items")
// public class Item {
//     @Id
//     private String id;

//     private String title;
//     private String description;
//     private double price;
//     private String userId;
    
//     public Item() {
//     }

//     public Item(String id, String title, String description, double price, String userId) {
//         this.id = id;
//         this.title = title;
//         this.description = description;
//         this.price = price;
//         this.userId = userId;
//     }

//     public String getId() {
//         return id;
//     }
//     public void setId(String id) {
//         this.id = id;
//     }
//     public String getTitle() {
//         return title;
//     }
//     public void setTitle(String title) {
//         this.title = title;
//     }
//     public String getDescription() {
//         return description;
//     }
//     public void setDescription(String description) {
//         this.description = description;
//     }
//     public double getPrice() {
//         return price;
//     }
//     public void setPrice(double price) {
//         this.price = price;
//     }
//     public String getUserId() {
//         return userId;
//     }
//     public void setUserId(String userId) {
//         this.userId = userId;
//     }
// }

package com.GroupProject.OrderService.Entity;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "items")
public class Item {

    private static final Logger logger = LoggerFactory.getLogger(Item.class);

    @Id
    private String id;

    @Field("title")
    private String title;

    @Field("description")
    private String description;

    @Field("price")
    private double price;

    @Field("userId")
    private String userId;  // Seller or uploader ID

    @Field("category")
    private String category;

    @Field("imageUrl")
    private String imageUrl;

    @Field("stockQuantity")
    private int stockQuantity;

    // Default constructor
    public Item() {
        logger.debug("Item: Default constructor called");
    }

    // All-args constructor
    public Item(String id, String title, String description, double price, String userId,
                String category, String imageUrl, int stockQuantity) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.userId = userId;
        this.category = category;
        this.imageUrl = imageUrl;
        this.stockQuantity = stockQuantity;
        logger.debug("Item: Parameterized constructor called with id={}, title={}, price={}, userId={}, category={}, stockQuantity={}",
                id, title, price, userId, category, stockQuantity);
    }

    public String getId() {
        logger.debug("getId called, returning: {}", id);
        return id;
    }

    public void setId(String id) {
        logger.debug("setId called with: {}", id);
        this.id = id;
    }

    public String getTitle() {
        logger.debug("getTitle called, returning: {}", title);
        return title;
    }

    public void setTitle(String title) {
        logger.debug("setTitle called with: {}", title);
        this.title = title;
    }

    public String getDescription() {
        logger.debug("getDescription called, returning: {}", description);
        return description;
    }

    public void setDescription(String description) {
        logger.debug("setDescription called with: {}", description);
        this.description = description;
    }

    public double getPrice() {
        logger.debug("getPrice called, returning: {}", price);
        return price;
    }

    public void setPrice(double price) {
        logger.debug("setPrice called with: {}", price);
        this.price = price;
    }

    public String getUserId() {
        logger.debug("getUserId called, returning: {}", userId);
        return userId;
    }

    public void setUserId(String userId) {
        logger.debug("setUserId called with: {}", userId);
        this.userId = userId;
    }

    public String getCategory() {
        logger.debug("getCategory called, returning: {}", category);
        return category;
    }

    public void setCategory(String category) {
        logger.debug("setCategory called with: {}", category);
        this.category = category;
    }

    public String getImageUrl() {
        logger.debug("getImageUrl called, returning: {}", imageUrl);
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        logger.debug("setImageUrl called with: {}", imageUrl);
        this.imageUrl = imageUrl;
    }

    public int getStockQuantity() {
        logger.debug("getStockQuantity called, returning: {}", stockQuantity);
        return stockQuantity;
    }

    public void setStockQuantity(int stockQuantity) {
        logger.debug("setStockQuantity called with: {}", stockQuantity);
        this.stockQuantity = stockQuantity;
    }

    @Override
    public String toString() {
        return "Item{" +
                "id='" + id + '\'' +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", price=" + price +
                ", userId='" + userId + '\'' +
                ", category='" + category + '\'' +
                ", imageUrl='" + imageUrl + '\'' +
                ", stockQuantity=" + stockQuantity +
                '}';
    }
}
