package com.gestaooficina.model.dto;

public class WorkOrderPanoramaDTO {

    private String statusCode;
    private String statusLabel;
    private Integer displayOrder;
    private Long orderCount;

    public WorkOrderPanoramaDTO() {
    }

    public WorkOrderPanoramaDTO(String statusCode, String statusLabel, Integer displayOrder, Long orderCount) {
        this.statusCode = statusCode;
        this.statusLabel = statusLabel;
        this.displayOrder = displayOrder;
        this.orderCount = orderCount;
    }

    public String getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(String statusCode) {
        this.statusCode = statusCode;
    }

    public String getStatusLabel() {
        return statusLabel;
    }

    public void setStatusLabel(String statusLabel) {
        this.statusLabel = statusLabel;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }

    public Long getOrderCount() {
        return orderCount;
    }

    public void setOrderCount(Long orderCount) {
        this.orderCount = orderCount;
    }
}
