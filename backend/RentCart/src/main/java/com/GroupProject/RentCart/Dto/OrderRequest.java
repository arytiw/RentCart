package com.GroupProject.RentCart.Dto;

import java.util.List;

public class OrderRequest {
    private List<String> itemIds;
    private String address;
    
    public OrderRequest() {
    }

    public OrderRequest(List<String> itemIds, String address) {
        this.itemIds = itemIds;
        this.address = address;
    }

    public List<String> getItemIds() {
        return itemIds;
    }

    public void setItemIds(List<String> itemIds) {
        this.itemIds = itemIds;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

}

