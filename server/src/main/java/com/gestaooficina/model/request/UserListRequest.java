package com.gestaooficina.model.request;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "User list filters and pagination")
public class UserListRequest {

    @Schema(description = "ALL, ADMIN, ATTENDANT or MECHANIC", example = "ALL")
    private String role;

    @Schema(description = "ALL, ACTIVE or INACTIVE", example = "ALL")
    private String activeFilter;

    @Schema(description = "NAME or EMAIL", example = "NAME")
    private String searchField;

    @Schema(description = "Search text for the selected field")
    private String searchText;

    @Schema(description = "Zero-based page index", example = "0")
    private Integer page;

    @Schema(description = "Page size (max 100)", example = "20")
    private Integer pageSize;

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getActiveFilter() {
        return activeFilter;
    }

    public void setActiveFilter(String activeFilter) {
        this.activeFilter = activeFilter;
    }

    public String getSearchField() {
        return searchField;
    }

    public void setSearchField(String searchField) {
        this.searchField = searchField;
    }

    public String getSearchText() {
        return searchText;
    }

    public void setSearchText(String searchText) {
        this.searchText = searchText;
    }

    public Integer getPage() {
        return page;
    }

    public void setPage(Integer page) {
        this.page = page;
    }

    public Integer getPageSize() {
        return pageSize;
    }

    public void setPageSize(Integer pageSize) {
        this.pageSize = pageSize;
    }
}
