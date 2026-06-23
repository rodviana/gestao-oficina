package com.gestaooficina.model.response;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class UserListResponse {

    private final List<UserListItemResponse> items;
    private final long totalNumber;
    private final int pageNumber;
    private final int pageSize;
    private final int pageMaxNumber;

    public UserListResponse(List<UserListItemResponse> items, long totalNumber,
                            int pageNumber, int pageSize, int pageMaxNumber) {
        this.items = items;
        this.totalNumber = totalNumber;
        this.pageNumber = pageNumber;
        this.pageSize = pageSize;
        this.pageMaxNumber = pageMaxNumber;
    }

    @JsonProperty("items")
    public List<UserListItemResponse> getItems() {
        return items;
    }

    @JsonProperty("totalNumber")
    public long getTotalNumber() {
        return totalNumber;
    }

    @JsonProperty("pageNumber")
    public int getPageNumber() {
        return pageNumber;
    }

    @JsonProperty("pageSize")
    public int getPageSize() {
        return pageSize;
    }

    @JsonProperty("pageMaxNumber")
    public int getPageMaxNumber() {
        return pageMaxNumber;
    }
}
