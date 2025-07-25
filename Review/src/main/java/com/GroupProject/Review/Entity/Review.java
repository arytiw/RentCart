package com.GroupProject.Review.Entity;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "reviews")
public class Review {

    private static final Logger logger = LoggerFactory.getLogger(Review.class);

    @Id
    private String id;

    private String itemId;
    private String userId;
    private String comment;
    private double rating;
    private long timestamp;

    public Review() {
        logger.debug("Creating empty Review object");
    }

    public Review(String id, String itemId, String userId, String comment, double rating, long timestamp) {
        logger.info("Creating Review with id: {}, itemId: {}, userId: {}", id, itemId, userId);
        this.id = id;
        this.itemId = itemId;
        this.userId = userId;
        this.comment = comment;
        this.rating = rating;
        this.timestamp = timestamp;
    }

    public String getId() {
        logger.debug("Getting id: {}", id);
        return id;
    }

    public void setId(String id) {
        logger.info("Setting id: {}", id);
        this.id = id;
    }

    public String getItemId() {
        logger.debug("Getting itemId: {}", itemId);
        return itemId;
    }

    public void setItemId(String itemId) {
        logger.info("Setting itemId: {}", itemId);
        this.itemId = itemId;
    }

    public String getUserId() {
        logger.debug("Getting userId: {}", userId);
        return userId;
    }

    public void setUserId(String userId) {
        logger.info("Setting userId: {}", userId);
        this.userId = userId;
    }

    public String getComment() {
        logger.debug("Getting comment: {}", comment);
        return comment;
    }

    public void setComment(String comment) {
        logger.info("Setting comment: {}", comment);
        this.comment = comment;
    }

    public double getRating() {
        logger.debug("Getting rating: {}", rating);
        return rating;
    }

    public void setRating(double rating) {
        logger.info("Setting rating: {}", rating);
        this.rating = rating;
    }

    public long getTimestamp() {
        logger.debug("Getting timestamp: {}", timestamp);
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        logger.info("Setting timestamp: {}", timestamp);
        this.timestamp = timestamp;
    }

    @Override
    public String toString() {
        String result = "Review [id=" + id + ", itemId=" + itemId + ", userId=" + userId + ", comment=" + comment +
                        ", rating=" + rating + ", timestamp=" + timestamp + "]";
        logger.debug("Converting Review to String: {}", result);
        return result;
    }
}
