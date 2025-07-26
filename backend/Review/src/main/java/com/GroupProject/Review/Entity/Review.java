package com.GroupProject.Review.Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "reviews")
public class Review {

    @Id
    private String id;

    private String itemId;
    private String userId;
    private String comment;
    private double rating;
    private long timestamp;
    
    
    
    
    
    
	public Review() {
		super();
		// TODO Auto-generated constructor stub
	}






	public Review(String id, String itemId, String userId, String comment, double rating, long timestamp) {
		super();
		this.id = id;
		this.itemId = itemId;
		this.userId = userId;
		this.comment = comment;
		this.rating = rating;
		this.timestamp = timestamp;
	}






	public String getId() {
		return id;
	}






	public void setId(String id) {
		this.id = id;
	}






	public String getItemId() {
		return itemId;
	}






	public void setItemId(String itemId) {
		this.itemId = itemId;
	}






	public String getUserId() {
		return userId;
	}






	public void setUserId(String userId) {
		this.userId = userId;
	}






	public String getComment() {
		return comment;
	}






	public void setComment(String comment) {
		this.comment = comment;
	}






	public double getRating() {
		return rating;
	}






	public void setRating(double rating) {
		this.rating = rating;
	}






	public long getTimestamp() {
		return timestamp;
	}






	public void setTimestamp(long timestamp) {
		this.timestamp = timestamp;
	}






	@Override
	public String toString() {
		return "Review [id=" + id + ", itemId=" + itemId + ", userId=" + userId + ", comment=" + comment + ", rating="
				+ rating + ", timestamp=" + timestamp + "]";
	}
    
    
}
