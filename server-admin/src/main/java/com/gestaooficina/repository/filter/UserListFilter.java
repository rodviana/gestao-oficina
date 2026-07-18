package com.gestaooficina.repository.filter;

public class UserListFilter {

    private String role;
    private String activeFilter;
    private String searchField;
    private String searchText;
    private Integer page;
    private Integer pageSize;

    public UserListFilter(String role, String activeFilter, String searchField, String searchText,
                          Integer page, Integer pageSize) {
        this.role = role;
        this.activeFilter = activeFilter;
        this.searchField = searchField;
        this.searchText = searchText;
        this.page = page;
        this.pageSize = pageSize;
    }

    public String getRole() {
        return role;
    }

    public String getActiveFilter() {
        return activeFilter;
    }

    public String getSearchField() {
        return searchField;
    }

    public String getSearchText() {
        return searchText;
    }

    public Integer getPage() {
        return page;
    }

    public Integer getPageSize() {
        return pageSize;
    }

    public int getPageOrDefault() {
        return page == null ? 0 : page;
    }

    public int getPageSizeOrDefault() {
        return pageSize == null ? 20 : pageSize;
    }

    public UserListFilter copy() {
        return new UserListFilter(role, activeFilter, searchField, searchText, page, pageSize);
    }

    public UserListFilter withPage(int page, int pageSize) {
        UserListFilter copy = copy();
        copy.page = page;
        copy.pageSize = pageSize;
        return copy;
    }
}
