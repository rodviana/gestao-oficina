package com.gestaooficina.model.dto;

import java.util.List;

public class PageResultDTO<T> {

    private final List<T> items;
    private final long totalNumber;
    private final int pageNumber;
    private final int pageSize;
    private final int pageMaxNumber;

    public PageResultDTO(List<T> items, long totalNumber, int pageNumber, int pageSize, int pageMaxNumber) {
        this.items = items;
        this.totalNumber = totalNumber;
        this.pageNumber = pageNumber;
        this.pageSize = pageSize;
        this.pageMaxNumber = pageMaxNumber;
    }

    public List<T> getItems() {
        return items;
    }

    public long getTotalNumber() {
        return totalNumber;
    }

    public int getPageNumber() {
        return pageNumber;
    }

    public int getPageSize() {
        return pageSize;
    }

    public int getPageMaxNumber() {
        return pageMaxNumber;
    }
}
