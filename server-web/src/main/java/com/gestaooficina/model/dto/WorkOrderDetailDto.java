package com.gestaooficina.model.dto;

import java.util.ArrayList;
import java.util.List;

public class WorkOrderDetailDto extends WorkOrderSummaryDto {

    private Long customerId;
    private String customerName;
    private Integer vehicleYear;
    private List<WorkOrderItemDto> items = new ArrayList<>();
    private List<WorkOrderTimelineEntryDto> timeline = new ArrayList<>();

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public Integer getVehicleYear() {
        return vehicleYear;
    }

    public void setVehicleYear(Integer vehicleYear) {
        this.vehicleYear = vehicleYear;
    }

    public List<WorkOrderItemDto> getItems() {
        return items;
    }

    public void setItems(List<WorkOrderItemDto> items) {
        this.items = items != null ? items : new ArrayList<>();
    }

    public List<WorkOrderTimelineEntryDto> getTimeline() {
        return timeline;
    }

    public void setTimeline(List<WorkOrderTimelineEntryDto> timeline) {
        this.timeline = timeline != null ? timeline : new ArrayList<>();
    }
}
